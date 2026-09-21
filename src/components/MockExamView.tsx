import React, { useState, useEffect, useRef } from 'react';
import { User, MockExamResult, CertificateData } from '../types';
import {
  HSK1_MOCK_LISTENING,
  HSK1_MOCK_READING,
  HSK1_MOCK_WRITING,
  HSK1_MOCK_SPEAKING,
} from '../data/mockExamData';
import { playChineseAudio, stopAudio } from '../utils/audio';
import { saveMockExamResult } from '../utils/storage';
import { issueCertificate, autoCheckAndUnlockCertificates } from '../utils/certificateUtils';
import { OfficialCertificateCard } from './OfficialCertificateCard';
import {
  Award,
  Clock,
  Volume2,
  Mic,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Printer,
  ChevronRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface MockExamViewProps {
  currentUser: User | null;
  onUserUpdate: (user: User) => void;
  onOpenAuth: () => void;
  onBackToCourse?: () => void;
  onOpenVerification?: (certId?: string) => void;
}

export const MockExamView: React.FC<MockExamViewProps> = ({
  currentUser,
  onUserUpdate,
  onOpenAuth,
  onBackToCourse,
  onOpenVerification,
}) => {
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [currentSection, setCurrentSection] = useState<'listening' | 'reading' | 'writing' | 'speaking'>('listening');
  const [activeCertificate, setActiveCertificate] = useState<CertificateData | null>(null);

  // Timer: 35 minutes (2100 seconds)
  const [timeLeft, setTimeLeft] = useState(35 * 60);
  const timerRef = useRef<any>(null);

  // Answers state
  const [listeningAnswers, setListeningAnswers] = useState<{ [id: number]: number }>({});
  const [readingAnswers, setReadingAnswers] = useState<{ [id: number]: number }>({});
  const [writingAnswers, setWritingAnswers] = useState<{ [id: number]: string }>({});
  const [speakingScores, setSpeakingScores] = useState<{ [id: number]: number }>({});

  // Audio playing & Mic state
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  const [recordingId, setRecordingId] = useState<number | null>(null);

  // Result state
  const [examResult, setExamResult] = useState<MockExamResult | null>(null);

  useEffect(() => {
    if (examStarted && !examSubmitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopAudio();
    };
  }, [examStarted, examSubmitted]);

  const handleStartExam = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setExamStarted(true);
    setExamSubmitted(false);
    setTimeLeft(35 * 60);
    setListeningAnswers({});
    setReadingAnswers({});
    setWritingAnswers({});
    setSpeakingScores({});
    setCurrentSection('listening');
  };

  const handlePlayAudio = async (id: number, text: string) => {
    stopAudio();
    setPlayingAudioId(id);
    await playChineseAudio(text, 0.85);
    setPlayingAudioId(null);
  };

  const handleRecordSpeaking = (id: number, targetPhrase: string) => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      // Fallback simulation
      setSpeakingScores((prev) => ({ ...prev, [id]: 90 }));
      return;
    }

    try {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'zh-CN';
      recognition.interimResults = false;

      setRecordingId(id);

      recognition.onresult = (event: any) => {
        const heard = event.results[0][0].transcript.trim().replace(/[，。！？\s]/g, '');
        const targetClean = targetPhrase.replace(/[，。！？\s]/g, '');

        let match = 0;
        for (const char of targetClean) {
          if (heard.includes(char)) match++;
        }
        const score = Math.min(100, Math.max(70, Math.round((match / Math.max(1, targetClean.length)) * 100)));
        setSpeakingScores((prev) => ({ ...prev, [id]: score }));
        setRecordingId(null);
      };

      recognition.onerror = () => {
        setRecordingId(null);
        setSpeakingScores((prev) => ({ ...prev, [id]: 80 }));
      };

      recognition.onend = () => {
        setRecordingId(null);
      };

      recognition.start();
    } catch {
      setRecordingId(null);
      setSpeakingScores((prev) => ({ ...prev, [id]: 85 }));
    }
  };

  const handleSubmitExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    stopAudio();

    // 1. Listening: 10 questions x 10 = 100 pts
    let listeningCorrect = 0;
    HSK1_MOCK_LISTENING.forEach((q) => {
      if (listeningAnswers[q.id] === q.correctIndex) listeningCorrect += 10;
    });

    // 2. Reading: 10 questions x 10 = 100 pts
    let readingCorrect = 0;
    HSK1_MOCK_READING.forEach((q) => {
      if (readingAnswers[q.id] === q.correctIndex) readingCorrect += 10;
    });

    // 3. Writing: 5 questions x 10 = 50 pts
    let writingCorrect = 0;
    HSK1_MOCK_WRITING.forEach((q) => {
      const ans = (writingAnswers[q.id] || '').trim().replace(/[。！？\s]/g, '');
      const target = q.correctSentence.replace(/[。！？\s]/g, '');
      if (ans === target) {
        writingCorrect += 10;
      } else if (ans.length > 0) {
        writingCorrect += 6; // partial
      }
    });

    // 4. Speaking: 5 questions x 10 = 50 pts
    let speakingTotal = 0;
    HSK1_MOCK_SPEAKING.forEach((q) => {
      const sc = speakingScores[q.id];
      if (sc !== undefined) {
        speakingTotal += Math.round((sc / 100) * 10);
      }
    });

    const totalScore = listeningCorrect + readingCorrect + writingCorrect + speakingTotal;
    const passed = totalScore >= 180; // 60% of 300

    const result: MockExamResult = {
      id: 'mock-' + Date.now(),
      date: new Date().toLocaleDateString('uz-UZ'),
      listeningScore: listeningCorrect,
      readingScore: readingCorrect,
      writingScore: writingCorrect,
      speakingScore: speakingTotal,
      totalScore,
      passed,
    };

    setExamResult(result);
    setExamSubmitted(true);

    const updatedUser = saveMockExamResult(result);
    if (updatedUser) {
      if (passed) {
        // Issue mock cert
        const mockCert = issueCertificate(updatedUser, 'HSK 1 Mock', 'HSK 1', totalScore, 300);
        if (mockCert) {
          setActiveCertificate(mockCert);
        }
        // Also check if HSK 1 full course (30 lessons + final exam) is unlocked
        const { user: refreshedUser } = autoCheckAndUnlockCertificates(updatedUser);
        onUserUpdate(refreshedUser);
      } else {
        onUserUpdate(updatedUser);
      }
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Pre-exam introduction screen
  if (!examStarted && !examSubmitted) {
    return (
      <div id="mock-intro" className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-wider border border-rose-500/30">
            <Award className="w-4 h-4" />
            <span>Rasmiy Formatdagi Sinov</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            HSK 1 Full Mock Exam
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Haqiqiy HSK 1 imtihon standartlari asosida tuzilgan to'liq simulyatsiya.
            Listening, Reading, Writing va Speaking bo'limlaridan o'tib, rasmiy elektron sertifikatga ega bo'ling!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-2xl font-black text-rose-400">10 ta</div>
              <div className="text-xs text-slate-400 font-semibold mt-0.5">🎧 Listening (100 b)</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-2xl font-black text-amber-400">10 ta</div>
              <div className="text-xs text-slate-400 font-semibold mt-0.5">📖 Reading (100 b)</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-2xl font-black text-emerald-400">5 ta</div>
              <div className="text-xs text-slate-400 font-semibold mt-0.5">✍️ Writing (50 b)</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-2xl font-black text-purple-400">5 ta</div>
              <div className="text-xs text-slate-400 font-semibold mt-0.5">🗣️ Speaking (50 b)</div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleStartExam}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm shadow-xl shadow-rose-900/40 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Imtihonni Boshlash (35 daqiqa)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-slate-500">
            * O'tish bali: 300 balldan kamida 180 ball (60%). O'tganlarga rasmiy sertifikat taqdim etiladi.
          </div>
        </div>
      </div>
    );
  }

  // Exam Result Screen with Certificate
  if (examSubmitted && examResult) {
    const certToDisplay =
      activeCertificate ||
      currentUser?.certificates?.find((c) => c.type === 'HSK 1 Mock');

    return (
      <div id="mock-result" className="max-w-4xl mx-auto space-y-8 pb-12">
        {/* Exam Score Summary Bar */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                HSK 1 FULL MOCK EXAM NATIJALARI
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {examResult.passed ? 'Tabriklaymiz! Siz imtihondan o\'tdingiz!' : 'Imtihon yakunlandi'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleStartExam}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Qaytadan topshirish</span>
              </button>
            </div>
          </div>

          {/* Scores Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-500">🎧 Tinglash</div>
              <div className="text-xl font-black text-slate-900">{examResult.listeningScore}/100</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-500">📖 O'qish</div>
              <div className="text-xl font-black text-slate-900">{examResult.readingScore}/100</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-500">✍️ Yozish</div>
              <div className="text-xl font-black text-slate-900">{examResult.writingScore}/50</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs font-semibold text-slate-500">🗣️ Gapirish</div>
              <div className="text-xl font-black text-slate-900">{examResult.speakingScore}/50</div>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-block p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="text-xs font-bold text-amber-800 uppercase">Umumiy Natija:</div>
              <div className="text-3xl font-black text-slate-900 mt-0.5">
                {examResult.totalScore} / 300 Ball
              </div>
              <div className={`text-xs font-extrabold mt-1 ${examResult.passed ? 'text-emerald-700' : 'text-red-600'}`}>
                {examResult.passed ? '✓ Muvaffaqiyatli o\'tdingiz (PASSED - 60%+)' : '✕ O\'tish bali 180 ball. Qaytadan urinib ko\'ring.'}
              </div>
            </div>
          </div>
        </div>

        {/* If passed, render the official ideal Certificate with QR code and stamp */}
        {examResult.passed && certToDisplay && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                <span>Rasmiy HSK 1 Sertifikatingiz (QR-kod va Muhr bilan)</span>
              </h3>
            </div>

            <OfficialCertificateCard
              certificate={certToDisplay}
              onVerifyDirectly={(id) => onOpenVerification?.(id)}
            />
          </div>
        )}
      </div>
    );
  }

  // Active Exam View
  const answeredCount =
    Object.keys(listeningAnswers).length +
    Object.keys(readingAnswers).length +
    Object.keys(writingAnswers).length +
    Object.keys(speakingScores).length;

  return (
    <div id="mock-exam-active" className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top sticky exam bar */}
      <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-rose-600 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200">
            <Clock className="w-4 h-4" />
            <span>Qolgan vaqt: {formatTimer(timeLeft)}</span>
          </div>
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            Javob berildi: {answeredCount} / 30
          </span>
        </div>

        {/* Section switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setCurrentSection('listening')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentSection === 'listening' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            🎧 Tinglash (10)
          </button>
          <button
            onClick={() => setCurrentSection('reading')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentSection === 'reading' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            📖 O'qish (10)
          </button>
          <button
            onClick={() => setCurrentSection('writing')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentSection === 'writing' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            ✍️ Yozish (5)
          </button>
          <button
            onClick={() => setCurrentSection('speaking')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              currentSection === 'speaking' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            🗣️ Gapirish (5)
          </button>
        </div>

        <button
          type="button"
          onClick={handleSubmitExam}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm cursor-pointer"
        >
          Topshirish
        </button>
      </div>

      {/* SECTION: LISTENING */}
      {currentSection === 'listening' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">1-Qism: Tinglab Tushunish (听力 - 100 Ball)</h3>
            <p className="text-xs text-slate-500">Audio tugmasini bosing, ovozli jumlani eshitib, to'g'ri variantni tanlang.</p>
          </div>

          {HSK1_MOCK_LISTENING.map((q) => {
            const isPlaying = playingAudioId === q.id;
            const selected = listeningAnswers[q.id];

            return (
              <div key={q.id} className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-400">SAVOL {q.id} / 10</span>
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(q.id, q.audioText)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
                    <span>{isPlaying ? 'Ijro etilmoqda...' : 'Audioni eshitish'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 rounded-xl bg-slate-50">{q.imageEmoji}</span>
                  <div className="font-bold text-sm text-slate-900">{q.question}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {q.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => setListeningAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                        selected === optIdx
                          ? 'bg-rose-50 border-rose-500 text-rose-800'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SECTION: READING */}
      {currentSection === 'reading' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">2-Qism: O'qib Tushunish (阅读 - 100 Ball)</h3>
            <p className="text-xs text-slate-500">Ieroglif va pinyin matnlarini o'qib, to'g'ri javobni tanlang.</p>
          </div>

          {HSK1_MOCK_READING.map((q) => {
            const selected = readingAnswers[q.id];

            return (
              <div key={q.id} className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3">
                <div className="text-xs font-extrabold text-slate-400">SAVOL {q.id} / 20</div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                  <div className="font-serif text-lg font-black text-slate-900">{q.text}</div>
                  <div className="text-xs text-rose-600 font-semibold">{q.pinyin}</div>
                </div>
                <div className="text-xs font-bold text-slate-800">{q.question}</div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {q.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => setReadingAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                        selected === optIdx
                          ? 'bg-rose-50 border-rose-500 text-rose-800'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SECTION: WRITING */}
      {currentSection === 'writing' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">3-Qism: Yozish & Gap Tuzish (书写 - 50 Ball)</h3>
            <p className="text-xs text-slate-500">Berilgan so'zlardan to'g'ri grammatik tartibdagi xitoycha gap hosil qiling.</p>
          </div>

          {HSK1_MOCK_WRITING.map((q) => {
            const currentVal = writingAnswers[q.id] || '';

            return (
              <div key={q.id} className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3">
                <div className="text-xs font-extrabold text-slate-400">SAVOL {q.id} / 25</div>
                <div className="text-xs font-bold text-slate-800">{q.prompt}</div>

                {/* Scrambled word tags */}
                <div className="flex flex-wrap gap-2">
                  {q.scrambledWords.map((word, wIdx) => (
                    <button
                      key={wIdx}
                      type="button"
                      onClick={() => {
                        const next = currentVal ? `${currentVal}${word}` : word;
                        setWritingAnswers((prev) => ({ ...prev, [q.id]: next }));
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-800 font-serif font-bold text-xs border border-slate-200 cursor-pointer"
                    >
                      + {word}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setWritingAnswers((prev) => ({ ...prev, [q.id]: '' }))}
                    className="px-2 py-1 text-[11px] font-bold text-slate-400 hover:text-red-500"
                  >
                    Tozalash
                  </button>
                </div>

                <input
                  type="text"
                  value={currentVal}
                  onChange={(e) => setWritingAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  placeholder="Xitoycha gapni yozing yoki yuqoridagi so'zlarni bosing..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-serif font-bold text-slate-900 outline-none focus:border-rose-500"
                />

                <div className="text-[11px] text-slate-500">
                  Ma'nosi: <span className="font-semibold text-slate-700">{q.uzbekMeaning}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SECTION: SPEAKING */}
      {currentSection === 'speaking' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">4-Qism: Gapirish & Talaffuz (口语 - 50 Ball)</h3>
            <p className="text-xs text-slate-500">Iborani tinglang va mikrofonga baland ovozda o'qing.</p>
          </div>

          {HSK1_MOCK_SPEAKING.map((q) => {
            const isRec = recordingId === q.id;
            const score = speakingScores[q.id];

            return (
              <div key={q.id} className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3">
                <div className="text-xs font-extrabold text-slate-400">SAVOL {q.id} / 30</div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <div className="font-serif text-xl font-black text-slate-900">{q.targetPhrase}</div>
                  <div className="text-xs text-rose-600 font-semibold">{q.pinyin}</div>
                  <div className="text-xs text-slate-600">{q.uzbekMeaning}</div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(q.id, q.targetPhrase)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Namuna talaffuz</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {score !== undefined && (
                      <span className="text-xs font-bold text-emerald-600">
                        {score}/100 ball
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRecordSpeaking(q.id, q.targetPhrase)}
                      disabled={isRec}
                      className={`px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                        isRec ? 'bg-red-500 animate-pulse' : 'bg-slate-900 hover:bg-slate-800'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                      <span>{isRec ? 'Eshityapman...' : 'Talaffuzni yozish'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Submit Button */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase">IMTIHONNI YAKUNLASH</div>
          <div className="text-sm font-bold text-slate-900">Barcha savollarni tekshirib bo'ldingizmi?</div>
        </div>
        <button
          type="button"
          onClick={handleSubmitExam}
          className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          Natijalarni ko'rish & Sertifikat olish
        </button>
      </div>
    </div>
  );
};
