# 🚀 البدء السريع

## ما الذي تحصل عليه؟

هذا الملف يحتوي على بوت ديسكورد متقدم وشامل لـ Honkai: Star Rail مع:

✅ **15+ أوامر Slash Commands**  
✅ **نظام ذكاء اصطناعي**  
✅ **نظام ألعاب وتحديات**  
✅ **جاهز للنشر على Render**  
✅ **توثيق شامل**  

## 📋 الملفات المهمة

| الملف | الوصف |
|------|-------|
| `bot-advanced.js` | البوت الرئيسي (استخدم هذا!) |
| `bot.js` | البوت الأساسي (legacy) |
| `config.js` | الإعدادات |
| `data/characters.json` | قاعدة البيانات |
| `README_ADVANCED.md` | التوثيق الكامل |
| `RENDER_DEPLOYMENT.md` | دليل النشر على Render |
| `SETUP_GUIDE.md` | دليل التثبيت |

## ⚡ البدء السريع (5 دقائق)

### 1. تثبيت المكتبات
```bash
npm install
```

### 2. إنشاء ملف .env
```bash
# انسخ .env.example إلى .env
cp .env.example .env

# ثم عدّل .env وأضف:
DISCORD_TOKEN=YOUR_BOT_TOKEN
CLIENT_ID=YOUR_CLIENT_ID
GUILD_ID=YOUR_GUILD_ID
```

### 3. تشغيل البوت
```bash
npm start
```

### 4. استخدم الأوامر
```
/help          - عرض جميع الأوامر
/character     - معلومات الشخصية
/team          - أفضل الفرق
/ai            - سؤال ذكي
```

## 🌐 النشر على Render (مجاني!)

1. اذهب إلى [render.com](https://render.com)
2. اختر "New Web Service"
3. اختر "Deploy from GitHub"
4. اختر مستودع البوت
5. أضف متغيرات البيئة
6. انقر "Create"

📖 [دليل النشر المفصل](./RENDER_DEPLOYMENT.md)

## 🎮 الأوامر الأساسية

```
/character <name>      - معلومات الشخصية
/search <query>        - البحث
/list [filter]         - القائمة
/team <character>      - أفضل الفرق
/compare <char1> <char2> - مقارنة
/tier                  - Tier List
/relics <character>    - الآثار
/lightcone <character> - مخاريط الضوء
/ai <question>         - سؤال ذكي
/daily                 - التحدي اليومي
/build <char> <type>   - نصائح البناء
/help                  - قائمة الأوامر
```

## 🐛 استكشاف الأخطاء

### خطأ: "Cannot find module"
```bash
npm install
```

### خطأ: "Invalid Token"
- تحقق من أن Token صحيح في .env
- جرب إنشاء token جديد

### البوت لا يستجيب
- تأكد من أن البوت يعمل
- تحقق من الـ Logs
- جرب إعادة التشغيل

## 📚 المزيد من المعلومات

- 📖 [التوثيق الكامل](./README_ADVANCED.md)
- 🔧 [دليل التثبيت](./SETUP_GUIDE.md)
- 🚀 [دليل النشر](./RENDER_DEPLOYMENT.md)
- ⚙️ [الإعدادات المتقدمة](./config.js)

## 🎯 الخطوات التالية

1. ✅ ثبّت المكتبات
2. ✅ أضف Bot Token
3. ✅ شغّل البوت
4. ✅ اختبر الأوامر
5. ✅ انشره على Render

## 💡 نصائح

- استخدم `/help` لعرض جميع الأوامر
- استخدم `/ai` لأسئلة ذكية
- استخدم `/daily` للتحديات اليومية
- استخدم `/build` لنصائح البناء

---

**استمتع بالبوت! 🎮✨**

للمساعدة، اطلع على الملفات المرفقة أو اسأل في Discord!
