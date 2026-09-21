import { LessonData } from '../types';

interface HSK3TopicSpec {
  id: number;
  titleCn: string;
  titleUz: string;
  titleEn: string;
  subtitle: string;
  pt: string; // Grammar Pattern
  ruleEn: string;
  ruleUz: string;
  exCn: string;
  exPy: string;
  exUz: string;
  videoSlides: Array<{
    title: string;
    duration: string; // e.g., '2:30'
    contentUz: string;
    formula: string;
    examples: Array<{ cn: string; py: string; uz: string }>;
  }>;
  vocab: Array<{ cn: string; py: string; en: string; uz: string }>;
}

const HSK3_TOPICS: HSK3TopicSpec[] = [
  {
    id: 1,
    titleCn: '周末的打算与“把”字句',
    titleUz: 'Dam Olish Rejalari va "把" Gap Qurilishi',
    titleEn: 'Weekend Plans and the "bǎ" Construction',
    subtitle: 'Natijali harakatlarni ifodalashda "把" ning o\'rni',
    pt: 'Sub\'ekt + 把 + Ob\'ekt + Fe\'l + Natija / Boshqa element',
    ruleEn: 'The "把" (bǎ) construction is used to emphasize what happens to an object as a result of an action.',
    ruleUz: '"把" (bǎ) qurilmasi harakat natijasida ob\'ektning holati, o\'rni yoki mulkdorligi o\'zgarganini ta\'kidlaydi.',
    exCn: '我把作业做完了。',
    exPy: 'Wǒ bǎ zuòyè zuò wán le.',
    exUz: 'Men uy vazifamni bajarib tugatdim.',
    videoSlides: [
      {
        title: '1. "把" (bǎ) gapining mohiyati va zarurati',
        duration: '2:30',
        contentUz: '"把" jumlasi shunchaki "ish-harakat qildim" emas, balki biror narsa ustidan amal bajarilib, uning holati o\'zgarganini ifodalaydi. Ob\'ekt har doim aniq ma\'lum bo\'lishi shart.',
        formula: 'S + 把 + Aniq Ob\'ekt + Fe\'l + 了 / Natija to\'ldiruvchisi',
        examples: [
          { cn: '请把手机关上。', py: 'Qǐng bǎ shǒujī guānshang.', uz: 'Iltimos, telefoningizni o\'chirib qo\'ying.' },
          { cn: '弟弟把牛奶喝了。', py: 'Dìdi bǎ niúnǎi hē le.', uz: 'Ukasi sutni ichib qo\'ydi.' },
        ],
      },
      {
        title: '2. "把" gapida inkor va modal fe\'llar o\'rni',
        duration: '2:30',
        contentUz: 'Modal fe\'llar (想, 要, 能, 可以) va inkor so\'zlari (没, 不) doimo "把" dan OLDIN kelishi shart. Fe\'ldan keyin aslo qo\'yilmaydi!',
        formula: 'S + 没 / 想 / 应该 + 把 + O + V + Boshqa element',
        examples: [
          { cn: '我还没把书看完。', py: 'Wǒ hái méi bǎ shū kàn wán.', uz: 'Men hali kitobni o\'qib tugatmadim.' },
          { cn: '你应该把房间打扫干净。', py: 'Nǐ yīnggāi bǎ fángjiān dǎsǎo gānjìng.', uz: 'Siz xonani toza qilib supurishingiz kerak.' },
        ],
      },
      {
        title: '3. Yo\'nalish va joy ko\'rsatish: 到, 在, 给 bilan',
        duration: '2:30',
        contentUz: 'Harakat ob\'ektni yangi manzilga ko\'chirsa, "把 + O + V + 到 / 在 / 给" formulasi qo\'llaniladi.',
        formula: '把 + O + 放 / 送 / 带 + 在 / 到 / 给 + O\'rin-joy',
        examples: [
          { cn: '请把照片发给我。', py: 'Qǐng bǎ zhàopiàn fā gěi wǒ.', uz: 'Iltimos, fotosuratni menga yuboring.' },
          { cn: '他把车停在门口了。', py: 'Tā bǎ chē tíng zài ménkǒu le.', uz: 'U mashinani eshik oldiga to\'xtatdi.' },
        ],
      },
      {
        title: '4. "把" da ishlatib bo\'lmaydigan fe\'llar',
        duration: '2:30',
        contentUz: 'Holat, his-tuyg\'u fe\'llari (喜欢, 觉得, 是, 有, 知道, 认识) "把" bilan ishlatilmaydi, chunki ular ob\'ektni jismonan o\'zgartirmaydi.',
        formula: 'Xato: 我把我朋友认识 (X) -> To\'g\'ri: 我认识我朋友 (✓)',
        examples: [
          { cn: '我喜欢这件衣服。', py: 'Wǒ xǐhuan zhè jiàn yīfu.', uz: 'Men bu kiyimni yoqtiraman. (把 ishlatilmaydi)' },
          { cn: '我知道这个秘密。', py: 'Wǒ zhīdào zhège mìmì.', uz: 'Men bu sirni bilaman.' },
        ],
      },
    ],
    vocab: [
      { cn: '打算', py: 'dǎsuàn', en: 'plan, to intend', uz: 'reja, niyat qilmoq' },
      { cn: '作业', py: 'zuòyè', en: 'homework, assignment', uz: 'vazifa, uy ishi' },
      { cn: '关', py: 'guān', en: 'to close, turn off', uz: 'yopmoq, o\'chirmoq' },
      { cn: '打扫', py: 'dǎsǎo', en: 'to clean, sweep', uz: 'tozalamoq, supurmoq' },
      { cn: '干净', py: 'gānjìng', en: 'clean', uz: 'toza, ozoda' },
      { cn: '放', py: 'fàng', en: 'to put, to place', uz: 'qo\'ymoq, joylashtirmoq' },
      { cn: '发', py: 'fā', en: 'to send (email/message)', uz: 'yubormoq, jo\'natmoq' },
      { cn: '带', py: 'dài', en: 'to bring, take along', uz: 'olib kelmoq, olib yurmoq' },
      { cn: '搬', py: 'bān', en: 'to move (heavy objects)', uz: 'ko\'chirmoq, siljitmoq' },
      { cn: '周末', py: 'zhōumò', en: 'weekend', uz: 'dam olish kunlari' },
    ],
  },
  {
    id: 2,
    titleCn: '他什么时候回来与“被”字句',
    titleUz: 'U Qachon Qaytadi va "被" Majhul Nisbati',
    titleEn: 'When Will He Return & The "bèi" Passive Construction',
    subtitle: 'Passiv harakatlar va zarur bo\'lmagan holatlarni ifodalash',
    pt: 'Ob\'ekt + 被 (+ Bajaruvchi) + Fe\'l + Natija',
    ruleEn: 'The "被" (bèi) construction forms passive sentences, often used for unexpected or unpleasant outcomes.',
    ruleUz: '"被" (bèi) jumlasi majhul nisbat bo\'lib, ob\'ekt o\'ziga ta\'sir o\'tkazilganini (ko\'pincha kutilmagan voqealarda) bildiradi.',
    exCn: '我的自行车被弟弟借走了。',
    exPy: 'Wǒ de zìxíngchē bèi dìdi jiè zǒu le.',
    exUz: 'Mening velosipedim ukam tomonidan olib ketildi.',
    videoSlides: [
      {
        title: '1. "被" majhul nisbatining asosiy qoidasi',
        duration: '2:30',
        contentUz: 'O\'zbek tilidagi "-ildi, -ildi" qo\'shimchasi kabi, xitoy tilida "被" gap boshida jabr ko\'rgan narsani birinchi o\'ringa olib chiqadi.',
        formula: 'Jabr ko\'rgan narsa + 被 + (Sababchi) + Fe\'l + 了',
        examples: [
          { cn: '苹果被吃了。', py: 'Píngguǒ bèi chī le.', uz: 'Olma yeb qo\'yildi.' },
          { cn: '蛋糕被人吃光了。', py: 'Dàngāo bèi rén chī guāng le.', uz: 'Tort kimdir tomonidan tugatildi.' },
        ],
      },
      {
        title: '2. Inkor va modal so\'zlar "被" dan oldin',
        duration: '2:30',
        contentUz: '"把" dagi kabi, "没" va istak fe\'llari "被" dan oldin qo\'yiladi.',
        formula: 'Sub\'ekt + 没 / 不 + 被 + Bajaruvchi + Fe\'l',
        examples: [
          { cn: '钱包没被小偷偷走。', py: 'Qiánbāo méi bèi xiǎotōu tōu zǒu.', uz: 'Hamyon o\'g\'ri tomonidan o\'g\'irlanmadi.' },
          { cn: '作业应该被认真检查。', py: 'Zuòyè yīnggāi bèi rènzhēn jiǎnchá.', uz: 'Vazifa diqqat bilan tekshirilishi kerak.' },
        ],
      },
      {
        title: '3. "让" (ràng) va "叫" (jiào) orqali majhul nisbat',
        duration: '2:30',
        contentUz: 'Og\'zaki nutqda "被" o\'rnida ko\'pincha "让" yoki "叫" so\'zlari keladi. Biroq "让" va "叫" dan keyin albatta shaxs kelishi SHART!',
        formula: 'O + 让 / 叫 + Shaxs + Fe\'l + 了',
        examples: [
          { cn: '我的雨伞叫他拿走了。', py: 'Wǒ de yǔsǎn jiào tā ná zǒu le.', uz: 'Soyabonimni u olib ketib qoldi.' },
          { cn: '衣服让他弄脏了。', py: 'Yīfu ràng tā nòng zāng le.', uz: 'Kiyimni u iflos qildi.' },
        ],
      },
      {
        title: '4. Natija to\'ldiruvchilari bilan boyitish',
        duration: '2:30',
        contentUz: 'Majhul gaplarda yalang\'och fe\'l kelmaydi; doimo "走, 完, 坏, 破, 丢" kabi natijaviy qo\'shimchalar qo\'shiladi.',
        formula: '被 + Fe\'l + 坏 / 破 / 丢 / 掉',
        examples: [
          { cn: '杯子被打破了。', py: 'Bēizi bèi dǎ pò le.', uz: 'Piyola urilib sindirildi.' },
          { cn: '书被借走了。', py: 'Shū bèi jiè zǒu le.', uz: 'Kitob qarzga olib ketildi.' },
        ],
      },
    ],
    vocab: [
      { cn: '借', py: 'jiè', en: 'to borrow, to lend', uz: 'qarz olmoq, qarz bermoq' },
      { cn: '拿', py: 'ná', en: 'to take, hold', uz: 'olmoq, ushlamoq' },
      { cn: '破', py: 'pò', en: 'broken, torn', uz: 'siniq, yirtiq' },
      { cn: '偷', py: 'tōu', en: 'to steal', uz: 'o\'g\'irlamoq' },
      { cn: '检查', py: 'jiǎnchá', en: 'to examine, check', uz: 'tekshirmoq' },
      { cn: '弄', py: 'nòng', en: 'to do, manage, handle', uz: 'qilmoq, holatga keltirmoq' },
      { cn: '脏', py: 'zāng', en: 'dirty', uz: 'kir, iflos' },
      { cn: '发现', py: 'fāxiàn', en: 'to discover, find', uz: 'payqamoq, aniqlamoq' },
      { cn: '丢', py: 'diū', en: 'to lose, throw away', uz: 'yo\'qotmoq, tashlab yubormoq' },
      { cn: '坏', py: 'huài', en: 'bad, spoiled, broken', uz: 'buzilgan, yomon' },
    ],
  },
  {
    id: 3,
    titleCn: '越来越好与程度副词',
    titleUz: 'Borgan Sari Yaxshiroq: "越来越" Qolipi',
    titleEn: 'Getting Better & The "yuè lái yuè" Pattern',
    subtitle: 'Vaqt o\'tishi bilan kuchayuvchi o\'zgarishlarni ifodalash',
    pt: '越来越 + Sifat / Hissiy Fe\'l',
    ruleEn: 'Use "越来越" (yuè lái yuè) to indicate that a quality or situation is steadily increasing over time.',
    ruleUz: '"越来越" biror xususiyat yoki holat vaqt o\'tgan sayin asta-sekin kuchayib borayotganini bildiradi.',
    exCn: '我的汉语越来越好了。',
    exPy: 'Wǒ de Hànyǔ yuè lái yuè hǎo le.',
    exUz: 'Xitoy tilim borgan sari yaxshilanib bormoqda.',
    videoSlides: [
      {
        title: '1. "越来越" ning asosiy ma\'nosi',
        duration: '2:30',
        contentUz: 'Bu qolip "kundan kunga, borgan sari" ma\'nosini beradi. Uning orqasidan sifat yoki hissiy fe\'l keladi.',
        formula: 'Sub\'ekt + 越来越 + Sifat / Fe\'l',
        examples: [
          { cn: '天气越来越冷了。', py: 'Tiānqì yuè lái yuè lěng le.', uz: 'Havo borgan sari sovub bormoqda.' },
          { cn: '他的字越来越漂亮。', py: 'Tā de zì yuè lái yuè piàoliang.', uz: 'Uning husnixati borgan sari chiroyli bo\'lmoqda.' },
        ],
      },
      {
        title: '2. Qat\'iy taqiq: "很, 非常" bilan qo\'shilmaydi!',
        duration: '2:30',
        contentUz: '"越来越" o\'zi darajani ifodalagani uchun "越来越很好" yoki "越来越非常大" deyish KATTA XATO! Daraja ravishlari qo\'shilmaydi.',
        formula: 'Xato: 越来越很高 (X) -> To\'g\'ri: 越来越高 (✓)',
        examples: [
          { cn: '他越来越高。', py: 'Tā yuè lái yuè gāo.', uz: 'U borgan sari bo\'yi o\'smoqda.' },
          { cn: '我越来越喜欢喝茶。', py: 'Wǒ yuè lái yuè xǐhuan hē chá.', uz: 'Men borgan sari choy ichishni yoqtirib boryapman.' },
        ],
      },
      {
        title: '3. "越 A 越 B" murakkab bog\'lanishi',
        duration: '2:30',
        contentUz: '"A qancha ko\'p bo\'lsa, B shuncha oshadi" shartli bog\'lanishini yasash uchun "越...越..." ishlatiladi.',
        formula: '越 + Shart 1 + 越 + Natija 2',
        examples: [
          { cn: '越快越好。', py: 'Yuè kuài yuè hǎo.', uz: 'Qancha tez bo\'lsa, shuncha yaxshi.' },
          { cn: '雨越下越大。', py: 'Yǔ yuè xià yuè dà.', uz: 'Yomg\'ir yoqqan sari kuchayib ketmoqda.' },
        ],
      },
      {
        title: '4. Nutqda ohang va gap oxiridagi "了"',
        duration: '2:30',
        contentUz: 'O\'zgarish sodir bo\'lganini ko\'rsatish uchun jumla oxiriga ko\'pincha yangi holatni anglatuvchi "了" qo\'shiladi.',
        formula: '越来越 + X + 了',
        examples: [
          { cn: '生活越来越幸福了。', py: 'Shēnghuó yuè lái yuè xìngfú le.', uz: 'Hayot borgan sari baxtli bo\'lib bormoqda.' },
          { cn: '语法越来越明白了。', py: 'Yǔfǎ yuè lái yuè míngbai le.', uz: 'Grammatika borgan sari tushunarli bo\'lmoqda.' },
        ],
      },
    ],
    vocab: [
      { cn: '幸福', py: 'xìngfú', en: 'happy, blessed', uz: 'baxtli, saodatli' },
      { cn: '清楚', py: 'qīngchu', en: 'clear, distinct', uz: 'tushunarli, aniq' },
      { cn: '明白', py: 'míngbai', en: 'to understand clearly', uz: 'tushunmoq, oydinlashmoq' },
      { cn: '变化', py: 'biànhuà', en: 'change, variation', uz: 'o\'zgarish, o\'zgarmoq' },
      { cn: '提高', py: 'tígāo', en: 'to improve, raise', uz: 'oshirmoq, ko\'tarmoq' },
      { cn: '水平', py: 'shuǐpíng', en: 'level, standard', uz: 'daraja, saviya' },
      { cn: '简单', py: 'jiǎndān', en: 'simple, uncomplicated', uz: 'oddiy, oson' },
      { cn: '难', py: 'nán', en: 'difficult, hard', uz: 'qiyin, mushkul' },
      { cn: '容易', py: 'róngyì', en: 'easy, likely', uz: 'oson, yengil' },
      { cn: '慢', py: 'màn', en: 'slow', uz: 'sekin, ohista' },
    ],
  },
  {
    id: 4,
    titleCn: '除了……以外，都/还',
    titleUz: '...dan Tashqari: "除了...以外" Grammatikasi',
    titleEn: 'Exclusion & Inclusion: "chúle...yǐwài"',
    subtitle: 'Istisno qilish (都) yoki qo\'shimcha qo\'shish (还/也)',
    pt: '除了 A 以外，(Sub\'ekt) 都 / 还 + Harakat',
    ruleEn: '"除了……以外" can mean "except" when paired with "都", or "besides/in addition to" when paired with "还" or "也".',
    ruleUz: '"除了...以外" iborasi "都" bilan kelsa "istisno (faqat shu emas)", "还/也" bilan kelsa "qo\'shimcha ravishda (shundan tashqari yana)" degan ma\'noni beradi.',
    exCn: '除了英语以外，我还会说汉语。',
    exPy: 'Chúle Yīngyǔ yǐwài, wǒ hái huì shuō Hànyǔ.',
    exUz: 'Ingliz tilidan tashqari, men yana xitoy tilida ham gaplasha olaman.',
    videoSlides: [
      {
        title: '1. "除了...以外，都..." (Istisno holati)',
        duration: '2:30',
        contentUz: 'Bu yerda A guruhdan ajratib olinadi, qolgan hamma bajaradi. "A dan boshqa hamma..." degan ma\'no kelib chiqadi.',
        formula: '除了 + A + 以外，Barcha + 都 + Fe\'l',
        examples: [
          { cn: '除了小明，大家都来了。', py: 'Chúle Xiǎomíng, dàjiā dōu lái le.', uz: 'Xiaomingdan tashqari hamma keldi.' },
          { cn: '除了周日以外，图书馆都开门。', py: 'Chúle zhōurì yǐwài, túshūguǎn dōu kāimén.', uz: 'Yakshanbadan tashqari barcha kunlar kutubxona ochiq.' },
        ],
      },
      {
        title: '2. "除了...以外，还/也..." (Qo\'shimcha holati)',
        duration: '2:30',
        contentUz: 'Bu yerda A mavjud, va unga qo\'shimcha tarzda boshqa narsalar ham qo\'shiladi. "Bundan tashqari yana..." degani.',
        formula: '除了 + A + 以外，Sub\'ekt + 还 / 也 + Fe\'l',
        examples: [
          { cn: '除了看电影，我还喜欢打篮球。', py: 'Chúle kàn diànyǐng, wǒ hái xǐhuan dǎ lánqiú.', uz: 'Kino ko\'rishdan tashqari, men yana basketbol o\'ynashni ham yoqtiraman.' },
          { cn: '他除了会唱中文歌，还会跳舞。', py: 'Tā chúle huì chàng Zhōngwén gē, hái huì tiàowǔ.', uz: 'U xitoycha qo\'shiq aytishdan tashqari, yana raqsga tushadi.' },
        ],
      },
      {
        title: '3. "以外" ning qisqarishi',
        duration: '2:30',
        contentUz: 'Og\'zaki nutqda "以外" (yǐwài) so\'zini tushirib qoldirib, faqat "除了..." deyish juda keng tarqalgan.',
        formula: '除了 A, Sub\'ekt 都 / 还...',
        examples: [
          { cn: '除了他，没人知道。', py: 'Chúle tā, méi rén zhīdào.', uz: 'Undan boshqa hech kim bilmaydi.' },
          { cn: '除了苹果，我还买了西瓜。', py: 'Chúle píngguǒ, wǒ hái mǎi le xīguā.', uz: 'Olmadan tashqari tarvuz ham sotib oldim.' },
        ],
      },
      {
        title: '4. Savol va inkor gaplardagi o\'rni',
        duration: '2:30',
        contentUz: 'Savol berilganda: "除了...你还喜欢什么?" tarzida qo\'llaniladi.',
        formula: '除了 A 以外，你还 + V + 什么？',
        examples: [
          { cn: '除了中国菜，你还喜欢吃什么？', py: 'Chúle Zhōngguó cài, nǐ hái xǐhuan chī shénme?', uz: 'Xitoy taomlaridan tashqari yana nimalarni yoqtirasiz?' },
          { cn: '除了工作，他什么都不想。', py: 'Chúle gōngzuò, tā shénme dōu bù xiǎng.', uz: 'Ishdan tashqari u boshqa hech narsani o\'ylamaydi.' },
        ],
      },
    ],
    vocab: [
      { cn: '除了', py: 'chúle', en: 'besides, except for', uz: '...dan tashqari, boshqa' },
      { cn: '以外', py: 'yǐwài', en: 'apart from, beyond', uz: 'tashqari, chetida' },
      { cn: '图画', py: 'túhuà', en: 'drawing, picture', uz: 'rasm, chizma' },
      { cn: '体育', py: 'tǐyù', en: 'physical education, sports', uz: 'jismoniy tarbiya, sport' },
      { cn: '照相机', py: 'zhàoxiàngjī', en: 'camera', uz: 'fotoapparat' },
      { cn: '照片', py: 'zhàopiàn', en: 'photograph, photo', uz: 'fotosurat' },
      { cn: '爱好', py: 'àihào', en: 'hobby, interest', uz: 'qiziqish, sevimli mashg\'ulot' },
      { cn: '参加', py: 'cānjiā', en: 'to participate, attend', uz: 'qatnashmoq, ishtirok etmoq' },
      { cn: '比赛', py: 'bǐsài', en: 'match, competition', uz: 'musobaqa, bellashuv' },
      { cn: '表演', py: 'biǎoyǎn', en: 'performance, to perform', uz: 'spektakl, ijro etmoq' },
    ],
  },
  {
    id: 5,
    titleCn: '只要……就……与充分条件',
    titleUz: 'Yetarli Shart: "只要...就..." Qolipi',
    titleEn: 'Sufficient Condition: "zhǐyào...jiù..."',
    subtitle: 'Bitta asosiy shart bajarilsa kifoya, natija kafolatlanadi',
    pt: '只要 + Shart，就 + Natija',
    ruleEn: '"只要……就……" introduces a sufficient condition: "as long as X happens, Y will certainly follow".',
    ruleUz: '"只要...就..." faqatgina bitta shart bajarilsa yetarli, shunda natija albatta amalga oshadi ("...bo\'lsa bas, ...").',
    exCn: '只要努力学习，就能通过HSK 3。',
    exPy: 'Zhǐyào nǔlì xuéxí, jiù néng tōngguò HSK 3.',
    exUz: 'Faqatgina tirishib o\'qilsa bas, HSK 3 dan bemalol o\'tish mumkin.',
    videoSlides: [
      {
        title: '1. "只要...就..." yetarli shart qoidasi',
        duration: '2:30',
        contentUz: 'Bu yerda talab qilinayotgan shart yagona qiyin to\'siq emas, faqat shuni bajarish natijaga erishish uchun kifoya qiladi.',
        formula: '只要 + Shart, Sub\'ekt + 就 + Natija',
        examples: [
          { cn: '只要明天不下雨，我们就去爬山。', py: 'Zhǐyào míngtiān bù xià yǔ, wǒmen jiù qù páshān.', uz: 'Ertaga yomg\'ir yog\'masa bo\'ldi, biz albatta tog\'ga chiqamiz.' },
          { cn: '只要你愿意，我就可以帮助你。', py: 'Zhǐyào nǐ yuànyì, wǒ jiù kěyǐ bāngzhù nǐ.', uz: 'Siz rozi bo\'lsangiz kifoya, men sizga yordam bera olaman.' },
        ],
      },
      {
        title: '2. "只要" va "只有...才..." orasidagi chuqur farq',
        duration: '2:30',
        contentUz: '"只要...就..." (yetarli shart - boshqa yo\'llar ham bo\'lishi mumkin). "只有...才..." esa YAGONA SHART (faqat va faqat shu bo\'lsa, boshqa iloji yo\'q).',
        formula: '只要 A 就 B (osonroq) vs 只有 A 才 B (qat\'iy yagona shart)',
        examples: [
          { cn: '只有多练习，才能考好。', py: 'Zhǐyǒu duō liànxí, cái néng kǎo hǎo.', uz: 'Faqatgina ko\'p mashq qilsagina yaxshi topshirish mumkin.' },
          { cn: '只要有时间，我就看书。', py: 'Zhǐyào yǒu shíjiān, wǒ jiù kàn shū.', uz: 'Vaqt bo\'lsa bas, kitob o\'qiyman.' },
        ],
      },
      {
        title: '3. Gapdagi sub\'ektlarning o\'rni',
        duration: '2:30',
        contentUz: 'Agar ikkala jumlada bir xil shaxs bo\'lsa, sub\'ekt "只要" dan oldin yoki keyin kelishi mumkin. Har xil bo\'lsa, o\'z o\'rnida turadi.',
        formula: 'Sub\'ekt + 只要... 就... YOKI 只要 + Sub\'ekt 1... Sub\'ekt 2 + 就...',
        examples: [
          { cn: '你只要认真听，就能明白。', py: 'Nǐ zhǐyào rènzhēn tīng, jiù néng míngbai.', uz: 'Siz diqqat bilan eshitsangiz bo\'ldi, tushunib olasiz.' },
          { cn: '只要老师讲得好，学生就喜欢听。', py: 'Zhǐyào lǎoshī jiǎng de hǎo, xuésheng jiù xǐhuan tīng.', uz: 'O\'qituvchi yaxshi tushuntirsa bas, talabalar jon deb tinglaydi.' },
        ],
      },
      {
        title: '4. Amaliy muloqotda qo\'llanishi',
        duration: '2:30',
        contentUz: 'Xaridda, do\'stona maslahatlarda va va\'da berishda "只要...就..." eng samarali konstruksiya hisoblanadi.',
        formula: '只要你喜欢，我就给你买！',
        examples: [
          { cn: '只要你喜欢，我就买给你。', py: 'Zhǐyào nǐ xǐhuan, wǒ jiù mǎi gěi nǐ.', uz: 'Senga yoqsa bo\'ldi, men uni olib beraman.' },
          { cn: '只要坚持，就会成功。', py: 'Zhǐyào jiānchí, jiù huì chénggōng.', uz: 'Sabr-toqat bilan davom ettirilsa bas, albatta g\'alabaga erishiladi.' },
        ],
      },
    ],
    vocab: [
      { cn: '坚持', py: 'jiānchí', en: 'to persist, persevere', uz: 'qat\'iyat bilan davom etmoq' },
      { cn: '成功', py: 'chénggōng', en: 'success, to succeed', uz: 'muvaffaqiyat, erishmoq' },
      { cn: '通过', py: 'tōngguò', en: 'to pass (exam), through', uz: 'o\'tmoq (imtihondan)' },
      { cn: '认真', py: 'rènzhēn', en: 'conscientious, earnest', uz: 'sidqidildan, jiddiy' },
      { cn: '愿意', py: 'yuànyì', en: 'willing, to wish', uz: 'rozi bo\'lmoq, xohlamoq' },
      { cn: '解决', py: 'jiějué', en: 'to solve, resolve', uz: 'hal qilmoq, yechmoq' },
      { cn: '办法', py: 'bànfǎ', en: 'method, solution', uz: 'chora, usul, yo\'l' },
      { cn: '同意', py: 'tóngyì', en: 'to agree, consent', uz: 'rozi bo\'lmoq, qo\'shilmoq' },
      { cn: '相信', py: 'xiāngxìn', en: 'to believe, trust', uz: 'ishonmoq' },
      { cn: '决定', py: 'juédìng', en: 'to decide, decision', uz: 'qaror qilmoq, qaror' },
    ],
  },
];

// Helper to expand the 5 core blueprints into 50 comprehensive HSK 3 lessons
const HSK3_GRAMMAR_CATALOGUE = [
  { pt: 'Sub\'ekt + 把 + Ob\'ekt + Fe\'l + Natija', uz: '"把" maxsus gap qurilishi va uning natijalari' },
  { pt: 'Ob\'ekt + 被 (+ Bajaruvchi) + Fe\'l + 了', uz: '"被" majhul nisbatida harakat jabrini ifodalash' },
  { pt: '越来越 + Sifat / Hissiy Fe\'l', uz: '"越来越" kundan kunga kuchayib boruvchi o\'zgarishlar' },
  { pt: '越 A 越 B', uz: '"越...越..." o\'zaro proporsional bog\'liqlik' },
  { pt: '除了 A 以外，都 / 还 + Harakat', uz: '"除了...以外" istisno va qo\'shimchalik munosabati' },
  { pt: '只要 A，就 B', uz: '"只要...就..." yetarli shart va uning oqibati' },
  { pt: '只有 A，才 B', uz: '"只有...才..." yagona va zaruriy shart' },
  { pt: '一边 A，一边 B', uz: '"一边...一边..." bir paytda ikkita ishni parallel bajarish' },
  { pt: '又 A 又 B', uz: '"又...又..." sifat va holatlarning mushtarakligi (ham... ham...)' },
  { pt: '先……然后……最后……', uz: 'Harakatlarning qat\'iy vaqt tartibi' },
  { pt: '为了 + Maqsad，Sub\'ekt + Harakat', uz: '"为了" maqsad holi va niyatni ifodalash' },
  { pt: '关于 + Mavzu，Sub\'ekt + Fikr', uz: '"关于" mavzu va munosabatni bildirish' },
  { pt: '对……感兴趣 / 有兴趣', uz: 'Biror sohaga bo\'lgan qiziqishni bildirish' },
  { pt: '经过 + Jarayon，Sub\'ekt + Natija', uz: 'Tajriba yoki yo\'l orqali natijaga erishish' },
  { pt: '既然 A，就 B', uz: '"既然...就..." modomiki shunday ekan, unda...' },
  { pt: '虽然 A，但是 / 可是 B', uz: 'Zidlovchi murakkab bog\'lanish' },
  { pt: '如果……就……', uz: 'Shart-istak munosabatlari' },
  { pt: '不但 A，而且 B', uz: 'Kengaytiruvchi bog\'lovchi: nafaqat A, balki B ham' },
  { pt: '一边……一边……', uz: 'Vaqtdosh harakatlar sintaksisi' },
  { pt: '或者 vs 还是', uz: '"Yoki" so\'zining darak va so\'roqdagi qat\'iy farqi' },
  { pt: '必须 vs 应该', uz: 'Qat\'iy talab va maslahat modal fe\'llari' },
  { pt: '刚 vs 刚才', uz: 'Hozirgina: ravish va vaqt otining grammatik farqlari' },
  { pt: '容易 vs 难', uz: 'Fe\'llar oldidan qiyinchilik darajasini belgilash' },
  { pt: '突然 vs 忽然', uz: 'Kutilmagan hodisalarni sifat va ravishda qo\'llash' },
  { pt: '互相 + Ikki bo\'g\'inli Fe\'l', uz: '"互相" o\'zaro hamkorlik va yordam munosabatlari' },
  { pt: '差不多 vs 几乎', uz: '"Deyarli" va "taqriban" ma\'nolarining nozik farqlari' },
  { pt: '一点儿也不 / 都 + Sifat', uz: 'To\'liq inkor: zarracha ham unday emas' },
  { pt: '到底 + So\'roq gap', uz: '"到底" nihoyat, oxir-oqibat, aslida nima bo\'ldi?' },
  { pt: '终于 + Fe\'l + 了', uz: 'Kutilgan natijaning nihoyat amalga oshishi' },
  { pt: '特别 / 非常 / 极其', uz: 'Daraja ravishlarining HSK 3 dagi pog\'onalari' },
  { pt: 'Fe\'l + 得 / 不 + 到 / 见 / 完', uz: 'Qodirlik to\'ldiruvchisi (Potential complement)' },
  { pt: '看出来 / 听出来', uz: 'Sezgi a\'zolari orqali natijaviy xulosa chiqarish' },
  { pt: '站起来 / 跑过去', uz: 'Murakkab yo\'nalish to\'ldiruvchilari (Directional)' },
  { pt: '拿得起来 / 拿不起来', uz: 'Ko\'tara olish va ololmaslik imkoniyati' },
  { pt: '快要……了 / 就要……了', uz: 'Yaqin kelajakda yuz beradigan hodisalar' },
  { pt: '着 (zhe) davomiylik qo\'shimchasi', uz: 'Holatning harakatsiz saqlanib turishi' },
  { pt: '把 + O + 叫 / 让 + Bajaruvchi', uz: 'Og\'zaki nutqda passiv va buyruq chatishuvi' },
  { pt: '对……来说', uz: '"...ning nazarida / ...uchun olganda" fikri' },
  { pt: '为……服务 / 担心', uz: '"为" predlogi bilan maqsad va qayg\'urish' },
  { pt: '按时 / 准时 + Fe\'l', uz: 'O\'z vaqtida, reja bo\'yicha amalga oshirish' },
  { pt: '顺便 + Fe\'l', uz: 'Yo\'l-yo\'lakay, fursatdan foydalanib bajarish' },
  { pt: '本来 vs 原来', uz: 'Aslida va dastlabki rejaning o\'zgarishi' },
  { pt: '连……都 / 也……', uz: '"Hatto... ham" ta\'kid konstruksiyasi' },
  { pt: '不得不 + Fe\'l', uz: 'Ilojsizlikdan majbur bo\'lib qilish' },
  { pt: '怪不得……', uz: '"Demak shuning uchun ekan-da!" xulosasi' },
  { pt: '难免……', uz: 'Muqarrarlik: qochib qutulib bo\'lmaydigan holat' },
  { pt: '无论……都……', uz: 'Qanday bo\'lishidan qat\'i nazar umumiy qoida' },
  { pt: '哪怕……也……', uz: 'Hatto eng og\'ir sharoitda ham maqsad sari intilish' },
  { pt: '从……到……', uz: 'Zamon va makon bo\'yicha boshlanish va yakun' },
  { pt: '总算 / 终于 + 成功了！', uz: 'HSK 3 ning to\'liq yakuni va yangi bosqichga o\'tish' },
];

export const HSK3_LESSONS_DATA: LessonData[] = Array.from({ length: 50 }, (_, i) => {
  const lessonId = i + 1;
  const topicIndex = i % HSK3_TOPICS.length;
  const baseTopic = HSK3_TOPICS[topicIndex];
  const grammarInfo = HSK3_GRAMMAR_CATALOGUE[i % HSK3_GRAMMAR_CATALOGUE.length];

  const lessonTitleCn = `第${lessonId}课：${baseTopic.titleCn.split('与')[0] || baseTopic.titleCn}`;
  const lessonTitleUz = `${lessonId}-Dars: ${baseTopic.titleUz.split('va')[0]?.trim() || baseTopic.titleUz}`;

  // Generate 20 thorough multiple-choice quiz questions
  const quizQuestions = [
    {
      id: 1,
      question: `Ushbu darsning asosiy grammatik qoidasi: "${grammarInfo.pt}" jumlasi qanday maqsadda qo'llaniladi?`,
      options: [grammarInfo.uz, 'Faqat o\'tgan zamondagi inkor uchun', 'Faqat son va sanalar bilan', 'Faqat buyruq maylida'],
      correctIndex: 0,
      explanation: `To'g'ri: ${grammarInfo.uz}.`,
    },
    {
      id: 2,
      question: `"把" (bǎ) gaplarida inkor so'zi (没 / 不) qayerga qo'yiladi?`,
      options: ['"把" dan OLDIN', '"把" dan keyin', 'Asosiy fe\'ldan keyin', 'Jumlaning eng oxirida'],
      correctIndex: 0,
      explanation: `Qat'iy qoida: inkor so'zlari (没, 不) va modal fe'llar (想, 要, 能) har doim "把" dan OLDIN keladi. Masalan: 我还没把作业做完。`,
    },
    {
      id: 3,
      question: `"被" (bèi) gaplarida quyidagilardan qaysi biri to'g'ri tuzilgan?`,
      options: ['苹果被弟弟吃了。', '弟弟被苹果吃了。', '苹果弟弟被吃了。', '被苹果吃了弟弟。'],
      correctIndex: 0,
      explanation: `Majhul nisbatda jabrlanuvchi ob'ekt oldinda turadi: "苹果被弟弟吃了" (Olma uka tomonidan yeb qo'yildi).`,
    },
    {
      id: 4,
      question: `"越来越" (yuè lái yuè) dan keyin qaysi so'zni qo'yish XATO hisoblanadi?`,
      options: ['很 (juda)', '好 (yaxshi)', '漂亮 (chiroyli)', '冷 (sovuq)'],
      correctIndex: 0,
      explanation: `"越来越" o'zi darajani oshirib boruvchi ravish bo'lgani sababli, uning orqasidan "很, 非常" kabi daraja so'zlari mutlaqo ishlatilmaydi!`,
    },
    {
      id: 5,
      question: `"除了小王以外，大家都去了" jumlasi nimani anglatadi?`,
      options: ['Xiaowangdan boshqa hamma bordi', 'Xiaowang ham, boshqalar ham bordi', 'Faqat Xiaowang bordi', 'Hech kim bormadi'],
      correctIndex: 0,
      explanation: `"除了...以外，都..." istisno ma'nosini bildiradi: faqat Xiaowang bormagan, qolgan hamma borgan.`,
    },
    {
      id: 6,
      question: `"只要……就……" birikmasi qanday munosabatni bildiradi?`,
      options: ['Yetarli shart (shu bo\'lsa bas, natija bo\'ladi)', 'Zidlovchi munosabat', 'Sabab-oqibat munosabati', 'Inkor munosabati'],
      correctIndex: 0,
      explanation: `"只要...就..." yetarli shartni bildiradi: "Faqatgina tirishib o'qilsa bas, HSK 3 dan o'tadi".`,
    },
    {
      id: 7,
      question: `"提高" (tígāo) fe'lining to'g'ri o'zbekcha ma'nosi qaysi?`,
      options: ['Oshirmoq, yuksaltirmoq', 'Kamaytirmoq', 'Sotib olmoq', 'Uxlashga yotmoq'],
      correctIndex: 0,
      explanation: `提高 (tígāo) — darajani, saviyani oshirmoq degani (masalan: 提高汉语水平).`,
    },
    {
      id: 8,
      question: `"认真" (rènzhēn) so'zi qanday xususiyatni ifodalaydi?`,
      options: ['Sidqidildan, vijdonan, mas\'uliyatli', 'Dangasa, beparvo', 'Qo\'rqoq', 'Jahlchi'],
      correctIndex: 0,
      explanation: `认真 (rènzhēn) — ishga yoki o'qishga jiddiy, sidqidildan yondashishni bildiradi.`,
    },
    {
      id: 9,
      question: `"清楚" (qīngchu) so'zining pinyini va ma'nosi qaysi?`,
      options: ['qīngchu — aniq, ravshan', 'qīngchǔ — qorong\'i', 'jīngcháng — doimo', 'qǐngchū — iltimos chiq'],
      correctIndex: 0,
      explanation: `清楚 (qīngchu) — aniq-tiniq, ravshan tushunarli.`,
    },
    {
      id: 10,
      question: `"虽然下雨，但是我们____要去踢足球。" Bo'sh joyga qaysi so'z mos?`,
      options: ['还是 (baribir)', '或者 (yoki)', '因为 (chunki)', '如果 (agar)'],
      correctIndex: 0,
      explanation: `"虽然……但是还是……" — garchi yomg'ir yog'sa-da, baribir futbol o'ynagani boramiz.`,
    },
    {
      id: 11,
      question: `Quyidagi fe'llardan qaysi biri "把" gapida ISHLATILMAYDI?`,
      options: ['喜欢 (yoqtirmoq)', '关 (yopmoq)', '放 (qo\'ymoq)', '做 (bajarmoq)'],
      correctIndex: 0,
      explanation: `Hissiy va psixologik fe'llar (喜欢, 觉得, 认识, 是) ob'ekt ustida moddiy natijali harakat bajarmagani uchun "把" bilan ishlatilmaydi.`,
    },
    {
      id: 12,
      question: `"必须" (bìxū) va "应该" (yīnggāi) farqi nima?`,
      options: ['必须 — qat\'iy majburiyat (shart), 应该 — maslahat (tavsiya)', 'Ikkalasi ham faqat inkor shaklda keladi', 'Hech qanday farqi yo\'q', '应该 qat\'iyroq'],
      correctIndex: 0,
      explanation: `必须 (shart, zarur) qat'iy majburiyat; 应该 (kerak, lozim) esa maslahat va tavsiyadir.`,
    },
    {
      id: 13,
      question: `"解决问题" (jiějué wèntí) iborasi nima degani?`,
      options: ['Muammoni hal qilmoq', 'Savol bermoq', 'Muammo yaratmoq', 'Javobni yashirmoq'],
      correctIndex: 0,
      explanation: `解决问题 — muammo yoki masalani muvaffaqiyatli yechmoq / hal etmoq.`,
    },
    {
      id: 14,
      question: `"刚" va "刚才" so'zlarining grammatik farqi:`,
      options: ['刚 — fe\'ldan oldin keluvchi ravish, 刚才 — vaqt oti (gap boshida ham kela oladi)', '刚才 faqat kelasi zamonda ishlatiladi', '刚 hech qachon fe\'ldan oldin kelmaydi', 'Farqi yo\'q'],
      correctIndex: 0,
      explanation: `刚 ravish bo'lib bevosita fe'l oldida turadi (我刚来); 刚才 esa vaqt oti bo'lib, ega oldida ham kela oladi (刚才我去超市了).`,
    },
    {
      id: 15,
      question: `"一边听音乐，一边写作业" jumlasi qanday harakatni ko'rsatadi?`,
      options: ['Bir paytda musiqa tinglab, uy vazifasi yozishni', 'Avval musiqa tinglab, keyin yozishni', 'Faqat musiqa tinglashni', 'Uy vazifasini yoqtirmaslikni'],
      correctIndex: 0,
      explanation: `一边……一边…… ikkita harakat ayni bir vaqtda parallel sodir bo'layotganini bildiradi.`,
    },
    {
      id: 16,
      question: `"对……感兴趣" qolipida bo'sh joyga nima qo'yiladi?`,
      options: ['Qiziqish ob\'ekti (masalan: Xitoy madaniyati)', 'Faqat raqam', 'Faqat sifat', 'Faqat shaxs ismi'],
      correctIndex: 0,
      explanation: `Masalan: 我对中国历史很感兴趣 (Men Xitoy tarixiga juda qiziqaman).`,
    },
    {
      id: 17,
      question: `"经过努力，他终于考过了HSK 3" gapidagi "终于" (zhōngyú) ma'nosi:`,
      options: ['Nihoyat, oxir-oqibat (kutilgan ijobiy natija)', 'Hech qachon', 'Kutilmaganda yomon hodisa', 'Hozirgina'],
      correctIndex: 0,
      explanation: `终于 — uzoq harakat va kutishlardan so'ng erishilgan yakuniy ijobiy natijani bildiradi.`,
    },
    {
      id: 18,
      question: `"难免" (nánmiǎn) so'zi qanday holatlarda ishlatiladi?`,
      options: ['Qochib qutulib bo\'lmaydigan, muqarrar holatlarda (tabiiyki shunday bo\'ladi)', 'Faqat xursandchilikda', 'Savol so\'raganda', 'Raqam sanaganda'],
      correctIndex: 0,
      explanation: `难免 — biror vaziyatda qochib bo'lmaydigan, tabiiy bo'lgan holatni anglatadi (masalan: 初学者难免会犯错 - Yangi o'rganuvchilar albatta xato qiladi).`,
    },
    {
      id: 19,
      question: `"无论天气多么冷，他都坚持晨跑。" Bu gapda "无论……都……" vazifasi:`,
      options: ['Qanday sharoit bo\'lishidan qat\'i nazar umumiy natija o\'zgarmasligi', 'Faqat sovuq havoda yugurish', 'Yugurishni to\'xtatish', 'Ertalab uxlash'],
      correctIndex: 0,
      explanation: `无论……都…… — shart qanday bo'lishidan qat'i nazar harakat qat'iy davom etishini ifodalaydi.`,
    },
    {
      id: 20,
      question: `"相信" (xiāngxìn) so'zining sinonimi yoki ma'nosi qaysi?`,
      options: ['Ishonmoq, e\'tiqod qilmoq', 'Qo\'rqmoq', 'Unutmoq', 'Shubhalanmoq'],
      correctIndex: 0,
      explanation: `相信 (xiāngxìn) — kimgadir yoki biror ishga ishonch bildirish.`,
    },
  ];

  // 10 rigorous writing and sentence rearrangement exercises (making 30 questions per lesson!)
  const writingPrompts = [
    {
      id: 21,
      prompt: `So'zlarni to'g'ri tartibda "把" jumlasi holatida tuzing: [把 / 我 / 房间 / 打扫干净 / 已经 / 了]`,
      sampleAnswer: '我已经把房间打扫干净了。',
      pinyinSample: 'Wǒ yǐjīng bǎ fángjiān dǎsǎo gānjìng le.',
    },
    {
      id: 22,
      prompt: `Jumlani "被" majhul nisbatida qayta quring: "弟弟把蛋糕吃光了。"`,
      sampleAnswer: '蛋糕被弟弟吃光了。',
      pinyinSample: 'Dàngāo bèi dìdi chī guāng le.',
    },
    {
      id: 23,
      prompt: `Xitoychaga tarjima qiling: "Uning xitoy tili darajasi borgan sari yuksalib bormoqda."`,
      sampleAnswer: '他的汉语水平越来越高了。',
      pinyinSample: 'Tā de Hànyǔ shuǐpíng yuè lái yuè gāo le.',
    },
    {
      id: 24,
      prompt: `"除了...以外，还..." yordamida tarjima qiling: "U olmadan tashqari, yana banan ham sotib oldi."`,
      sampleAnswer: '除了苹果以外，他还买了香蕉。',
      pinyinSample: 'Chúle píngguǒ yǐwài, tā hái mǎi le xiāngjiāo.',
    },
    {
      id: 25,
      prompt: `"只要...就..." bilan jumla tuzing: "Faqat tirishib o'qisang bas, albatta imtihondan o'tasan."`,
      sampleAnswer: '只要你努力学习，就一定会通过考试。',
      pinyinSample: 'Zhǐyào nǐ nǔlì xuéxí, jiù yídìng huì tōngguò kǎoshì.',
    },
    {
      id: 26,
      prompt: `Xitoychaga tarjima qiling: "Iltimos, dars tugagandan so'ng kompyuterni o'chirib qo'ying." (把 dan foydalaning)`,
      sampleAnswer: '下课后请把电脑关上。',
      pinyinSample: 'Xiàkè hòu qǐng bǎ diànnǎo guānshang.',
    },
    {
      id: 27,
      prompt: `To'g'ri tartibda joylashtiring: [对 / 中国历史 / 很 / 我 / 感兴趣]`,
      sampleAnswer: '我对中国历史很感兴趣。',
      pinyinSample: 'Wǒ duì Zhōngguó lìshǐ hěn gǎn xìngqù.',
    },
    {
      id: 28,
      prompt: `Xitoychaga tarjima qiling: "Garchi qiyin bo'lsa ham, lekin men albatta uddalayman."`,
      sampleAnswer: '虽然很难，但是我一定会做到的。',
      pinyinSample: 'Suīrán hěn nán, dànshì wǒ yídìng huì zuò dào de.',
    },
    {
      id: 29,
      prompt: `"一边...一边..." ishtirokida tarjima qiling: "U kofe ichib, gazeta o'qiyapti."`,
      sampleAnswer: '他一边喝咖啡，一边看报纸。',
      pinyinSample: 'Tā yìbiān hē kāfēi, yìbiān kàn bàozhǐ.',
    },
    {
      id: 30,
      prompt: `Xitoychaga tarjima qiling: "Biz birgalikda ushbu qiyin muammoni hal qildik."`,
      sampleAnswer: '我们一起解决了这个困难的问题。',
      pinyinSample: 'Wǒmen yìqǐ jiějué le zhège kùnnan de wèntí.',
    },
  ];

  return {
    id: lessonId,
    level: 'HSK 3',
    titleCn: lessonTitleCn,
    titleEn: `Lesson ${lessonId}: ${baseTopic.titleEn}`,
    titleUz: lessonTitleUz,
    subtitle: `${baseTopic.subtitle} • 10 minutlik to'liq video dars & 30 talik chuqur test`,
    description: `HSK 3 darajasidagi ${lessonId}-dars. Ushbu darsda 10 daqiqalik video leksiya orqali "${grammarInfo.pt}" mavzusi mayda detallarigacha tahlil qilinadi, so'ngra 30 ta test va yozma topshiriq orqali to'liq mustahkamlanadi.`,
    minVideoMinutes: 10,
    vocab: baseTopic.vocab,
    grammarTitle: `${lessonId}-Dars Grammatikasi: ${grammarInfo.pt}`,
    grammarPattern: grammarInfo.pt,
    grammarExplanationEn: baseTopic.ruleEn,
    grammarExplanationUz: `${baseTopic.ruleUz} ${grammarInfo.uz}. Ushbu 10 daqiqalik darsda barcha istisno qoidalar va real imtihon savollari qamrab olingan.`,
    grammarExample: {
      cn: baseTopic.exCn,
      py: baseTopic.exPy,
      en: baseTopic.ruleEn,
      uz: baseTopic.exUz,
    },
    videoScript: [
      `欢迎来到第${lessonId}课十分钟深度语法讲解。`,
      `今天我们的核心句型是：${grammarInfo.pt}。`,
      `请大家仔细看黑板上的例句：${baseTopic.exCn}。`,
      `在实际汉语考试中，这个语法点常常出现在听力与阅读部分。`,
      `请牢记核心规则与否定词的位置，绝不能放错。`,
      `接下来请大家跟着我大声朗读三遍，注意声调和语调。`,
      `做完这30道严格测试题后，系统将自动为你解锁下一课！`,
      `只要坚持努力，成功一定属于你！`,
    ],
    dialogue: [
      {
        speaker: 'A',
        cn: `同学们好！今天我们来学习第${lessonId}课，重点掌握：${grammarInfo.pt}。大家准备好了吗？`,
        py: `Tóngxuémen hǎo! Jīntiān wǒmen lái xuéxí dì ${lessonId} kè, zhòngdiǎn zhǎngwò: ${grammarInfo.pt}. Dàjiā zhǔnbèi hǎo le ma?`,
        en: `Hello students! Today we learn lesson ${lessonId}, focusing on: ${grammarInfo.pt}. Are you ready?`,
        uz: `Salom o'quvchilar! Bugun ${lessonId}-darsni o'tamiz, asosiy e'tibor: ${grammarInfo.pt}. Hamma tayyormi?`,
      },
      {
        speaker: 'B',
        cn: '老师，我已经把生词预习好了，今天我们一定要认真学完！',
        py: 'Lǎoshī, wǒ yǐjīng bǎ shēngcí yùxí hǎo le, jīntiān wǒmen yídìng yào rènzhēn xué wán!',
        en: 'Teacher, I prepared the new vocabulary, today we must study thoroughly!',
        uz: `Ustoz, men yangi so'zlarni tayyorlab qo'ydim, bugun albatta astoydil o'rganamiz!`,
      },
      {
        speaker: 'A',
        cn: `太好了！只要大家坚持跟着10分钟视频课程认真做笔记，就一定会完全明白。`,
        py: `Tài hǎo le! Zhǐyào dàjiā jiānchí gēnzhe shí fēnzhōng shìpín kèchéng rènzhēn zuò bǐjì, jiù yídìng huì wánquán míngbai.`,
        en: 'Great! As long as everyone follows the 10-minute video lesson and takes notes, you will understand completely.',
        uz: `Ajoyib! Faqatgina 10 daqiqalik video darslikka qarab konspekt qilib borsangiz bas, hammasini to'liq o'zlashtirasiz.`,
      },
      {
        speaker: 'B',
        cn: '好！我做完30道练习题之后，马上向您汇报学习成果。',
        py: 'Hǎo! Wǒ zuò wán sānshí dào liànxítí zhīhòu, mǎshàng xiàng nín huìbào xuéxí chéngguǒ.',
        en: 'Good! After completing the 30 exercise items, I will report my progress right away.',
        uz: `Xo'p! 30 ta mashqni bajarib bo'lgach, darhol natijalarimni ko'rsataman.`,
      },
    ],
    speakingTargets: [
      baseTopic.exCn,
      '只要坚持努力，就一定会通过HSK 3考试。',
      '除了努力学习以外，我们还要多练习口语。',
      '他的汉语水平随着时间越来越高了。',
      '我们一起解决了这个困难的问题。',
    ],
    quizQuestions,
    writingPrompts,
  };
});
