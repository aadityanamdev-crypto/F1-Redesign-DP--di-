import React from 'react';
import { ChevronDown, BookOpen } from 'lucide-react';

export const HeroSection = () => {
  const scrollToWhatIsF1 = () => {
    document.getElementById('what-is-f1')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      data-testid="hero-section" 
      className="hero-section"
    >
      {/* Background Image */}
      <div 
        className="hero-bg"
        style={{
          backgroundImage: `url(https://4kwallpapers.com/images/walls/thumbs_3t/13489.jpg )`
        }}
      />
      
      {/* Overlay */}
      <div className="hero-overlay" />    
      
      {/* Red accent line */}
      <div className="absolute top-0 left-0 w-1 h-full bg-[#E10600]" />
      
      {/* Content */}
      <div className="hero-content px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
        {/* Step indicator */}
        <div 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 mb-8 animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          
        </div>
        
        {/* Main Headline - F1 Display Font */}
       <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none tracking-tight mb-6 animate-slide-in-left"
  style={{ animationDelay: '0.4s' }}
>
  LEARN<br />

  <span 
  className="text-[#E10600] text-6xl md:text-7xl lg:text-8xl"
  style={{ fontFamily: 'F1-Regular', textTransform: 'none' }}
>
  Formula 1
</span><br />

</h1>
        
        {/* Subheading - Titillium Web */}
        <p 
          className="text-lg md:text-xl text-zinc-300 max-w-xl mb-10 animate-fade-in leading-relaxed"
          style={{ animationDelay: '0.6s' }}
        >
          New to F1? Start here.<br />
          <span className="text-zinc-500">We'll guide you from zero knowledge to understanding the sport in 10 minutes.</span>
        </p>
        
        {/* Single clear CTA */}
        <div 
          className="animate-slide-in-up"
          style={{ animationDelay: '0.8s' }}
        >
          <button 
            onClick={scrollToWhatIsF1}
            data-testid="hero-cta-button"
            className="btn-primary flex items-center justify-center gap-3 text-base px-8 py-4"
          >
            BEGIN YOUR JOURNEY
            <ChevronDown size={20} />
          </button>
        </div>
        
        {/* Learning path preview */}
        <div 
          className="mt-16 animate-fade-in"
          style={{ animationDelay: '1s' }}
        >
          <div className="label text-zinc-600 mb-4">
            Your Learning Path
          </div>
          <div className="flex flex-wrap gap-3">
            {['What is F1', 'Race Weekend', 'Teams', 'Rules', 'Strategy', 'Quick Guide'].map((step, i) => (
              <div 
                key={step}
                className="flex items-center gap-2 text-sm"
              >
                <span className="w-6 h-6 flex items-center justify-center bg-[#E10600]/20 text-[#E10600] font-semibold text-xs">
                  {i + 1}
                </span>
                <span className="text-zinc-500">{step}</span>
                {i < 5 && <span className="text-zinc-700 ml-1">→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <button
        onClick={scrollToWhatIsF1}
        data-testid="hero-scroll-indicator"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors animate-bounce"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
};
