import { ActivityItem, Language, UrgentAppeal } from '../types';

export const CLUB_META = {
  name: 'النادي الخيري رفقاء الخير',
  shortName: 'رفقاء الخير',
  location: 'بلدية حمادي، ولاية بومرداس - الجزائر',
  addressFull: 'مقر النادي الخيري رفقاء الخير، وسط بلدية حمادي، ولاية بومرداس 35008',
  headerImage: '/images/header-bg.jpg',
  logoImage: '/images/club-logo.jpg',
  pwaIcon: '/images/club-logo-192.png',
  officialUrl: 'https://one-pied-80.vercel.app/',
  facebookUrl: 'https://www.facebook.com/search/top?q=%D8%A7%D9%84%D9%86%D8%A7%D8%AF%D9%8A%20%D8%A7%D9%84%D8%AE%D9%8A%D8%B1%D9%8A%20%D8%B1%D9%81%D9%82%D8%A7%D8%A1%20%D8%A7%D9%84%D8%AE%D9%8A%D8%B1',
  phoneNumbers: [
    { label: 'اتصل: 0561155377', raw: '0561155377', intl: '+213561155377' },
    { label: 'اتصل: 0556947249', raw: '0556947249', intl: '+213556947249' },
  ],
  receptionHours: 'يومياً ما عدا الجمعة من 09:00 صباحاً إلى 17:00 مساءً',
};

export const getPublicAppUrl = (): string => {
  if (typeof window !== 'undefined' && window.location.hostname) {
    if (!window.location.hostname.includes('localhost') && !window.location.hostname.includes('run.app')) {
      return window.location.href;
    }
  }
  return CLUB_META.officialUrl;
};

export const TRANSLATIONS: Record<Language, {
  clubTitle: string;
  clubSubtitle: string;
  welcomeIntro: string;
  tabHome: string;
  tabActivities: string;
  tabContact: string;
  shortcutActivities: string;
  shortcutContact: string;
  shortcutRequestAid: string;
  shortcutVolunteer: string;
  shortcutZakat: string;
  howToContributeTitle: string;
  howToContributeDesc: string;
  donateButton: string;
  contactOfficeTitle: string;
  contactOfficeDesc: string;
  urgentAppealsTitle: string;
  followFbTitle: string;
  followFbDesc: string;
  searchPlaceholder: string;
  volunteerTitle: string;
  volunteerDesc: string;
  zakatTitle: string;
  zakatDesc: string;
}> = {
  ar: {
    clubTitle: 'النادي الخيري رفقاء الخير',
    clubSubtitle: 'بلدية حمادي، ولاية بومرداس',
    welcomeIntro: 'نادي رفقاء الخير في بلدية حمادي بولاية بومرداس نادٍ تطوعي يُعنى بالعمل الخيري والإنساني والاجتماعي. يعرّفكم هذا التطبيق بأنشطة النادي وطرق التواصل معه والمساهمة في جهوده.',
    tabHome: 'الرئيسية',
    tabActivities: 'الأنشطة',
    tabContact: 'التواصل والمساهمة',
    shortcutActivities: 'الأنشطة',
    shortcutContact: 'التواصل',
    shortcutRequestAid: 'طلب مساعدة',
    shortcutVolunteer: 'تطوع معنا',
    shortcutZakat: 'حاسبة الزكاة',
    howToContributeTitle: 'كيف تساهم؟',
    howToContributeDesc: 'للاستلام والتبرعات، تواصل مع النادي أو توجّه مباشرة إلى مقره في بلدية حمادي.',
    donateButton: 'تسجيل مساهمة أو تبرع',
    contactOfficeTitle: 'مقر النادي واستقبال التبرعات',
    contactOfficeDesc: 'يقع مقر النادي في بلدية حمادي، ولاية بومرداس. يتم الاستلام وتقديم التبرعات مباشرةً في مقر النادي.',
    urgentAppealsTitle: 'نداءات تضامنية وحالات مستعجلة',
    followFbTitle: 'متابعة الصفحة الرسمية على فيسبوك',
    followFbDesc: 'تابعوا الصفحة الرسمية على فيسبوك باسم «النادي الخيري رفقاء الخير» للاطلاع على آخر النداءات والحملات.',
    searchPlaceholder: 'ابحث في الأنشطة، الأدوية، العتاد الطبي، أو أرقام التواصل...',
    volunteerTitle: 'انضم إلى فريق المتطوعين',
    volunteerDesc: 'كن جزءاً من صناع الأثر في بلدية حمادي والقرى المجاورة.',
    zakatTitle: 'حاسبة زكاة المال بالدينار الجزائري',
    zakatDesc: 'احسب نصاب وزكاة مالك بسهولة وفق الشريعة الإسلامية.',
  },
  fr: {
    clubTitle: 'Club Caritatif Rofaqaa El Kheir',
    clubSubtitle: 'Commune de Hammadi, Wilaya de Boumerdès',
    welcomeIntro: 'Le club caritatif « Rofaqaa El Kheir » de la commune de Hammadi (Boumerdès) est une association bénévole d\'action humanitaire et sociale. Cette application vous présente les activités du club, comment le contacter et participer à ses actions.',
    tabHome: 'Accueil',
    tabActivities: 'Activités',
    tabContact: 'Contact & Soutien',
    shortcutActivities: 'Activités',
    shortcutContact: 'Contact',
    shortcutRequestAid: 'Demander de l\'aide',
    shortcutVolunteer: 'Devenir bénévole',
    shortcutZakat: 'Calculateur Zakat',
    howToContributeTitle: 'Comment contribuer ?',
    howToContributeDesc: 'Pour les dons et dépôts, contactez le club ou rendez-vous directement à son siège situé dans la commune de Hammadi.',
    donateButton: 'Enregistrer un don ou soutien',
    contactOfficeTitle: 'Siège du club & Réception des dons',
    contactOfficeDesc: 'Le siège du club est situé dans la commune de Hammadi, wilaya de Boumerdès. La réception et la remise des dons s\'effectuent directement au siège.',
    urgentAppealsTitle: 'Appels urgents et cas prioritaires',
    followFbTitle: 'Suivre la page officielle Facebook',
    followFbDesc: 'Suivez la page officielle Facebook « النادي الخيري رفقاء الخير » pour être informé des derniers appels et campagnes humanitaires.',
    searchPlaceholder: 'Rechercher des activités, médicaments, matériel médical...',
    volunteerTitle: 'Rejoindre les bénévoles',
    volunteerDesc: 'Devenez acteur du changement à Hammadi et ses environs.',
    zakatTitle: 'Calculateur de Zakat en Dinars (DZD)',
    zakatDesc: 'Calculez votre Zakat facilement selon le nissab officiel en Algérie.',
  },
};

export const CLUB_ACTIVITIES: ActivityItem[] = [
  {
    id: 'activity_patients',
    title: 'مساعدة المرضى',
    iconName: 'medkit',
    tag: 'صحي وطبي',
    description: 'توفير الأدوية المجانية والعتاد الطبي وأجهزة التنفس وحليب الأطفال التخصصي عند التوفر.',
    highlights: [
      'أجهزة توليد وتنفس الأكسجين للإعارة المجانية الفورية',
      'كراسي متحركة عادية ومفارش طبية هوائية لملازمي الفراش',
      'أدوية الأمراض المزمنة غير المتوفرة أو باهظة الثمن للمحتاجين',
      'حليب تخصصي للأطفال الرضع ذوي الحساسيات والأمراض النادرة'
    ],
    equipmentOrServices: [
      'مكثفات أكسجين (Concentrateurs d\'oxygène)',
      'كراسي متحركة (Fauteuils roulants)',
      'أسرّة طبية ومفارش هوائية (Matelas anti-escarres)',
      'أجهزة قياس الضغط والسكر وحقائب تمريضية',
      'صيدلية خيرية للأدوية المتبرع بها'
    ],
    actionType: 'request_aid'
  },
  {
    id: 'activity_social',
    title: 'الدعم الاجتماعي',
    iconName: 'users',
    tag: 'تكافل وأسر',
    description: 'زيارات دور المسنين والأيتام، كفالة الأيتام، رعاية الأرامل والعائلات المعوزة، وتوزيع وجبات ساخنة على محتاجي الطريق.',
    highlights: [
      'كفالة شهرية ومتابعة دورية للأيتام والأرامل ببلدية حمادي',
      'زيارات ميدانية لدور العجزة ومراكز الطفولة المسعفة لإدخال البهجة',
      'طرود غذائية متكاملة للأسر المعوزة وأرباب العائلات المتعثرين',
      'توزيع وجبات ساخنة لعابري السبيل والمحتاجين على الطرقات'
    ],
    equipmentOrServices: [
      'قفف غذائية ومواد تموينية أساسية',
      'برنامج الكفالة الشهرية للأيتام',
      'إعانات طارئة لسداد إيجار أو فواتير علاجية',
      'وجبات عابري السبيل وعمال النظافة'
    ],
    actionType: 'donate'
  },
  {
    id: 'activity_initiatives',
    title: 'القوافل والمبادرات',
    iconName: 'truck',
    tag: 'حملات موسمية',
    description: 'قوافل تضامنية للمناطق النائية، حملات التبرع بالدم، وقفة رمضان، الختان الجماعي، وكسوة العيد.',
    highlights: [
      'قوافل شتوية محملة بالأغطية والمؤونة للمناطق النائية وقرى الظل',
      'حملات دورية للتبرع بالدم بالتنسيق مع بنك الدم ومستشفيات المنطقة',
      'مبادرة قفة رمضان ومطاعم الإفطار لعابري السبيل طيلة الشهر الفضيل',
      'عمليات الختان الجماعي للأطفال وتوزيع ألبسة وكسوة العيد'
    ],
    equipmentOrServices: [
      'قافلة شتاء دافئ (أغطية ومدافئ ومواد تدفئة)',
      'حملة التبرع بالدم (قطرة دم تنقذ حياة)',
      'حقيبة الأدوات المدرسية للأطفال المعوزين',
      'كسوة عيدي الفطر والأضحى المباركين'
    ],
    actionType: 'volunteer'
  }
];

export const INITIAL_APPEALS: UrgentAppeal[] = [
  {
    id: 'appeal_1',
    title: 'توفير مكثف أكسجين (10 لتر) لمسن بحمادي',
    category: 'medical',
    targetAmountOrItem: 'جهاز مكثف أكسجين 10L',
    urgency: 'high',
    description: 'نداء عاجل لمساعدة مسن يعاني من قصور تنفسي حاد ببلدية حمادي، بحاجة فورية إلى مكثف أكسجين للإعارة.',
    date: 'مستمر الآن',
    verified: true
  },
  {
    id: 'appeal_2',
    title: 'توفير حليب تخصصي لرضيع ذو حساسية بروتين الحليب',
    category: 'medical',
    targetAmountOrItem: 'علب حليب Neocate / Pepti-Junior',
    urgency: 'high',
    description: 'نداء للأهل الخير والصيادلة لتوفير علب حليب خاص لرضيع من عائلة معوزة لا تستطيع تغطية تكلفته المرتفعة.',
    date: 'تحديث اليوم',
    verified: true
  },
  {
    id: 'appeal_3',
    title: 'جمع أغطية شتوية وطرود غذائية لقافلة المناطق النائية',
    category: 'emergency',
    targetAmountOrItem: '150 غطاء شتوي + طرود تموين',
    urgency: 'medium',
    description: 'التحضير لإطلاق القافلة التضامنية المقبلة نحو قرى ومداشر ولاية بومرداس لمساعدة العائلات في موجة البرد.',
    date: 'الحملة مفتوحة',
    verified: true
  }
];

export const FAQ_ITEMS = [
  {
    q: 'أين يقع مقر النادي الخيري رفقاء الخير؟',
    a: 'يقع مقر النادي في بلدية حمادي بولاية بومرداس (الجزائر). يمكنكم التوجه مباشرة إلى المقر لتقديم التبرعات العينية أو الاستفسار.'
  },
  {
    q: 'كيف يمكنني استعارة عتاد طبي (كرسي متحرك أو مكثف أكسجين)؟',
    a: 'يمكنكم التواصل هاتفياً على أحد أرقام النادي أو تقديم طلب عبر التطبيق مع تقديم شهادة طبية أو ملف يثبت حالة المريض، ويتم تسليم العتاد كإعارة مجانية لحين شفاء المريض.'
  },
  {
    q: 'هل يقبل النادي التبرعات بالأدوية الفائضة؟',
    a: 'نعم، يقبل النادي الأدوية السليمة وغير المنتهية الصلاحية ليتم فحصها وفرزها وإعادة توجيهها للمرضى المحتاجين بالمجان تحت إشراف ذوي الاختصاص.'
  },
  {
    q: 'كيف أشارك كمتطوع في نشاطات النادي؟',
    a: 'أهلاً بك! يمكنك الضغط على زر «تطوع معنا» في التطبيق أو الاتصال بأحد أرقام النادي ليتم إدراجك في أفواج المتطوعين حسب تخصصك ووقت فراغك.'
  }
];
