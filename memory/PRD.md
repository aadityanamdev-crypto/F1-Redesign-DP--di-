# F1 Learning Hub - Product Requirements Document

## Original Problem Statement
Design a beginner-focused educational website about Formula One (F1). Transform into a clear, beginner-first learning system based on user research insights (confusion, cognitive overload, fragmented information, lack of structured guidance).

## User Personas
1. **New F1 Fan** - Zero knowledge, needs step-by-step guidance
2. **Casual Viewer** - Watches occasionally, wants structure
3. **Learning Enthusiast** - Enjoys tracking progress

## Core Requirements (Static)
- Structured learning journey with numbered steps
- Maximum 1-2 lines per content block
- Progressive information flow
- Visual hierarchy and consistency
- F1 brand visual language: #E10600 red, #000000 black

## Learning Flow (April 7, 2026 - REFINED)
1. **What is F1** - Foundation (replaced random "Basics")
2. **Race Weekend** - Format understanding
3. **Teams & Drivers** - Meet participants
4. **Rules & Flags** - How races are controlled
5. **Strategy** - Advanced concepts (tyres, DRS, pit stops) - AFTER rules
6. **Quick Guide** - Cheat sheet summary

## What's Been Implemented

### UX Improvements
- ✅ Numbered step navigation with progress bar
- ✅ "Next" buttons for guided flow
- ✅ Key Takeaway boxes for each section
- ✅ Simplified content (max 2 lines per block)
- ✅ Clear section markers (Step 1 of 6, etc.)
- ✅ Mark as Learned buttons
- ✅ Learning path preview in hero

### Backend (FastAPI)
- ✅ JWT Authentication with brute force protection
- ✅ Progress tracking per section
- ✅ Bookmarking system
- ✅ Quiz system (3 quizzes)
- ✅ F1 data endpoints (2025 season)

### Frontend (React)
- ✅ All 6 learning sections with simplified content
- ✅ Interactive navigation with progress tracking
- ✅ Responsive design
- ✅ Quiz modal
- ✅ Profile page with learning progress

## Test Results (April 7, 2026)
- Backend: 96% pass rate
- Frontend: 95% pass rate
- Overall: 95% pass rate

## Prioritized Backlog

### P1 (High Priority)
- [ ] Live F1 standings from OpenF1 API
- [ ] Video content integration
- [ ] More quiz questions

### P2 (Medium Priority)
- [ ] Race calendar with countdown
- [ ] Social sharing for quiz results
- [ ] Achievement badges

## Next Tasks
1. Add video explainers for each section
2. Integrate live race standings
3. Create more quiz difficulty levels
