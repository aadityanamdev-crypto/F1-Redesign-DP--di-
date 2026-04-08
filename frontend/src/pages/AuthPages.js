import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      {/* Background */}
      <div 
        className="fixed inset-0 opacity-20"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/18545023/pexels-photo-18545023.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black via-black/95 to-black" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-[#E10600] flex items-center justify-center">
            <span className="font-display text-white text-3xl">F1</span>
          </div>
        </Link>

        <div className="f1-card p-8">
          <h1 
            className="font-display text-4xl text-center mb-2"
            data-testid="login-title"
          >
            WELCOME BACK
          </h1>
          <p className="text-zinc-500 text-center mb-8">
            Sign in to track your learning progress
          </p>

          {error && (
            <div 
              className="flex items-center gap-2 p-4 mb-6 bg-red-500/10 border border-red-500/50 text-red-500"
              data-testid="login-error"
            >
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="login-email"
                  className="f1-input w-full pl-10"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="login-password"
                  className="f1-input w-full pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="login-submit"
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  SIGN IN
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-zinc-500 mt-6">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-[#E10600] hover:underline"
              data-testid="login-register-link"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    const result = await register(email, password, name);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      {/* Background */}
      <div 
        className="fixed inset-0 opacity-20"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/18545023/pexels-photo-18545023.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black via-black/95 to-black" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-[#E10600] flex items-center justify-center">
            <span className="font-display text-white text-3xl">F1</span>
          </div>
        </Link>

        <div className="f1-card p-8">
          <h1 
            className="font-display text-4xl text-center mb-2"
            data-testid="register-title"
          >
            JOIN THE GRID
          </h1>
          <p className="text-zinc-500 text-center mb-8">
            Create an account to track your F1 learning journey
          </p>

          {error && (
            <div 
              className="flex items-center gap-2 p-4 mb-6 bg-red-500/10 border border-red-500/50 text-red-500"
              data-testid="register-error"
            >
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-testid="register-name"
                  className="f1-input w-full pl-10"
                  placeholder="Your name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="register-email"
                  className="f1-input w-full pl-10"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-zinc-500 mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="register-password"
                  className="f1-input w-full pl-10"
                  placeholder="Min. 6 characters"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="register-submit"
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  CREATE ACCOUNT
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-zinc-500 mt-6">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-[#E10600] hover:underline"
              data-testid="register-login-link"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
