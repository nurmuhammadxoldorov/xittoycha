import React from 'react';
import { User, LessonData } from '../types';
import { LESSONS_DATA } from '../data/lessonsData';
import {
  Trophy,
  Flame,
  BookOpen,
  Sparkles,
  Search,
  Award,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Mic,
  User as UserIcon,
  ShieldCheck,
  Brain
} from 'lucide-react';

interface DashboardViewProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onNavigateTab: (tab: 'dashboard' | 'course' | 'vocabulary' | 'flashcards' | 'mock' | 'dialogue' | 'cabinet' | 'certificates' | 'verify') => void;
  onSelectLesson: (lesson: LessonData) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  onOpenAuth,
  onNavigateTab,
  onSelectLesson,
}) => {
  const hsk1Completed = (currentUser?.completedLessonIds || []).length;
  const hsk2Completed = (currentUser?.completedHsk2LessonIds || []).length;
  const totalCompleted = hsk1Completed + hsk2Completed;

  const nextLessonId = Math.min(30, hsk1Completed + 1);
  const nextLesson = LESSONS_DATA.find((l) => l.id === nextLessonId) || LESSONS_DATA[0];

  const skills = [
    { name: 'Lug\'at (Vocabulary)', pct: Math.min(100, Math.round(totalCompleted * 1.5 + 15)), icon: '🧠' },
    { name: 'O\'qish (Reading)', pct: Math.min(100, Math.round(totalCompleted * 1.4 + 12)), icon: '📖' },
    { name: 'Eshitish (Listening)', pct: Math.min(100, Math.round(totalCompleted * 1.3 + 10)), icon: '🎧' },
    { name: 'Gapirish (Speaking)', pct: Math.min(100, Math.round((currentUser?.dialoguePracticesCount || 0) * 15 + totalCompleted * 1.1 + 10)), icon: '🗣️' },
    { name: 'Yozish (Writing)', pct: Math.min(100, Math.round(totalCompleted * 1.2 + 8)), icon: '✍️' },
  ];

  return (
    <div id="dashboard-container" className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentUser?.avatar || '🎓'}</span>
              <span className="text-xs font-black uppercase tracking-widest text-rose-400">
                O'quvchi Kabineti • Xitoycha Akademiyasi
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Xush kelibsiz, {currentUser ? currentUser.name : 'Talaba'}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              HSK 1 (30 dars) va HSK 2 (50 dars) tayyorgarligi. AI ovozli murabbiy, dialog mashg'ulotlari
              va rasmiy Mock imtihonlari orqali Xitoy tilini tez va mustahkam o'zlashtiring!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectLesson(nextLesson)}
              className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>{hsk1Completed === 0 ? 'Darsni boshlash' : `${nextLessonId}-darsni davom ettirish`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('cabinet')}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <UserIcon className="w-4 h-4" />
              <span>Shaxsiy Kabinet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{currentUser?.xp || 0} XP</div>
            <div className="text-xs text-slate-500 font-medium">To'plangan XP</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{currentUser?.streakDays || 1} kun</div>
            <div className="text-xs text-slate-500 font-medium">Uzluksiz o'qish (Streak)</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{totalCompleted} ta</div>
            <div className="text-xs text-slate-500 font-medium">Tugallangan darslar</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{currentUser?.dialoguePracticesCount || 0}</div>
            <div className="text-xs text-slate-500 font-medium">AI Speaking seanslari</div>
          </div>
        </div>
      </div>

      {/* Featured AI Speaking & HSK Mock Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* AI Dialogue Card */}
        <div
          onClick={() => onNavigateTab('dialogue')}
          className="p-6 rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden shadow-lg border border-purple-800/60 cursor-pointer hover:border-purple-400 transition-all hover:scale-[1.01]"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/40 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              <span>YANGI IMKONIYAT</span>
            </span>
            <ArrowRight className="w-5 h-5 text-purple-300" />
          </div>

          <h3 className="text-xl font-black tracking-tight">
            AI Dialogue & Speaking Coach
          </h3>
          <p className="text-xs text-purple-200 mt-1.5 leading-relaxed">
            Virtual xitoylik o'qituvchi bilan xohlagan mavzuda ovozli muloqot qiling.
            Suhbat yakunida talaffuz, ravonlik va grammatika xatolari bo'yicha to'liq feedback oling!
          </p>

          <div className="mt-4 pt-3 border-t border-purple-800/60 flex items-center justify-between text-xs font-bold text-purple-300">
            <span>🗣️ Mikrofonda real vaqtda gapirish</span>
            <span>Mashqni boshlash →</span>
          </div>
        </div>

        {/* HSK 1 Full Mock Exam Card */}
        <div
          onClick={() => onNavigateTab('mock')}
          className="p-6 rounded-3xl bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 text-white relative overflow-hidden shadow-lg border border-amber-800/60 cursor-pointer hover:border-amber-400 transition-all hover:scale-[1.01]"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/40 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>RASMIY SINOV</span>
            </span>
            <ArrowRight className="w-5 h-5 text-amber-300" />
          </div>

          <h3 className="text-xl font-black tracking-tight">
            HSK 1 Full Mock Exam & Sertifikat
          </h3>
          <p className="text-xs text-amber-200 mt-1.5 leading-relaxed">
            Listening, Reading, Writing va Speaking bo'limlaridan iborat rasmiy darajadagi simulyatsiya.
            Taymer, to'liq ball tahlili va muvaffaqiyatli topshiruvchilarga chop etiladigan sertifikat!
          </p>

          <div className="mt-4 pt-3 border-t border-amber-800/60 flex items-center justify-between text-xs font-bold text-amber-300">
            <span>⏱️ 35 daqiqa • 300 ballik tizim</span>
            <span>Imtihonni topshirish →</span>
          </div>
        </div>
      </div>

      {/* Main split: Course roadmap preview & Skills breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Next Up & Quick Navigation */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Tavsiya etilgan keyingi dars
              </h3>
              <button
                onClick={() => onNavigateTab('course')}
                className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Barcha darslar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div
              onClick={() => onSelectLesson(nextLesson)}
              className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 hover:border-rose-400 flex items-center justify-between gap-4 cursor-pointer transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-lg">
                  {String(nextLesson.id).padStart(2, '0')}
                </div>
                <div>
                  <div className="font-serif text-lg font-black text-slate-900">
                    {nextLesson.titleCn} — {nextLesson.titleUz}
                  </div>
                  <div className="text-xs text-slate-500">{nextLesson.subtitle}</div>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shrink-0 cursor-pointer">
                Boshlash
              </button>
            </div>

            {/* Quick action navigation grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => onNavigateTab('vocabulary')}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left flex items-start gap-3 transition-colors cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-white shadow-xs text-rose-600">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">5000+ Lug'at</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Ieroglif qidiruvi va audiosi</div>
                </div>
              </button>

              <button
                onClick={() => onNavigateTab('flashcards')}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left flex items-start gap-3 transition-colors cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-white shadow-xs text-purple-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Flashcard Mashqi</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Xotirani kartochkalar bilan tekshiring</div>
                </div>
              </button>

              <button
                onClick={() => onNavigateTab('certificates')}
                className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100/70 border border-amber-200 text-left flex items-start gap-3 transition-colors cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-white shadow-xs text-amber-600">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Sertifikatlar & Muhr</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">HSK 1, 2, 3 va Mock diplomlari</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Skills Breakdown */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Ko'nikmalar Holati (Skills)</h3>

            <div className="space-y-3.5">
              {skills.map((skill, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <span>{skill.icon}</span>
                      <span>{skill.name}</span>
                    </span>
                    <span className="font-bold text-slate-900">{skill.pct}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${skill.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 text-center">
              Darslar va AI suhbatlarini yakunlagan sari ko'nikmalar darajasi oshib boradi
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
