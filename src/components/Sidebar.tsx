import React from 'react';
import { User } from '../types';
import {
  BookOpen,
  Search,
  Flame,
  LogOut,
  LogIn,
  Sparkles,
  Flower2,
  Award,
  Mic,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  currentTab: 'dashboard' | 'course' | 'vocabulary' | 'flashcards' | 'mock' | 'dialogue' | 'cabinet' | 'certificates' | 'verify';
  onSelectTab: (tab: 'dashboard' | 'course' | 'vocabulary' | 'flashcards' | 'mock' | 'dialogue' | 'cabinet' | 'certificates' | 'verify') => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  sakuraActive: boolean;
  onToggleSakura: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: 'dashboard' | 'course' | 'vocabulary' | 'flashcards' | 'mock' | 'dialogue' | 'cabinet' | 'certificates' | 'verify';
  labelUz: string;
  labelEn: string;
  icon: React.ElementType;
  count?: string;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onOpenAuth,
  onLogout,
  sakuraActive,
  onToggleSakura,
  mobileOpen,
  onCloseMobile,
}) => {
  const navItems: NavItem[] = [
    { id: 'course', labelUz: 'Darslar (HSK 1 & 2)', labelEn: 'Lessons', icon: BookOpen, badge: '80 Dars' },
    { id: 'certificates', labelUz: 'Sertifikatlar (HSK 1, 2, 3)', labelEn: 'Certificates', icon: Award, badge: 'QR & Muhr' },
    { id: 'mock', labelUz: 'HSK 1 Full Mock Exam', labelEn: 'Mock Exam', icon: ShieldCheck, badge: 'Imtihon' },
    { id: 'dialogue', labelUz: 'AI Dialogue (Speaking)', labelEn: 'AI Speaking', icon: Mic, badge: 'AI' },
    { id: 'cabinet', labelUz: 'Shaxsiy Kabinet', labelEn: 'Cabinet', icon: UserIcon },
    { id: 'vocabulary', labelUz: '5000+ Lug\'at & Qidiruv', labelEn: 'Dictionary', icon: Search, badge: '5000+' },
    { id: 'flashcards', labelUz: 'Flashcard & Mashq', labelEn: 'Flashcards', icon: Sparkles },
    { id: 'dashboard', labelUz: 'Boshqaruv Paneli', labelEn: 'Dashboard', icon: Flame },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        id="main-sidebar"
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-5 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo - Renamed strictly to Xitoycha as requested */}
          <div className="flex items-center gap-3 px-2 py-2 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 text-white flex items-center justify-center font-serif text-xl font-black shadow-md">
              学
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-slate-900 leading-tight">
                Xitoy<span className="text-rose-600">cha</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                HSK Mandarin Akademiyasi
              </div>
            </div>
          </div>

          {/* User Profile Card */}
          {currentUser ? (
            <div
              id="sidebar-user-card"
              onClick={() => {
                onSelectTab('cabinet');
                onCloseMobile();
              }}
              className="p-3 mb-5 rounded-2xl bg-gradient-to-br from-slate-50 to-rose-50/50 border border-slate-200/80 cursor-pointer hover:border-rose-300 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-rose-100 flex items-center justify-center text-xl">
                  {currentUser.avatar || '🎓'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-slate-900 truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{currentUser.xp || 0} XP</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>Kabinetni ochish</span>
                <span className="font-bold text-rose-600">→</span>
              </div>
            </div>
          ) : (
            <div className="p-3 mb-5 rounded-2xl bg-rose-50/60 border border-rose-100 text-center">
              <p className="text-xs text-slate-600 mb-2">Tizimga kiring yoki ro'yxatdan o'ting</p>
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Kirish (Sign In)</span>
              </button>
            </div>
          )}

          {/* Navigation Items */}
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 mb-2">
            O'quv Bo'limlari
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-rose-50 text-rose-600 shadow-xs border border-rose-100'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600' : 'text-slate-400'}`} />
                    <span>{item.labelUz}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer controls: Sakura toggle & Logout */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          {/* Sakura Ambient Toggle */}
          <button
            type="button"
            id="sakura-toggle-btn"
            onClick={onToggleSakura}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              sakuraActive
                ? 'bg-pink-50 text-pink-700 border border-pink-200'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Flower2 className={`w-4 h-4 ${sakuraActive ? 'text-pink-500 animate-pulse' : 'text-slate-400'}`} />
              <span>🌸 Sakura effekti</span>
            </div>
            <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
              sakuraActive ? 'bg-pink-200/70 text-pink-800' : 'bg-slate-200 text-slate-600'
            }`}>
              {sakuraActive ? 'Yoqiq' : 'O\'chiq'}
            </span>
          </button>

          {/* Auth Action button */}
          {currentUser ? (
            <button
              type="button"
              id="sidebar-logout-btn"
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Chiqish (Log Out)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Kirish / Ro'yxatdan o'tish</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
