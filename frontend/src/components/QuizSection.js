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

  useEffect(() => {
  const demoQuiz = {
    title: "F1 Basics Quiz",
    questions: [
      {
        id: 1,
        question: "How many teams are there in Formula 1?",
        options: ["8", "10", "12", "14"]
      },
      {
        id: 2,
        question: "What does F1 stand for?",
        options: ["Fast 1", "Formula One", "First Race", "Final Lap"]
      }
    ]
  };

  setQuiz(demoQuiz);
  setLoading(false);
}, []);

  const handleAnswer = () => {
    if (!selectedAnswer) return;
    
    const newAnswers = [
      ...answers, 
      { 
        quiz_id: quizId, 
        question_id: quiz.questions[currentQuestion].id, 
        answer: selectedAnswer 
      }
    ];
    setAnswers(newAnswers);

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/quizzes/${quizId}/submit`,
        finalAnswers,
        { withCredentials: true }
      );
      setResults(data);
      setShowResult(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setResults(null);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#E10600] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Quiz not found</p>
          <button onClick={onClose} className="btn-secondary">Go Back</button>
        </div>
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
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-white"
            data-testid="quiz-close"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        {!showResult && (
          <div className="progress-bar mb-8">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        )}

        {showResult ? (
          /* Results */
          <div className="text-center animate-fade-in">
            <div className="mb-8">
              <Trophy 
                size={64} 
                className={results.score >= 80 ? 'text-[#FFD700] mx-auto' : results.score >= 50 ? 'text-[#C0C0C0] mx-auto' : 'text-zinc-500 mx-auto'}
              />
              <div className="font-display text-6xl mt-4" style={{ color: '#E10600' }}>
                {results.score}%
              </div>
              <p className="text-zinc-400 mt-2">
                {results.score >= 80 ? 'Excellent! You\'re ready for race day!' : 
                 results.score >= 50 ? 'Good effort! Keep learning!' : 
                 'Don\'t worry, review the material and try again!'}
              </p>
            </div>

            {/* Answer Review */}
            <div className="space-y-4 mb-8 text-left">
              {results.results.map((result, index) => (
                <div 
                  key={result.question_id}
                  className={`p-4 border ${result.correct ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'}`}
                >
                  <div className="flex items-start gap-3">
                    {result.correct ? (
                      <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                    ) : (
                      <XCircle className="text-red-500 flex-shrink-0" size={20} />
                    )}
                    <div>
                      <p className="text-sm text-zinc-300">
                        Q{index + 1}: {quiz.questions[index].question}
                      </p>
                      {!result.correct && (
                        <p className="text-xs text-green-500 mt-1">
                          Correct: {result.correct_answer}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <button 
                onClick={resetQuiz}
                data-testid="quiz-retry"
                className="btn-secondary flex items-center gap-2"
              >
                <RotateCcw size={18} />
                Try Again
              </button>
              <button 
                onClick={onClose}
                data-testid="quiz-finish"
                className="btn-primary"
              >
                Finish
              </button>
            </div>
          </div>
        ) : (
          /* Question */
          <div className="animate-fade-in">
            <h3 className="text-xl mb-6">
              {quiz.questions[currentQuestion].question}
            </h3>
            
            <div className="space-y-3 mb-8">
              {quiz.questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(option)}
                  data-testid={`quiz-option-${index}`}
                  className={`quiz-option w-full text-left ${
                    selectedAnswer === option ? 'selected' : ''
                  }`}
                >
                  <span className="text-[#E10600] mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>

            <button
              onClick={handleAnswer}
              disabled={!selectedAnswer}
              data-testid="quiz-next"
              className={`btn-primary w-full flex items-center justify-center gap-2 ${
                !selectedAnswer ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {currentQuestion < quiz.questions.length - 1 ? (
                <>Next Question <ChevronRight size={18} /></>
              ) : (
                'Submit Quiz'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const QuizTrigger = ({ onStartQuiz }) => {
  return (
    <section className="section bg-black border-y border-white/10">
      <div className="max-w-7xl mx-auto text-center">
        <div className="text-xs uppercase tracking-[0.2em] font-bold text-[#E10600] mb-2">
          Test Your Knowledge
        </div>
        <h2 className="font-display text-4xl md:text-5xl mb-4">
          READY FOR A QUIZ?
        </h2>
        <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
          Put your F1 knowledge to the test with our interactive quizzes
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => onStartQuiz('basics')}
            data-testid="start-basics-quiz"
            className="btn-primary"
          >
            F1 Basics Quiz
          </button>
          <button 
            onClick={() => onStartQuiz('flags')}
            data-testid="start-flags-quiz"
            className="btn-secondary"
          >
            Racing Flags Quiz
          </button>
          <button 
            onClick={() => onStartQuiz('strategy')}
            data-testid="start-strategy-quiz"
            className="btn-secondary"
          >
            Strategy Quiz
          </button>
        </div>
      </div>
    </section>
  );
};
