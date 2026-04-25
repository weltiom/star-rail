# 📖 دليل التثبيت والتشغيل الشامل

## 🎯 المتطلبات الأساسية

- **Node.js**: الإصدار 16.0 أو أحدث
- **npm**: يأتي مع Node.js
- **حساب Discord**: لإنشاء البوت
- **Discord Developer Portal**: لإنشاء التطبيق والحصول على Token

## 🔧 خطوات التثبيت

### الخطوة 1: إنشاء تطبيق على Discord Developer Portal

1. اذهب إلى [Discord Developer Portal](https://discord.com/developers/applications)
2. انقر على **"New Application"**
3. أدخل اسم التطبيق (مثل: "HSR Guide Bot")
4. انقر على **"Create"**

### الخطوة 2: إنشاء البوت

1. في الشريط الجانبي، انقر على **"Bot"**
2. انقر على **"Add Bot"**
3. تحت اسم البوت، انقر على **"Reset Token"** (إذا لزم الأمر)
4. انسخ **Token** (ستحتاجه لاحقاً)

### الخطوة 3: تعيين الصلاحيات

1. في الشريط الجانبي، انقر على **"OAuth2"** ثم **"URL Generator"**
2. في قسم **"Scopes"**، اختر:
   - ✅ `bot`
3. في قسم **"Permissions"**، اختر:
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Read Message History
   - ✅ Add Reactions
   - ✅ Use Slash Commands
   - ✅ Manage Messages

4. انسخ الرابط المُنشأ من أسفل الصفحة

### الخطوة 4: إضافة البوت إلى السيرفر

1. الصق الرابط الذي نسخته في متصفحك
2. اختر السيرفر الذي تريد إضافة البوت إليه
3. انقر على **"Authorize"**
4. أكمل التحقق من الأمان (CAPTCHA)

### الخطوة 5: تثبيت المشروع محلياً

```bash
# استنساخ المشروع
git clone https://github.com/your-username/hsr-discord-bot.git
cd hsr-discord-bot

# تثبيت المكتبات
npm install
```

### الخطوة 6: إعداد ملف .env

1. انسخ ملف `.env.example` إلى `.env`
2. أضف بيانات البوت:

```env
DISCORD_TOKEN=YOUR_BOT_TOKEN_HERE
CLIENT_ID=YOUR_CLIENT_ID_HERE
GUILD_ID=YOUR_GUILD_ID_HERE
```

**كيفية الحصول على البيانات:**
- **DISCORD_TOKEN**: من Discord Developer Portal (خطوة 2)
- **CLIENT_ID**: من صفحة "General Information" في Developer Portal
- **GUILD_ID**: انقر بزر الماوس الأيمن على السيرفر واختر "Copy Server ID"

### الخطوة 7: تشغيل البوت

```bash
# تشغيل البوت
npm start

# أو في وضع التطوير
npm run dev
```

يجب أن ترى رسالة مثل:
```
✅ البوت جاهز! تم تسجيل الدخول باسم: HSR Guide Bot#1234
```

## 🚀 الاستخدام الأساسي

بعد تشغيل البوت، يمكنك استخدام الأوامر التالية في Discord:

### أوامر البحث
```
!character فايرفلاي
!search Firefly
!list الدمار
```

### أوامر الاستراتيجية
```
!team فايرفلاي
!compare فايرفلاي روان مي
!tier
```

### أوامر المعدات
```
!relics فايرفلاي
!lightcone جينج يوان
```

### أوامر المعلومات
```
!path الدمار
!element النار
!stats فايرفلاي
```

### أوامر أخرى
```
!help
!tip
!ping
```

## 🔍 استكشاف الأخطاء

### المشكلة: البوت لا يستجيب للأوامر

**الحل:**
1. تأكد من أن البوت يعمل (يجب أن ترى الرسالة في الكونسول)
2. تأكد من أن البوت لديه صلاحيات الكتابة في القناة
3. تأكد من أن الأمر يبدأ بـ `!`

### المشكلة: خطأ "Invalid Token"

**الحل:**
1. تحقق من أن Token صحيح في ملف `.env`
2. تأكد من عدم وجود مسافات إضافية
3. جرب إنشاء token جديد من Developer Portal

### المشكلة: البوت يظهر "Offline"

**الحل:**
1. تأكد من أن البوت يعمل محلياً
2. تحقق من اتصالك بالإنترنت
3. جرب إعادة تشغيل البوت

### المشكلة: خطأ "Cannot find module"

**الحل:**
```bash
# أعد تثبيت المكتبات
npm install

# أو حذف وإعادة التثبيت
rm -rf node_modules package-lock.json
npm install
```

## 📚 الملفات الهامة

| الملف | الوصف |
|------|-------|
| `bot.js` | ملف البوت الرئيسي |
| `config.js` | إعدادات البوت |
| `advanced-features.js` | الميزات المتقدمة |
| `data/characters.json` | بيانات الشخصيات |
| `.env` | متغيرات البيئة |
| `README.md` | التوثيق الأساسي |

## 🔐 نصائح الأمان

1. **لا تشارك Token**: لا تضع Token في GitHub أو أي مكان عام
2. **استخدم .env**: احفظ البيانات الحساسة في ملف `.env`
3. **أضف .env إلى .gitignore**: تأكد من عدم رفع `.env` إلى GitHub

```bash
# أضف هذا إلى .gitignore
echo ".env" >> .gitignore
```

## 🌐 النشر على الإنترنت

### خيار 1: Heroku (مجاني)

```bash
# تثبيت Heroku CLI
# ثم قم بـ:
heroku login
heroku create your-bot-name
git push heroku main
```

### خيار 2: Railway (مجاني)

1. اذهب إلى [Railway.app](https://railway.app)
2. انقر على "New Project"
3. اختر "Deploy from GitHub"
4. اختر مستودعك
5. أضف متغيرات البيئة

### خيار 3: Replit

1. اذهب إلى [Replit.com](https://replit.com)
2. انقر على "Create"
3. اختر "Import from GitHub"
4. أضف متغيرات البيئة في "Secrets"

## 📊 المراقبة والصيانة

### عرض السجلات
```bash
# السجلات الحية
tail -f logs/bot.log

# آخر 100 سطر
tail -100 logs/bot.log
```

### إعادة تشغيل البوت
```bash
# قتل البوت
Ctrl + C

# إعادة التشغيل
npm start
```

### تحديث البيانات
```bash
# تحديث المكتبات
npm update

# تحديث بيانات الشخصيات
# عدّل ملف data/characters.json
```

## 💡 نصائح إضافية

1. **استخدم Nodemon**: لإعادة التشغيل التلقائي أثناء التطوير
   ```bash
   npm install -g nodemon
   nodemon bot.js
   ```

2. **استخدم PM2**: للنشر على الإنترنت
   ```bash
   npm install -g pm2
   pm2 start bot.js
   pm2 save
   ```

3. **استخدم Docker**: لتسهيل النشر
   ```bash
   docker build -t hsr-bot .
   docker run -e DISCORD_TOKEN=your_token hsr-bot
   ```

## 📞 الدعم والمساعدة

إذا واجهت مشاكل:
1. تحقق من [Discord.js Documentation](https://discord.js.org)
2. ابحث عن المشكلة في [GitHub Issues](https://github.com/discordjs/discord.js/issues)
3. اطلب المساعدة في [Discord.js Support Server](https://discord.gg/djs)

---

**استمتع باستخدام البوت! 🎮✨**
