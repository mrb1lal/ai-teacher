'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'uz' | 'ru';

interface Translations {
  [key: string]: string;
}

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.features': 'Features',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.privacy': 'Privacy Policy',
    'nav.dashboard': 'Dashboard',
    'nav.login': 'Login',
    'nav.admin': 'Admin Panel',
    
    // Hero
    'hero.title': 'Learn English with AI',
    'hero.subtitle': 'Your personal AI English tutor. Practice speaking, get pronunciation audio, analyze images, generate PDF lessons, and track your progress.',
    'hero.cta': 'Start Learning Free',
    'hero.bot': 'Open in Telegram',
    
    // Features
    'features.title': 'Powerful Features',
    'features.subtitle': 'Everything you need to master English',
    'feature.chat.title': 'AI Chat',
    'feature.chat.desc': 'Ask any English question - grammar, vocabulary, idioms, IELTS prep. Get instant explanations with examples.',
    'feature.audio.title': 'Pronunciation Audio',
    'feature.audio.desc': 'Generate audio for any word or phrase. Get IPA transcription, stress markers, and native-like pronunciation.',
    'feature.images.title': 'Image Analysis',
    'feature.images.desc': 'Send up to 6 images at once - textbook pages, exercises, signs. Get explanations, translations, and solutions.',
    'feature.pdf.title': 'PDF Generation',
    'feature.pdf.desc': 'Create study reports, lesson PDFs, and vocabulary lists. Download and study offline anytime.',
    'feature.profile.title': 'Smart Profiling',
    'feature.profile.desc': 'Auto-detects your CEFR level, estimated IELTS band, weak/strong topics, and study patterns.',
    'feature.memory.title': 'Full Memory',
    'feature.memory.desc': 'Complete conversation history saved. Context-aware responses that remember your learning journey.',
    
    // About
    'about.title': 'About AI English Teacher',
    'about.description': 'AI English Teacher is a personal language learning assistant powered by Google\'s Gemini AI. It combines advanced AI capabilities with pedagogical expertise to provide personalized English learning experience.',
    'about.mission': 'Our mission is to make quality English education accessible to everyone, anywhere, anytime.',
    'about.tech': 'Built with cutting-edge technology:',
    'about.tech.gemini': 'Google Gemini 1.5 Flash for AI responses',
    'about.tech.supabase': 'Supabase (PostgreSQL) for data storage',
    'about.tech.telegram': 'Telegram Bot API for messaging',
    'about.tech.vercel': 'Vercel for web hosting',
    'about.tech.node': 'Node.js with Telegraf framework',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Have questions? We\'d love to hear from you.',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.success': 'Message sent successfully!',
    'contact.error': 'Failed to send message. Please try again.',
    'contact.telegram': 'Or message us on Telegram',
    
    // Privacy
    'privacy.title': 'Privacy Policy',
    'privacy.lastUpdated': 'Last updated: August 2026',
    'privacy.intro': 'AI English Teacher respects your privacy. This policy explains what data we collect and how we use it.',
    'privacy.data.title': 'Data We Collect',
    'privacy.data.items': 'Telegram user ID, username, first/last name, language preference, chat messages, images sent, audio requests, generated PDFs, learning analytics (level, weak/strong topics, study hours)',
    'privacy.usage.title': 'How We Use Your Data',
    'privacy.usage.items': 'Provide AI-powered English tutoring, generate personalized responses, create study materials, track learning progress, improve service quality',
    'privacy.storage.title': 'Data Storage',
    'privacy.storage.items': 'Data stored in Supabase (PostgreSQL) and local SQLite. No data sold to third parties. You can request deletion anytime via /clear command or contact us.',
    'privacy.rights.title': 'Your Rights',
    'privacy.rights.items': 'Access your data, request correction, request deletion, export your data, opt-out of analytics',
    'privacy.contact': 'Contact: @ai_teacher_bot on Telegram',
    
    // Dashboard
    'dashboard.title': 'Learning Dashboard',
    'dashboard.welcome': 'Welcome back',
    'dashboard.stats': 'Your Statistics',
    'dashboard.level': 'English Level',
    'dashboard.ielts': 'Estimated IELTS',
    'dashboard.messages': 'Total Messages',
    'dashboard.audio': 'Audio Requests',
    'dashboard.images': 'Images Analyzed',
    'dashboard.lessons': 'My Lessons',
    'dashboard.vocab': 'My Vocabulary',
    'dashboard.reports': 'Study Reports',
    'dashboard.history': 'Chat History',
    'dashboard.generateReport': 'Generate Report',
    'dashboard.createLesson': 'Create Lesson',
    'dashboard.createVocab': 'Create Vocabulary',
    
    // Admin
    'admin.title': 'Admin Panel',
    'admin.users': 'All Users',
    'admin.broadcast': 'Broadcast Message',
    'admin.stats': 'Statistics',
    'admin.user': 'User Details',
    'admin.send': 'Send Broadcast',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.download': 'Download',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.noData': 'No data available',
    
    // Footer
    'footer.rights': 'All rights reserved.',
    'footer.made': 'Made with ❤️ for English learners worldwide',
  },
  uz: {
    'nav.home': 'Bosh sahifa',
    'nav.features': 'Imkoniyatlar',
    'nav.about': 'Biz haqimizda',
    'nav.contact': 'Aloqa',
    'nav.privacy': 'Maxfiylik siyosati',
    'nav.dashboard': 'Panel',
    'nav.login': 'Kirish',
    'nav.admin': 'Admin panel',
    
    'hero.title': 'AI bilan ingliz tilini o\'rganing',
    'hero.subtitle': 'Shaxsiy AI ingliz tili ustozingiz. Nutqni mashq qiling, audio talaffuz oling, rasmlarni tahlil qiling, PDF darslar yarating va progressingizni kuzating.',
    'hero.cta': 'Bepul boshlash',
    'hero.bot': 'Telegramda ochish',
    
    'features.title': 'Kuchli imkoniyatlar',
    'features.subtitle': 'Ingliz tilini egallash uchun kerakli barcha narsalar',
    'feature.chat.title': 'AI Chat',
    'feature.chat.desc': 'Har qanday ingliz tili savolini bering - grammatika, lug\'at, idomalar, IELTS tayyorgarligi. Misollar bilan tezkor tushuntirishlar oling.',
    'feature.audio.title': 'Talaffuz audiosi',
    'feature.audio.desc': 'Har qanday so\'z yoki ibora uchun audio yarating. IPA transkripsiyasi, ton belgilari va carrierdek talaffuz oling.',
    'feature.images.title': 'Rasm tahlili',
    'feature.images.desc': 'Bir vaqtda 6 tagacha rasm yuboring - darslik sahifalari, mashqlar, belgilar. Tushuntirishlar, tarjimalar va yechimlar oling.',
    'feature.pdf.title': 'PDF yaratish',
    'feature.pdf.desc': 'O\'rganish hisobotlari, dars PDFlari va lug\'at ro\'yxatlarini yarating. Yuklab oling va offlayn o\'rganing.',
    'feature.profile.title': 'Aqlli profil',
    'feature.profile.desc': 'CEFR darajangiz, taxminiy IELTS balli, zaif/kuchli mavzular va o\'rganish na\'moyotlari avtomatik aniqlanadi.',
    'feature.memory.title': 'To\'liq xotira',
    'feature.memory.desc': 'To\'liq suhbat tarixi saqlanadi. O\'rganish yo\'lingizni eslagan, kontekstga mos javoblar.',
    
    'about.title': 'AI Ingliz tili Ustoz haqida',
    'about.description': 'AI Ingliz tili Ustoz - Google\'ning Gemini AI quvvatidan foydalangan shaxsiy til o\'rganish yordamchisidir. Bu ilg\'or AI imkoniyatlari va pedagogik tajribani birlashtirib, shaxsiy ingliz tili o\'rganish tajribasini taqdim etadi.',
    'about.mission': 'Missiyamiz - sifatli ingliz tilini har kimgayoq, har qayerda, har vaqtda yetkazib berish.',
    'about.tech': 'Zamonaviy texnologiyalar bilan yaratilgan:',
    'about.tech.gemini': 'Google Gemini 1.5 Flash - AI javoblar uchun',
    'about.tech.supabase': 'Supabase (PostgreSQL) - ma\'lumotlar saqlash uchun',
    'about.tech.telegram': 'Telegram Bot API - xabar almashish uchun',
    'about.tech.vercel': 'Vercel - veb hosting uchun',
    'about.tech.node': 'Node.js va Telegraf framework',
    
    'contact.title': 'Biz bilan bog\'laning',
    'contact.subtitle': 'Savollar bormi? Javob berishdan xursandmiz.',
    'contact.name': 'Ism',
    'contact.email': 'Email',
    'contact.message': 'Xabar',
    'contact.send': 'Yuborish',
    'contact.success': 'Xabar muvaffaqiyatli yuborildi!',
    'contact.error': 'Yuborishda xatolik. Qaytadan urinib ko\'ring.',
    'contact.telegram': 'Yoki Telegramda yozing',
    
    'privacy.title': 'Maxfiylik siyosati',
    'privacy.lastUpdated': 'Oxirgi yangilanish: Avgust 2026',
    'privacy.intro': 'AI Ingliz tili Ustoz sizning maxfiyligingizni qadrlaydi. Bu siyosat qanday ma\'lumot yig\'ilishi va u qanday ishlatilishi haqida.',
    'privacy.data.title': 'Yig\'iladigan ma\'lumotlar',
    'privacy.data.items': 'Telegram user ID, username, ism/familiya, til tanlovi, chat xabarlari, yuborilgan rasmlar, audio so\'rovlar, yaratilgan PDFlar, o\'rganish analitikasi (daraja, zaif/kuchli mavzular, o\'rganish soatlari)',
    'privacy.usage.title': 'Ma\'lumotlar qanday ishlatiladi',
    'privacy.usage.items': 'AI-quvvatli ingliz tili darslari, shaxsiy javoblar yaratish, o\'rganish materiallari, progress kuzatishi, xizmat sifati oshirish',
    'privacy.storage.title': 'Ma\'lumotlar saqlash',
    'privacy.storage.items': 'Ma\'lumotlar Supabase (PostgreSQL) va mahalliy SQLite da saqlanadi. Hech qanday ma\'lumot uchinchi shaxslarga sotilmaydi. /clear buyrug\'i yoki aloqa orqali o\'chirish so\'rashi mumkin.',
    'privacy.rights.title': 'Sizning huquqlaringiz',
    'privacy.rights.items': 'Ma\'lumotlaringizga kirish, to\'g\'rilash so\'rashi, o\'chirish so\'rashi, ma\'lumotlarni eksport qilish, analytikadan chetlash',
    'privacy.contact': 'Aloqa: @ai_teacher_bot Telegramda',
    
    'dashboard.title': 'O\'rganish paneli',
    'dashboard.welcome': 'Qayta xush kelibsiz',
    'dashboard.stats': 'Sizning statistikangiz',
    'dashboard.level': 'Ingliz tili darajasi',
    'dashboard.ielts': 'Taxminiy IELTS',
    'dashboard.messages': 'Jami xabarlar',
    'dashboard.audio': 'Audio so\'rovlari',
    'dashboard.images': 'Tahlil qilingan rasmlar',
    'dashboard.lessons': 'Mening darslarim',
    'dashboard.vocab': 'Mening lug\'atim',
    'dashboard.reports': 'O\'rganish hisobotlari',
    'dashboard.history': 'Suhbat tarixi',
    'dashboard.generateReport': 'Hisobot yaratish',
    'dashboard.createLesson': 'Dars yaratish',
    'dashboard.createVocab': 'Lug\'at yaratish',
    
    'admin.title': 'Admin panel',
    'admin.users': 'Barcha foydalanuvchilar',
    'admin.broadcast': 'Xabar yuborish',
    'admin.stats': 'Statistika',
    'admin.user': 'Foydalanuvchi tafsilotlari',
    'admin.send': 'Yuborish',
    
    'common.loading': 'Yuklanmoqda...',
    'common.error': 'Xatolik',
    'common.success': 'Muvaffaqiyat',
    'common.save': 'Saqlash',
    'common.cancel': 'Bekor qilish',
    'common.delete': 'O\'chirish',
    'common.edit': 'Tahrirlash',
    'common.view': 'Ko\'rish',
    'common.download': 'Yuklab olish',
    'common.close': 'Yopish',
    'common.back': 'Orqaga',
    'common.next': 'Keyingi',
    'common.previous': 'Oldingi',
    'common.search': 'Qidirish',
    'common.filter': 'Filtrlash',
    'common.noData': 'Ma\'lumot yo\'q',
    
    'footer.rights': 'Barcha huquqlar himoyalangan.',
    'footer.made': 'Ingliz tilini o\'rganuvchilar uchun ❤️ bilan yaratilgan',
  },
  ru: {
    'nav.home': 'Главная',
    'nav.features': 'Возможности',
    'nav.about': 'О нас',
    'nav.contact': 'Контакты',
    'nav.privacy': 'Политика конфиденциальности',
    'nav.dashboard': 'Панель',
    'nav.login': 'Вход',
    'nav.admin': 'Админ панель',
    
    'hero.title': 'Выучите английский с ИИ',
    'hero.subtitle': 'Ваш личный ИИ-репетитор по английскому. Практикуйте речь, получайте аудио произношения, анализируйте изображения, создавайте PDF-уроки и отслеживайте прогресс.',
    'hero.cta': 'Начать бесплатно',
    'hero.bot': 'Открыть в Telegram',
    
    'features.title': 'Мощные возможности',
    'features.subtitle': 'Все необходимое для maîtrизации английского',
    'feature.chat.title': 'ИИ Чат',
    'feature.chat.desc': 'Спросите любой вопрос по английскому - грамматика, лексика, идиомы, подготовка к IELTS. Мгновенные объяснения с примерами.',
    'feature.audio.title': 'Аудио произношения',
    'feature.audio.desc': 'Генерируйте аудио для любого слова или фразы. Получите IPA транскрипцию, знаки ударения и нативное произношение.',
    'feature.images.title': 'Анализ изображений',
    'feature.images.desc': 'Отправляйте до 6 изображений одновременно - страницы учебников, упражнения, знаки. Получайте объяснения, переводы и решения.',
    'feature.pdf.title': 'Генерация PDF',
    'feature.pdf.desc': 'Создавайте отчеты об обучении, PDF-уроки и списки словаря. Скачивайте и учитесь офлайн в любое время.',
    'feature.profile.title': 'Умный профиль',
    'feature.profile.desc': 'Автоматически определяет ваш уровень CEFR, примерный балл IELTS, слабые/сильные темы и паттерны обучения.',
    'feature.memory.title': 'Полная память',
    'feature.memory.desc': 'Полная история диалогов сохранена. Контекстно-зависимые ответы, которые помнят ваш путь обучения.',
    
    'about.title': 'Об AI English Teacher',
    'about.description': 'AI English Teacher - это личный помощник в изучении языка на базе Gemini AI от Google. Сочетает передовые возможности ИИ с педагогической экспертизой для персонализированного изучения английского.',
    'about.mission': 'Наша миссия - сделать качественное образование по английскому доступным для всех, в любом месте, в любое время.',
    'about.tech': 'Построено на передовых технологиях:',
    'about.tech.gemini': 'Google Gemini 1.5 Flash для ИИ-ответов',
    'about.tech.supabase': 'Supabase (PostgreSQL) для хранения данных',
    'about.tech.telegram': 'Telegram Bot API для обмена сообщениями',
    'about.tech.vercel': 'Vercel для веб-хостинга',
    'about.tech.node': 'Node.js с фреймворком Telegraf',
    
    'contact.title': 'Свяжитесь с нами',
    'contact.subtitle': 'Есть вопросы? Мы будем рады ответить.',
    'contact.name': 'Имя',
    'contact.email': 'Email',
    'contact.message': 'Сообщение',
    'contact.send': 'Отправить',
    'contact.success': 'Сообщение успешно отправлено!',
    'contact.error': 'Ошибка отправки. Попробуйте снова.',
    'contact.telegram': 'Или напишите в Telegram',
    
    'privacy.title': 'Политика конфиденциальности',
    'privacy.lastUpdated': 'Последнее обновление: Август 2026',
    'privacy.intro': 'AI English Teacher уважает вашу конфиденциальность. Эта политика объясняет, какие данные мы собираем и как их используем.',
    'privacy.data.title': 'Собираемые данные',
    'privacy.data.items': 'Telegram user ID, username, имя/фамилия, языковые предпочтения, сообщения чата, отправленные изображения, запросы аудио, сгенерированные PDF, аналитика обучения (уровень, слабые/сильные темы, часы обучения)',
    'privacy.usage.title': 'Как мы используем данные',
    'privacy.usage.items': 'Предоставление ИИ-репетиторства по английскому, генерация персонализированных ответов, создание учебных материалов, отслеживание прогресса обучения, улучшение качества сервиса',
    'privacy.storage.title': 'Хранение данных',
    'privacy.storage.items': 'Данные хранятся в Supabase (PostgreSQL) и локальном SQLite. Данные не продаются третьим лицам. Вы можете запросить удаление в любой момент через команду /clear или связавшись с нами.',
    'privacy.rights.title': 'Ваши права',
    'privacy.rights.items': 'Доступ к своим данным, запрос на исправление, запрос на удаление, экспорт данных, отказ от аналитики',
    'privacy.contact': 'Контакт: @ai_teacher_bot в Telegram',
    
    'dashboard.title': 'Панель обучения',
    'dashboard.welcome': 'С возвращением',
    'dashboard.stats': 'Ваша статистика',
    'dashboard.level': 'Уровень английского',
    'dashboard.ielts': 'Примерный IELTS',
    'dashboard.messages': 'Всего сообщений',
    'dashboard.audio': 'Аудио запросов',
    'dashboard.images': 'Проанализировано изображений',
    'dashboard.lessons': 'Мои уроки',
    'dashboard.vocab': 'Мой словарь',
    'dashboard.reports': 'Отчеты об обучении',
    'dashboard.history': 'История чата',
    'dashboard.generateReport': 'Создать отчет',
    'dashboard.createLesson': 'Создать урок',
    'dashboard.createVocab': 'Создать словарь',
    
    'admin.title': 'Админ панель',
    'admin.users': 'Все пользователи',
    'admin.broadcast': 'Рассылка',
    'admin.stats': 'Статистика',
    'admin.user': 'Детали пользователя',
    'admin.send': 'Отправить рассылку',
    
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успех',
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.delete': 'Удалить',
    'common.edit': 'Редактировать',
    'common.view': 'Просмотр',
    'common.download': 'Скачать',
    'common.close': 'Закрыть',
    'common.back': 'Назад',
    'common.next': 'Далее',
    'common.previous': 'Назад',
    'common.search': 'Поиск',
    'common.filter': 'Фильтр',
    'common.noData': 'Нет данных',
    
    'footer.rights': 'Все права защищены.',
    'footer.made': 'Сделано с ❤️ для изучающих английский по всему миру',
  },
};

export function I18nProvider({ children, defaultLanguage = 'en' }: { children: ReactNode; defaultLanguage?: Language }) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('language') as Language | null;
    if (saved && translations[saved]) {
      setLanguage(saved);
    } else {
      const browserLang = navigator.language.slice(0, 2) as Language;
      if (translations[browserLang]) {
        setLanguage(browserLang);
      }
    }
  }, []);

  const t = (key: string, params?: Record<string, string>) => {
    if (!mounted) return key;
    let text = translations[language][key] || translations.en[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{{${k}}}`, 'g'), v);
      });
    }
    return text;
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

export { translations };
export type { Language };