import React, { useState } from 'react';
import { User } from '../types';
import {
  loginUser,
  registerUser,
  loginDemoUser,
  getRegisteredStudentsCount,
} from '../utils/storage';
import {
  Sparkles,
  UserPlus,
  LogIn,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Award,
  Mic,
  Search,
  Lock,
  ArrowRight,
  Users,
  TrendingUp,
  Activity,
  Zap,
} from 'lucide-react';

interface AuthGatewayViewProps {
  onAuthSuccess: (user: User) => void;
}

const AVATARS = ['🎓', '🐼', '🐉', '🏮', '🎋', '🥋', '🌸', '✨'];

export const AuthGatewayView: React.FC<AuthGatewayViewProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup'); // Default to sign up as requested
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🎓');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Statistics state: Base 2758+ with automatic +1 increment per registered student
  const [studentsCount, setStudentsCount] = useState<number>(() => getRegisteredStudentsCount());
  const [newlyAddedCount, setNewlyAddedCount] = useState<number>(0);
  const [justIncremented, setJustIncremented] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMsg('Iltimos, to\'liq ismingizni kiriting.');
        return;
      }
      if (!username.trim()) {
        setErrorMsg('Iltimos, login (username) tanlang.');
        return;
      }
      if (password && password.length < 3) {
        setErrorMsg('Parol kamida 3 ta belgidan iborat bo\'lishi kerak.');
        return;
      }

      setIsLoading(true);
      const res = registerUser({
        name,
        username,
        email: email.trim() || `${username.trim().toLowerCase()}@hsk.uz`,
        password: password || '123456',
        avatar: selectedAvatar,
      });

      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.message);
      } else if (res.user) {
        // Automatically reflect +1, +2, +3... in the UI statistics state
        const updatedCount = getRegisteredStudentsCount();
        setStudentsCount(updatedCount);
        setNewlyAddedCount((prev) => prev + 1);
        setJustIncremented(true);

        setSuccessMsg(
          `Tabriklaymiz, ${res.user.name}! Hisobingiz yaratildi va statistikaga yangi talaba (+1) qo'shildi! Asosiy darslarga yo'naltirilmoqda...`
        );
        setTimeout(() => {
          onAuthSuccess(res.user!);
        }, 700);
      }
    } else {
      if (!username.trim()) {
        setErrorMsg('Iltimos, username yoki emailingizni kiriting.');
        return;
      }

      setIsLoading(true);
      const res = loginUser(username, password);
      setIsLoading(false);

      if (!res.success) {
        setErrorMsg(res.message);
      } else if (res.user) {
        setSuccessMsg(`Xush kelibsiz, ${res.user.name}! Darslarga yo'naltirilmoqda...`);
        setTimeout(() => {
          onAuthSuccess(res.user!);
        }, 500);
      }
    }
  };

  const handleDemoAccess = () => {
    setErrorMsg('');
    setSuccessMsg('Demo hisobiga muvaffaqiyatli ulandi...');
    const demo = loginDemoUser();
    setTimeout(() => {
      onAuthSuccess(demo);
    }, 400);
  };

  return (
    <div
      id="auth-gateway-screen"
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-10 relative z-20"
    >
      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-md rounded-3xl sm:rounded-[36px] border border-slate-200/90 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
        {/* Left Side: Brand Visual & Platform Highlights */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 p-6 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle glow circles */}
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-500 text-white flex items-center justify-center font-serif text-2xl font-black shadow-lg shadow-rose-900/40">
                中
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-none">
                  Xitoycha
                </h1>
                <span className="text-xs font-semibold text-rose-400 tracking-wider uppercase">
                  HSK Mandarin Akademiyasi
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                Rasmiy ta'lim platformasi
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Xitoy tilini noldan HSK darajasigacha o'rganing
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Asosiy sahifaga kirish va darslarni boshlash uchun ro'yxatdan o'ting yoki hisobingizga kiring. Barcha yutuqlaringiz xavfsiz saqlanadi.
              </p>
            </div>

            {/* Real-time Statistics Section */}
            <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md space-y-3 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-24 h-24 bg-rose-500/20 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-rose-200 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    Jonli Talabalar Statistikasi
                  </span>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-500/40">
                  Avtomatik +1 hisob
                </span>
              </div>

              <div className="flex items-baseline gap-2 flex-wrap">
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2">
                  <Users className="w-7 h-7 text-rose-400 shrink-0" />
                  <span className="font-mono">{studentsCount.toLocaleString()}+</span>
                </div>
                <span className="text-xs font-semibold text-slate-300">
                  faol o'quvchi talabalar
                </span>
                {justIncremented && (
                  <span className="animate-bounce inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-xs font-black shadow-lg">
                    <Zap className="w-3 h-3 fill-slate-950" />
                    +{newlyAddedCount} Yangi talaba qo'shildi!
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-300 leading-snug">
                Baza: <strong className="text-white font-bold">2,758+</strong> talaba. Har bir ro'yxatdan o'tgan yangi o'quvchi statistikaga to'g'ridan-to'g'ri avtomatik tarzda (+1, +2, +3, +4...) qo'shilib boradi.
              </p>
            </div>

            {/* Feature Badges */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">130 ta to'liq darslik</div>
                  <div className="text-[11px] text-slate-400">HSK 1 (30), HSK 2 (50) & HSK 3 (50 dars)</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">AI Dialogue Speaking</div>
                  <div className="text-[11px] text-slate-400">Sun'iy intellekt bilan erkin og'zaki muloqot</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">5000+ Ierogliflar Lug'ati</div>
                  <div className="text-[11px] text-slate-400">O'zbekcha universal qidiruv & audio talaffuz</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">Mock Exam & Sertifikat</div>
                  <div className="text-[11px] text-slate-400">Rasmiy formatdagi 100 ballik imtihon tizimi</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
            <span>Muallif: Nurmuhammad Xoldorov</span>
            <span className="flex items-center gap-1 text-rose-400 font-semibold">
              <ShieldCheck className="w-4 h-4" /> Himoyalangan
            </span>
          </div>
        </div>

        {/* Right Side: Mandatory Registration & Login Gateway Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full space-y-6">
            {/* Live Platform Statistics Bar */}
            <div
              id="auth-statistics-banner"
              className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-rose-50/90 via-slate-50 to-amber-50/50 border border-rose-100 shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-600 animate-pulse" />
                  <span className="text-xs font-bold text-slate-800 tracking-tight">
                    Platforma Statistikasi & Ko'rsatkichlar
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100/80 text-rose-700 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
                  Jonli hisob (+1)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-xl bg-white border border-rose-200/80 shadow-2xs text-center transition-all">
                  <div className="text-base sm:text-lg font-black text-rose-600 flex items-center justify-center gap-1 font-mono">
                    <Users className="w-4 h-4 text-rose-500" />
                    <span>{studentsCount.toLocaleString()}+</span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mt-0.5">
                    Talabalar
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs text-center">
                  <div className="text-base sm:text-lg font-black text-slate-800 font-mono">
                    130 ta
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mt-0.5">
                    HSK darslar
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs text-center">
                  <div className="text-base sm:text-lg font-black text-slate-800 font-mono">
                    5000+
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mt-0.5">
                    Lug'at
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-emerald-200/70 shadow-2xs text-center">
                  <div className="text-base sm:text-lg font-black text-emerald-600 font-mono">
                    98.8%
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mt-0.5">
                    Natija
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-0.5 px-0.5">
                <span className="flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Baza: <strong>2,758+</strong> talaba</span>
                </span>
                <span className="font-semibold text-rose-600 text-[10px] sm:text-[11px]">
                  Har bir ro'yxatdan o'tishda avtomatik +1
                </span>
              </div>
            </div>

            {/* Top Switcher Tabs */}
            <div className="flex items-center p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                id="tab-signup-btn"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Ro'yxatdan o'tish</span>
              </button>

              <button
                type="button"
                id="tab-signin-btn"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Tizimga kirish</span>
              </button>
            </div>

            {/* Form Title */}
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {mode === 'signup' ? "Yangi o'quvchi sifatida ro'yxatdan o'ting" : "Mavjud hisobingizga kiring"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {mode === 'signup'
                  ? "Asosiy sahifa va darslarga kirish uchun profilingizni shakllantiring."
                  : "Oldin ro'yxatdan o'tgan bo'lsangiz, login va parolingizni kiriting."}
              </p>
            </div>

            {/* Alerts */}
            {errorMsg && (
              <div
                id="gateway-error"
                className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-shake"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div
                id="gateway-success"
                className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form Inputs */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      To'liq ismingiz <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="signup-name-input"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masalan: Sardor Aliyev"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Avatar tanlang
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {AVATARS.map((av) => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => setSelectedAvatar(av)}
                          className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center border transition-all cursor-pointer ${
                            selectedAvatar === av
                              ? 'bg-rose-50 border-rose-500 scale-110 shadow-xs'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Foydalanuvchi nomi (Login) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="auth-username-input"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masalan: student2026 yoki nurmuhammad"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
                />
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Elektron pochta (Ixtiyoriy)
                  </label>
                  <input
                    type="email"
                    id="signup-email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@misol.uz"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Parol {mode === 'signup' ? <span className="text-rose-500">*</span> : ''}
                </label>
                <input
                  type="password"
                  id="auth-password-input"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="auth-submit-btn"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-sm shadow-lg shadow-rose-600/25 hover:shadow-rose-600/40 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : mode === 'signup' ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Ro'yxatdan o'tish va darslarga kirish</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Tizimga kirish</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Divider & Button */}
            <div className="pt-2">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  yoki
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <button
                type="button"
                id="quick-demo-access-btn"
                onClick={handleDemoAccess}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-rose-300 bg-slate-50 hover:bg-rose-50/50 text-slate-700 hover:text-rose-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>Bir bosishda sinab ko'rish (Demo kirish: Nurmuhammad)</span>
              </button>
            </div>

            <div className="text-center text-[11px] text-slate-400 pt-1">
              Ro'yxatdan o'tish orqali siz platforma qoidalari va o'quv dasturiga rozilik bildirasiz.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
