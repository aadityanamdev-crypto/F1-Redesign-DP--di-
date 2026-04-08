import React from 'react';
import { Flag, Car, Users, Trophy, MapPin, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const WhatIsF1Section = () => {
  const { user, updateProgress } = useAuth();
  const isCompleted = user?.progress?.['what-is-f1'];

  const handleMarkComplete = () => {
    if (user) {
      updateProgress('what-is-f1', !isCompleted);
    }
  };

  const scrollToNext = () => {
    document.getElementById('weekend')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="what-is-f1" 
      data-testid="what-is-f1-section"
      className="section bg-black relative"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E10600]/10 border border-[#E10600]/30 mb-6">
            <span className="w-6 h-6 flex items-center justify-center bg-[#E10600] text-white font-bold text-xs">1</span>
            <span className="label text-[#E10600]">Start Here</span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">
            WHAT IS FORMULA ONE?
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            The basics explained simply
          </p>
        </div>

        {/* Main Definition - Simple */}
        <div className="f1-card p-8 md:p-12 mb-8 text-center border-l-4 border-l-[#E10600]">
          <p className="text-xl md:text-2xl text-white leading-relaxed">
            Formula One is the <span className="text-[#E10600]">world's fastest</span> racing series.
          </p>
          <p className="text-lg text-zinc-400 mt-4">
            11 teams. 22 drivers.  Racing around the globe for the championship.
          </p>
        </div>

        {/* Core Concepts - One at a time */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* The Cars */}
          <div className="f1-card p-6" data-testid="whatisf1-cars">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#E10600]/10 flex items-center justify-center">
                <Car className="text-[#E10600]" size={20} />
              </div>
              <h3 className="font-display text-2xl">THE CARS</h3>
            </div>
            <ul className="space-y-2 text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-[#E10600] mt-1">•</span>
                <span>Open-wheel, single-seat racing machines</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E10600] mt-1">•</span>
                <span>Top speed: over 350 km/h (220 mph)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E10600] mt-1">•</span>
                <span>Each team builds their own car</span>
              </li>
            </ul>
          </div>

          {/* The Competition */}
          <div className="f1-card p-6" data-testid="whatisf1-competition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#E10600]/10 flex items-center justify-center">
                <Trophy className="text-[#E10600]" size={20} />
              </div>
              <h3 className="font-display text-2xl">THE GOAL</h3>
            </div>
            <ul className="space-y-2 text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-[#E10600] mt-1">•</span>
                <span>Finish races in the highest position</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E10600] mt-1">•</span>
                <span>Earn points based on finishing order</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E10600] mt-1">•</span>
                <span>Most points at season end = Champion</span>
              </li>
            </ul>
          </div>

          {/* The Teams */}
          <div className="f1-card p-6" data-testid="whatisf1-teams">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#E10600]/10 flex items-center justify-center">
                <Users className="text-[#E10600]" size={20} />
              </div>
              <h3 className="font-display text-2xl">THE TEAMS</h3>
            </div>
            <ul className="space-y-2 text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-[#E10600] mt-1">•</span>
                <span>11 teams compete each season</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E10600] mt-1">•</span>
                <span>Each team has 2 drivers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E10600] mt-1">•</span>
                <span>Teams also compete for Constructor title</span>
              </li>
            </ul>
          </div>

          {/* The Calendar */}
          <div className="f1-card p-6" data-testid="whatisf1-calendar">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#E10600]/10 flex items-center justify-center">
                <MapPin className="text-[#E10600]" size={20} />
              </div>
              <h3 className="font-display text-2xl">THE SEASON</h3>
            </div>
            <ul className="space-y-2 text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-[#E10600] mt-1">•</span>
                <span>24 races across 5 continents</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E10600] mt-1">•</span>
                <span>Season runs March to December</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E10600] mt-1">•</span>
                <span>Races held every 1-2 weeks</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Key Takeaway */}
        <div className="bg-zinc-900/50 border border-white/5 p-6 text-center mb-8">
          <div className="label text-[#E10600] mb-2">Key Takeaway</div>
          <p className="text-white">
            F1 = 22 drivers, 11 teams, racing for a full season to become World Champion
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {user && (
            <button
              onClick={handleMarkComplete}
              data-testid="whatisf1-complete-btn"
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
            data-testid="whatisf1-next-btn"
            className="ml-auto flex items-center gap-2 text-[#E10600] hover:gap-3 transition-all"
          >
            <span className="text-sm uppercase tracking-wider">Next: Race Weekend</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};
