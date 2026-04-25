# 🚀 دليل نشر بوت Honkai: Star Rail على Render

## المتطلبات الأساسية

قبل البدء، تأكد من أن لديك:
- ✅ حساب Discord Developer Portal
- ✅ Discord Bot Token
- ✅ حساب GitHub (لتخزين الكود)
- ✅ حساب Render (مجاني)

---

## الخطوة 1️⃣: إعداد GitHub

### 1.1 إنشاء مستودع GitHub

1. اذهب إلى [GitHub.com](https://github.com)
2. انقر على **"New"** لإنشاء مستودع جديد
3. أدخل اسم المستودع: `hsr-discord-bot`
4. اختر **"Public"** (اختياري)
5. انقر **"Create repository"**

### 1.2 رفع الكود إلى GitHub

```bash
# إذا لم تكن قد نسخت المستودع بعد
git clone https://github.com/YOUR_USERNAME/hsr-discord-bot.git
cd hsr-discord-bot

# أو إذا كان المستودع موجود بالفعل
cd /path/to/hsr-discord-bot
git init
git add .
git commit -m "Initial commit: HSR Discord Bot with full Arabic translation"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hsr-discord-bot.git
git push -u origin main
```

### 1.3 إنشاء ملف `.env.example`

```bash
# ملف .env.example (بدون القيم الحقيقية)
DISCORD_TOKEN=your_bot_token_here
NODE_ENV=production
```

---

## الخطوة 2️⃣: إعداد Render

### 2.1 التسجيل في Render

1. اذهب إلى [render.com](https://render.com)
2. انقر على **"Sign up"**
3. اختر **"Sign up with GitHub"** (الأسهل)
4. وافق على الأذونات

### 2.2 إنشاء خدمة جديدة

1. من لوحة التحكم، انقر **"New +"**
2. اختر **"Web Service"**

### 2.3 توصيل GitHub

1. اختر **"Deploy from GitHub"**
2. ابحث عن مستودع `hsr-discord-bot`
3. انقر **"Connect"**

### 2.4 تكوين الخدمة

ملء النموذج كالتالي:

| الحقل | القيمة |
|------|--------|
| **Name** | `hsr-discord-bot` |
| **Environment** | `Node` |
| **Region** | `Singapore` (أو الأقرب لك) |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `node bot-arabic.js` |

### 2.5 إضافة متغيرات البيئة

1. انقر على **"Environment"**
2. أضف المتغيرات التالية:

```
DISCORD_TOKEN = your_actual_bot_token_here
NODE_ENV = production
```

### 2.6 اختيار الخطة

- اختر **"Free"** (مجاني)
- أو **"Starter"** (مدفوع - أفضل للاستقرار)

### 2.7 النشر

انقر **"Create Web Service"** وانتظر النشر

---

## الخطوة 3️⃣: الحصول على Discord Bot Token

### 3.1 الذهاب إلى Discord Developer Portal

1. اذهب إلى [Discord Developer Portal](https://discord.com/developers/applications)
2. انقر **"New Application"**
3. أدخل الاسم: `HSR Guide Bot`
4. انقر **"Create"**

### 3.2 إنشاء Bot

1. من الجانب الأيسر، انقر **"Bot"**
2. انقر **"Add Bot"**
3. تحت **"TOKEN"**، انقر **"Copy"**

### 3.3 تفعيل الأذونات

1. انقر **"OAuth2"** من الجانب الأيسر
2. اختر **"bot"** من قسم Scopes
3. اختر الأذونات التالية:
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Read Message History
   - ✅ Add Reactions
   - ✅ Use Slash Commands
   - ✅ Use External Apps

4. انسخ رابط الدعوة من أسفل الصفحة

### 3.4 إضافة البوت إلى السيرفر

1. افتح رابط الدعوة في المتصفح
2. اختر السيرفر الذي تريد إضافة البوت إليه
3. انقر **"Authorize"**

---

## الخطوة 4️⃣: التحقق من الحالة

### 4.1 التحقق من Render

1. اذهب إلى لوحة تحكم Render
2. اختر خدمتك `hsr-discord-bot`
3. تحقق من **"Logs"** للتأكد من عدم وجود أخطاء

### 4.2 التحقق من البوت في Discord

1. اذهب إلى سيرفرك في Discord
2. اكتب `/help` في أي قناة
3. يجب أن يرد البوت بقائمة الأوامر

---

## الخطوة 5️⃣: استكشاف الأخطاء

### المشكلة: البوت لا يظهر في السيرفر

**الحل:**
1. تأكد من نسخ Token الصحيح
2. تأكد من تفعيل الأذونات الصحيحة
3. أعد إضافة البوت باستخدام رابط الدعوة الجديد

### المشكلة: الأوامر لا تعمل

**الحل:**
1. تحقق من Logs في Render
2. تأكد من أن البوت يعمل بدون أخطاء
3. أعد تشغيل الخدمة من Render

### المشكلة: البوت يتوقف بعد فترة

**الحل:**
1. ارقع إلى خطة مدفوعة (Starter أو Pro)
2. أو استخدم Keep-Alive Service

---

## الخطوة 6️⃣: تحسين الأداء (اختياري)

### 6.1 استخدام Keep-Alive Service

لمنع توقف البوت على الخطة المجانية:

```javascript
// أضف هذا في bot-arabic.js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Keep-alive server running on port ${PORT}`);
});
```

### 6.2 تحديث package.json

```json
{
  "scripts": {
    "start": "node bot-arabic.js",
    "dev": "nodemon bot-arabic.js"
  }
}
```

---

## الخطوة 7️⃣: التحديثات المستقبلية

### تحديث الكود

```bash
# عدّل الملفات محليًا
# ثم ارفعها إلى GitHub

git add .
git commit -m "Update: Add new features"
git push origin main
```

Render سيقوم تلقائيًا بـ:
1. سحب التحديثات من GitHub
2. تشغيل `npm install`
3. إعادة تشغيل البوت

---

## الخطوة 8️⃣: المراقبة والصيانة

### عرض السجلات

1. اذهب إلى لوحة Render
2. اختر خدمتك
3. انقر **"Logs"**
4. ستظهر جميع رسائل البوت والأخطاء

### إعادة تشغيل البوت

1. من لوحة Render
2. انقر **"Manual Deploy"**
3. اختر **"Deploy latest commit"**

### إيقاف البوت

1. من لوحة Render
2. انقر **"Suspend"**

---

## 🎯 ملخص الخطوات السريعة

```
1. ✅ إنشاء مستودع GitHub
2. ✅ رفع الكود إلى GitHub
3. ✅ إنشاء حساب Render
4. ✅ توصيل GitHub مع Render
5. ✅ إضافة DISCORD_TOKEN
6. ✅ النشر
7. ✅ اختبار البوت في Discord
```

---

## 📊 معلومات مفيدة

### حدود الخطة المجانية:
- ⏱️ الخدمة تتوقف بعد 15 دقيقة من عدم الاستخدام
- 💾 100 ساعة شهرية من وقت التشغيل
- 🌐 بدون حد للطلبات

### حدود الخطة المدفوعة (Starter):
- ⏱️ تشغيل 24/7 بدون توقف
- 💾 وقت تشغيل غير محدود
- 🌐 أداء أفضل
- 💰 $7 شهريًا

---

## 🔗 روابط مفيدة

- [Discord Developer Portal](https://discord.com/developers/applications)
- [Render Dashboard](https://dashboard.render.com)
- [GitHub](https://github.com)
- [Node.js Docs](https://nodejs.org/docs)
- [Discord.js Docs](https://discord.js.org)

---

## 💬 الدعم والمساعدة

إذا واجهت مشاكل:

1. **تحقق من السجلات** في Render
2. **اقرأ رسائل الخطأ** بعناية
3. **ابحث عن الحل** في التوثيق
4. **اطلب المساعدة** في مجتمع Discord

---

## ✨ تهانينا!

البوت الآن يعمل على Render 24/7! 🎉

استمتع بـ:
- ✅ بوت مترجم بالعربية 100%
- ✅ أوامر متقدمة
- ✅ ذكاء اصطناعي
- ✅ ألعاب وتحديات
- ✅ تشغيل مستمر

---

**آخر تحديث:** أبريل 2026
**الإصدار:** 2.0 (مع الترجمة العربية الكاملة)
