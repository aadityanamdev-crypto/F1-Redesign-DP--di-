import React, { useState } from 'react';
import { Circle, Flag, ChevronRight, Zap, Timer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TYRES = [
  { id: 'soft', name: 'Soft', color: '#E10600', speed: 'Fastest', life: 'Shortest' },
  { id: 'medium', name: 'Medium', color: '#FFD700', speed: 'Balanced', life: 'Balanced' },
  { id: 'hard', name: 'Hard', color: '#FFFFFF', speed: 'Slowest', life: 'Longest' },
];

export const StrategySection = () => {
  const [selectedTyre, setSelectedTyre] = useState('medium');
  const { user, updateProgress } = useAuth();
  const isCompleted = user?.progress?.strategy;

  const handleMarkComplete = () => {
    if (user) {
      updateProgress('strategy', !isCompleted);
    }
  };

  const scrollToNext = () => {
    document.getElementById('guide')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="strategy" 
      data-testid="strategy-section"
      className="section bg-black"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E10600]/10 border border-[#E10600]/30 mb-6">
            <span className="w-6 h-6 flex items-center justify-center bg-[#E10600] text-white font-bold text-xs">5</span>
            <span className="label text-[#E10600]">Advanced Basics</span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">
            RACE STRATEGY
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">
            The key decisions that can win or lose a race
          </p>
        </div>

        {/* Intro - Why strategy matters */}
        <div className="f1-card p-6 mb-12 text-center border-l-4 border-l-[#E10600]">
          <p className="text-white">
            F1 isn't just about driving fast.
          </p>
          <p className="text-zinc-500 text-sm mt-2">
            When to change tyres and when to use special features can make the difference between winning and losing.
          </p>
        </div>

        {/* 1. TYRES - Simplified */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#E10600]/10 flex items-center justify-center">
              <Circle className="text-[#E10600]" size={20} />
            </div>
            <div>
              <h3 className="font-display text-2xl">TYRES</h3>
              <p className="text-xs text-zinc-500">Different compounds for different needs</p>
            </div>
          </div>

          {/* Tyre selector */}
          <div className="flex gap-4 mb-6 justify-center">
            {TYRES.map((tyre) => (
              <button
                key={tyre.id}
                onClick={() => setSelectedTyre(tyre.id)}
                data-testid={`tyre-${tyre.id}`}
                className={`flex flex-col items-center p-4 transition-all ${
                  selectedTyre === tyre.id
                    ? 'bg-zinc-900 border-2'
                    : 'border border-white/10 hover:border-white/30'
                }`}
                style={{ borderColor: selectedTyre === tyre.id ? tyre.color : undefined }}
              >
                <div 
                  className="w-12 h-12 rounded-full border-4 mb-2"
                  style={{ borderColor: tyre.color }}
                />
                <span className="font-display text-lg">{tyre.name}</span>
              </button>
            ))}
          </div>

          {/* Tyre info */}
          {TYRES.filter(t => t.id === selectedTyre).map(tyre => (
            <div key={tyre.id} className="f1-card p-6 animate-fade-in">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Speed</div>
                  <div className="font-display text-xl" style={{ color: tyre.color }}>{tyre.speed}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Durability</div>
                  <div className="font-display text-xl" style={{ color: tyre.color }}>{tyre.life}</div>
                </div>
              </div>
              <p className="text-center text-zinc-500 text-sm mt-4">
                {tyre.id === 'soft' && 'Best for qualifying and quick bursts of speed'}
                {tyre.id === 'medium' && 'The all-rounder, good for most strategies'}
                {tyre.id === 'hard' && 'Long stints without stopping, saves time in pits'}
              </p>
            </div>
          ))}
        </div>

        {/* 2. PIT STOPS - Simplified */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#E10600]/10 flex items-center justify-center">
              <Timer className="text-[#E10600]" size={20} />
            </div>
            <div>
              <h3 className="font-display text-2xl">PIT STOPS</h3>
              <p className="text-xs text-zinc-500">Quick stops to change tyres</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="f1-card p-5 text-center">
              <div className="font-display text-4xl text-[#E10600] mb-2">&lt;2s</div>
              <div className="text-sm text-zinc-400">Tyre change time</div>
              <div className="text-xs text-zinc-600 mt-1">World record: 1.80 seconds</div>
            </div>
            <div className="f1-card p-5 text-center">
              <div className="font-display text-4xl text-[#E10600] mb-2">20+</div>
              <div className="text-sm text-zinc-400">Crew members</div>
              <div className="text-xs text-zinc-600 mt-1">Working simultaneously</div>
            </div>
            <div className="f1-card p-5 text-center">
              <div className="font-display text-4xl text-[#E10600] mb-2">~20s</div>
              <div className="text-sm text-zinc-400">Total time lost</div>
              <div className="text-xs text-zinc-600 mt-1">Including pit lane travel</div>
            </div>
          </div>
        </div>

        {/* 3. DRS - Simplified */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#E10600]/10 flex items-center justify-center">
              <Zap className="text-[#E10600]" size={20} />
            </div>
            <div>
              <h3 className="font-display text-2xl">DRS</h3>
              <p className="text-xs text-zinc-500">Drag Reduction System</p>
            </div>
          </div>

          <div className="f1-card p-6">
            <p className="text-white mb-4">
              A moveable rear wing that gives drivers a <span className="text-[#E10600]">speed boost</span> on straights.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-[#E10600]">•</span>
                <span className="text-zinc-400">Only available in designated "DRS Zones"</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#E10600]">•</span>
                <span className="text-zinc-400">Must be within 1 second of car ahead</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#E10600]">•</span>
                <span className="text-zinc-400">Adds ~15 km/h extra speed</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#E10600]">•</span>
                <span className="text-zinc-400">Designed to help overtaking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Takeaway */}
        <div className="bg-zinc-900/50 border border-white/5 p-6 text-center mb-8">
          <div className="label text-[#E10600] mb-2">Key Takeaway</div>
          <p className="text-white">
            Strategy = Choosing the right tyres + When to pit + Using DRS to overtake
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {user && (
            <button
              onClick={handleMarkComplete}
              data-testid="strategy-complete-btn"
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
            data-testid="strategy-next-btn"
            className="ml-auto flex items-center gap-2 text-[#E10600] hover:gap-3 transition-all"
          >
            <span className="text-sm uppercase tracking-wider">Final: Quick Guide</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};
