import React, { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navigation } from "./components/Navigation";
import { HeroSection } from "./components/HeroSection";
import { WhatIsF1Section } from "./components/WhatIsF1Section";
import { RaceWeekendSection } from "./components/RaceWeekendSection";
import { TeamsSection } from "./components/TeamsSection";
import { RulesSection } from "./components/RulesSection";
import { StrategySection } from "./components/StrategySection";
import { QuickGuideSection } from "./components/QuickGuideSection";
import { QuizSection, QuizTrigger } from "./components/QuizSection";
import { Footer } from "./components/Footer";
import { LoginPage, RegisterPage } from "./pages/AuthPages";
import { ProfilePage } from "./pages/ProfilePage";

const HomePage = () => {
  const [activeQuiz, setActiveQuiz] = useState(null);

  return (
    <>
      <Navigation />
      <main>
        {/* Learning Journey - Structured Flow */}
        <HeroSection />
        
        {/* Step 1: Foundation */}
        <WhatIsF1Section />
        
        {/* Step 2: Format */}
        <RaceWeekendSection />
        
        {/* Step 3: Participants */}
        <TeamsSection />
        
        {/* Step 4: Rules */}
        <RulesSection />
        
        {/* Step 5: Advanced (only after basics) */}
        <StrategySection />
        
        {/* Step 6: Summary */}
        <QuickGuideSection />
        
        {/* Optional: Test Knowledge */}
        <QuizTrigger onStartQuiz={setActiveQuiz} />
      </main>
      <Footer />
      
      {activeQuiz && (
        <QuizSection 
          quizId={activeQuiz} 
          onClose={() => setActiveQuiz(null)} 
        />
      )}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
