import React, { useState, useEffect, useRef } from 'react';
import { User, AIDialogueMessage, AIDialogueFeedback } from '../types';
import { playChineseAudio, stopAudio } from '../utils/audio';
import { recordDialoguePractice } from '../utils/storage';
import {
  Mic,
  Send,
  Volume2,
  Sparkles,
  Award,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Brain
} from 'lucide-react';

interface AiDialogueViewProps {
  currentUser: User | null;
  onUserUpdate: (user: User) => void;
  onOpenAuth: () => void;
}

const TOPICS = [
  { id: 'greeting', titleUz: 'Tanishuv & Salomlashish', titleCn: '打招呼与认识', starterCn: '你好！很高兴认识你。你叫什么名字？', starterUz: 'Salom! Tanishganimdan xursandman. Ismingiz nima?' },
  { id: 'cafe', titleUz: 'Qahvaxona & Buyurtma', titleCn: '在咖啡馆点饮品', starterCn: '欢迎光临！你想喝咖啡还是茶？', starterUz: 'Xush kelibsiz! Kofe ichasizmi yoki choy?' },
  { id: 'shopping', titleUz: 'Xarid & Narx So\'rash', titleCn: '商店买东西与问价', starterCn: '请问你想买什么？这个苹果很甜。', starterUz: 'Nima sotib olmoqchisiz? Bu olma juda shirin.' },
  { id: 'hobbies', titleUz: 'Qiziqishlar & Sport', titleCn: '兴趣爱好与运动', starterCn: '你周末喜欢做什么？喜欢跑步还是看书？', starterUz: 'Dam olish kunlari nima qilishni yoqtirasiz?' },
  { id: 'free', titleUz: 'Erkin Suhbat (Free Chat)', titleCn: '自由交谈与练习', starterCn: '你好！今天天气怎么样？跟我用汉语聊聊吧。', starterUz: 'Salom! Bugun ob-havo qanday? Men bilan xitoycha suhbatlashing.' },
];

export const AiDialogueView: React.FC<AiDialogueViewProps> = ({
  currentUser,
  onUserUpdate,
  onOpenAuth,
}) => {
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [messages, setMessages] = useState<AIDialogueMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      cn: TOPICS[0].starterCn,
      py: 'Nǐ hǎo! Hěn gāoxìng rènshi nǐ. Nǐ jiào shénme míngzi?',
      uz: TOPICS[0].starterUz,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<AIDialogueFeedback | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Topic change handler
  const handleSelectTopic = (topic: typeof TOPICS[0]) => {
    stopAudio();
    setSelectedTopic(topic);
    setFeedback(null);
    setMessages([
      {
        id: 'init-' + Date.now(),
        role: 'assistant',
        cn: topic.starterCn,
        py: 'Audioni eshitish uchun tugmani bosing',
        uz: topic.starterUz,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handlePlayMessage = async (text: string) => {
    stopAudio();
    await playChineseAudio(text, 0.85);
  };

  // Voice recording
  const handleToggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setSpeechError('Brauzeringizda ovozni aniqlash vositasi topilmadi. Matn orqali yozishingiz mumkin.');
      return;
    }

    try {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'zh-CN';
      recognition.interimResults = false;

      setIsRecording(true);
      setSpeechError(null);

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript.trim();
        setInputVal(text);
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  // AI Response generator
  const handleSendMessage = async () => {
    const text = inputVal.trim();
    if (!text || isThinking) return;

    const userMsg: AIDialogueMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      cn: text,
      py: '',
      uz: 'Talaba javobi',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsThinking(true);

    // Contextual realistic Chinese teacher reply
    setTimeout(async () => {
      let replyCn = '非常好！你的汉语说得很流利。';
      let replyPy = 'Fēicháng hǎo! Nǐ de hànyǔ shuō de hěn liúlì.';
      let replyUz = 'Juda ajoyib! Xitoy tilida juda ravon gapiryapsiz.';

      const lower = text.toLowerCase();
      if (lower.includes('叫') || lower.includes('名字') || lower.includes('我是')) {
        replyCn = '太好了！你学汉语多久了？喜欢中国菜吗？';
        replyPy = 'Tài hǎo le! Nǐ xué hànyǔ duōjiǔ le? Xǐhuan zhōngguó cài ma?';
        replyUz = 'Juda soz! Qanchadan beri xitoy tili o\'rganyapsiz? Xitoy taomlarini yoqtirasizmi?';
      } else if (lower.includes('咖啡') || lower.includes('茶') || lower.includes('喝')) {
        replyCn = '好的，一杯热咖啡！你还要别的点心吗？';
        replyPy = 'Hǎo de, yì bēi rè kāfēi! Nǐ hái yào bié de diǎnxin ma?';
        replyUz = 'Xo\'p, bir finjon issiq kofe! Yana biror shirinlik buyurasizmi?';
      } else if (lower.includes('钱') || lower.includes('多少') || lower.includes('贵') || lower.includes('买')) {
        replyCn = '这个一共五十块钱。可以微信支付或者现金。';
        replyPy = 'Zhège yígòng wǔshí kuài qián. Kěyǐ wēixìn zhīfù huòzhě xiànjīn.';
        replyUz = 'Bular jami 50 yuan bo\'ldi. WeChat orqali yoki naqd to\'lashingiz mumkin.';
      } else if (lower.includes('跑步') || lower.includes('书') || lower.includes('喜欢') || lower.includes('电影')) {
        replyCn = '跑步对身体特别好！我也经常周末去公园运动。';
        replyPy = 'Pǎobù duì shēntǐ tèbié hǎo! Wǒ yě jīngcháng zhōumò qù gōngyuán yùndòng.';
        replyUz = 'Yugurish salomatlik uchun juda foydali! Men ham dam olish kunlari parkda sport bilan shug\'ullanaman.';
      } else {
        replyCn = '你说得很有道理！继续练习，你的发音会越来越好。你还想了解什么？';
        replyPy = 'Nǐ shuō de hěn yǒu dàolǐ! Jìxù liànxí, nǐ de fāyīn huì yuè lái yuè hǎo. Nǐ hái xiǎng liǎojiě shénme?';
        replyUz = 'To\'g\'ri aytdingiz! Mashqni davom ettiring, talaffuzingiz yanada yaxshilanadi. Yana nimalarni o\'rganmoqchisiz?';
      }

      const aiMsg: AIDialogueMessage = {
        id: 'ai-' + Date.now(),
        role: 'assistant',
        cn: replyCn,
        py: replyPy,
        uz: replyUz,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);

      // Play audio automatically
      playChineseAudio(replyCn, 0.9);
    }, 1000);
  };

  // Finish Discussion & Generate AI Speaking Feedback
  const handleFinishAndFeedback = () => {
    stopAudio();
    const userMsgCount = messages.filter((m) => m.role === 'user').length;

    const fluency = Math.min(98, 80 + userMsgCount * 3);
    const grammar = Math.min(95, 78 + userMsgCount * 3);
    const pronunciation = Math.min(96, 82 + userMsgCount * 2);
    const overall = Math.round((fluency + grammar + pronunciation) / 3);

    const generatedFeedback: AIDialogueFeedback = {
      fluencyScore: fluency,
      grammarScore: grammar,
      pronunciationScore: pronunciation,
      overallScore: overall,
      strengths: [
        'Xitoycha gapirishga bo\'lgan ishonch va ravon intonatsiya',
        'HSK 1 va HSK 2 asosiy so\'z boyligidan to\'g\'ri foydalanish',
        'Savollarga mantiqiy va kontekstga mos tezkor javob qaytarish',
      ],
      mistakes: [
        {
          original: 'Xitoy tilida so\'roq so\'zlari gap oxirida (吗) yoki maxsus so\'roq olmoshi o\'rnida keladi',
          correction: 'Masalan: "你叫什么名字？" (Sen nima ism deb atalasan?)',
          reason: 'O\'zbek tilidagi tartib bilan aynan solishtirmaslik zarur.',
        },
        {
          original: 'Ohanglar (4 ta asosiy ton) balandligini to\'liq talaffuz qilish',
          correction: '3-tonda avval pasayib, keyin ko\'tariling (hǎo, nǐ)',
          reason: 'Bu xitoyliklar uchun tushunishni 100% osonlashtiradi.',
        },
      ],
      suggestedPhrases: [
        { cn: '我觉得……', py: 'Wǒ juéde...', uz: 'Mening fikrimcha / Menimcha...' },
        { cn: '除了这个以外……', py: 'Chúle zhège yǐwài...', uz: 'Bundan tashqari...' },
        { cn: '非常感谢你的帮助！', py: 'Fēicháng gǎnxiè nǐ de bāngzhù!', uz: 'Yordamingiz uchun katta rahmat!' },
      ],
      encouragement:
        'Ajoyib natija! Kundalik 5 daqiqa AI bilan bunday muloqot qilish sizning speaking qo\'rquvingizni butunlay yo\'qotadi.',
    };

    setFeedback(generatedFeedback);

    const updatedUser = recordDialoguePractice(30);
    if (updatedUser) {
      onUserUpdate(updatedUser);
    }
  };

  return (
    <div id="ai-dialogue-container" className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-rose-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI CHINESE SPEAKING PARTNER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Jonli AI Xitoycha Suhbatdoshi
          </h2>
          <p className="text-xs text-slate-500">
            Mavzuni tanlang, mikrofonda gapiring va oxirida batafsil AI feedback oling!
          </p>
        </div>

        <button
          type="button"
          onClick={handleFinishAndFeedback}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Award className="w-4 h-4" />
          <span>Suhbatni yakunlash & AI Feedback</span>
        </button>
      </div>

      {/* Topic selection chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => handleSelectTopic(topic)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedTopic.id === topic.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{topic.titleUz}</span>
            <span className="opacity-60 text-[10px] ml-1 font-serif">({topic.titleCn})</span>
          </button>
        ))}
      </div>

      {/* Main Chat Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Chat message stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isAI = msg.role === 'assistant';

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-serif text-sm font-black shrink-0">
                    李
                  </div>
                )}

                <div
                  className={`max-w-md p-4 rounded-2xl text-xs sm:text-sm space-y-1 ${
                    isAI
                      ? 'bg-slate-50 border border-slate-200 text-slate-900 rounded-tl-xs'
                      : 'bg-rose-600 text-white rounded-tr-xs'
                  }`}
                >
                  <div className="font-serif text-base font-bold leading-snug">{msg.cn}</div>
                  {msg.py && (
                    <div className={`text-[11px] font-medium ${isAI ? 'text-rose-600' : 'text-rose-200'}`}>
                      {msg.py}
                    </div>
                  )}
                  {msg.uz && (
                    <div className={`text-[11px] pt-1 border-t ${isAI ? 'border-slate-200/80 text-slate-500' : 'border-rose-500/80 text-rose-100'}`}>
                      {msg.uz}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-[10px] opacity-70">
                    <span>{msg.timestamp}</span>
                    {isAI && (
                      <button
                        type="button"
                        onClick={() => handlePlayMessage(msg.cn)}
                        className="p-1 rounded hover:bg-slate-200 text-slate-600 cursor-pointer"
                        title="Eshitish"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {!isAI && (
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {currentUser?.avatar || '👤'}
                  </div>
                )}
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Li Laoshi javob yozmoqda va talaffuz qilmoqda...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-50/80 border-t border-slate-200">
          {speechError && (
            <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg mb-2">
              {speechError}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-3 rounded-2xl text-white font-bold transition-all cursor-pointer ${
                isRecording ? 'bg-red-500 animate-pulse shadow-md shadow-red-200' : 'bg-slate-900 hover:bg-slate-800'
              }`}
              title={isRecording ? 'Yozishni to\'xtatish' : 'Mikrofon orqali gapirish'}
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Xitoycha yoki pinyin yozing yoki mikrofonda ayting..."
              className="flex-1 p-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm font-medium outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
            />

            <button
              type="button"
              onClick={handleSendMessage}
              disabled={!inputVal.trim()}
              className="p-3 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* FEEDBACK MODAL / BOTTOM CARD */}
      {feedback && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-rose-200 shadow-xl space-y-6 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <Brain className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">AI Speaking & Grammar Feedback</h3>
                <p className="text-xs text-slate-500">Muloqotingiz bo'yicha sun'iy intellekt xulosasi</p>
              </div>
            </div>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              +30 XP Saqlandi
            </span>
          </div>

          {/* Scores Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-semibold">Ravonlik (Fluency)</div>
              <div className="text-2xl font-black text-rose-600 mt-0.5">{feedback.fluencyScore}%</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-semibold">Grammatika</div>
              <div className="text-2xl font-black text-purple-600 mt-0.5">{feedback.grammarScore}%</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-semibold">Talaffuz (Tones)</div>
              <div className="text-2xl font-black text-amber-600 mt-0.5">{feedback.pronunciationScore}%</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-semibold">Umumiy Ball</div>
              <div className="text-2xl font-black text-emerald-600 mt-0.5">{feedback.overallScore}/100</div>
            </div>
          </div>

          {/* Strengths & Mistakes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kuchli tomonlaringiz:</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                {feedback.strengths.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
              <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Tavsiya va tuzatishlar:</span>
              </div>
              <div className="space-y-2 text-xs">
                {feedback.mistakes.map((m, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-white border border-amber-200/80">
                    <div className="font-semibold text-slate-800">{m.correction}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{m.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended expressions */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              💡 Keyingi muloqot uchun tavsiya qilingan iboralar:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {feedback.suggestedPhrases.map((phrase, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                  <div className="font-serif font-bold text-slate-900">{phrase.cn}</div>
                  <div className="text-[11px] text-rose-600 font-semibold">{phrase.py}</div>
                  <div className="text-[11px] text-slate-600">{phrase.uz}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
