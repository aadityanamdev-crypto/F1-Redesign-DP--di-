import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Youtube, Github } from 'lucide-react';

export const Footer = () => {
  return (
    <footer 
      data-testid="footer"
      className="bg-zinc-950 border-t border-white/10"
    >
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#E10600] flex items-center justify-center">
                <span className="font-display text-white text-2xl">F1</span>
              </div>
              <span className="font-display text-xl tracking-wider">
                LEARNING HUB
              </span>
            </div>
            <p className="text-zinc-500 text-sm max-w-md leading-relaxed">
              Your ultimate guide to understanding Formula One. From the basics to advanced strategy, 
              we break down the world's fastest sport for newcomers and enthusiasts alike.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg mb-4">LEARN</h4>
            <ul className="space-y-2">
              <li>
                <a href="/#what-is-f1" className="text-zinc-500 hover:text-[#E10600] text-sm transition-colors">
                  What is F1
                </a>
              </li>
              <li>
                <a href="/#weekend" className="text-zinc-500 hover:text-[#E10600] text-sm transition-colors">
                  Race Weekend
                </a>
              </li>
              <li>
                <a href="/#teams" className="text-zinc-500 hover:text-[#E10600] text-sm transition-colors">
                  Teams & Drivers
                </a>
              </li>
              <li>
                <a href="/#rules" className="text-zinc-500 hover:text-[#E10600] text-sm transition-colors">
                  Rules & Flags
                </a>
              </li>
              <li>
                <a href="/#strategy" className="text-zinc-500 hover:text-[#E10600] text-sm transition-colors">
                  Strategy
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-display text-lg mb-4">ACCOUNT</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-zinc-500 hover:text-[#E10600] text-sm transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-zinc-500 hover:text-[#E10600] text-sm transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-zinc-500 hover:text-[#E10600] text-sm transition-colors">
                  My Progress
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-zinc-600 text-sm">
            © {new Date().getFullYear()} F1 Begineers Guide | Redesign by ạạdiત્ય | Design Project
          </div>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-zinc-600 hover:text-[#E10600] transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-zinc-600 hover:text-[#E10600] transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-zinc-600 hover:text-[#E10600] transition-colors"
              aria-label="YouTube"
            >
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
