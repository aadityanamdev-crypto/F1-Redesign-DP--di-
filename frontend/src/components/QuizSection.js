import React, { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const QuizSection = ({ quizId, onClose }) => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // ✅ SINGLE useEffect (FIXED)
  useEffect(() => {
    const demoQuiz = {
      title: "F1 Basics Quiz",
      questions: [
        {
          id: 1,
          question: "How many teams are there in Formula 1?",
          options: ["8", "10", "12", "14"],
          correct: "10"
        },
        {
          id: 2,
          question: "What does F1 stand for?",
          options: ["Fast 1", "Formula One", "First Race", "Final Lap"],
          correct: "Formula One"
        }
      ]
    };

    setQuiz(demoQuiz);
    setLoading(false);
  }, []);

  // ✅ FIXED HANDLE ANSWER
  const handleAnswer = () => {
    if (!selectedAnswer) return;

    const newAnswers = [
      ...answers,
      {
        question_id: quiz.questions[currentQuestion].id,
        answer: selectedAnswer
      }
    ];

    setAnswers(newAnswers);

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      // ✅ DUMMY RESULT (NO BACKEND)
      const correctCount = newAnswers.filter((ans, i) =>
        ans.answer === quiz.questions[i].correct
      ).length;

      const score = Math.round((correctCount / quiz.questions.length) * 100);

      setResults({
        score,
        results: newAnswers.map((ans, i) => ({
          question_id: quiz.questions[i].id,
          correct: ans.answer === quiz.questions[i].correct,
          correct_answer: quiz.questions[i].correct
        }))
      });

      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setResults(null);
  };

  if (loading || !quiz) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#E10600] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      data-testid="quiz-modal"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl">{quiz.title}</h2>
            {!showResult && (
              <div className="text-zinc-500 text-sm">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            ✕
          </button>
        </div>

        {/* Progress */}
        {!showResult && (
          <div className="progress-bar mb-8">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        )}

        {showResult ? (
          <div className="text-center">
            <Trophy size={64} className="text-[#FFD700] mx-auto" />
            <div className="text-6xl mt-4 text-[#E10600]">
              {results.score}%
            </div>

            <div className="flex gap-4 justify-center mt-6">
              <button onClick={resetQuiz} className="btn-secondary">
                <RotateCcw size={18} /> Retry
              </button>
              <button onClick={onClose} className="btn-primary">
                Finish
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-xl mb-6">
              {quiz.questions[currentQuestion].question}
            </h3>

            <div className="space-y-3 mb-8">
              {quiz.questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(option)}
                  className={`quiz-option w-full text-left ${
                    selectedAnswer === option ? 'selected' : ''
                  }`}
                >
                  <span className="text-[#E10600] mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>

            <button
              onClick={handleAnswer}
              disabled={!selectedAnswer}
              className="btn-primary w-full"
            >
              {currentQuestion < quiz.questions.length - 1
                ? "Next Question"
                : "Submit Quiz"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};