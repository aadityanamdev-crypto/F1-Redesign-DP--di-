import React, { useState } from 'react';
import { Flag, ChevronRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ESSENTIAL_FLAGS = [
  {
    id: 'green',
    name: 'Green',
    color: '#00FF00',
    meaning: 'Go!',
    description: 'Track is clear, full racing allowed',
    priority: 'essential'
  },
  {
    id: 'yellow',
    name: 'Yellow',
    color: '#FFD700',
    meaning: 'Caution',
    description: 'Danger ahead, slow down, no overtaking',
    priority: 'essential'
  },
  {
    id: 'red',
    name: 'Red',
    color: '#E10600',
    meaning: 'Stop',
    description: 'Session stopped, return to pits',
    priority: 'essential'
  },
  {
    id: 'checkered',
    name: 'Checkered',
    pattern: true,
    meaning: 'Finish',
    description: 'Race or session has ended',
    priority: 'essential'
  },
  {
    id: 'blue',
    name: 'Blue',
    color: '#0066FF',
    meaning: 'Move Aside',
    description: 'Let faster car pass (being lapped)',
    priority: 'secondary'
  },
  {
    id: 'white',
    name: 'White',
    color: '#FFFFFF',
    meaning: 'Slow Car',
    description: 'Slow vehicle on track ahead',
    priority: 'secondary'
  }
];

export const RulesSection = () => {
  const [showAll, setShowAll] = useState(false);
  const { user, updateProgress } = useAuth();
  const isCompleted = user?.progress?.rules;

  const handleMarkComplete = () => {
    if (user) {
      updateProgress('rules', !isCompleted);
    }
  };

  const scrollToNext = () => {
    document.getElementById('strategy')?.scrollIntoView({ behavior: 'smooth' });
  };

  const displayedFlags = showAll 
    ? ESSENTIAL_FLAGS 
    : ESSENTIAL_FLAGS.filter(f => f.priority === 'essential');

  return (
    <section 
      id="rules" 
      data-testid="rules-section"
      className="section bg-zinc-950"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E10600]/10 border border-[#E10600]/30 mb-6">
            <span className="w-6 h-6 flex items-center justify-center bg-[#E10600] text-white font-bold text-xs">4</span>
            <span className="label text-[#E10600]">Race Control</span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">
            RULES & FLAGS
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">
            Simple visual signals that control the race
          </p>
        </div>

        {/* Intro explanation */}
        <div className="f1-card p-6 mb-12 text-center border-l-4 border-l-[#E10600]">
          <AlertTriangle className="text-[#E10600] mx-auto mb-3" size={28} />
          <p className="text-white">
            Flags communicate important information to drivers instantly.
          </p>
          <p className="text-zinc-500 text-sm mt-2">
            Here are the most important ones to know.
          </p>
        </div>

        {/* Essential Flags */}
        <div className="mb-8">
          <div className="label text-zinc-500 mb-4">
            {showAll ? 'All Racing Flags' : 'Essential Flags to Know'}
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {displayedFlags.map((flag) => (
              <div
                key={flag.id}
                data-testid={`flag-${flag.id}`}
                className="f1-card p-5 flex items-center gap-4 group hover:border-white/20"
              >
                {/* Flag Visual */}
                <div 
                  className="w-16 h-12 flex-shrink-0 transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: flag.color || undefined,
                    background: flag.pattern 
                      ? 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)' 
                      : flag.color,
                    backgroundSize: flag.pattern ? '12px 12px' : undefined
                  }}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display text-xl">{flag.name}</h3>
                    <span className="text-xs px-2 py-0.5 bg-white/5 text-zinc-400">
                      {flag.meaning}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500">
                    {flag.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {!showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-4 text-sm text-zinc-500 hover:text-[#E10600] transition-colors"
            >
              + Show more flags
            </button>
          )}
        </div>

        {/* Safety Car - Important concept */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="f1-card p-5">
            <div className="text-xs uppercase tracking-wider text-[#FFD700] mb-2">Safety Car</div>
            <h3 className="font-display text-xl mb-2">VSC & SC</h3>
            <p className="text-sm text-zinc-400">
              When there's danger, a Safety Car leads the pack at reduced speed until the track is clear.
            </p>
          </div>
          <div className="f1-card p-5">
            <div className="text-xs uppercase tracking-wider text-[#E10600] mb-2">Red Flag</div>
            <h3 className="font-display text-xl mb-2">Session Stopped</h3>
            <p className="text-sm text-zinc-400">
              In serious situations, the race is stopped completely. Cars return to pit lane.
            </p>
          </div>
        </div>

        {/* Key Takeaway */}
        <div className="bg-zinc-900/50 border border-white/5 p-6 text-center mb-8">
          <div className="label text-[#E10600] mb-2">Key Takeaway</div>
          <p className="text-white">
            Green = Go • Yellow = Slow • Red = Stop • Checkered = Finish
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {user && (
            <button
              onClick={handleMarkComplete}
              data-testid="rules-complete-btn"
              className={`flex items-center gap-2 px-4 py-2 border transition-all text-sm ${
                isCompleted 
                  ? 'border-green-500 text-green-500' 
                  : 'border-white/20 text-zinc-400 hover:border-[#E10600] hover:text-[#E10600]'
              }`}
            >
              <Flag size={14} />
              {isCompleted ? 'Completed' : 'Mark as Learned'}
            </button>
          )}
          
          <button
            onClick={scrollToNext}
            data-testid="rules-next-btn"
            className="ml-auto flex items-center gap-2 text-[#E10600] hover:gap-3 transition-all"
          >
            <span className="text-sm uppercase tracking-wider">Next: Strategy</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};
