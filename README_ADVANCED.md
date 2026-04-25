# 🎮 Honkai: Star Rail Discord Bot - الإصدار المتقدم

بوت ديسكورد متقدم وشامل جداً لـ Honkai: Star Rail مع أحدث الميزات والتقنيات.

## ✨ الميزات المتقدمة

### 🎯 Slash Commands (أوامر حديثة)
- أوامر سهلة وسريعة مع `/`
- اقتراحات تلقائية أثناء الكتابة
- واجهة مستخدم أفضل

### 🤖 نظام الذكاء الاصطناعي
- الإجابة الذكية على الأسئلة
- فهم السياق والنوايا
- نصائح ذكية مخصصة

### 🎮 نظام الألعاب والتحديات
- تحديات يومية مختلفة
- نظام المكافآت
- لوحة المتصدرين (قريباً)

### 💾 نظام قاعدة البيانات
- حفظ البيانات والإحصائيات
- تتبع تقدم اللاعبين
- إحصائيات مفصلة

### 🌐 نظام الترجمة
- دعم لغات متعددة
- ترجمة فورية
- دعم اللهجات المختلفة

### 📢 نظام الإشعارات
- تنبيهات عن التحديثات
- إشعارات شخصية
- تنبيهات الأحداث المهمة

### ⚡ نظام الأداء
- تخزين مؤقت ذكي (Caching)
- معالجة سريعة للأوامر
- استجابة فورية

### 🔒 نظام الأمان
- معالجة آمنة للبيانات
- تحقق من الأذونات
- حماية من الإساءة

## 📋 قائمة الأوامر الكاملة

### 🔍 أوامر البحث والمعلومات
```
/character <name>      - عرض معلومات الشخصية
/search <query>        - البحث عن شخصية
/list [filter]         - عرض قائمة الشخصيات
/stats <character>     - إحصائيات الشخصية
/path [name]           - معلومات المسارات
/element [name]        - معلومات العناصر
```

### ⚔️ أوامر الاستراتيجية
```
/team <character>      - أفضل الفرق
/compare <char1> <char2> - مقارنة شخصيتين
/tier                  - Tier List
/build <character> <type> - نصائح البناء
```

### 🎁 أوامر المعدات
```
/relics <character>    - أفضل الآثار
/lightcone <character> - أفضل مخاريط الضوء
```

### 🎮 أوامر الألعاب
```
/daily                 - التحدي اليومي
/ai <question>         - سؤال ذكي
/tip                   - نصيحة عشوائية
/help                  - قائمة الأوامر
```

## 🚀 التثبيت والتشغيل

### المتطلبات
- Node.js 16+ أو Docker
- حساب Discord
- Bot Token

### التثبيت المحلي

```bash
# استنساخ المشروع
git clone https://github.com/your-username/hsr-discord-bot.git
cd hsr-discord-bot

# تثبيت المكتبات
npm install

# إنشاء ملف .env
echo "DISCORD_TOKEN=YOUR_TOKEN" > .env
echo "CLIENT_ID=YOUR_CLIENT_ID" >> .env
echo "GUILD_ID=YOUR_GUILD_ID" >> .env

# تشغيل البوت
npm start
```

### التشغيل مع Docker

```bash
# بناء الصورة
docker build -t hsr-bot .

# تشغيل الحاوية
docker run -e DISCORD_TOKEN=YOUR_TOKEN \
           -e CLIENT_ID=YOUR_CLIENT_ID \
           -e GUILD_ID=YOUR_GUILD_ID \
           hsr-bot
```

## 🌐 النشر على Render

### الخطوات السريعة

1. **اذهب إلى [render.com](https://render.com)**
2. **اختر "New Web Service"**
3. **اختر "Deploy from GitHub"**
4. **اختر مستودع البوت**
5. **أضف متغيرات البيئة**
6. **انقر "Create"**

📖 [دليل النشر المفصل](./RENDER_DEPLOYMENT.md)

## 📊 البيانات المتضمنة

### الشخصيات
- ✅ 85+ شخصية مع معلومات شاملة
- ✅ إحصائيات كاملة (HP, ATK, DEF, SPD, CRIT)
- ✅ نقاط القوة والضعف
- ✅ أفضل الفرق والآثار

### المسارات
- ✅ 9 مسارات مختلفة
- ✅ وصف لكل مسار
- ✅ الشخصيات المنتمية

### العناصر
- ✅ 7 عناصر مختلفة
- ✅ الشخصيات لكل عنصر

### المعدات
- ✅ 4+ أنواع آثار
- ✅ 4+ مخاريط ضوء
- ✅ الإحصائيات والتوصيات

## 🎨 نظام الألوان

| اللون | الاستخدام |
|------|----------|
| 🔵 سيان | المعلومات الأساسية |
| 🟣 بنفسجي | المعلومات الثانوية |
| 🟢 أخضر | النجاح والتوصيات |
| 🔴 أحمر | التحذيرات والأخطاء |
| 🟡 أصفر | التنبيهات المهمة |

## 📁 هيكل المشروع

```
hsr-discord-bot/
├── bot-advanced.js          # البوت الرئيسي المحسّن
├── bot.js                   # البوت الأساسي (legacy)
├── config.js                # الإعدادات
├── advanced-features.js     # الميزات المتقدمة
├── data/
│   └── characters.json      # قاعدة البيانات
├── Dockerfile               # ملف Docker
├── render.yaml              # تكوين Render
├── .env                     # متغيرات البيئة
├── .gitignore              # ملف Git
├── package.json            # المكتبات
├── README.md               # التوثيق الأساسي
├── README_ADVANCED.md      # هذا الملف
├── SETUP_GUIDE.md          # دليل التثبيت
└── RENDER_DEPLOYMENT.md    # دليل النشر
```

## 🔧 التكوين المتقدم

### تعديل الإعدادات

عدّل `config.js`:

```javascript
// تغيير البادئة
PREFIX: '!',

// تغيير الألوان
colors: {
  primary: '#00FFFF',
  // ...
}

// تفعيل/تعطيل الميزات
features: {
  rating: true,
  statistics: true,
  notifications: true,
  // ...
}
```

### إضافة شخصيات جديدة

عدّل `data/characters.json`:

```json
{
  "id": 8,
  "nameAr": "الاسم العربي",
  "nameEn": "English Name",
  "rarity": 5,
  "path": "المسار",
  "element": "العنصر",
  // ...
}
```

## 📈 المراقبة والصيانة

### عرض السجلات

```bash
# السجلات الحية
tail -f logs/bot.log

# آخر 100 سطر
tail -100 logs/bot.log
```

### إعادة التشغيل

```bash
# قتل البوت
Ctrl + C

# إعادة التشغيل
npm start
```

### تحديث المكتبات

```bash
npm update
npm audit fix
```

## 🐛 استكشاف الأخطاء

### المشكلة: البوت لا يستجيب

**الحل:**
1. تحقق من الـ Logs
2. تأكد من أن Token صحيح
3. جرب إعادة التشغيل

### المشكلة: خطأ في الأوامر

**الحل:**
1. تحقق من اسم الأمر
2. تأكد من الصيغة الصحيحة
3. جرب `/help`

### المشكلة: البوت بطيء

**الحل:**
1. تحقق من الموارد المتاحة
2. امسح الـ Cache
3. قلل عدد الأوامر المتزامنة

## 🔐 الأمان

⚠️ **نصائح مهمة:**

1. **لا تشارك Token** - احفظه سراً
2. **استخدم .env** - للبيانات الحساسة
3. **أضف .env إلى .gitignore** - لا تنشره
4. **حدّث المكتبات** - بانتظام

## 📚 الموارد الإضافية

- [Discord.js Documentation](https://discord.js.org)
- [Discord API Docs](https://discord.com/developers/docs)
- [Render Documentation](https://render.com/docs)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 🤝 المساهمة

نرحب بالمساهمات! يرجى:

1. Fork المشروع
2. إنشاء فرع جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add AmazingFeature'`)
4. Push إلى الفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت MIT License - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## 👨‍💻 المطورون

- **HSR Guide Bot Team** - الفريق الأساسي

## 📞 التواصل والدعم

للأسئلة والاستفسارات:
- 📧 البريد الإلكتروني: support@hsr-bot.com
- 💬 Discord: [Join Server](https://discord.gg/hsr-bot)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/hsr-discord-bot/issues)

## 🎯 الخطط المستقبلية

- [ ] نظام قاعدة بيانات متقدم (MongoDB)
- [ ] لوحة متصدرين عالمية
- [ ] نظام الترجمة الكامل
- [ ] تطبيق ويب للإحصائيات
- [ ] نظام الإشعارات المتقدم
- [ ] دعم الأصوات (Voice)
- [ ] نظام الألعاب المتقدم
- [ ] تكامل مع APIs خارجية

## 📊 الإحصائيات

- ⭐ **15+ أوامر** متقدمة
- 🎮 **85+ شخصية** مع معلومات كاملة
- 🌐 **9 مسارات** و **7 عناصر**
- 🚀 **نشر سهل** على Render
- ⚡ **أداء عالي** مع Caching

## 🎉 شكراً لاستخدامك البوت!

استمتع باستخدام Honkai: Star Rail Guide Bot! 🎮✨

---

**آخر تحديث:** أبريل 2026  
**الإصدار:** 2.0.0 (Advanced)  
**الحالة:** ✅ جاهز للإنتاج
