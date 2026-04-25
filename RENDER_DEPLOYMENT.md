# 🚀 دليل النشر على Render

## ما هو Render؟

Render هي منصة حديثة لنشر التطبيقات مع دعم Docker والتطبيقات Node.js. توفر خطة مجانية ممتازة للبوتات.

## المميزات الرئيسية

✅ **مجاني تماماً** - لا توجد تكاليف مخفية  
✅ **سهل الاستخدام** - واجهة بسيطة وسهلة  
✅ **دعم Docker** - نشر سهل وسريع  
✅ **متغيرات البيئة** - إدارة آمنة للـ Secrets  
✅ **Auto-deploy** - نشر تلقائي من GitHub  
✅ **Uptime 99%** - خادم موثوق  

## خطوات النشر

### الخطوة 1: إنشاء حساب على Render

1. اذهب إلى [render.com](https://render.com)
2. انقر على **"Sign Up"**
3. اختر **"Sign up with GitHub"** (الأسهل)
4. أكمل عملية التسجيل

### الخطوة 2: ربط مستودع GitHub

1. في لوحة التحكم، انقر على **"New +"**
2. اختر **"Web Service"**
3. اختر **"Deploy an existing repository"**
4. ابحث عن مستودع البوت واختره
5. انقر على **"Connect"**

### الخطوة 3: تكوين الخدمة

في صفحة التكوين:

| الحقل | القيمة |
|------|--------|
| **Name** | hsr-guide-bot |
| **Environment** | Docker |
| **Region** | Singapore (أو الأقرب لك) |
| **Branch** | main |
| **Dockerfile Path** | ./Dockerfile |
| **Plan** | Free |

### الخطوة 4: إضافة متغيرات البيئة

1. اسحب لأسفل إلى قسم **"Environment"**
2. انقر على **"Add Environment Variable"**
3. أضف المتغيرات التالية:

```
DISCORD_TOKEN = YOUR_BOT_TOKEN
CLIENT_ID = YOUR_CLIENT_ID
GUILD_ID = YOUR_GUILD_ID
```

### الخطوة 5: النشر

1. انقر على **"Create Web Service"**
2. سيبدأ Render بناء وتشغيل البوت تلقائياً
3. انتظر حتى تظهر رسالة "Your service is live"

## التحقق من النشر

بعد النشر:

1. اذهب إلى **"Logs"** في لوحة التحكم
2. يجب أن ترى رسالة: `✅ البوت جاهز! تم تسجيل الدخول باسم: HSR Guide Bot#XXXX`
3. جرب الأوامر في Discord

## إعادة النشر

### عند تحديث الكود:

```bash
git add .
git commit -m "تحديث البوت"
git push origin main
```

Render سيكتشف التغييرات تلقائياً وينشرها!

### إعادة النشر اليدوية:

1. في لوحة التحكم، انقر على **"Manual Deploy"**
2. اختر **"Deploy latest commit"**

## استكشاف الأخطاء

### المشكلة: البوت لا يظهر "Online"

**الحل:**
1. تحقق من الـ Logs في Render
2. تأكد من أن DISCORD_TOKEN صحيح
3. جرب إعادة النشر

### المشكلة: خطأ في البناء

**الحل:**
1. تحقق من `package.json` - تأكد من أن جميع المكتبات موجودة
2. تحقق من `Dockerfile` - تأكد من الصحة
3. جرب النشر محلياً أولاً

### المشكلة: البوت يتوقف بعد فترة

**الحل:**
هذا طبيعي في الخطة المجانية من Render. للحل:
- ترقية إلى خطة مدفوعة
- أو استخدام خدمة مثل UptimeRobot للحفاظ على التشغيل

## نصائح إضافية

### 1. استخدام GitHub Actions (اختياري)

أنشئ ملف `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Render

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Trigger Render Deploy
        run: |
          curl -X POST https://api.render.com/deploy/srv-YOUR_SERVICE_ID?key=YOUR_API_KEY
```

### 2. مراقبة الأداء

في لوحة التحكم Render:
- **Metrics** - عرض استخدام CPU والذاكرة
- **Logs** - عرض السجلات الحية
- **Events** - عرض أحداث النشر

### 3. تحديث البوت

للتحديث:
1. عدّل الكود محلياً
2. اختبره
3. ادفعه إلى GitHub
4. Render سينشره تلقائياً

## الخطة المجانية من Render

| الميزة | الحد |
|--------|------|
| **الذاكرة** | 512 MB |
| **CPU** | Shared |
| **التخزين** | 100 GB |
| **Bandwidth** | غير محدود |
| **وقت التشغيل** | محدود (قد يتوقف بعد فترة عدم استخدام) |

## الترقية إلى خطة مدفوعة

إذا أردت:
- وقت تشغيل 24/7
- موارد أكثر
- دعم أولوي

اذهب إلى **"Settings"** واختر **"Change Plan"**

## الأمان

⚠️ **تحذير مهم:**

1. **لا تشارك متغيرات البيئة** - احفظها في Render فقط
2. **استخدم Secrets** - لا تضعها في الكود
3. **حدّث المكتبات** - بانتظام للأمان

## الدعم

إذا واجهت مشاكل:

1. تحقق من [Render Docs](https://render.com/docs)
2. اطلب المساعدة في [Render Community](https://community.render.com)
3. تواصل مع [Render Support](https://render.com/support)

## الخطوات التالية

بعد النشر بنجاح:

1. ✅ تأكد من أن البوت يعمل
2. ✅ اختبر الأوامر
3. ✅ راقب الـ Logs
4. ✅ أضف المزيد من الميزات
5. ✅ شارك البوت مع الآخرين!

---

**استمتع بالبوت على Render! 🚀**
