export interface MockListeningQuestion {
  id: number;
  audioText: string;
  pinyin: string;
  imageEmoji?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MockReadingQuestion {
  id: number;
  text: string;
  pinyin: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MockWritingQuestion {
  id: number;
  scrambledWords: string[];
  correctSentence: string;
  pinyin: string;
  uzbekMeaning: string;
  prompt: string;
}

export interface MockSpeakingQuestion {
  id: number;
  targetPhrase: string;
  pinyin: string;
  uzbekMeaning: string;
  cue: string;
}

export const HSK1_MOCK_LISTENING: MockListeningQuestion[] = [
  {
    id: 1,
    audioText: '很高兴认识你。',
    pinyin: 'Hěn gāoxìng rènshi nǐ.',
    imageEmoji: '🤝',
    question: 'Eshitilgan jumlaga qaysi rasm/vaziyat mos keladi? (Tanishuv)',
    options: ['🤝 Tanishuv / Ko\'rishish', '🍲 Restoranda ovqatlanish', '🚗 Mashina haydash'],
    correctIndex: 0,
    explanation: '"很高兴认识你" — Siz bilan tanishganimdan juda xursandman degani.',
  },
  {
    id: 2,
    audioText: '他在喝茶呢。',
    pinyin: 'Tā zài hē chá ne.',
    imageEmoji: '🍵',
    question: 'U kishi nima qilyapti? (Tinglang va tanlang)',
    options: ['Kitob o\'qiyapti', 'Choy ichyapti', 'Uxlab yotibdi'],
    correctIndex: 1,
    explanation: '"喝茶" (hē chá) — choy ichmoq.',
  },
  {
    id: 3,
    audioText: '三个人。',
    pinyin: 'Sān gè rén.',
    imageEmoji: '👨‍👩‍👦',
    question: 'Nechta inson haqida gap ketmoqda?',
    options: ['3 kishi', '4 kishi', '2 kishi'],
    correctIndex: 0,
    explanation: '"三个人" — uch kishi.',
  },
  {
    id: 4,
    audioText: '苹果在桌子上。',
    pinyin: 'Píngguǒ zài zhuōzi shang.',
    imageEmoji: '🍎',
    question: 'Olma qayerda turibdi?',
    options: ['Stol ustida', 'Stul tagida', 'Xalta ichida'],
    correctIndex: 0,
    explanation: '"桌子上" (zhuōzi shang) — stol ustida.',
  },
  {
    id: 5,
    audioText: '明天下午三点见。',
    pinyin: 'Míngtiān xiàwǔ sān diǎn jiàn.',
    imageEmoji: '🕒',
    question: 'Uchrashuv vaqti qachon?',
    options: ['Bugun soat 3 da', 'Ertaga tushdan keyin soat 3 da', 'Ertaga ertalab soat 9 da'],
    correctIndex: 1,
    explanation: '"明天下午三点" — ertaga tushdan keyin soat 3 da.',
  },
  {
    id: 6,
    audioText: '对不起，我没听懂。',
    pinyin: 'Duìbuqǐ, wǒ méi tīngdǒng.',
    imageEmoji: '👂',
    question: 'So\'zlovchi nima dedi?',
    options: ['Kechirasiz, eshitib tushunmadim', 'Kechirasiz, kech qoldim', 'Rahmat, tushundim'],
    correctIndex: 0,
    explanation: '"没听懂" — eshitib tushunmadim degan ma\'noda.',
  },
  {
    id: 7,
    audioText: '她是我的汉语老师。',
    pinyin: 'Tā shì wǒ de hànyǔ lǎoshī.',
    imageEmoji: '👩‍🏫',
    question: 'U ayol kim?',
    options: ['Xitoy tili o\'qituvchim', 'Singlim', 'Shifokorim'],
    correctIndex: 0,
    explanation: '"汉语老师" — xitoy tili o\'qituvchisi.',
  },
  {
    id: 8,
    audioText: '我想买一件衣服。',
    pinyin: 'Wǒ xiǎng mǎi yí jiàn yīfu.',
    imageEmoji: '👕',
    question: 'So\'zlovchi nima sotib olmoqchi?',
    options: ['Bitta kiyim', 'Bitta telefon', 'Bir juft poyabzal'],
    correctIndex: 0,
    explanation: '"一件衣服" — bitta kiyim.',
  },
  {
    id: 9,
    audioText: '今天天气很冷，会下雨。',
    pinyin: 'Jīntiān tiānqì hěn lěng, huì xiàyǔ.',
    imageEmoji: '🌧️',
    question: 'Bugungi ob-havo qanday?',
    options: ['Issiq va quyoshli', 'Sovuq va yomg\'ir yog\'adi', 'Shamolli va ochiq'],
    correctIndex: 1,
    explanation: '"很冷，会下雨" — juda sovuq, yomg\'ir yog\'ishi mumkin.',
  },
  {
    id: 10,
    audioText: '你喜欢吃米饭还是面条？',
    pinyin: 'Nǐ xǐhuan chī mǐfàn háishi miàntiáo?',
    imageEmoji: '🍜',
    question: 'Savolda qaysi taomlar tanlovi so\'ralmoqda?',
    options: ['Guruch (palov) yoki lag\'mon (lapsha)', 'Go\'sht yoki non', 'Choy yoki kofe'],
    correctIndex: 0,
    explanation: '"米饭" (guruch) va "面条" (lapsha/makaron).',
  },
];

export const HSK1_MOCK_READING: MockReadingQuestion[] = [
  {
    id: 11,
    text: '我爱喝中国茶。',
    pinyin: 'Wǒ ài hē zhōngguó chá.',
    question: 'Ushbu gapning to\'g\'ri tarjimasi qaysi?',
    options: ['Men xitoy choyini ichishni yaxshi ko\'raman', 'Men xitoycha ovqat pishiraman', 'U xitoy choyini sotib oldi'],
    correctIndex: 0,
    explanation: '"爱喝中国茶" — xitoy choyini ichishni yaxshi ko\'raman.',
  },
  {
    id: 12,
    text: '火车站不远，坐出租车十分钟就到。',
    pinyin: 'Huǒchēzhàn bù yuǎn, zuò chūzūchē shí fēnzhōng jiù dào.',
    question: 'Poyezd bekatiga taksida qancha vaqt ketadi?',
    options: ['10 daqiqa', '30 daqiqa', '1 soat'],
    correctIndex: 0,
    explanation: '"十分钟" — 10 daqiqa.',
  },
  {
    id: 13,
    text: '这只猫是谁的？—— 是王小姐的。',
    pinyin: 'Zhè zhī māo shì shéi de? —— Shì Wáng xiǎojiě de.',
    question: 'Mushuk kimniki?',
    options: ['Janob Vangniki', 'Vang xonimniki (Miss Wang)', 'Do\'stimniki'],
    correctIndex: 1,
    explanation: '"王小姐" — Vang xonim (miss).',
  },
  {
    id: 14,
    text: 'Nuqtalar o\'rniga to\'g\'ri so\'zni tanlang: "你在____工作？—— 我在医院工作。"',
    pinyin: 'Nǐ zài ____ gōngzuò? —— Wǒ zài yīyuàn gōngzuò.',
    question: 'Qaysi so\'roq so\'zi qo\'yilishi kerak?',
    options: ['哪儿 (qayerda)', '什么 (nima)', '谁 (kim)'],
    correctIndex: 0,
    explanation: 'Joy so\'ralganda "哪儿" (nǎr - qayerda) ishlatiladi.',
  },
  {
    id: 15,
    text: '我爸爸今年五十岁，他是一个医生。',
    pinyin: 'Wǒ bàba jīnnián wǔshí suì, tā shì yí gè yīshēng.',
    question: 'Otasi necha yoshda va kasbi nima?',
    options: ['50 yosh, shifokor', '40 yosh, o\'qituvchi', '60 yosh, haydovchi'],
    correctIndex: 0,
    explanation: '"五十岁" (50 yosh), "医生" (shifokor).',
  },
  {
    id: 16,
    text: 'Nuqtalar o\'rniga mos so\'zni qo\'ying: "太____了！谢谢你！"',
    pinyin: 'Tài ____ le! Xièxie nǐ!',
    question: 'Iboraning to\'g\'ri shakli qaysi?',
    options: ['好 (yaxshi)', '大 (katta)', '多 (ko\'p)'],
    correctIndex: 0,
    explanation: '"太好了" (Tài hǎo le) — Juda ajoyib! Juda soz!',
  },
  {
    id: 17,
    text: '今天星期五，明天是星期六。',
    pinyin: 'Jīntiān xīngqīwǔ, míngtiān shì xīngqīliù.',
    question: 'Bugun qaysi kun?',
    options: ['Juma', 'Shanba', 'Yakshanba'],
    correctIndex: 0,
    explanation: '"星期五" — Juma.',
  },
  {
    id: 18,
    text: '书在电脑前边。',
    pinyin: 'Shū zài diànnǎo qiánbian.',
    question: 'Kitob qayerda joylashgan?',
    options: ['Kompyuterning oldida', 'Kompyuterning orqasida', 'Kompyuterning tagida'],
    correctIndex: 0,
    explanation: '"前边" (qiánbian) — oldida.',
  },
  {
    id: 19,
    text: '喂，李先生在吗？—— 他不在家，他去北京了。',
    pinyin: 'Wèi, Lǐ xiānsheng zài ma? —— Tā bú zài jiā, tā qù Běijīng le.',
    question: 'Janob Li qayerga ketgan?',
    options: ['Pekinga', 'Maktabga', 'Kasalxonaga'],
    correctIndex: 0,
    explanation: '"去北京了" — Pekinga ketgan.',
  },
  {
    id: 20,
    text: '请坐，请喝茶。',
    pinyin: 'Qǐng zuò, qǐng hē chá.',
    question: 'Mehmonga qanday muloyim taklif aytilmoqda?',
    options: ['O\'tiring, choy iching', 'Marhamat, kiring', 'Kechirasiz, kuting'],
    correctIndex: 0,
    explanation: '"请坐" (o\'tiring), "请喝茶" (choy iching).',
  },
];

export const HSK1_MOCK_WRITING: MockWritingQuestion[] = [
  {
    id: 21,
    scrambledWords: ['好朋友', '是', '我们', '的'],
    correctSentence: '我们是好朋友。',
    pinyin: 'Wǒmen shì hǎo péngyou.',
    uzbekMeaning: 'Biz yaxshi do\'stlarmiz.',
    prompt: 'So\'zlarni to\'g\'ri tartibda birlashtirib gap tuzing.',
  },
  {
    id: 22,
    scrambledWords: ['在', '小狗', '椅子下边'],
    correctSentence: '小狗在椅子下边。',
    pinyin: 'Xiǎogǒu zài yǐzi xiàbian.',
    uzbekMeaning: 'Kuchukcha stul tagida.',
    prompt: 'Joy predikati (在) asosida gap tuzing.',
  },
  {
    id: 23,
    scrambledWords: ['想', '买', '我', '苹果'],
    correctSentence: '我想买苹果。',
    pinyin: 'Wǒ xiǎng mǎi píngguǒ.',
    uzbekMeaning: 'Men olma sotib olmoqchiman.',
    prompt: 'Xohish-istak (想) bilan gap tuzing.',
  },
  {
    id: 24,
    scrambledWords: ['多少', '这个杯子', '钱'],
    correctSentence: '这个杯子多少钱？',
    pinyin: 'Zhège bēizi duōshao qián?',
    uzbekMeaning: 'Bu stakan qancha turadi?',
    prompt: 'Narx so\'rash so\'rog\'ini tuzing.',
  },
  {
    id: 25,
    scrambledWords: ['在看书', '现在', '他'],
    correctSentence: '他现在在看书。',
    pinyin: 'Tā xiànzài zài kànshū.',
    uzbekMeaning: 'U hozir kitob o\'qiyapti.',
    prompt: 'Hozirgi davomli zamon gapini hosil qiling.',
  },
];

export const HSK1_MOCK_SPEAKING: MockSpeakingQuestion[] = [
  {
    id: 26,
    targetPhrase: '你好，很高兴认识你。',
    pinyin: 'Nǐ hǎo, hěn gāoxìng rènshi nǐ.',
    uzbekMeaning: 'Salom, siz bilan tanishganimdan xursandman.',
    cue: 'Mikrofonga baland va ohang bilan talaffuz qiling.',
  },
  {
    id: 27,
    targetPhrase: '我想学汉语。',
    pinyin: 'Wǒ xiǎng xué hànyǔ.',
    uzbekMeaning: 'Men xitoy tilini o\'rganmoqchiman.',
    cue: 'To\'liq va ravon ayting.',
  },
  {
    id: 28,
    targetPhrase: '这个多少钱？',
    pinyin: 'Zhège duōshao qián?',
    uzbekMeaning: 'Bu qancha turadi?',
    cue: 'So\'roq ohangini to\'g\'ri bering.',
  },
  {
    id: 29,
    targetPhrase: '明天见，再见！',
    pinyin: 'Míngtiān jiàn, zàijiàn!',
    uzbekMeaning: 'Ertagacha, xayr!',
    cue: 'Xayrlashuv iborasini aniq talaffuz qiling.',
  },
  {
    id: 30,
    targetPhrase: '今天天气非常好。',
    pinyin: 'Jīntiān tiānqì fēicháng hǎo.',
    uzbekMeaning: 'Bugun ob-havo juda ham yaxshi.',
    cue: 'Sifat darajasini to\'g\'ri talaffuz qiling.',
  },
];
