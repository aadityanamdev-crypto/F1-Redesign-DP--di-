import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { id: 'what-is-f1', label: 'What is F1', href: '/#what-is-f1' },
  { id: 'weekend', label: 'Weekend', href: '/#weekend' },
  { id: 'teams', label: 'Teams', href: '/#teams' },
  { id: 'rules', label: 'Rules', href: '/#rules' },
  { id: 'strategy', label: 'Strategy', href: '/#strategy' },
  { id: 'guide', label: 'Guide', href: '/#guide' },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Determine active section
      const sections = NAV_ITEMS.map(item => item.id);
      for (const section of [...sections].reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const id = href.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setIsOpen(false);
    }
  };

  // Get current step number
  const getCurrentStep = () => {
    const index = NAV_ITEMS.findIndex(item => item.id === activeSection);
    return index >= 0 ? index + 1 : 0;
  };

  return (
    <nav
      data-testid="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            data-testid="nav-logo"
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-[#E10600] flex items-center justify-center">
              <span className="font-display text-white text-2xl">F1</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-lg tracking-wider">
                LEARNING HUB
              </span>
              {scrolled && activeSection && (
                <div className="text-xs text-zinc-500">
                  Step {getCurrentStep()} of 6
                </div>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item, index) => (
              <a
                key={item.id}
                href={item.href}
                data-testid={`nav-${item.id}`}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`flex items-center gap-2 px-3 py-2 text-sm transition-all ${
                  activeSection === item.id 
                    ? 'text-white' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span 
                  className={`w-5 h-5 flex items-center justify-center text-xs font-bold ${
                    activeSection === item.id 
                      ? 'bg-[#E10600] text-white' 
                      : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {index + 1}
                </span>
                <span className="hidden lg:inline">{item.label}</span>
              </a>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <Link 
                  to="/profile"
                  data-testid="nav-profile"
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                >
                  <User size={18} />
                  <span className="text-sm">{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  data-testid="nav-logout"
                  className="text-zinc-400 hover:text-[#E10600] transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                data-testid="nav-login"
                className="hidden md:block text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              data-testid="nav-mobile-toggle"
              className="md:hidden text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {scrolled && (
          <div className="h-0.5 bg-zinc-900 -mx-4 sm:-mx-6 lg:-mx-8">
            <div 
              className="h-full bg-[#E10600] transition-all duration-300"
              style={{ width: `${(getCurrentStep() / 6) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-white/10">
          <div className="px-4 py-6 space-y-2">
            {NAV_ITEMS.map((item, index) => (
              <a
                key={item.id}
                href={item.href}
                data-testid={`nav-mobile-${item.id}`}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`flex items-center gap-3 p-3 ${
                  activeSection === item.id 
                    ? 'bg-[#E10600]/10 border-l-2 border-l-[#E10600]' 
                    : ''
                }`}
              >
                <span 
                  className={`w-6 h-6 flex items-center justify-center text-xs font-bold ${
                    activeSection === item.id 
                      ? 'bg-[#E10600] text-white' 
                      : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {index + 1}
                </span>
                <span className={activeSection === item.id ? 'text-white' : 'text-zinc-400'}>
                  {item.label}
                </span>
              </a>
            ))}
            <div className="pt-4 border-t border-white/10 mt-4">
              {user ? (
                <div className="space-y-4">
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 text-zinc-300 p-3"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={18} />
                    <span>{user.name}</span>
                  </Link>
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="flex items-center gap-2 text-[#E10600] p-3"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center p-3 bg-[#E10600] text-white font-display tracking-wider"
                >
                  Sign In to Track Progress
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
