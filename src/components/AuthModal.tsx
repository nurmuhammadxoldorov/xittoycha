import React, { useState } from 'react';
import { User } from '../types';
import { loginUser, registerUser } from '../utils/storage';
import { LogIn, UserPlus, Sparkles, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: 'signin' | 'signup';
}

const AVATARS = ['🎓', '🐼', '🐉', '🏮', '🎋', '🥋', '🌸', '✨'];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin',
}) => {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🎓');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleToggleMode = (mode: 'signin' | 'signup') => {
    setIsSignUp(mode === 'signup');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleDemoSignIn = () => {
    setErrorMsg('');
    const res = loginUser('nurmuhammad', '123');
    if (res.success && res.user) {
      setSuccessMsg(`Xush kelibsiz, ${res.user.name}!`);
      setTimeout(() => {
        onSuccess(res.user!);
        onClose();
      }, 500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isSignUp) {
      if (!name.trim()) {
        setErrorMsg('Iltimos, ismingizni kiriting.');
        return;
      }
      if (!username.trim()) {
        setErrorMsg('Iltimos, username (login) tanlang.');
        return;
      }
      const res = registerUser({
        name,
        username,
        email: email.trim() || `${username.trim().toLowerCase()}@hsk.uz`,
        password: password || '123456',
        avatar: selectedAvatar,
      });

      if (!res.success) {
        setErrorMsg(res.message);
      } else if (res.user) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onSuccess(res.user!);
          onClose();
        }, 600);
      }
    } else {
      if (!username.trim()) {
        setErrorMsg('Iltimos, username yoki emailingizni kiriting.');
        return;
      }
      const res = loginUser(username, password);
      if (!res.success) {
        setErrorMsg(res.message);
      } else if (res.user) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onSuccess(res.user!);
          onClose();
        }, 600);
      }
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
    >
      <div
        id="auth-modal-card"
        className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
      >
        {/* Subtle decorative blossom corner */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-100 rounded-full blur-2xl pointer-events-none opacity-60" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-pink-100 rounded-full blur-2xl pointer-events-none opacity-60" />

        <button
          id="auth-modal-close-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-2xl font-serif font-black shadow-sm mb-3">
            学
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isSignUp ? "Ro'yxatdan o'tish" : "Tizimga kirish (Sign In)"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isSignUp
              ? "HSK platformasida shaxsiy profilingizni yarating"
              : "Hisobingizga kiring va darslarni davom ettiring"}
          </p>
        </div>

        {/* Quick Demo One-Click Access Button */}
        <div className="mb-5">
          <button
            type="button"
            id="demo-login-btn"
            onClick={handleDemoSignIn}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Bir bosishda sinab ko'rish (Demo Sign In)</span>
          </button>
          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-xs uppercase font-medium">
              yoki username bilan
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>
        </div>

        {/* Feedback notifications */}
        {errorMsg && (
          <div
            id="auth-error-alert"
            className="flex items-start gap-2.5 p-3.5 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div
            id="auth-success-alert"
            className="flex items-start gap-2.5 p-3.5 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm"
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Ismingiz
              </label>
              <input
                id="auth-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masalan: Sardor yoki Lola"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-sm outline-none transition-all"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Foydalanuvchi nomi (Username / Email)
            </label>
            <input
              id="auth-username-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={isSignUp ? 'Yangi login tanlang (masalan: sardor2026)' : 'nurmuhammad yoki demo'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-sm outline-none transition-all"
              required
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Avatar tanlang
              </label>
              <div className="flex gap-2 justify-center py-1">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform ${
                      selectedAvatar === av
                        ? 'bg-rose-100 ring-2 ring-rose-500 scale-110'
                        : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Parol
            </label>
            <input
              id="auth-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignUp ? 'Kamida 4 ta belgi' : 'Parolingiz'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-sm outline-none transition-all"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-400"
              />
              <span>Meni eslab qolish (Auto Save)</span>
            </label>
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Xavfsiz
            </span>
          </div>

          <button
            type="submit"
            id="auth-submit-btn"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all mt-2 active:scale-[0.99]"
          >
            {isSignUp ? (
              <>
                <UserPlus className="w-4 h-4 text-rose-300" />
                <span>Ro'yxatdan o'tish (Register)</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-rose-300" />
                <span>Kirish (Sign In)</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Mode Switcher ("Already have an account? Sign In") */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs sm:text-sm text-slate-600">
          {isSignUp ? (
            <p>
              Akkauntingiz bormi?{' '}
              <button
                type="button"
                id="switch-to-signin-btn"
                onClick={() => handleToggleMode('signin')}
                className="font-bold text-rose-600 hover:text-rose-700 underline ml-1 cursor-pointer"
              >
                Kirish (Sign In)
              </button>
            </p>
          ) : (
            <p>
              Akkauntingiz yo'qmi?{' '}
              <button
                type="button"
                id="switch-to-signup-btn"
                onClick={() => handleToggleMode('signup')}
                className="font-bold text-rose-600 hover:text-rose-700 underline ml-1 cursor-pointer"
              >
                Ro'yxatdan o'tish (Create Account)
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
