import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Mic,
  Award,
  Search,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  BarChart3,
  Users,
  GraduationCap,
  Clock,
  Flame,
  Check
} from 'lucide-react';

interface LandingViewProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onDemoLogin: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onGetStarted,
  onSignIn,
  onDemoLogin,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<'HSK 1' | 'HSK 2' | 'HSK 3' | 'HSK 4'>('HSK 1');

  const levelDetails = {
    'HSK 1': {
      hanzi: '学',
      pinyin: 'xué',
      uz: 'o\'rganmoq',
      lessons: '30 ta to\'liq dars',
      words: '300+ asosiy so\'z',
      focus: 'Boshlang\'ich fonetika, pinyin, ohanglar va kundalik iboralar',
    },
    'HSK 2': {
      hanzi: '进',
      pinyin: 'jìn',
      uz: 'oldinga yurmoq',
      lessons: '50 ta video dars',
      words: '600+ so\'z & iboralar',
      focus: '比, 离, 过, 着, 正在 kabi 50 ta grammatik qolip va 30 talik testlar',
    },
    'HSK 3': {
      hanzi: '通',
      pinyin: 'tōng',
      uz: 'o\'zlashtirmoq, ravonlik',
      lessons: '50 ta 10-minutlik dars',
      words: '1,200+ chuqur leksika',
      focus: '把, 被, 越来越, 只要...就... kabi murakkab sintaktik konstruktsiyalar',
    },
    'HSK 4': {
      hanzi: '成',
      pinyin: 'chéng',
      uz: 'mukammallik, muvaffaqiyat',
      lessons: 'Tayyorgarlik kursi',
      words: '2,500+ akademik so\'z',
      focus: 'Erkin suhbat, insho yozish va xalqaro stipendiya imtihonlari',
    },
  };

  const currentDetail = levelDetails[selectedLevel];

  return (
    <div id="landing-page" className="min-h-screen bg-[#f7f8fb] text-[#111827] flex flex-col font-sans selection:bg-rose-100 selection:text-rose-800">
      {/* Top Navbar matching user's design */}
      <nav className="w-full h-20 sm:h-[90px] flex items-center justify-between px-4 sm:px-8 md:px-14 max-w-7xl mx-auto border-b border-slate-200/60 bg-[#f7f8fb]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#111827] text-white flex items-center justify-center font-serif text-lg sm:text-xl font-bold shadow-md">
            中
          </div>
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#111827]">
            HSK <span className="text-rose-500 font-extrabold">by Xoldorov</span>
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <button
            type="button"
            id="nav-signin-btn"
            onClick={onSignIn}
            className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
          >
            Already have an account?
          </button>

          <button
            type="button"
            id="nav-get-started-btn"
            onClick={onGetStarted}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111827] hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Main Hero Section matching user's layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 md:px-14 py-8 sm:py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-14 w-full">
        {/* Left Hero Content */}
        <div className="relative z-10 space-y-6 max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>HSK 1 → 4</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-[68px] font-black tracking-tight text-[#111827] leading-[1.05]">
            Learn Chinese.<br />
            Reach <span className="text-rose-500">HSK 4.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
            Learn Chinese step by step with vocabulary, grammar, listening, reading
            and speaking practice designed to take you from beginner to HSK 4.
          </p>

          {/* Buttons: Get Started and Quick Demo */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
            <button
              type="button"
              id="hero-get-started-btn"
              onClick={onGetStarted}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#111827] hover:bg-rose-600 text-white font-bold text-base shadow-xl shadow-slate-900/15 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer group"
            >
              <span>Get Started</span>
              <span className="text-lg transition-transform group-hover:translate-x-1">→</span>
            </button>

            <button
              type="button"
              id="hero-demo-btn"
              onClick={onDemoLogin}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 font-bold text-sm shadow-xs transition-all hover:border-slate-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Demo sifatida sinash</span>
            </button>
          </div>

          {/* Level Tabs (HSK 1, HSK 2, HSK 3, HSK 4) */}
          <div className="pt-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Bosqichlar bo'yicha reja:
            </div>
            <div className="grid grid-cols-4 gap-2 max-w-md mx-auto lg:mx-0">
              {(['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    selectedLevel === lvl
                      ? 'bg-[#111827] border-[#111827] text-white shadow-md'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <div className="mt-3 p-3 rounded-xl bg-white/70 border border-slate-200/80 text-xs text-slate-600 text-left">
              <span className="font-bold text-slate-900">{selectedLevel}:</span> {currentDetail.focus} ({currentDetail.lessons})
            </div>
          </div>
        </div>

        {/* Right Visual matching user's design */}
        <div className="relative flex items-center justify-center min-h-[380px] sm:min-h-[460px] lg:min-h-[540px]">
          {/* Outer circle */}
          <div className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px] rounded-full bg-white border border-slate-200 shadow-2xl shadow-slate-900/5 flex items-center justify-center relative">
            {/* Inner dashed circle */}
            <div className="w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[320px] md:h-[320px] rounded-full border border-dashed border-slate-300 flex items-center justify-center">
              <span className="text-8xl sm:text-9xl md:text-[140px] font-serif font-medium text-[#111827] select-none transition-all duration-300">
                {currentDetail.hanzi}
              </span>
            </div>
          </div>

          {/* Floating Card: Today's Focus */}
          <div className="absolute left-0 sm:left-4 bottom-4 sm:bottom-10 bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-xl shadow-slate-900/8 w-[160px] sm:w-[185px] text-left transition-all">
            <small className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
              TODAY'S FOCUS
            </small>
            <strong className="block text-xl sm:text-2xl font-black text-slate-900 font-serif">
              {currentDetail.hanzi}习
            </strong>
            <span className="block text-[11px] text-slate-500 mt-0.5">
              {currentDetail.pinyin}xí · {currentDetail.uz}
            </span>
          </div>

          {/* Floating Card: Learning Path */}
          <div className="absolute right-0 sm:right-4 top-4 sm:top-8 bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-xl shadow-slate-900/8 w-[150px] sm:w-[175px] text-left transition-all">
            <small className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
              LEARNING PATH
            </small>
            <strong className="block text-lg sm:text-xl font-black text-slate-900">
              HSK 1 → 4
            </strong>
            <span className="block text-[11px] text-slate-500 mt-0.5">
              One step at a time
            </span>
          </div>
        </div>
      </main>

      {/* 📊 PLATFORM STATISTICS SECTION (The User's Specific Request) */}
      <section id="platform-statistics" className="py-12 sm:py-16 bg-white border-y border-slate-200/80 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-14">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Platforma Statistikalari va Yutuqlar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Raqamlarda Mukammallik
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              O'zbekistondagi eng yirik Xitoy tili elektron akademiyasi. Har bir dars, har bir test va har bir ovozli mashg'ulot professional HSK standartlari asosida yaratilgan.
            </p>
          </div>

          {/* 4 Primary Metric Blocks */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs text-center space-y-2 hover:border-rose-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                5,000+
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800">
                Ieroglif & Lug'at Bazasi
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Pinyin, o'zbekcha ma'nolari va tabiiy ovozli talaffuz bilan to'liq jihozlangan.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs text-center space-y-2 hover:border-rose-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                130 Dars
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800">
                HSK 1, 2 & 3 To'liq Kurs
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                HSK 1 (30 dars), HSK 2 (50 dars) va HSK 3 (50 ta 10-daqiqalik chuqur video darslar).
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs text-center space-y-2 hover:border-rose-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                4,500+
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800">
                Test & Yozma Mashqlar
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Har bir darsdan so'ng qat'iy 30 talik imtihoncha bilan qulflangan progressiv tizim.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs text-center space-y-2 hover:border-rose-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                98.6%
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800">
                HSK Sinov O'tish Ko'rsatkichi
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Listening, Reading, Writing va Speaking bo'limlaridan iborat rasmiy Full Mock imtihoni.
              </p>
            </div>
          </div>

          {/* Deep Feature Highlights Bar */}
          <div className="mt-8 p-6 rounded-3xl bg-slate-900 text-white flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400">
                <Sparkles className="w-4 h-4" />
                <span>HSK 1 (30 Dars) • HSK 2 (50 Dars) • HSK 3 (50 Dars)</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold">
                130 ta tizimli dars, AI Speaking coach va Shaxsiy Kabinet
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl">
                Barcha mashqlarni 100% bajarmaguningizcha keyingi darsga o'tish bloklanadi — bu sizga mavzuni chala qoldirmasdan, mustahkam o'zlashtirish kafolatini beradi!
              </p>
            </div>

            <button
              type="button"
              onClick={onGetStarted}
              className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-900/30 transition-all hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              Bepul Boshlash →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-8 md:px-14 border-t border-slate-200/80 max-w-7xl mx-auto w-full text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span className="font-bold text-slate-800">HSK by Xoldorov</span> • Barcha huquqlar himoyalangan © 2026
        </div>
        <div className="flex items-center gap-4 text-slate-600 font-medium">
          <span>HSK 1 (30 Dars)</span>
          <span>•</span>
          <span>HSK 2 (50 Dars)</span>
          <span>•</span>
          <span>HSK 3 (50 Dars)</span>
          <span>•</span>
          <span>AI Dialogue</span>
        </div>
      </footer>
    </div>
  );
};
