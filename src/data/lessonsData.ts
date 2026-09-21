import { LessonData } from '../types';

const LESSON_THEMES = [
  { id: 1, cn: '你好', en: 'Hello & Introductions', uz: 'Salom va Tanishuv', sub: 'Salomlashish, ismlar, mamlakatlar va xushmuomalalik', pattern: '我叫… / 你叫什么名字？', rule: '是 (shì) — bog\'lovchi fe\'li va 叫 (jiào) otlashgan fe\'l' },
  { id: 2, cn: '数字', en: 'Numbers & Age', uz: 'Raqamlar va Yosh', sub: 'Raqamlar, yosh, telefon raqamlari va hisoblash', pattern: '你几岁？ / 你有几个？', rule: '几 (jǐ) va 多少 (duōshao) — miqdor so\'roqlari' },
  { id: 3, cn: '家人', en: 'Family', uz: 'Oila A\'zolari', sub: 'Oila a\'zolari va insonlarni tasvirlash', pattern: '这是我的妈妈。', rule: '的 (de) — egalik ko\'rsatkichi' },
  { id: 4, cn: '时间', en: 'Time & Dates', uz: 'Vaqt va Sanalar', sub: 'Kunlar, sanalar, soatlar va kun tartibi', pattern: '现在几点？', rule: '几点 (jǐ diǎn) — soat va vaqt ifodalari' },
  { id: 5, cn: '学校', en: 'School & Study', uz: 'Maktab va O\'qish', sub: 'Talabalar, ustozlar, darslar va o\'qish', pattern: '我们在学校学习中文。', rule: '在 + joy + fe\'l — harakat sodir bo\'lgan joy' },
  { id: 6, cn: '工作', en: 'Jobs & Daily Work', uz: 'Kasb va Ish', sub: 'Umumiy kasblar, ish joylari va faoliyat', pattern: '你呢？你做什么工作？', rule: '呢 (ne) — qayta savol berish yuklamasi' },
  { id: 7, cn: '朋友', en: 'Friends', uz: 'Do\'stlar', sub: 'Do\'stlar, xarakter va insoniy munosabatlar', pattern: '我也喜欢他。', rule: '也 (yě) va 都 (dōu) — ham / barcha' },
  { id: 8, cn: '食物', en: 'Food & Drinks', uz: 'Taom va Ichimliklar', sub: 'Ovqatlar, ta\'mlar, buyurtma va choy/suv', pattern: '你想吃什么？', rule: '想 (xiǎng) — xohlamoq va istak' },
  { id: 9, cn: '购物', en: 'Shopping', uz: 'Xarid va Bozor', sub: 'Narxlar, o\'lchamlar, sotib olish va pul', pattern: '这个多少钱？太贵了！', rule: '太…了 (tài...le) — haddan tashqari' },
  { id: 10, cn: '天气', en: 'Weather & Seasons', uz: 'Ob-havo va Fasllar', sub: 'Ob-havo, fasllar, issiq va sovuq', pattern: '今天很冷，明天会下雨。', rule: '很 + sifat — sifatlarni bog\'lovchisiz qo\'llash' },
  { id: 11, cn: '交通', en: 'Transport', uz: 'Transport va Sayohat', sub: 'Mashina, avtobus, taksi, vokzal va qatnov', pattern: '你怎么去学校？我坐公共汽车。', rule: '怎么 + fe\'l — qanday usulda bajarish' },
  { id: 12, cn: '我的一天', en: 'My Day', uz: 'Mening Bir Kunim', sub: 'Tong, kechqurun, tartib va ketma-ketlik', pattern: '我先吃饭，再学习。', rule: '先…再… (xiān...zài...) — avval... keyin...' },
  { id: 13, cn: '家', en: 'Home & Furniture', uz: 'Uy va Xona', sub: 'Xonalar, mebellar va narsalarning joylashuvi', pattern: '书在桌子上。', rule: '在 + joy + 上/下/里 — makon holati' },
  { id: 14, cn: '位置', en: 'Where Things Are', uz: 'Yo\'nalish va Joy', sub: 'Chap, o\'ng, ichkari, tashqari, yonida', pattern: '猫在椅子下面。', rule: '方位词 (fāngwèicí) — yo\'nalish so\'zlari' },
  { id: 15, cn: '爱好', en: 'Hobbies', uz: 'Qiziqish va Xobbi', sub: 'Sport, musiqa, kitob o\'qish va bo\'sh vaqt', pattern: '我喜欢听音乐。', rule: '喜欢 + fe\'l — yoqtirish ifodasi' },
  { id: 16, cn: '能力', en: 'Abilities', uz: 'Qobiliyat va Mahorat', sub: 'Qila olmoq, tillar va amaliy ko\'nikmalar', pattern: '我会说一点儿中文。', rule: '会 (huì) — o\'rganilgan qobiliyat' },
  { id: 17, cn: '计划', en: 'Plans', uz: 'Rejalar', sub: 'Ertaga, dam olish kunlari va niyatlar', pattern: '明天我要去北京。', rule: '要 (yào) — reja va qat\'iy niyat' },
  { id: 18, cn: '旅行', en: 'Travel', uz: 'Sayohat', sub: 'Mehmonxonalar, chiptalar, joylar', pattern: '从家到学校要多久？', rule: '从…到… (cóng...dào...) — ...dan ...gacha' },
  { id: 19, cn: '餐厅', en: 'At the Restaurant', uz: 'Restoranda', sub: 'Menyu, buyurtma, to\'lov va xizmat', pattern: '请给我一杯水。', rule: '请 (qǐng) — iltimos, marhamat' },
  { id: 20, cn: '健康', en: 'Health & Feeling', uz: 'Salomatlik va Holat', sub: 'Tana a\'zolari, charchoq, dam olish', pattern: '我有点儿累。', rule: '有点儿 + sifat — salbiy noxush holat' },
  { id: 21, cn: '运动', en: 'Sports & Exercise', uz: 'Sport va Mashqlar', sub: 'Badantarbiyalar, o\'yinlar, chastota', pattern: '我每天跑步锻炼身体。', rule: 'Chastota ravishlari (每天, 常常)' },
  { id: 22, cn: '天气预报', en: 'Weather Report', uz: 'Ob-havo Bashorati', sub: 'Ob-havoni taqqoslash va darajalar', pattern: '今天比昨天热。', rule: '比 (bǐ) — qiyoslash grammatikasi' },
  { id: 23, cn: '生日', en: 'Birthdays & Wishes', uz: 'Tug\'ilgan Kun va Tabrik', sub: 'Sovg\'alar, sanalar, tilaklar', pattern: '祝你生日快乐！', rule: '祝 (zhù) — ezgu tilak bildirish' },
  { id: 24, cn: '看电影', en: 'Movies & Media', uz: 'Kino va Dam Olish', sub: 'Kinolar, teledasturlar, fikr-mulohazalar', pattern: '我觉得这个电影很有意思。', rule: '觉得 (juéde) — fikr va qarash bildirish' },
  { id: 25, cn: '电话', en: 'Phone & Messages', uz: 'Telefon va Xabarlar', sub: 'Qo\'ng\'iroq qilish, javob berish, xabar yozish', pattern: '我正在打电话呢。', rule: '正在…呢 — ayni paytda davom etayotgan ish' },
  { id: 26, cn: '语言', en: 'Languages', uz: 'Tillar va O\'rganish', sub: 'Xitoy tili, ingliz tili, yozish, gapirish', pattern: '汉字很有趣，但是有点儿难。', rule: '虽然…但是… — zidlov bog\'lovchisi' },
  { id: 27, cn: '城市', en: 'Cities & Places', uz: 'Shahar va Manzillar', sub: 'Shahar hayoti, do\'konlar, bog\'lar', pattern: '商场离这里很近。', rule: '离 (lí) — masofani o\'lchash' },
  { id: 28, cn: '复习', en: 'Review Strategies', uz: 'Mustahkamlash Usullari', sub: 'So\'zlar va qoidalarni qaytarish', pattern: '因为下雨，所以我不去。', rule: '因为…所以… — sabab va natija bog\'lovchisi' },
  { id: 29, cn: '综合', en: 'Everyday Chinese', uz: 'Kundalik Xitoy Tili', sub: 'Aralash kundalik suhbatlar va dialoglar', pattern: '虽然很难，但我一定要学会。', rule: 'Murakkab gap birikmalari' },
  { id: 30, cn: 'HSK 1冲刺', en: 'HSK 1 Final Practice', uz: 'HSK 1 Yakuniy Amaliyot', sub: '30 dars yakuni, to\'liq imtihon mashqi va sertifikat', pattern: '我成功完成了HSK 1级课程！', rule: 'HSK 1 umumiy xulosasi va yakun' },
];

export const LESSONS_DATA: LessonData[] = LESSON_THEMES.map((theme) => {
  return {
    id: theme.id,
    titleCn: theme.cn,
    titleEn: theme.en,
    titleUz: theme.uz,
    subtitle: theme.sub,
    description: `HSK 1 Lesson ${theme.id}: Master core vocabulary, authentic sentence structure "${theme.pattern}", listening comprehension, shadow speaking, and writing.`,
    vocab: [
      { cn: theme.cn, py: 'cíhuì', en: theme.en, uz: theme.uz },
      { cn: '好', py: 'hǎo', en: 'good', uz: 'yaxshi' },
      { cn: '我', py: 'wǒ', en: 'I; me', uz: 'men' },
      { cn: '你', py: 'nǐ', en: 'you', uz: 'sen, siz' },
      { cn: '学习', py: 'xuéxí', en: 'to study', uz: 'o\'rganmoq' },
      { cn: '很', py: 'hěn', en: 'very', uz: 'juda' },
      { cn: '中国', py: 'Zhōngguó', en: 'China', uz: 'Xitoy' },
      { cn: '朋友', py: 'péngyou', en: 'friend', uz: 'do\'st' },
      { cn: '高兴', py: 'gāoxìng', en: 'happy; glad', uz: 'xursand' },
      { cn: '谢谢', py: 'xièxie', en: 'thank you', uz: 'rahmat' },
    ],
    grammarTitle: theme.rule,
    grammarPattern: theme.pattern,
    grammarExplanationEn: `In this lesson, focus on the sentence pattern: "${theme.pattern}". Chinese sentences follow a strict Topic-Time-Place-Action order. Use this structure to swap in new vocabulary and speak clearly.`,
    grammarExplanationUz: `Ushbu darsda asosiy grammatik qolip: "${theme.pattern}". Xitoy tilida so'z tartibi: Ega + Vaqt + Joy + Harakat. Ushbu qolipga yangi so'zlarni qo'yib, jumlalarni mustaqil tuza olasiz.`,
    grammarExample: {
      cn: theme.pattern,
      py: 'Shuō de hěn hǎo, qǐng dà shēng dú.',
      en: 'Practice speaking this sentence aloud with correct tones.',
      uz: 'Ushbu gapni ohanglarga e\'tibor berib, baland ovozda qaytaring.'
    },
    videoScript: [
      `Welcome to HSK 1 Lesson ${theme.id}: ${theme.cn} (${theme.en}). Today we build practical, real-world Mandarin confidence.`,
      `The core grammar rule today is: ${theme.rule}. Master the anchor formula: ${theme.pattern}.`,
      `Remember that Chinese words don't conjugate. Keep the word order steady, speak each tone deliberately, and repeat after the native audio.`,
      `Let's complete the five interactive speaking phrases, answer the auto-graded quiz, and finish the writing practice.`
    ],
    dialogue: [
      { speaker: 'A', cn: `你好！今天我们学习第${theme.id}课：${theme.cn}。`, py: `Nǐ hǎo! Jīntiān wǒmen xuéxí dì ${theme.id} kè: ${theme.cn}.`, en: `Hello! Today we study Lesson ${theme.id}: ${theme.en}.`, uz: `Salom! Bugun biz ${theme.id}-darsni o'rganamiz: ${theme.uz}.` },
      { speaker: 'B', cn: `太好了！这个课的核心句型是什么？`, py: `Tài hǎo le! Zhè ge kè de héxīn jùxíng shì shénme?`, en: `Awesome! What is the key sentence pattern for today?`, uz: `Ajoyib! Bugungi darsning asosiy gap qolipi qanaqa?` },
      { speaker: 'A', cn: `核心句型是：“${theme.pattern}”。`, py: `Héxīn jùxíng shì: "${theme.pattern}".`, en: `The key pattern is: "${theme.pattern}".`, uz: `Asosiy qolip: "${theme.pattern}".` },
      { speaker: 'B', cn: `明白了！我马上开始练习听力和发音。`, py: `Míngbai le! Wǒ mǎshàng kāishǐ liànxí tīnglì hé fāyīn.`, en: `Understood! I will practice listening and pronunciation right away.`, uz: `Tushundim! Hoziroq eshitish va talaffuz mashqini boshlayman.` }
    ],
    speakingTargets: [
      `你好！我们今天学习${theme.cn}`,
      `这个课的核心句型非常实用`,
      theme.pattern,
      `我喜欢每天坚持练习中文`,
      `谢谢老师，再见！`
    ],
    quizQuestions: [
      {
        id: 1,
        question: `What is the core meaning of “${theme.cn}”?`,
        options: [theme.en, 'Yesterday', 'Good morning', 'To eat breakfast'],
        correctIndex: 0,
        explanation: `“${theme.cn}” translates directly to “${theme.en}” (${theme.uz}).`
      },
      {
        id: 2,
        question: `Which sentence correctly represents the grammar pattern of Lesson ${theme.id}?`,
        options: [theme.pattern, '我很是昨天去。', '不什么有书。', '桌子上面很大在。'],
        correctIndex: 0,
        explanation: `The correct sentence pattern is: ${theme.pattern}`
      },
      {
        id: 3,
        question: `How do you say “thank you” in Mandarin?`,
        options: ['谢谢 (xièxie)', '再见 (zàijiàn)', '对不起 (duìbuqǐ)', '没关系 (méi guānxi)'],
        correctIndex: 0,
        explanation: '“谢谢” (xièxie) means thank you.'
      },
      {
        id: 4,
        question: `Choose the correct pinyin for “中国” (China):`,
        options: ['Zhōngguó', 'Běijīng', 'Shànghǎi', 'Měiguó'],
        correctIndex: 0,
        explanation: '“中国” is pronounced Zhōngguó.'
      },
      {
        id: 5,
        question: `What is the polite form of “you” in Chinese?`,
        options: ['您 (nín)', '你 (nǐ)', '他 (tā)', '我们 (wǒmen)'],
        correctIndex: 0,
        explanation: '“您” (nín) is the polite honorific pronoun for you.'
      },
      {
        id: 6,
        question: `Which word is an interrogative pronoun for quantity under 10?`,
        options: ['几 (jǐ)', '多少 (duōshao)', '怎么 (zěnme)', '什么 (shénme)'],
        correctIndex: 0,
        explanation: '“几” (jǐ) asks for small numbers/quantities.'
      },
      {
        id: 7,
        question: `What does “很高兴认识你” mean?`,
        options: ['Nice to meet you', 'How much does this cost?', 'Where are you going?', 'What time is it?'],
        correctIndex: 0,
        explanation: '很高兴认识你 = Nice to meet you (Tanishganimdan xursandman).'
      },
      {
        id: 8,
        question: `What does the character “学” represent?`,
        options: ['To study / learn', 'To eat', 'To run', 'To sleep'],
        correctIndex: 0,
        explanation: '学 (xué) means to study, learn, or science.'
      },
      {
        id: 9,
        question: `Select the sentence with natural Chinese word order:`,
        options: ['我明天在学校学习。', '我在明天学校学习。', '学习我在学校明天。', '学校我明天在学习。'],
        correctIndex: 0,
        explanation: 'Standard order: Subject (我) + Time (明天) + Place (在学校) + Action (学习).'
      },
      {
        id: 10,
        question: `How do you answer politely when someone says “谢谢你” (Thank you)?`,
        options: ['不客气 (bú kèqi)', '没关系 (méi guānxi)', '你好 (nǐ hǎo)', '再见 (zàijiàn)'],
        correctIndex: 0,
        explanation: '“不客气” (bú kèqi) means you are welcome.'
      }
    ],
    writingPrompts: [
      {
        id: 11,
        prompt: `Write one complete sentence using the lesson pattern: "${theme.pattern}".`,
        sampleAnswer: theme.pattern,
        pinyinSample: 'Wǒ xǐhuan xuéxí Zhōngwén.'
      },
      {
        id: 12,
        prompt: `Write the Chinese characters for: "I study Chinese every day."`,
        sampleAnswer: '我每天学习中文。',
        pinyinSample: 'Wǒ měitiān xuéxí Zhōngwén.'
      },
      {
        id: 13,
        prompt: `Write a friendly greeting and introduction in Chinese.`,
        sampleAnswer: '你好！我是学生，很高兴认识你。',
        pinyinSample: 'Nǐ hǎo! Wǒ shì xuésheng, hěn gāoxìng rènshi nǐ.'
      },
      {
        id: 14,
        prompt: `Form a question asking someone's name or age.`,
        sampleAnswer: '你叫什么名字？你多大了？',
        pinyinSample: 'Nǐ jiào shénme míngzi? Nǐ duō dà le?'
      },
      {
        id: 15,
        prompt: `Write pinyin with tones for today\'s key word: "${theme.cn}".`,
        sampleAnswer: `${theme.cn} (${theme.en} / ${theme.uz})`,
        pinyinSample: 'Zhù nǐ xuéxí jìnbù!'
      }
    ]
  };
});
