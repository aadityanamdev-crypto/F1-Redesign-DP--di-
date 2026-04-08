import React, { useState } from 'react';
import { Calendar, Clock, Trophy, Flag, ChevronRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const WEEKEND_STEPS = [
  {
    id: 'friday',
    day: 'Friday',
    title: 'Practice',
    sessions: ['FP1', 'FP2'],
    purpose: 'Learn the track',
    points: [
      'Drivers get familiar with the circuit',
      'Teams test different car setups',
      'No championship points awarded'
    ],
    color: '#3B82F6'
  },
  {
    id: 'saturday',
    day: 'Saturday',
    title: 'Qualifying',
    sessions: ['FP3', 'Qualifying'],
    purpose: 'Set grid positions',
    points: [
      'Three rounds: Q1 → Q2 → Q3',
      'Slowest drivers eliminated each round',
      'Fastest driver starts in P1 (pole position)'
    ],
    color: '#F59E0B'
  },
  {
    id: 'sunday',
    day: 'Sunday',
    title: 'Race Day',
    sessions: ['The Race'],
    purpose: 'Championship points',
    points: [
      'Lights out = race begins',
      'Drivers compete for race victory',
      'Points awarded to top 10 finishers'
    ],
    color: '#E10600'
  }
];

export const RaceWeekendSection = () => {
  const [activeStep, setActiveStep] = useState('saturday');
  const { user, updateProgress } = useAuth();
  const isCompleted = user?.progress?.weekend;

  const handleMarkComplete = () => {
    if (user) {
      updateProgress('weekend', !isCompleted);
    }
  };

  const scrollToNext = () => {
    document.getElementById('teams')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="weekend" 
      data-testid="weekend-section"
      className="section bg-zinc-950"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E10600]/10 border border-[#E10600]/30 mb-6">
            <span className="w-6 h-6 flex items-center justify-center bg-[#E10600] text-white font-bold text-xs">2</span>
            <span className="label text-[#E10600]">Understanding the Format</span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">
            HOW A RACE WEEKEND WORKS
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Every F1 race follows a 3-day format
          </p>
        </div>

        {/* Simple Timeline */}
        <div className="mb-12">
          {/* Desktop Timeline */}
          <div className="hidden md:flex items-start justify-between relative mb-8">
            {/* Connection Line */}
            <div className="absolute top-8 left-[16.67%] right-[16.67%] h-0.5 bg-white/10" />
            <div 
              className="absolute top-8 left-[16.67%] h-0.5 bg-[#E10600] transition-all duration-500"
              style={{ 
                width: activeStep === 'friday' ? '0%' : activeStep === 'saturday' ? '50%' : '100%',
                maxWidth: '66.67%'
              }}
            />
            
            {WEEKEND_STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                data-testid={`weekend-step-${step.id}`}
                className={`flex-1 flex flex-col items-center text-center transition-all ${
                  activeStep === step.id ? 'opacity-100' : 'opacity-50 hover:opacity-75'
                }`}
              >
                <div 
                  className={`w-16 h-16 flex items-center justify-center mb-4 transition-all ${
                    activeStep === step.id ? '' : 'bg-zinc-900'
                  }`}
                  style={{ backgroundColor: activeStep === step.id ? step.color : undefined }}
                >
                  <span className="font-display text-2xl text-white">{step.day[0]}</span>
                </div>
                <div className="font-display text-xl">{step.day}</div>
                <div className="text-sm text-zinc-500">{step.title}</div>
              </button>
            ))}
          </div>

          {/* Mobile Steps */}
          <div className="md:hidden space-y-4">
            {WEEKEND_STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                data-testid={`weekend-step-mobile-${step.id}`}
                className={`w-full flex items-center gap-4 p-4 border transition-all ${
                  activeStep === step.id 
                    ? 'border-[#E10600] bg-[#E10600]/5' 
                    : 'border-white/10'
                }`}
              >
                <div 
                  className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: step.color }}
                >
                  <span className="font-display text-lg text-white">{step.day[0]}</span>
                </div>
                <div className="text-left">
                  <div className="font-display text-lg">{step.day}</div>
                  <div className="text-sm text-zinc-500">{step.title}</div>
                </div>
                {activeStep === step.id && (
                  <CheckCircle className="ml-auto text-[#E10600]" size={20} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Active Step Details */}
        {WEEKEND_STEPS.filter(s => s.id === activeStep).map(step => (
          <div 
            key={step.id}
            data-testid="weekend-details"
            className="f1-card p-8 mb-12 animate-fade-in"
            style={{ borderLeftColor: step.color, borderLeftWidth: '4px' }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="text-xs uppercase tracking-wider mb-2" style={{ color: step.color }}>
                  {step.purpose}
                </div>
                <h3 className="font-display text-3xl mb-4">{step.day}: {step.title}</h3>
                <div className="flex gap-2 mb-4">
                  {step.sessions.map(session => (
                    <span 
                      key={session}
                      className="px-3 py-1 text-xs font-medium border"
                      style={{ borderColor: step.color, color: step.color }}
                    >
                      {session}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-zinc-500 mb-3">
                  What Happens
                </div>
                <ul className="space-y-3">
                  {step.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div 
                        className="w-1.5 h-1.5 mt-2 flex-shrink-0" 
                        style={{ backgroundColor: step.color }}
                      />
                      <span className="text-zinc-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}

        {/* Key Takeaway */}
        <div className="bg-zinc-900/50 border border-white/5 p-6 text-center mb-8">
          <div className="label text-[#E10600] mb-2">Key Takeaway</div>
          <p className="text-white">
            Friday = Practice • Saturday = Qualifying • Sunday = Race
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {user && (
            <button
              onClick={handleMarkComplete}
              data-testid="weekend-complete-btn"
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
            data-testid="weekend-next-btn"
            className="ml-auto flex items-center gap-2 text-[#E10600] hover:gap-3 transition-all"
          >
            <span className="text-sm uppercase tracking-wider">Next: Teams & Drivers</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};
