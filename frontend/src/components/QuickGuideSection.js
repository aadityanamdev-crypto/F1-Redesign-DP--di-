import React from 'react';
import { 
  Flag, Trophy, Circle, AlertTriangle, CheckCircle, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const QuickGuideSection = () => {
  const { user, updateProgress } = useAuth();
  const isCompleted = user?.progress?.guide;

  const handleMarkComplete = () => {
    if (user) {
      updateProgress('guide', !isCompleted);
    }
  };

  return (
    <section 
      id="guide" 
      data-testid="guide-section"
      className="section bg-zinc-950"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E10600]/10 border border-[#E10600]/30 mb-6">
            <span className="w-6 h-6 flex items-center justify-center bg-[#E10600] text-white font-bold text-xs">6</span>
            <span className="label text-[#E10600]">Quick Reference</span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">
            CHEAT SHEET
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">
            Everything you learned, at a glance
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* The Basics */}
          <div className="f1-card p-6">
            <h3 className="font-display text-xl text-[#E10600] mb-4">THE BASICS</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                <span className="text-zinc-300">11 teams, 22 drivers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                <span className="text-zinc-300">24 races per season</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                <span className="text-zinc-300">Most points = World Champion</span>
              </li>
            </ul>
          </div>

          {/* Race Weekend */}
          <div className="f1-card p-6">
            <h3 className="font-display text-xl text-[#E10600] mb-4">RACE WEEKEND</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-blue-500 font-bold">FRI</span>
                <span className="text-zinc-300">Practice sessions</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-500 font-bold">SAT</span>
                <span className="text-zinc-300">Qualifying (set grid positions)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#E10600] font-bold">SUN</span>
                <span className="text-zinc-300">Race day (points awarded)</span>
              </li>
            </ul>
          </div>

          {/* Flags */}
          <div className="f1-card p-6">
            <h3 className="font-display text-xl text-[#E10600] mb-4">KEY FLAGS</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-green-500" />
                <span className="text-zinc-300">Go</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-yellow-500" />
                <span className="text-zinc-300">Caution</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-[#E10600]" />
                <span className="text-zinc-300">Stop</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3" style={{ background: 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)', backgroundSize: '6px 6px' }} />
                <span className="text-zinc-300">Finish</span>
              </div>
            </div>
          </div>

          {/* Tyres */}
          <div className="f1-card p-6">
            <h3 className="font-display text-xl text-[#E10600] mb-4">TYRES</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Circle size={12} className="text-[#E10600]" fill="#E10600" />
                <span className="text-zinc-300">Soft = Fastest, wears quickly</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle size={12} className="text-yellow-500" fill="#FFD700" />
                <span className="text-zinc-300">Medium = Balanced</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle size={12} className="text-white" fill="#FFFFFF" />
                <span className="text-zinc-300">Hard = Slowest, lasts longest</span>
              </div>
            </div>
          </div>
        </div>

        {/* Points System */}
        <div className="f1-card p-6 mb-12">
          <h3 className="font-display text-xl text-[#E10600] mb-4 text-center">POINTS SYSTEM</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { pos: '1st', pts: 25, color: '#FFD700' },
              { pos: '2nd', pts: 18, color: '#C0C0C0' },
              { pos: '3rd', pts: 15, color: '#CD7F32' },
              { pos: '4th', pts: 12 },
              { pos: '5th', pts: 10 },
              { pos: '6th', pts: 8 },
              { pos: '7th', pts: 6 },
              { pos: '8th', pts: 4 },
              { pos: '9th', pts: 2 },
              { pos: '10th', pts: 1 },
            ].map((item) => (
              <div 
                key={item.pos}
                className="text-center px-3 py-2 bg-zinc-900"
              >
                <div className="text-xs text-zinc-500">{item.pos}</div>
                <div 
                  className="font-display text-xl"
                  style={{ color: item.color || '#E10600' }}
                >
                  {item.pts}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-zinc-500 mt-4">
            +1 bonus point for fastest lap (if finishing in top 10)
          </p>
        </div>

        {/* Completion Banner */}
        <div className="bg-gradient-to-r from-[#E10600]/20 to-transparent border-l-4 border-l-[#E10600] p-6 mb-8">
          <div className="flex items-center gap-4">
            <Trophy className="text-[#E10600]" size={32} />
            <div>
              <h3 className="font-display text-2xl">CONGRATULATIONS!</h3>
              <p className="text-zinc-400 text-sm">
                You now know the basics of Formula One. Ready to watch your first race!
              </p>
            </div>
          </div>
        </div>

        {/* Final Mark Complete */}
        {user && (
          <div className="text-center">
            <button
              onClick={handleMarkComplete}
              data-testid="guide-complete-btn"
              className={`inline-flex items-center gap-2 px-6 py-3 border transition-all ${
                isCompleted 
                  ? 'border-green-500 text-green-500 bg-green-500/10' 
                  : 'border-[#E10600] text-[#E10600] hover:bg-[#E10600] hover:text-white'
              }`}
            >
              <Flag size={18} />
              {isCompleted ? 'Learning Complete!' : 'Complete Your Journey'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
