import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getPlayerState } from '../utils/gamification';
import { 
  Gamepad2,
  Swords, 
  Code2, 
  Trophy, 
  Zap, 
  User, 
  LogOut, 
  LogIn, 
  Flame, 
  Gem, 
  Compass, 
  GraduationCap, 
  Terminal, 
  BookOpen, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [player, setPlayer] = useState(getPlayerState());
  const location = useLocation();

  useEffect(() => {
    const handleStorage = () => setPlayer(getPlayerState());
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(() => setPlayer(getPlayerState()), 3000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Quest Map', path: '/quests', icon: Gamepad2, highlight: true },
    { name: 'Problems', path: '/problems', icon: Code2 },
    { name: '1v1 Duel', path: '/duel', icon: Swords, badge: 'LIVE' },
    { name: 'Visualizer', path: '/compiler', icon: Terminal },
    { name: 'Classrooms', path: '/classrooms', icon: GraduationCap },
    { name: 'Roadmaps', path: '/paths', icon: Compass },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  ];

  const xpPercent = Math.min(100, Math.round((player.xp / player.nextLevelXp) * 100));

  return (
    <header className="sticky top-0 z-50 bg-[#0B1020]/90 backdrop-blur-md border-b border-[#1E294B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo -> AlgoArena */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] via-[#6366F1] to-[#34D399] p-0.5 shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform duration-200">
                <div className="h-full w-full bg-[#0B1020] rounded-[10px] flex items-center justify-center">
                  <Swords className="h-5 w-5 text-[#34D399] group-hover:text-purple-300 transition-colors" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl font-display font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-200 to-[#34D399] bg-clip-text text-transparent">
                    AlgoArena
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-[#A78BFA] border border-purple-500/30 font-mono font-bold">
                    RPG
                  </span>
                </div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#34D399] font-semibold -mt-0.5">
                  Play • Visualize • Win
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 ${
                      active
                        ? 'bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/40 shadow-sm shadow-[#7C3AED]/10'
                        : link.highlight
                        ? 'text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/10 border border-emerald-500/20'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-[#12182F]'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? 'text-[#A78BFA]' : link.highlight ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="ml-1 text-[9px] px-1 py-0.2 rounded bg-rose-500 text-white font-black animate-pulse">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              {isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive('/admin')
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                      : 'text-purple-400 hover:text-purple-300 hover:bg-[#12182F]'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Admin</span>
                </Link>
              )}
            </nav>
          </div>

          {/* Right Section: Player Status HUD & User Profile */}
          <div className="flex items-center space-x-3">
            
            {/* Player Level & XP HUD Pill */}
            <div className="hidden sm:flex items-center space-x-2 bg-[#12182F] border border-[#1E294B] px-3 py-1.5 rounded-full shadow-inner">
              {/* Level Badge */}
              <div className="flex items-center space-x-1 text-xs font-bold text-amber-400">
                <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-[10px]">
                  Lv.{player.level}
                </span>
                <span className="hidden xl:inline text-slate-300 text-[11px] font-medium">
                  {player.title}
                </span>
              </div>

              {/* Mini XP Bar */}
              <div className="w-16 bg-[#0B1020] h-2 rounded-full overflow-hidden border border-slate-700/60 hidden md:block">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-[#34D399] h-full rounded-full transition-all duration-300"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>

              {/* Streak */}
              <div className="flex items-center space-x-0.5 text-xs font-bold text-amber-400" title="Active Streak">
                <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500 animate-pulse" />
                <span className="text-[11px]">{player.streakDays}d</span>
              </div>

              {/* Gems */}
              <div className="flex items-center space-x-0.5 text-xs font-bold text-emerald-400" title="Gems">
                <Gem className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[11px]">{player.gems}</span>
              </div>
            </div>

            {/* Profile Dropdown / Sign in */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-[#12182F] transition-colors border border-transparent hover:border-[#1E294B]"
                >
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#34D399] flex items-center justify-center font-bold text-white text-xs shadow-md">
                    {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <span className="hidden md:inline text-xs font-semibold text-slate-200">
                    {user?.username || player.username}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[#7C3AED] to-[#6366F1] text-white hover:brightness-110 shadow-lg shadow-purple-600/30 transition-all"
                >
                  Join Quest
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#12182F]"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B1020] border-b border-[#1E294B] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-[#12182F] hover:text-white"
              >
                <Icon className="h-4 w-4 text-[#A78BFA]" />
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500 text-white font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
