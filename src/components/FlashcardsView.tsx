import React, { useState, useMemo } from 'react';
import { User, VocabWord } from '../types';
import { getFullVocabDictionary } from '../data/vocabularyData';
import { playChineseAudio } from '../utils/audio';
import { Volume2, RotateCw, Check, X, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

interface FlashcardsViewProps {
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ currentUser }) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('HSK 1');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCount, setKnownCount] = useState(0);

  const allWords = useMemo(() => getFullVocabDictionary(), []);

  const deck = useMemo(() => {
    let list = allWords;
    if (selectedLevel === 'SAVED') {
      const saved = new Set(currentUser?.bookmarkedWords || []);
      list = list.filter((w) => saved.has(w.cn));
      if (list.length === 0) list = allWords.slice(0, 20);
    } else {
      list = list.filter((w) => w.level === selectedLevel);
    }
    return list.slice(0, 100);
  }, [allWords, selectedLevel, currentUser?.bookmarkedWords]);

  const currentCard = deck[currentIndex] || deck[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
  };

  const handleMarkKnown = () => {
    setKnownCount((prev) => prev + 1);
    handleNext();
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped && currentCard) {
      playChineseAudio(currentCard.cn);
    }
  };

  return (
    <div id="flashcards-container" className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Flashcard Trainer
          </h2>
          <p className="text-xs text-slate-500">Ierogliflarni eslab qolish uchun interaktiv kartochkalar</p>
        </div>

        {/* Level selector */}
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
          {['HSK 1', 'HSK 2', 'HSK 3', 'SAVED'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setSelectedLevel(lvl);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedLevel === lvl ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {lvl === 'SAVED' ? '❤️ Saqlanganlar' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Progress & counter */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
        <span>Karta: {currentIndex + 1} / {deck.length}</span>
        <span className="text-emerald-600 font-bold">O'zlashtirildi: {knownCount} ta</span>
      </div>

      {/* Interactive Card */}
      {currentCard && (
        <div
          onClick={handleFlip}
          className="w-full min-h-[320px] sm:min-h-[380px] bg-white rounded-3xl border-2 border-slate-200/80 hover:border-rose-300 shadow-lg hover:shadow-xl transition-all cursor-pointer p-8 flex flex-col justify-between items-center text-center relative select-none"
        >
          <div className="w-full flex justify-between items-center text-xs font-bold text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">{currentCard.level}</span>
            <span className="flex items-center gap-1 text-slate-400">
              <RotateCw className="w-3.5 h-3.5" />
              Aylantirish uchun bosing
            </span>
          </div>

          {!isFlipped ? (
            /* FRONT: Hanzi only */
            <div className="my-auto space-y-4">
              <div className="font-serif text-7xl sm:text-8xl font-black text-slate-900 tracking-wide">
                {currentCard.cn}
              </div>
              <p className="text-xs text-slate-400">Pinyin va tarjimani ko'rish uchun bosing</p>
            </div>
          ) : (
            /* BACK: Pinyin + Meaning + Audio */
            <div className="my-auto space-y-3 animate-fade-in">
              <div className="font-serif text-5xl font-black text-slate-900">
                {currentCard.cn}
              </div>
              <div className="text-2xl font-bold text-rose-600">
                {currentCard.py}
              </div>
              <div className="text-base font-bold text-slate-800">
                {currentCard.uz}
              </div>
              <div className="text-xs text-slate-500 italic">
                {currentCard.en}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playChineseAudio(currentCard.cn);
                }}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs"
              >
                <Volume2 className="w-4 h-4" />
                <span>Ovozli eshitish</span>
              </button>
            </div>
          )}

          <div className="text-[11px] text-slate-400">
            {isFlipped ? 'Orqa tomoni' : 'Old tomoni (Hanzi)'}
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handlePrev}
          className="p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs"
          title="Oldingi karta"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 flex-1 justify-center max-w-xs">
          <button
            onClick={handleNext}
            className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <X className="w-4 h-4 text-red-500" />
            <span>Qaytarish</span>
          </button>

          <button
            onClick={handleMarkKnown}
            className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Bilaman!</span>
          </button>
        </div>

        <button
          onClick={handleNext}
          className="p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs"
          title="Keyingi karta"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
