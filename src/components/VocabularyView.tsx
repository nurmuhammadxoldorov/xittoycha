import React, { useState, useMemo } from 'react';
import { VocabWord, User } from '../types';
import { getFullVocabDictionary, searchDictionary, lookupUniversalWord } from '../data/vocabularyData';
import { playChineseAudio, stopAudio } from '../utils/audio';
import { toggleWordBookmark } from '../utils/storage';
import { Search, Volume2, Heart, Sparkles, Filter, X, BookOpen, Layers, Check } from 'lucide-react';

interface VocabularyViewProps {
  currentUser: User | null;
  onUserUpdate: (user: User) => void;
  onOpenAuth: () => void;
}

export const VocabularyView: React.FC<VocabularyViewProps> = ({
  currentUser,
  onUserUpdate,
  onOpenAuth,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [activeWord, setActiveWord] = useState<VocabWord | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.85);

  const allWords = useMemo(() => getFullVocabDictionary(), []);

  // Filter by level and search query
  const filteredWords = useMemo(() => {
    let list = allWords;

    if (selectedLevel === 'SAVED') {
      const savedSet = new Set(currentUser?.bookmarkedWords || []);
      list = list.filter((w) => savedSet.has(w.cn));
    } else if (selectedLevel !== 'ALL') {
      list = list.filter((w) => w.level === selectedLevel);
    }

    if (searchQuery.trim()) {
      list = searchDictionary(searchQuery, list);
    }

    return list;
  }, [allWords, selectedLevel, searchQuery, currentUser?.bookmarkedWords]);

  const handlePlayAudio = async (word: VocabWord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    stopAudio();
    setPlayingId(word.id);
    await playChineseAudio(word.cn, speechRate);
    setPlayingId(null);
  };

  const handleToggleBookmark = (wordCn: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    const res = toggleWordBookmark(wordCn);
    if (res.user) {
      onUserUpdate(res.user);
    }
  };

  const isBookmarked = (wordCn: string) => {
    return currentUser?.bookmarkedWords?.includes(wordCn) || false;
  };

  // If search returned 0 results, generate smart instant translation entry
  const dynamicFallbackWord: VocabWord | null = useMemo(() => {
    if (filteredWords.length > 0 || !searchQuery.trim()) return null;
    return lookupUniversalWord(searchQuery.trim());
  }, [filteredWords.length, searchQuery]);

  return (
    <div id="vocabulary-container" className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 relative overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            5000+ Ieroglif va Lug'at Bazasi
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Xitoy Tili Lug'ati & Qidiruv Tizimi
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Ieroglif, Pinyin, inglizcha yoki o'zbekcha so'z kiriting. Har bir so'zning to'liq transkripsiyasi,
            talaffuzi (ovozli shakli) va misol jumlalari keltirilgan.
          </p>
        </div>
      </div>

      {/* Search Bar & Speed Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="vocab-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Istalgan so'zni qidiring (masalan: 你好, nǐ hǎo, salom, book, 朋友, suv)..."
            className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-100 text-sm font-medium outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Level Filters & Audio speed controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'ALL', label: 'Barchasi (5000+)' },
              { id: 'HSK 1', label: 'HSK 1' },
              { id: 'HSK 2', label: 'HSK 2' },
              { id: 'HSK 3', label: 'HSK 3' },
              { id: 'HSK 4', label: 'HSK 4' },
              { id: 'HSK 5', label: 'HSK 5' },
              { id: 'HSK 6', label: 'HSK 6' },
              { id: 'SAVED', label: `❤️ Saqlanganlar (${currentUser?.bookmarkedWords?.length || 0})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedLevel(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedLevel === tab.id
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Ovoz tezligi:</span>
            <button
              onClick={() => setSpeechRate(0.75)}
              className={`px-2 py-1 rounded text-xs font-bold ${
                speechRate === 0.75 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100'
              }`}
            >
              0.75x
            </button>
            <button
              onClick={() => setSpeechRate(0.9)}
              className={`px-2 py-1 rounded text-xs font-bold ${
                speechRate === 0.9 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100'
              }`}
            >
              1.0x
            </button>
          </div>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
        <span>
          Topildi: <strong className="text-slate-800">{filteredWords.length}</strong> ta so'z
        </span>
        <span>Tap qilib ovozini eshiting yoki batafsil oching</span>
      </div>

      {/* Grid of Vocabulary Cards */}
      {filteredWords.length === 0 && dynamicFallbackWord ? (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-rose-200 shadow-md max-w-xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Topilgan so'z & maxsus lug'at kartasi
          </div>
          
          <div className="font-serif text-5xl font-black text-slate-900 tracking-wide">
            {dynamicFallbackWord.cn}
          </div>

          <div className="text-xl font-bold text-rose-600">
            {dynamicFallbackWord.py}
          </div>

          <div className="text-base font-bold text-slate-800">
            {dynamicFallbackWord.uz}
          </div>

          <div className="text-xs text-slate-500 italic">
            {dynamicFallbackWord.en}
          </div>

          {dynamicFallbackWord.exampleCn && (
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 text-left space-y-1 mt-2">
              <div className="text-xs font-bold text-rose-700 uppercase tracking-wide">Misol gap:</div>
              <div className="font-serif text-sm font-bold text-slate-900">{dynamicFallbackWord.exampleCn}</div>
              <div className="text-xs font-semibold text-rose-600">{dynamicFallbackWord.examplePy}</div>
              <div className="text-xs text-slate-600">{dynamicFallbackWord.exampleUz}</div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => handlePlayAudio(dynamicFallbackWord)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 text-white text-sm font-bold shadow-md hover:shadow-lg hover:from-rose-700 hover:to-rose-600 transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>🔊 Ovozli eshitish (Talaffuz)</span>
            </button>

            <button
              type="button"
              onClick={(e) => handleToggleBookmark(dynamicFallbackWord.cn, e)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-sm font-bold transition-all cursor-pointer border border-slate-200"
            >
              <Heart className={`w-4 h-4 ${isBookmarked(dynamicFallbackWord.cn) ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isBookmarked(dynamicFallbackWord.cn) ? 'Saqlangan' : 'Saqlash'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredWords.slice(0, 160).map((word) => {
            const isSaved = isBookmarked(word.cn);
            const isPlaying = playingId === word.id;
            return (
              <div
                key={word.id}
                onClick={() => setActiveWord(word)}
                className="group relative bg-white hover:bg-rose-50/20 p-4 rounded-2xl border border-slate-200/90 hover:border-rose-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 group-hover:bg-rose-100 group-hover:text-rose-700 transition-colors">
                      {word.level}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleToggleBookmark(word.cn, e)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isSaved
                            ? 'text-rose-600 hover:text-rose-700'
                            : 'text-slate-300 hover:text-rose-500'
                        }`}
                        title={isSaved ? "Saqlanganlardan o'chirish" : "Lug'atga saqlash"}
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handlePlayAudio(word, e)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isPlaying
                            ? 'bg-rose-500 text-white animate-bounce'
                            : 'bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700'
                        }`}
                        title="Ovozli eshitish"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="font-serif text-3xl font-black text-slate-900 tracking-wide mb-1">
                    {word.cn}
                  </div>
                  <div className="text-sm font-bold text-rose-600 tracking-tight mb-1.5">
                    {word.py}
                  </div>
                  <div className="text-xs text-slate-700 font-medium line-clamp-1">
                    {word.uz}
                  </div>
                  <div className="text-[11px] text-slate-400 italic line-clamp-1">
                    {word.en}
                  </div>
                </div>

                {word.radical && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Radikal: <strong className="text-slate-700 font-serif">{word.radical}</strong></span>
                    {word.strokes && <span>{word.strokes} chiziq</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Word Detail Modal */}
      {activeWord && (
        <div
          id="word-detail-backdrop"
          onClick={() => setActiveWord(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
        >
          <div
            id="word-detail-card"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5"
          >
            <button
              onClick={() => setActiveWord(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-black px-2.5 py-1 rounded-md bg-rose-100 text-rose-700">
                  {activeWord.level}
                </span>
                <h3 className="text-5xl font-serif font-black text-slate-900 mt-2">
                  {activeWord.cn}
                </h3>
                <div className="text-lg font-bold text-rose-600 mt-1">
                  {activeWord.py}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handlePlayAudio(activeWord)}
                className="p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Volume2 className="w-6 h-6" />
                <span className="text-xs font-bold hidden sm:inline">Eshitish</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-100 text-xs">
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 block mb-0.5">O'zbekcha ma'nosi:</span>
                <span className="font-bold text-slate-900 text-sm">{activeWord.uz}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <span className="text-slate-400 block mb-0.5">Inglizcha ma'nosi:</span>
                <span className="font-bold text-slate-900 text-sm">{activeWord.en}</span>
              </div>
            </div>

            {activeWord.exampleCn && (
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-rose-600 tracking-wider">
                    Misol jumla (Example Sentence)
                  </span>
                  <button
                    onClick={() => playChineseAudio(activeWord.exampleCn!, speechRate)}
                    className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Jumlani eshitish</span>
                  </button>
                </div>
                <div className="font-serif text-lg font-bold text-slate-900">
                  {activeWord.exampleCn}
                </div>
                {activeWord.examplePy && (
                  <div className="text-xs font-semibold text-rose-700">
                    {activeWord.examplePy}
                  </div>
                )}
                {activeWord.exampleUz && (
                  <div className="text-xs text-slate-600 pt-0.5">
                    {activeWord.exampleUz}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={(e) => handleToggleBookmark(activeWord.cn, e)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  isBookmarked(activeWord.cn)
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${isBookmarked(activeWord.cn) ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isBookmarked(activeWord.cn) ? "Lug'atda saqlangan" : "Lug'atga saqlash"}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveWord(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
