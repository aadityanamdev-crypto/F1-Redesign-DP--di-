import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { User, Trophy, Bookmark, CheckCircle, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SECTIONS = [
  { id: 'what-is-f1', name: 'What is F1' },
  { id: 'weekend', name: 'Race Weekend' },
  { id: 'teams', name: 'Teams & Drivers' },
  { id: 'rules', name: 'Rules & Flags' },
  { id: 'strategy', name: 'Strategy' },
  { id: 'guide', name: 'Quick Guide' }
];

export const ProfilePage = () => {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#E10600] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const completedSections = Object.values(user.progress || {}).filter(Boolean).length;
  const totalSections = SECTIONS.length;
  const progressPercentage = Math.round((completedSections / totalSections) * 100);

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8"
          data-testid="profile-back"
        >
          <ArrowLeft size={18} />
          Back to Learning
        </Link>

        {/* Profile Header */}
        <div className="f1-card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 bg-[#E10600] flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 
                className="font-display text-4xl"
                data-testid="profile-name"
              >
                {user.name}
              </h1>
              <p className="text-zinc-500">{user.email}</p>
              <p className="text-xs text-zinc-600 mt-1">
                Member since {new Date(user.created_at || Date.now()).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={logout}
              data-testid="profile-logout"
              className="btn-secondary flex items-center gap-2"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="f1-card p-6 text-center">
            <div className="font-display text-5xl text-[#E10600]" data-testid="profile-progress-percent">
              {progressPercentage}%
            </div>
            <div className="text-zinc-500 text-sm">Course Progress</div>
          </div>
          <div className="f1-card p-6 text-center">
            <div className="font-display text-5xl text-[#E10600]" data-testid="profile-sections-completed">
              {completedSections}/{totalSections}
            </div>
            <div className="text-zinc-500 text-sm">Sections Completed</div>
          </div>
          <div className="f1-card p-6 text-center">
            <div className="font-display text-5xl text-[#E10600]" data-testid="profile-bookmarks-count">
              {(user.bookmarks || []).length}
            </div>
            <div className="text-zinc-500 text-sm">Bookmarks</div>
          </div>
        </div>

        {/* Learning Progress */}
        <div className="f1-card p-8 mb-8">
          <h2 className="font-display text-2xl mb-6 flex items-center gap-2">
            <Trophy className="text-[#E10600]" />
            Learning Progress
          </h2>
          
          {/* Progress Bar */}
          <div className="progress-bar mb-6 h-2">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
              data-testid="profile-progress-bar"
            />
          </div>

          {/* Sections List */}
          <div className="space-y-4">
            {SECTIONS.map((section) => {
              const isComplete = user.progress?.[section.id];
              return (
                <div 
                  key={section.id}
                  data-testid={`profile-section-${section.id}`}
                  className={`flex items-center justify-between p-4 border ${
                    isComplete ? 'border-green-500/50 bg-green-500/5' : 'border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isComplete ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : (
                      <div className="w-5 h-5 border border-zinc-600 rounded-full" />
                    )}
                    <span className={isComplete ? 'text-white' : 'text-zinc-500'}>
                      {section.name}
                    </span>
                  </div>
                  <Link 
                    to={`/#${section.id}`}
                    className="text-[#E10600] text-sm hover:underline"
                  >
                    {isComplete ? 'Review' : 'Start'}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quiz Scores */}
        {Object.keys(user.quiz_scores || {}).length > 0 && (
          <div className="f1-card p-8 mb-8">
            <h2 className="font-display text-2xl mb-6 flex items-center gap-2">
              <Trophy className="text-[#FFD700]" />
              Quiz Scores
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(user.quiz_scores).map(([quizId, score]) => (
                <div 
                  key={quizId}
                  data-testid={`profile-quiz-${quizId}`}
                  className="text-center p-4 bg-zinc-900"
                >
                  <div className="font-display text-3xl text-[#E10600]">{score}%</div>
                  <div className="text-xs text-zinc-500 uppercase">{quizId} Quiz</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookmarks */}
        {(user.bookmarks || []).length > 0 && (
          <div className="f1-card p-8">
            <h2 className="font-display text-2xl mb-6 flex items-center gap-2">
              <Bookmark className="text-[#E10600]" />
              Bookmarks
            </h2>
            <div className="space-y-2">
              {user.bookmarks.map((bookmark, index) => (
                <div 
                  key={index}
                  data-testid={`profile-bookmark-${index}`}
                  className="flex items-center justify-between p-3 bg-zinc-900"
                >
                  <div>
                    <span className="text-xs text-[#E10600] uppercase">{bookmark.item_type}</span>
                    <span className="mx-2 text-zinc-600">•</span>
                    <span>{bookmark.item_id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
