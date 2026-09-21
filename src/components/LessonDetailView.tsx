import React, { useState, useEffect, useRef } from 'react';
import { LessonData, User } from '../types';
import { playChineseAudio, stopAudio } from '../utils/audio';
import { updateUserProgress, updateHsk2LessonProgress, updateHsk3LessonProgress } from '../utils/storage';
import {
  Volume2,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  Mic,
  Award,
  Sparkles,
  ChevronRight,
  Eye,
  EyeOff,
  Check,
  Lock,
  AlertCircle
} from 'lucide-react';

interface LessonDetailViewProps {
  lesson: LessonData;
  currentUser: User | null;
  onBack: () => void;
  onNextLesson: () => void;
  onUserUpdate: (user: User) => void;
}

export const LessonDetailView: React.FC<LessonDetailViewProps> = ({
  lesson,
  currentUser,
  onBack,
  onNextLesson,
  onUserUpdate,
}) => {
  // Audio playback state
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  // Video/Audio coach player state
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoTimerRef = useRef<any>(null);

  // Speaking check state
  const [speakingScores, setSpeakingScores] = useState<number[]>(new Array(lesson.speakingTargets.length).fill(-1));
  const [listeningTargetIndex, setListeningTargetIndex] = useState<number | null>(null);
  const [recordingIndex, setRecordingIndex] = useState<number | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Test quiz answers state
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: number }>({});
  const [revealedSamples, setRevealedSamples] = useState<{ [wId: number]: boolean }>({});
  const [writingInputs, setWritingInputs] = useState<{ [wId: number]: string }>({});

  // Checklist
  const [reviewedVocab, setReviewedVocab] = useState(false);
  const [watchedVideo, setWatchedVideo] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load existing writing inputs from localStorage
  useEffect(() => {
    const saved: { [key: number]: string } = {};
    lesson.writingPrompts.forEach((wp) => {
      const val = localStorage.getItem(`hsk_w_${lesson.id}_${wp.id}`);
      if (val) saved[wp.id] = val;
    });
    setWritingInputs(saved);

    // Check if already completed by user
    const completedList =
      lesson.level === 'HSK 3'
        ? currentUser?.completedHsk3LessonIds
        : lesson.level === 'HSK 2'
        ? currentUser?.completedHsk2LessonIds
        : currentUser?.completedLessonIds;

    if (completedList?.includes(lesson.id)) {
      setIsCompleted(true);
    }
  }, [lesson.id, currentUser, lesson.level]);

  const handlePlayVocab = async (text: string) => {
    stopAudio();
    setPlayingWord(text);
    await playChineseAudio(text, 0.85);
    setPlayingWord(null);
    setReviewedVocab(true);
  };

  // Video Coach Player Simulation
  useEffect(() => {
    if (!isPlayingVideo) {
      if (videoTimerRef.current) clearInterval(videoTimerRef.current);
      return;
    }

    const currentScript = lesson.videoScript[videoIndex] || '';
    playChineseAudio(currentScript, 0.9);

    const stepInterval = 1000;
    const totalSteps = 15; // 15s per slide
    let step = 0;

    videoTimerRef.current = setInterval(() => {
      step++;
      const currentPct = ((videoIndex * totalSteps + step) / (lesson.videoScript.length * totalSteps)) * 100;
      setVideoProgress(Math.min(currentPct, 100));

      if (step >= totalSteps) {
        if (videoIndex < lesson.videoScript.length - 1) {
          setVideoIndex((prev) => prev + 1);
          step = 0;
        } else {
          setIsPlayingVideo(false);
          setWatchedVideo(true);
          clearInterval(videoTimerRef.current);
        }
      }
    }, stepInterval);

    return () => {
      if (videoTimerRef.current) clearInterval(videoTimerRef.current);
      stopAudio();
    };
  }, [isPlayingVideo, videoIndex, lesson.videoScript]);

  const toggleVideo = () => {
    if (isPlayingVideo) {
      setIsPlayingVideo(false);
      stopAudio();
    } else {
      setIsPlayingVideo(true);
      setWatchedVideo(true);
    }
  };

  const restartVideo = () => {
    setIsPlayingVideo(false);
    stopAudio();
    setVideoIndex(0);
    setVideoProgress(0);
    setTimeout(() => {
      setIsPlayingVideo(true);
    }, 200);
  };

  // Speaking check with Web Speech API
  const handleListenPhrase = async (idx: number, phrase: string) => {
    setListeningTargetIndex(idx);
    await playChineseAudio(phrase, 0.8);
    setListeningTargetIndex(null);
  };

  const handleRecordPhrase = (idx: number, targetPhrase: string) => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setSpeechError('Brauzeringizda mikrofondan ovozni aniqlash mavjud emas. Chrome yoki Edge tavsiya etiladi.');
      // Give honorary 85 score so user isn't permanently blocked
      const next = [...speakingScores];
      next[idx] = 85;
      setSpeakingScores(next);
      return;
    }

    try {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'zh-CN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;

      setRecordingIndex(idx);
      setSpeechError(null);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.trim();
        // Calculate similarity score
        const targetClean = targetPhrase.replace(/[，。！？\s]/g, '');
        const heardClean = transcript.replace(/[，。！？\s]/g, '');

        let matchCount = 0;
        for (const char of targetClean) {
          if (heardClean.includes(char)) matchCount++;
        }
        const score = Math.min(100, Math.max(60, Math.round((matchCount / Math.max(1, targetClean.length)) * 100)));

        const next = [...speakingScores];
        next[idx] = score;
        setSpeakingScores(next);
        setRecordingIndex(null);
      };

      recognition.onerror = () => {
        setRecordingIndex(null);
        // Generous fallback so users still make progress
        const next = [...speakingScores];
        next[idx] = 75;
        setSpeakingScores(next);
      };

      recognition.onend = () => {
        setRecordingIndex(null);
      };

      recognition.start();
    } catch (e) {
      setRecordingIndex(null);
      const next = [...speakingScores];
      next[idx] = 80;
      setSpeakingScores(next);
    }
  };

  // Quiz answering
  const handleSelectOption = (qId: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const calculateQuizScore = () => {
    let correct = 0;
    lesson.quizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) correct++;
    });
    return correct;
  };

  const handleWritingChange = (promptId: number, value: string) => {
    setWritingInputs((prev) => ({ ...prev, [promptId]: value }));
    localStorage.setItem(`hsk_w_${lesson.id}_${promptId}`, value);
  };

  // Complete Lesson with strict validation
  const allQuizAnswered = lesson.quizQuestions.every((q) => selectedAnswers[q.id] !== undefined);
  const allWritingAnswered = lesson.writingPrompts.every((wp) => (writingInputs[wp.id] || '').trim().length > 0);
  const hasAttemptedSpeaking = lesson.speakingTargets.length === 0 || speakingScores.some((s) => s >= 0);
  const canCompleteLesson = allQuizAnswered && allWritingAnswered && hasAttemptedSpeaking;

  const handleFinishLesson = () => {
    if (!canCompleteLesson) {
      setToastMessage("Darsni yakunlash uchun barcha test savollari, yozma va talaffuz mashqlarini to'liq bajaring!");
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    const score = calculateQuizScore();
    const speakingDone = speakingScores.filter((s) => s >= 0).length;
    const earnedXp = (lesson.level === 'HSK 3' ? 35 : lesson.level === 'HSK 2' ? 25 : 15) + score * 2 + speakingDone * 2;

    const updatedUser =
      lesson.level === 'HSK 3'
        ? updateHsk3LessonProgress(lesson.id, earnedXp)
        : lesson.level === 'HSK 2'
        ? updateHsk2LessonProgress(lesson.id, earnedXp)
        : updateUserProgress(lesson.id, earnedXp);

    if (updatedUser) {
      onUserUpdate(updatedUser);
    }

    setIsCompleted(true);
    setToastMessage(`Tabriklaymiz! ${lesson.level || 'HSK 1'} ${lesson.id}-dars muvaffaqiyatli yakunlandi (+${earnedXp} XP)!`);

    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const scoreCount = calculateQuizScore();
  const maxLessons = lesson.level === 'HSK 1' ? 30 : 50;

  return (
    <div id="lesson-detail-container" className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top back nav & progress */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kurslar ro'yxatiga qaytish</span>
        </button>
        <span className="text-xs font-black px-2.5 py-1 rounded-md bg-rose-100 text-rose-700">
          {lesson.level || 'HSK 1'} • Dars {lesson.id} / {maxLessons}
        </span>
      </div>

      {/* Lesson Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="text-xs font-extrabold uppercase text-rose-600 tracking-wider mb-1">
            {lesson.level || 'HSK 1'} • DARS {lesson.id}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            {lesson.titleCn} — {lesson.titleUz}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {lesson.subtitle}. {lesson.description}
          </p>
        </div>
      </div>

      {/* SECTION 1: Core Vocabulary */}
      <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">1. Asosiy Lug'at (Core Vocabulary)</h3>
            <p className="text-xs text-slate-500">So'z ustiga bosing va to'g'ri ohangda eshiting</p>
          </div>
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
            {lesson.vocab.length} ta so'z
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {lesson.vocab.map((v, idx) => {
            const isPlaying = playingWord === v.cn;
            return (
              <div
                key={idx}
                onClick={() => handlePlayVocab(v.cn)}
                className="p-3.5 rounded-2xl border border-slate-200/90 hover:border-rose-400 bg-slate-50/50 hover:bg-rose-50/20 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                  <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'text-rose-600 animate-bounce' : 'text-slate-400 group-hover:text-rose-600'}`} />
                </div>
                <div className="my-2">
                  <div className="font-serif text-2xl font-black text-slate-900">{v.cn}</div>
                  <div className="text-xs font-bold text-rose-600">{v.py}</div>
                  <div className="text-[11px] font-medium text-slate-600 truncate mt-0.5">{v.uz}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: Grammar Explained */}
      <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">2. Grammatika Qoidasi (Grammar Focus)</h3>
            <p className="text-xs text-slate-500">Aniq formulalar va jumlalarning tuzilishi</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
          <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>{lesson.grammarTitle}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-rose-200/80 shadow-xs">
            <span className="text-[10px] uppercase font-extrabold text-rose-600 tracking-wider block mb-1">
              Asosiy Jumla Qolipi (Pattern):
            </span>
            <div className="font-serif text-2xl font-black text-slate-900">{lesson.grammarPattern}</div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {lesson.grammarExplanationUz}
          </p>

          <div className="mt-2 pt-2 border-t border-rose-200/60 flex items-center justify-between text-xs text-slate-600">
            <span>Misol: <strong className="font-serif text-slate-900">{lesson.grammarExample.cn}</strong></span>
            <button
              onClick={() => handlePlayVocab(lesson.grammarExample.cn)}
              className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Eshitish</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3: 3-Minute Animated AI Grammar Coach Video */}
      <section className="rounded-3xl bg-slate-950 text-white p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black tracking-widest text-rose-400 uppercase">
              🎬 AI GRAMMAR COACH • INTERAKTIV DARSLIK
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">3 Daqiqalik Ovozli Darslik</h3>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-800 text-slate-300">
            3:00 MIN
          </span>
        </div>

        {/* Player Screen */}
        <div className="min-h-[160px] p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 flex flex-col justify-center items-center text-center space-y-3">
          <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">
            Slayd {videoIndex + 1} / {lesson.videoScript.length}
          </div>
          <p className="text-base sm:text-lg text-slate-200 max-w-xl font-medium leading-relaxed">
            "{lesson.videoScript[videoIndex]}"
          </p>
        </div>

        {/* Progress Bar & Controls */}
        <div className="space-y-3">
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 transition-all duration-300"
              style={{ width: `${videoProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleVideo}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer"
              >
                {isPlayingVideo ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
                <span>{isPlayingVideo ? "To'xtatish" : "Ijro etish (Play)"}</span>
              </button>
              <button
                type="button"
                onClick={restartVideo}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Qaytadan boshlash"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs font-medium text-slate-400">
              {Math.round(videoProgress)}% tugatildi
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 4: Mini Dialogue */}
      <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">4. Mini Dialog & Suxbat (Dialogue)</h3>
            <p className="text-xs text-slate-500">Ovozni eshitib, suhbatdoshlarga ergashib takrorlang</p>
          </div>
          <button
            onClick={() => handlePlayVocab(lesson.dialogue.map((d) => d.cn).join(' '))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Butun dialogni eshitish</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {lesson.dialogue.map((line, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 hover:bg-rose-50/20 transition-colors"
            >
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                  line.speaker === 'A' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-white'
                }`}
              >
                {line.speaker}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-serif text-base font-bold text-slate-900">{line.cn}</div>
                <div className="text-xs font-semibold text-rose-600">{line.py}</div>
                <div className="text-xs text-slate-600 mt-0.5">{line.uz}</div>
              </div>
              <button
                onClick={() => handlePlayVocab(line.cn)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: Listen & Repeat AI Pronunciation check */}
      <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-rose-600 mb-0.5">
              <Mic className="w-3.5 h-3.5" />
              <span>AI TALAFFUZ TEKSHIRUVI</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">5. Eshit va Takrorla (Listen & Repeat)</h3>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
            +10 XP gacha
          </span>
        </div>

        {speechError && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            {speechError}
          </div>
        )}

        <div className="space-y-3">
          {lesson.speakingTargets.map((phrase, idx) => {
            const score = speakingScores[idx];
            const isRecording = recordingIndex === idx;
            const isListening = listeningTargetIndex === idx;

            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="text-[10px] font-bold text-slate-400 mb-0.5">IBORA {idx + 1} / 5</div>
                  <div className="font-serif text-lg font-black text-slate-900">{phrase}</div>
                  {score >= 0 && (
                    <div className="text-xs font-bold text-emerald-600 mt-1">
                      Moslik darajasi: {score}/100 {score >= 80 ? '🌟 A\'lo!' : '👍 Yaxshi'}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleListenPhrase(idx, phrase)}
                    disabled={isListening}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Eshitish</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRecordPhrase(idx, phrase)}
                    disabled={isRecording}
                    className={`px-3 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-900 hover:bg-slate-800'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{isRecording ? 'Eshityapman...' : 'Yozib tekshirish'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 6: 10 Quiz Tests + 5 Writing Prompts */}
      <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">6. Test Savollari & Yozma Mashq</h3>
            <p className="text-xs text-slate-500">10 ta test savoli + 5 ta erkin yozma vazifa</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            To'g'ri: {scoreCount}/10
          </span>
        </div>

        {/* 10 Multiple-choice questions */}
        <div className="space-y-4">
          {lesson.quizQuestions.map((q) => {
            const selectedOpt = selectedAnswers[q.id];
            const isAnswered = selectedOpt !== undefined;

            return (
              <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>SAVOL {q.id} / 10</span>
                  <span>HSK 1 TEST</span>
                </div>
                <div className="font-bold text-sm text-slate-900">{q.question}</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    const isCorrect = optIdx === q.correctIndex;

                    let btnClass = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';
                    if (isAnswered) {
                      if (isCorrect) btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold';
                      else if (isSelected && !isCorrect) btnClass = 'bg-red-50 border-red-300 text-red-700';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${btnClass}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className="text-xs font-semibold text-slate-600 pt-1">
                    {selectedOpt === q.correctIndex ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> To'g'ri! {q.explanation}
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Noto'g'ri. {q.explanation}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 5 Writing exercises */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            ✍️ Yozma Mashg'ulot (5 ta vazifa)
          </h4>

          <div className="space-y-4">
            {lesson.writingPrompts.map((wp) => {
              const isSampleRevealed = revealedSamples[wp.id] || false;
              const userText = writingInputs[wp.id] || '';

              return (
                <div key={wp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>YOZMA MASHQ {wp.id - 10} / 5</span>
                    <button
                      type="button"
                      onClick={() =>
                        setRevealedSamples((prev) => ({ ...prev, [wp.id]: !prev[wp.id] }))
                      }
                      className="text-rose-600 hover:underline flex items-center gap-1"
                    >
                      {isSampleRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{isSampleRevealed ? 'Namuna yashirish' : 'Namunani ko\'rish'}</span>
                    </button>
                  </div>

                  <p className="text-xs font-bold text-slate-800">{wp.prompt}</p>

                  <textarea
                    value={userText}
                    onChange={(e) => handleWritingChange(wp.id, e.target.value)}
                    placeholder="Xitoycha yoki pinyin shaklida javobingizni yozing..."
                    rows={2}
                    className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-medium outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 resize-y"
                  />

                  {isSampleRevealed && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-xs space-y-1">
                      <div className="font-serif font-bold text-slate-900">
                        Namuna javob: {wp.sampleAnswer}
                      </div>
                      {wp.pinyinSample && (
                        <div className="text-[11px] text-rose-600 font-semibold">{wp.pinyinSample}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 7: Bottom Complete Button & Controls with Strict Gating */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {lesson.level || 'HSK 1'} • {lesson.id}-DARS NATIJASI
            </div>
            <div className="text-base font-extrabold text-slate-900 mt-0.5">
              {isCompleted ? '✓ Ushbu dars to\'liq yakunlangan' : 'Darsni yakunlash talablari:'}
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleFinishLesson}
              disabled={!canCompleteLesson && !isCompleted}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : canCompleteLesson
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed shadow-none'
              }`}
            >
              {canCompleteLesson || isCompleted ? <Check className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span>{isCompleted ? 'Qayta saqlash' : canCompleteLesson ? 'Darsni yakunlash & XP olish' : 'Mashqlarni tugating (Qulflangan)'}</span>
            </button>

            <button
              type="button"
              onClick={onNextLesson}
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Keyingi dars</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Exercises completion checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold ${
            allQuizAnswered ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            {allQuizAnswered ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />}
            <span>Test savollari: {Object.keys(selectedAnswers).length} / {lesson.quizQuestions.length}</span>
          </div>

          <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold ${
            allWritingAnswered ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            {allWritingAnswered ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />}
            <span>Yozish mashqi: {Object.values(writingInputs).filter((v) => v.trim().length > 0).length} / {lesson.writingPrompts.length}</span>
          </div>

          <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold ${
            hasAttemptedSpeaking ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            {hasAttemptedSpeaking ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />}
            <span>Talaffuz: {speakingScores.filter((s) => s >= 0).length} ta bajarildi</span>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 border border-slate-700 animate-slide-up">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
