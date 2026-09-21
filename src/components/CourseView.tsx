import React, { useState } from 'react';
import { User, LessonData } from '../types';
import { LESSONS_DATA } from '../data/lessonsData';
import { HSK2_LESSONS_DATA } from '../data/hsk2LessonsData';
import { HSK3_LESSONS_DATA } from '../data/hsk3LessonsData';
import { CheckCircle2, Lock, ArrowRight, Play, BookOpen, Trophy, Sparkles } from 'lucide-react';

interface CourseViewProps {
  currentUser: User | null;
  onSelectLesson: (lesson: LessonData) => void;
  onOpenAuth: () => void;
}

export const CourseView: React.FC<CourseViewProps> = ({
  currentUser,
  onSelectLesson,
  onOpenAuth,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<'HSK 1' | 'HSK 2' | 'HSK 3'>('HSK 1');

  const completedHsk1Ids = new Set(currentUser?.completedLessonIds || [1]);
  const completedHsk2Ids = new Set(currentUser?.completedHsk2LessonIds || [1]);
  const completedHsk3Ids = new Set(currentUser?.completedHsk3LessonIds || [1]);

  let activeLessons = LESSONS_DATA;
  let completedIds = completedHsk1Ids;

  if (selectedLevel === 'HSK 2') {
    activeLessons = HSK2_LESSONS_DATA;
    completedIds = completedHsk2Ids;
  } else if (selectedLevel === 'HSK 3') {
    activeLessons = HSK3_LESSONS_DATA;
    completedIds = completedHsk3Ids;
  }

  const isLessonUnlocked = (id: number) => {
    if (id === 1) return true;
    return completedIds.has(id - 1) || completedIds.has(id);
  };

  const isLessonCompleted = (id: number) => {
    return completedIds.has(id);
  };

  const totalLessons = activeLessons.length;
  const completedCount = Array.from(completedIds).filter((id) => id <= totalLessons).length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalLessons) * 100));

  return (
    <div id="course-view-container" className="space-y-6">
      {/* Level Selector Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setSelectedLevel('HSK 1')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              selectedLevel === 'HSK 1'
                ? 'bg-white text-rose-600 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>HSK 1 Kursi</span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-extrabold">
              30 Dars
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedLevel('HSK 2')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              selectedLevel === 'HSK 2'
                ? 'bg-white text-purple-600 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>HSK 2 Ilg'or</span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-extrabold">
              50 Dars • 5 min
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedLevel('HSK 3')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              selectedLevel === 'HSK 3'
                ? 'bg-white text-amber-600 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>HSK 3 Chuqur</span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-extrabold">
              50 Dars • 10 min
            </span>
          </button>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Daraja: <span className="font-extrabold text-slate-900">{selectedLevel}</span>
        </div>
      </div>

      {/* Course Hero Banner */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider">
              {selectedLevel === 'HSK 1'
                ? 'HSK 1 To\'liq Kurs • 30 Ta Dars'
                : selectedLevel === 'HSK 2'
                ? 'HSK 2 Ilg\'or Kurs • 50 Ta Dars (5 Min Darslik & 30 Talik Imtihoncha)'
                : 'HSK 3 Chuqur Kurs • 50 Ta Dars (10 Min Video & 30 Talik Imtihoncha)'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {selectedLevel === 'HSK 1'
                ? 'Noldan Boshlab Xitoy Tilini O\'rganing'
                : selectedLevel === 'HSK 2'
                ? 'HSK 2: Murakkab Grammatika va Kundalik Muloqot'
                : 'HSK 3: 把 va 被 kabi Chuqur Sintaksis & 10 Minutlik Videolar'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {selectedLevel === 'HSK 1'
                ? 'Har bir darsda 10 ta asosiy so\'z, audio tushuntirish, darslik, talaffuz tekshiruvi, test va yozma mashg\'ulotlar mavjud.'
                : selectedLevel === 'HSK 2'
                ? '50 ta maxsus darslik. Har biri 5 daqiqalik video slaydlar, qat\'iy grammatik formulalar va 30 talik imtihoncha bilan jihozlangan. Keyingi darsga o\'tish uchun avvalgisini to\'liq yakunlash shart!'
                : '50 ta chuqur darslik. Har biri kamida 10 daqiqalik to\'liq grammatik video tushuntirish, 把, 被, 越来越, 只要...就... formulalari va 30 talik imtihoncha bilan ta\'minlangan. Barcha testlarni to\'liq tugatmaguncha keyingi darsga o\'tib bo\'lmaydi!'}
            </p>

            <div className="pt-2 max-w-md">
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5">
                <span>{selectedLevel} Progressi</span>
                <span
                  className={
                    selectedLevel === 'HSK 1'
                      ? 'text-rose-400'
                      : selectedLevel === 'HSK 2'
                      ? 'text-purple-400'
                      : 'text-amber-400'
                  }
                >
                  {progressPercent}%
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    selectedLevel === 'HSK 1'
                      ? 'bg-gradient-to-r from-rose-500 to-red-500'
                      : selectedLevel === 'HSK 2'
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">JAMI MAZMUN</span>
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/40">
                <div className="text-2xl font-black text-white">{totalLessons}</div>
                <div className="text-[11px] text-slate-400">Darslar</div>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/40">
                <div
                  className={`text-2xl font-black ${
                    selectedLevel === 'HSK 1'
                      ? 'text-rose-400'
                      : selectedLevel === 'HSK 2'
                      ? 'text-purple-400'
                      : 'text-amber-400'
                  }`}
                >
                  {selectedLevel === 'HSK 1' ? '450' : '1500'}
                </div>
                <div className="text-[11px] text-slate-400">Savol & Mashq</div>
              </div>
            </div>
            <button
              onClick={() => {
                const nextUncompleted =
                  activeLessons.find((l) => !isLessonCompleted(l.id)) || activeLessons[0];
                onSelectLesson(nextUncompleted);
              }}
              className={`w-full py-2.5 px-4 rounded-xl text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedLevel === 'HSK 1'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : selectedLevel === 'HSK 2'
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Darsni davom ettirish</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold text-slate-900">
            {selectedLevel}: Barcha {totalLessons} ta darslar ro'yxati
          </h3>
          <span className="text-xs font-semibold text-slate-500">Qat'iy ketma-ketlik</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {activeLessons.map((lesson) => {
            const unlocked = isLessonUnlocked(lesson.id);
            const completed = isLessonCompleted(lesson.id);

            return (
              <div
                key={lesson.id}
                id={`lesson-card-${lesson.id}`}
                onClick={() => {
                  if (unlocked) {
                    onSelectLesson(lesson);
                  } else {
                    alert(
                      `🔒 Dars ${lesson.id} qulflangan. Avval ${lesson.id - 1}-darsning barcha mashqlarini to'liq yakunlang.`
                    );
                  }
                }}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  unlocked
                    ? 'bg-white hover:bg-rose-50/20 border-slate-200/90 hover:border-rose-300 shadow-xs hover:shadow-md cursor-pointer'
                    : 'bg-slate-100/70 border-slate-200 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                      completed
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : unlocked
                        ? selectedLevel === 'HSK 1'
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : selectedLevel === 'HSK 2'
                          ? 'bg-purple-50 text-purple-600 border border-purple-200'
                          : 'bg-amber-50 text-amber-600 border border-amber-200'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {completed ? <CheckCircle2 className="w-6 h-6" /> : String(lesson.id).padStart(2, '0')}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight truncate">
                        {lesson.titleCn} — {lesson.titleUz}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{lesson.subtitle}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {completed ? '100% Tugatilgan' : unlocked ? 'Ochiq' : 'Qulflangan'}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">
                        {selectedLevel === 'HSK 1'
                          ? '10 so\'z • 15 mashq'
                          : selectedLevel === 'HSK 2'
                          ? '5 min • 30 talik imtihon'
                          : '10 min • 30 talik imtihon'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {unlocked ? (
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
