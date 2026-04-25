// ==================== BOT CONFIGURATION ====================

module.exports = {
  // معلومات البوت الأساسية
  bot: {
    name: 'Honkai: Star Rail Guide Bot',
    version: '1.0.0',
    prefix: '!',
    description: 'بوت ديسكورد شامل لـ Honkai: Star Rail'
  },

  // نظام الألوان
  colors: {
    primary: '#00FFFF',      // سيان نيون
    secondary: '#FF00FF',    // ماجنتا
    success: '#00FF00',      // أخضر
    danger: '#FF0000',       // أحمر
    warning: '#FFFF00',      // أصفر
    info: '#0099FF',         // أزرق
    dark: '#1a1a1a',         // أسود
    light: '#FFFFFF'         // أبيض
  },

  // الرموز التعبيرية
  emojis: {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    loading: '⏳',
    star: '⭐',
    fire: '🔥',
    ice: '❄️',
    lightning: '⚡',
    wind: '💨',
    quantum: '🌌',
    imaginary: '✨',
    physical: '⚪',
    sword: '⚔️',
    shield: '🛡️',
    heart: '❤️',
    zap: '⚡',
    book: '📚',
    chart: '📊',
    search: '🔍',
    list: '📋',
    team: '👥',
    trophy: '🏆',
    gift: '🎁',
    lightbulb: '💡'
  },

  // إعدادات الأوامر
  commands: {
    // أوامر البحث
    search: {
      enabled: true,
      cooldown: 2000,
      description: 'البحث عن الشخصيات'
    },
    character: {
      enabled: true,
      cooldown: 2000,
      description: 'عرض معلومات الشخصية'
    },
    list: {
      enabled: true,
      cooldown: 3000,
      description: 'عرض قائمة الشخصيات'
    },

    // أوامر الاستراتيجية
    team: {
      enabled: true,
      cooldown: 2000,
      description: 'أفضل الفرق'
    },
    compare: {
      enabled: true,
      cooldown: 2000,
      description: 'مقارنة الشخصيات'
    },
    tier: {
      enabled: true,
      cooldown: 3000,
      description: 'Tier List'
    },

    // أوامر المعدات
    relics: {
      enabled: true,
      cooldown: 2000,
      description: 'أفضل الآثار'
    },
    lightcone: {
      enabled: true,
      cooldown: 2000,
      description: 'أفضل مخاريط الضوء'
    },

    // أوامر المعلومات
    path: {
      enabled: true,
      cooldown: 2000,
      description: 'معلومات المسارات'
    },
    element: {
      enabled: true,
      cooldown: 2000,
      description: 'معلومات العناصر'
    },
    stats: {
      enabled: true,
      cooldown: 2000,
      description: 'إحصائيات الشخصية'
    },

    // أوامر أخرى
    help: {
      enabled: true,
      cooldown: 2000,
      description: 'قائمة الأوامر'
    },
    tip: {
      enabled: true,
      cooldown: 2000,
      description: 'نصيحة عشوائية'
    },
    ping: {
      enabled: true,
      cooldown: 1000,
      description: 'اختبار الاتصال'
    }
  },

  // إعدادات الرسائل
  messages: {
    welcome: 'مرحباً بك في Honkai: Star Rail Guide Bot! استخدم `!help` للمزيد من المعلومات',
    error: '❌ حدث خطأ أثناء معالجة طلبك',
    notFound: '❌ لم يتم العثور على النتيجة المطلوبة',
    invalidArgs: '❌ الأوامر المدخلة غير صحيحة',
    cooldown: '⏳ يرجى الانتظار قبل استخدام الأمر مرة أخرى',
    noPermission: '❌ ليس لديك صلاحيات كافية'
  },

  // إعدادات الميزات المتقدمة
  features: {
    // نظام التقييم
    rating: {
      enabled: true,
      maxRating: 5,
      emoji: '⭐'
    },

    // نظام الإحصائيات
    statistics: {
      enabled: true,
      trackCommands: true,
      trackSearches: true
    },

    // نظام التنبيهات
    notifications: {
      enabled: true,
      updateNotifications: true,
      newCharacterNotifications: true
    },

    // نظام الترجمة
    translation: {
      enabled: true,
      supportedLanguages: ['ar', 'en', 'zh', 'ja']
    },

    // نظام الألعاب
    games: {
      enabled: true,
      dailyChallenge: true,
      leaderboard: true
    }
  },

  // إعدادات قاعدة البيانات (للمستقبل)
  database: {
    enabled: false,
    type: 'mongodb',
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/hsr-bot'
  },

  // إعدادات التسجيل
  logging: {
    enabled: true,
    level: 'info', // 'debug', 'info', 'warn', 'error'
    file: 'logs/bot.log',
    console: true
  },

  // إعدادات الأمان
  security: {
    enableRateLimit: true,
    rateLimitWindow: 60000, // 1 دقيقة
    rateLimitMaxRequests: 10,
    enableCommandValidation: true,
    enableInputSanitization: true
  },

  // إعدادات الأداء
  performance: {
    enableCaching: true,
    cacheExpiry: 3600000, // 1 ساعة
    enableCompression: true,
    maxEmbedFields: 25
  },

  // إعدادات الخادم
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    timeout: 30000
  },

  // الأوامر المحظورة
  blacklist: {
    users: [],
    guilds: [],
    commands: []
  },

  // الأوامر المسموحة (إذا كانت قائمة بيضاء مفعلة)
  whitelist: {
    enabled: false,
    users: [],
    guilds: [],
    commands: []
  },

  // إعدادات الإشعارات
  notifications: {
    errorChannel: null,
    logChannel: null,
    updateChannel: null
  },

  // إعدادات الأدوار والأذونات
  roles: {
    admin: 'Admin',
    moderator: 'Moderator',
    member: 'Member'
  },

  // إعدادات الترجمة
  i18n: {
    defaultLanguage: 'ar',
    fallbackLanguage: 'en',
    supportedLanguages: {
      'ar': 'العربية',
      'en': 'English',
      'zh': '中文',
      'ja': '日本語'
    }
  },

  // إعدادات الميزات التجريبية
  experimental: {
    aiChat: false,
    voiceSupport: false,
    imageGeneration: false,
    advancedAnalytics: false
  },

  // إعدادات التطوير
  development: {
    debug: process.env.DEBUG === 'true',
    testMode: process.env.TEST_MODE === 'true',
    mockData: false
  }
};
