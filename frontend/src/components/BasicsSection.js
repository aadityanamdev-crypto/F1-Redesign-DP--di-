import React from 'react';
import { Zap, Shield, Wind, Gauge, Timer, Flag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BASICS_CARDS = [
  {
    id: 'drs',
    icon: Wind,
    title: 'DRS',
    subtitle: 'Drag Reduction System',
    description: 'A moveable rear wing that reduces air resistance, giving drivers a speed boost on straights when within 1 second of the car ahead.',
    span: 'md:col-span-4 lg:col-span-4'
  },
  {
    id: 'downforce',
    icon: Zap,
    title: 'Downforce',
    subtitle: 'Aerodynamic Grip',
    description: 'Aerodynamic force that pushes the car into the track, allowing faster cornering speeds. More downforce = more grip.',
    span: 'md:col-span-4 lg:col-span-4'
  },
  {
    id: 'halo',
    icon: Shield,
    title: 'Halo',
    subtitle: 'Safety Device',
    description: 'The titanium bar above the cockpit that protects drivers from debris and impacts. Mandatory since 2018.',
    span: 'md:col-span-4 lg:col-span-4'
  },
  {
    id: 'power-unit',
    icon: Gauge,
    title: 'Power Unit',
    subtitle: '1000+ Horsepower',
    description: 'A hybrid system combining a 1.6L V6 turbo engine with electric motors, producing over 1000 horsepower.',
    span: 'md:col-span-4 lg:col-span-6'
  },
  {
    id: 'pitstop',
    icon: Timer,
    title: 'Pit Stop',
    subtitle: 'Under 2 Seconds',
    description: 'Teams change all four tyres in under 2 seconds. Strategy around pit stops can win or lose races.',
    span: 'md:col-span-4 lg:col-span-6'
  }
];

export const BasicsSection = () => {
  const { user, updateProgress } = useAuth();
  const isCompleted = user?.progress?.basics;

  const handleMarkComplete = () => {
    if (user) {
      updateProgress('basics', !isCompleted);
    }
  };

  return (
    <section 
      id="basics" 
      data-testid="basics-section"
      className="section bg-black relative"
    >
      {/* Background texture */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1763075958748-9a0c9c8799c3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwzfHxkYXJrJTIwY2FyYm9uJTIwZmliZXIlMjB0ZXh0dXJlfGVufDB8fHx8MTc3NTU1NTA0Nnww&ixlib=rb-4.1.0&q=85')`,
          backgroundSize: 'cover'
        }}
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-[#E10600] mb-2">
              Chapter 01
            </div>
            <h2 className="font-['Bebas_Neue'] text-4xl md:text-5xl lg:text-6xl">
              F1 BASICS
            </h2>
            <p className="text-zinc-400 mt-2 max-w-xl">
              Essential concepts every F1 fan should know
            </p>
          </div>
          
          {user && (
            <button
              onClick={handleMarkComplete}
              data-testid="basics-complete-btn"
              className={`hidden md:flex items-center gap-2 px-4 py-2 border transition-all ${
                isCompleted 
                  ? 'border-green-500 text-green-500' 
                  : 'border-white/20 text-zinc-400 hover:border-[#E10600] hover:text-[#E10600]'
              }`}
            >
              <Flag size={16} />
              {isCompleted ? 'Completed' : 'Mark Complete'}
            </button>
          )}
        </div>

        {/* Bento Grid */}
        <div className="bento-grid stagger-children">
          {BASICS_CARDS.map((card) => (
            <div
              key={card.id}
              data-testid={`basics-card-${card.id}`}
              className={`f1-card p-6 md:p-8 ${card.span}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#E10600]/10 flex items-center justify-center flex-shrink-0">
                  <card.icon className="text-[#E10600]" size={24} />
                </div>
                <div>
                  <h3 className="font-['Bebas_Neue'] text-2xl md:text-3xl">{card.title}</h3>
                  <div className="text-xs uppercase tracking-wider text-[#E10600] mb-2">
                    {card.subtitle}
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
