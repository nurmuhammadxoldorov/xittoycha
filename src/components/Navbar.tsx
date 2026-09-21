import React from 'react';
import { User } from '../types';
import { Menu, Sparkles, Flower2, UserCheck, LogIn, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  onOpenMobileMenu: () => void;
  onOpenAuth: () => void;
  onNavigateToCabinet?: () => void;
  sakuraActive: boolean;
  onToggleSakura: () => void;
  title: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenMobileMenu,
  onOpenAuth,
  onNavigateToCabinet,
  sakuraActive,
  onToggleSakura,
  title,
}) => {
  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-white/80 backdrop-blur-md border-b border-slate-200/80"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          id="mobile-menu-trigger"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{title}</span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-rose-500" />
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Sakura Quick Toggle */}
        <button
          type="button"
          id="topbar-sakura-btn"
          onClick={onToggleSakura}
          title={sakuraActive ? 'Sakura effektini to\'xtatish' : 'Sakura effektini yoqish'}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            sakuraActive
              ? 'bg-pink-100/80 text-pink-700 hover:bg-pink-200'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          <Flower2 className={`w-3.5 h-3.5 ${sakuraActive ? 'text-pink-500' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">Sakura</span>
        </button>

        {/* User stats / login */}
        {currentUser ? (
          <button
            type="button"
            id="topbar-user-badge"
            onClick={onNavigateToCabinet}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 cursor-pointer transition-colors"
          >
            <span className="text-base">{currentUser.avatar || '🎓'}</span>
            <span className="text-xs font-bold text-slate-800 hidden sm:inline truncate max-w-[120px]">
              {currentUser.name}
            </span>
            <span className="text-[11px] font-black px-1.5 py-0.5 rounded-md bg-rose-500 text-white flex items-center gap-0.5">
              <Sparkles className="w-3 h-3" />
              {currentUser.xp || 0}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Kirish</span>
          </button>
        )}
      </div>
    </header>
  );
};
