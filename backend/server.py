from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import copy
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import secrets
import httpx
from bson import ObjectId

ROOT_DIR = Path(__file__).parent

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_ALGORITHM = "HS256"

def get_jwt_secret() -> str:
    return os.environ.get("JWT_SECRET", "default-secret-change-in-production")

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id, 
        "email": email, 
        "exp": datetime.now(timezone.utc) + timedelta(minutes=15), 
        "type": "access"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id, 
        "exp": datetime.now(timezone.utc) + timedelta(days=7), 
        "type": "refresh"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

# Create the main app
app = FastAPI()

# Create routers
api_router = APIRouter(prefix="/api")
auth_router = APIRouter(prefix="/api/auth")

# ============ MODELS ============

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    created_at: datetime

class ProgressUpdate(BaseModel):
    section_id: str
    completed: bool

class QuizAnswer(BaseModel):
    quiz_id: str
    question_id: str
    answer: str

class BookmarkCreate(BaseModel):
    item_type: str  # driver, team, section
    item_id: str

# ============ AUTH HELPER ============

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_optional_user(request: Request) -> Optional[dict]:
    try:
        return await get_current_user(request)
    except HTTPException:
        return None

# ============ AUTH ENDPOINTS ============

@auth_router.post("/register")
async def register(user_data: UserCreate, response: Response):
    email = user_data.email.lower()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = hash_password(user_data.password)
    user_doc = {
        "email": email,
        "password_hash": hashed,
        "name": user_data.name,
        "role": "user",
        "created_at": datetime.now(timezone.utc),
        "progress": {},
        "bookmarks": [],
        "quiz_scores": {}
    }
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=900, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    
    return {
        "id": user_id,
        "email": email,
        "name": user_data.name,
        "role": "user",
        "created_at": user_doc["created_at"].isoformat()
    }

@auth_router.post("/login")
async def login(user_data: UserLogin, response: Response, request: Request):
    email = user_data.email.lower()
    ip = request.client.host
    identifier = f"{ip}:{email}"
    
    # Check brute force
    attempts = await db.login_attempts.find_one({"identifier": identifier})
    if attempts and attempts.get("count", 0) >= 5:
        lockout_until = attempts.get("lockout_until")
        if lockout_until:
            # Ensure timezone aware comparison
            if lockout_until.tzinfo is None:
                lockout_until = lockout_until.replace(tzinfo=timezone.utc)
            if datetime.now(timezone.utc) < lockout_until:
                raise HTTPException(status_code=429, detail="Too many login attempts. Try again later.")
        # Lockout expired, reset attempts
        await db.login_attempts.delete_one({"identifier": identifier})
    
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(user_data.password, user["password_hash"]):
        # Increment failed attempts
        current_count = attempts.get("count", 0) if attempts else 0
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {
                "$set": {
                    "count": current_count + 1,
                    "lockout_until": datetime.now(timezone.utc) + timedelta(minutes=15)
                }
            },
            upsert=True
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Clear attempts on success
    await db.login_attempts.delete_one({"identifier": identifier})
    
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=900, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    
    return {
        "id": user_id,
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
        "created_at": user["created_at"].isoformat() if isinstance(user["created_at"], datetime) else user["created_at"]
    }

@auth_router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")
    return {"message": "Logged out successfully"}

@auth_router.get("/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    return {
        "id": user["_id"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
        "progress": user.get("progress", {}),
        "bookmarks": user.get("bookmarks", []),
        "quiz_scores": user.get("quiz_scores", {})
    }

@auth_router.post("/refresh")
async def refresh_token(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        access_token = create_access_token(str(user["_id"]), user["email"])
        response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=900, path="/")
        return {"message": "Token refreshed"}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============ PROGRESS ENDPOINTS ============

@api_router.post("/progress")
async def update_progress(progress: ProgressUpdate, request: Request):
    user = await get_current_user(request)
    await db.users.update_one(
        {"_id": ObjectId(user["_id"])},
        {"$set": {f"progress.{progress.section_id}": progress.completed}}
    )
    return {"message": "Progress updated"}

@api_router.get("/progress")
async def get_progress(request: Request):
    user = await get_current_user(request)
    return user.get("progress", {})

# ============ BOOKMARK ENDPOINTS ============

@api_router.post("/bookmarks")
async def add_bookmark(bookmark: BookmarkCreate, request: Request):
    user = await get_current_user(request)
    bookmark_doc = {
        "item_type": bookmark.item_type,
        "item_id": bookmark.item_id,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.update_one(
        {"_id": ObjectId(user["_id"])},
        {"$addToSet": {"bookmarks": bookmark_doc}}
    )
    return {"message": "Bookmark added"}

@api_router.delete("/bookmarks/{item_type}/{item_id}")
async def remove_bookmark(item_type: str, item_id: str, request: Request):
    user = await get_current_user(request)
    await db.users.update_one(
        {"_id": ObjectId(user["_id"])},
        {"$pull": {"bookmarks": {"item_type": item_type, "item_id": item_id}}}
    )
    return {"message": "Bookmark removed"}

# ============ QUIZ ENDPOINTS ============

QUIZZES = {
    "basics": {
        "id": "basics",
        "title": "F1 Basics Quiz",
        "questions": [
            {"id": "q1", "question": "What does DRS stand for?", "options": ["Drag Reduction System", "Drive Racing System", "Dynamic Race Speed", "Direct Racing Steering"], "correct": "Drag Reduction System"},
            {"id": "q2", "question": "How many teams compete in F1?", "options": ["8", "10", "12", "15"], "correct": "10"},
            {"id": "q3", "question": "How many drivers are in each team?", "options": ["1", "2", "3", "4"], "correct": "2"},
            {"id": "q4", "question": "What is the safety device above the driver's head called?", "options": ["Halo", "Roll Hoop", "Air Box", "Headrest"], "correct": "Halo"},
            {"id": "q5", "question": "What creates downforce on an F1 car?", "options": ["Wings and aerodynamic elements", "Heavy weights", "Magnetic tracks", "Special tyres"], "correct": "Wings and aerodynamic elements"}
        ]
    },
    "flags": {
        "id": "flags",
        "title": "Racing Flags Quiz",
        "questions": [
            {"id": "q1", "question": "What does a yellow flag indicate?", "options": ["Caution, slow down", "Race finished", "Go faster", "Pit stop required"], "correct": "Caution, slow down"},
            {"id": "q2", "question": "What does the checkered flag mean?", "options": ["Race or session ended", "Slow down", "Penalty given", "Safety car deployed"], "correct": "Race or session ended"},
            {"id": "q3", "question": "What does a blue flag tell a driver?", "options": ["Let faster car pass", "Slow down", "Race paused", "Weather warning"], "correct": "Let faster car pass"},
            {"id": "q4", "question": "What does a red flag mean?", "options": ["Session stopped", "Go faster", "Penalty", "Final lap"], "correct": "Session stopped"},
            {"id": "q5", "question": "What does a black and orange flag indicate?", "options": ["Car has mechanical issue, return to pits", "Disqualified", "Fastest lap", "Position change"], "correct": "Car has mechanical issue, return to pits"}
        ]
    },
    "strategy": {
        "id": "strategy",
        "title": "Strategy & Tyres Quiz",
        "questions": [
            {"id": "q1", "question": "Which tyre compound is the softest?", "options": ["Red (Soft)", "Yellow (Medium)", "White (Hard)", "Blue (Wet)"], "correct": "Red (Soft)"},
            {"id": "q2", "question": "What is a pit stop?", "options": ["Stop in pit lane to change tyres/make repairs", "A penalty stop", "A rest break", "End of race"], "correct": "Stop in pit lane to change tyres/make repairs"},
            {"id": "q3", "question": "Which tyre lasts longest but is slowest?", "options": ["Hard (White)", "Soft (Red)", "Medium (Yellow)", "Intermediate (Green)"], "correct": "Hard (White)"},
            {"id": "q4", "question": "When are wet tyres used?", "options": ["Heavy rain", "Dry conditions", "Cold weather", "Hot weather"], "correct": "Heavy rain"},
            {"id": "q5", "question": "What is an undercut strategy?", "options": ["Pitting earlier than rival to gain advantage", "Going slower", "Using softer tyres", "Skipping pit stop"], "correct": "Pitting earlier than rival to gain advantage"}
        ]
    }
}

@api_router.get("/quizzes")
async def get_quizzes():
    return list(QUIZZES.values())

@api_router.get("/quizzes/{quiz_id}")
async def get_quiz(quiz_id: str):
    if quiz_id not in QUIZZES:
        raise HTTPException(status_code=404, detail="Quiz not found")
    quiz = copy.deepcopy(QUIZZES[quiz_id])
    # Remove correct answers for client
    for q in quiz["questions"]:
        q.pop("correct", None)
    return quiz

@api_router.post("/quizzes/{quiz_id}/submit")
async def submit_quiz(quiz_id: str, answers: List[QuizAnswer], request: Request):
    if quiz_id not in QUIZZES:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Use the original quiz data with correct answers
    quiz = QUIZZES[quiz_id]
    correct_count = 0
    results = []
    
    for answer in answers:
        question = next((q for q in quiz["questions"] if q["id"] == answer.question_id), None)
        if question:
            is_correct = question["correct"] == answer.answer
            if is_correct:
                correct_count += 1
            results.append({
                "question_id": answer.question_id,
                "correct": is_correct,
                "correct_answer": question["correct"]
            })
    
    score = int((correct_count / len(quiz["questions"])) * 100)
    
    # Save score if user is logged in
    user = await get_optional_user(request)
    if user:
        await db.users.update_one(
            {"_id": ObjectId(user["_id"])},
            {"$set": {f"quiz_scores.{quiz_id}": score}}
        )
    
    return {"score": score, "results": results}

# ============ F1 DATA ENDPOINTS ============

# Static F1 2025/2026 data (since OpenF1 may not have 2026 data yet)
F1_TEAMS_2025 = [
    {"id": "red-bull", "name": "Red Bull Racing", "color": "#3671C6", "country": "Austria"},
    {"id": "ferrari", "name": "Scuderia Ferrari", "color": "#E80020", "country": "Italy"},
    {"id": "mercedes", "name": "Mercedes-AMG", "color": "#27F4D2", "country": "Germany"},
    {"id": "mclaren", "name": "McLaren", "color": "#FF8000", "country": "United Kingdom"},
    {"id": "aston-martin", "name": "Aston Martin", "color": "#229971", "country": "United Kingdom"},
    {"id": "alpine", "name": "Alpine", "color": "#FF87BC", "country": "France"},
    {"id": "williams", "name": "Williams", "color": "#64C4FF", "country": "United Kingdom"},
    {"id": "rb", "name": "RB", "color": "#6692FF", "country": "Italy"},
    {"id": "kick-sauber", "name": "Kick Sauber", "color": "#52E252", "country": "Switzerland"},
    {"id": "haas", "name": "Haas", "color": "#B6BABD", "country": "United States"}
]

F1_DRIVERS_2025 = [
    {"id": "1", "number": 1, "name": "Max Verstappen", "team": "red-bull", "country": "Netherlands"},
    {"id": "11", "number": 11, "name": "Sergio Perez", "team": "red-bull", "country": "Mexico"},
    {"id": "16", "number": 16, "name": "Charles Leclerc", "team": "ferrari", "country": "Monaco"},
    {"id": "44", "number": 44, "name": "Lewis Hamilton", "team": "ferrari", "country": "United Kingdom"},
    {"id": "63", "number": 63, "name": "George Russell", "team": "mercedes", "country": "United Kingdom"},
    {"id": "12", "number": 12, "name": "Andrea Kimi Antonelli", "team": "mercedes", "country": "Italy"},
    {"id": "4", "number": 4, "name": "Lando Norris", "team": "mclaren", "country": "United Kingdom"},
    {"id": "81", "number": 81, "name": "Oscar Piastri", "team": "mclaren", "country": "Australia"},
    {"id": "14", "number": 14, "name": "Fernando Alonso", "team": "aston-martin", "country": "Spain"},
    {"id": "18", "number": 18, "name": "Lance Stroll", "team": "aston-martin", "country": "Canada"},
    {"id": "10", "number": 10, "name": "Pierre Gasly", "team": "alpine", "country": "France"},
    {"id": "7", "number": 7, "name": "Jack Doohan", "team": "alpine", "country": "Australia"},
    {"id": "23", "number": 23, "name": "Alex Albon", "team": "williams", "country": "Thailand"},
    {"id": "55", "number": 55, "name": "Carlos Sainz", "team": "williams", "country": "Spain"},
    {"id": "22", "number": 22, "name": "Yuki Tsunoda", "team": "rb", "country": "Japan"},
    {"id": "30", "number": 30, "name": "Liam Lawson", "team": "rb", "country": "New Zealand"},
    {"id": "27", "number": 27, "name": "Nico Hulkenberg", "team": "kick-sauber", "country": "Germany"},
    {"id": "5", "number": 5, "name": "Gabriel Bortoleto", "team": "kick-sauber", "country": "Brazil"},
    {"id": "31", "number": 31, "name": "Esteban Ocon", "team": "haas", "country": "France"},
    {"id": "87", "number": 87, "name": "Oliver Bearman", "team": "haas", "country": "United Kingdom"}
]

@api_router.get("/f1/teams")
async def get_teams():
    return F1_TEAMS_2025

@api_router.get("/f1/drivers")
async def get_drivers():
    drivers_with_teams = []
    for driver in F1_DRIVERS_2025:
        team = next((t for t in F1_TEAMS_2025 if t["id"] == driver["team"]), None)
        drivers_with_teams.append({
            **driver,
            "team_name": team["name"] if team else "",
            "team_color": team["color"] if team else "#FFFFFF"
        })
    return drivers_with_teams

@api_router.get("/f1/standings")
async def get_standings():
    # Try to fetch from OpenF1 API
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get("https://api.openf1.org/v1/drivers?session_key=latest", timeout=5.0)
            if response.status_code == 200:
                return response.json()
    except Exception:
        pass
    
    # Return static data as fallback
    return F1_DRIVERS_2025

@api_router.get("/")
async def root():
    return {"message": "F1 Learning Hub API"}

# Include routers
app.include_router(api_router)
app.include_router(auth_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[os.environ.get("FRONTEND_URL", "http://localhost:3000"), "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Startup event
@app.on_event("startup")
async def startup():
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    
    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@f1hub.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hashed,
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc),
            "progress": {},
            "bookmarks": [],
            "quiz_scores": {}
        })
        logger.info(f"Admin user created: {admin_email}")
    
    # Write test credentials
    os.makedirs("/app/memory", exist_ok=True)
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write("# Test Credentials\n\n")
        f.write("## Admin Account\n")
        f.write(f"- Email: {admin_email}\n")
        f.write(f"- Password: {admin_password}\n")
        f.write("- Role: admin\n\n")
        f.write("## Auth Endpoints\n")
        f.write("- POST /api/auth/register\n")
        f.write("- POST /api/auth/login\n")
        f.write("- POST /api/auth/logout\n")
        f.write("- GET /api/auth/me\n")
        f.write("- POST /api/auth/refresh\n")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
