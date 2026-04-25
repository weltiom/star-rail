# 🌍 نظام الترجمة العربية الكاملة

## ✨ الميزات

✅ **ترجمة عربية 100%** - جميع الرسائل والأوامر والخيارات  
✅ **نظام ترجمة ديناميكي** - سهل التوسع والصيانة  
✅ **دعم متغيرات** - استبدال ديناميكي للقيم  
✅ **مصفوفات عشوائية** - نصائح وردود متنوعة  
✅ **معالجة أخطاء** - رسائل خطأ واضحة وفيدة  

## 📁 الملفات

### `locales/ar.json`
ملف الترجمة الرئيسي يحتوي على:
- أسماء الأوامر والخيارات
- الرسائل والردود
- الأخطاء والتحذيرات
- النصائح والاقتراحات
- السجلات والتنبيهات

### `locales/i18n.js`
نظام الترجمة الديناميكي يوفر:
- تحميل اللغات تلقائياً
- استبدال المتغيرات
- اختيار عشوائي من المصفوفات
- معالجة الأخطاء الآمنة

### `bot-arabic.js`
البوت المحدث مع الترجمة الكاملة

## 🚀 الاستخدام

### استيراد نظام الترجمة
```javascript
const i18n = require('./locales/i18n.js');
```

### الحصول على ترجمة بسيطة
```javascript
const message = i18n.t('commands.help.title');
// النتيجة: "📖 قائمة الأوامر"
```

### الحصول على ترجمة مع متغيرات
```javascript
const message = i18n.t('commands.character.title', {
  nameAr: 'فايرفلاي',
  nameEn: 'Firefly'
});
// النتيجة: "⭐ فايرفلاي (Firefly)"
```

### اختيار عشوائي من مصفوفة
```javascript
const tip = i18n.random('tips');
// النتيجة: نصيحة عشوائية من القائمة
```

### معالجة آمنة للأخطاء
```javascript
const message = i18n.safe('commands.unknown', {
  defaultValue: 'أمر غير معروف'
});
```

## 📊 هيكل الترجمات

```json
{
  "bot": {
    "ready": "البوت جاهز! تم تسجيل الدخول باسم: {username}",
    "error": "❌ حدث خطأ أثناء معالجة طلبك"
  },
  "commands": {
    "character": {
      "name": "شخصية",
      "description": "عرض معلومات الشخصية",
      "options": {
        "name": "اسم الشخصية"
      }
    }
  },
  "tips": [
    "💡 نصيحة 1",
    "💡 نصيحة 2"
  ]
}
```

## 🔧 إضافة ترجمات جديدة

### 1. إضافة ترجمة في `locales/ar.json`
```json
{
  "newFeature": {
    "title": "عنوان الميزة الجديدة",
    "description": "وصف الميزة"
  }
}
```

### 2. استخدام الترجمة في الكود
```javascript
const title = i18n.t('newFeature.title');
const desc = i18n.t('newFeature.description');
```

## 🌐 إضافة لغات جديدة

### 1. إنشاء ملف ترجمة جديد
```bash
touch locales/en.json
```

### 2. نسخ الهيكل من `ar.json` وترجمة القيم

### 3. استخدام اللغة الجديدة
```javascript
i18n.setLanguage('en');
const message = i18n.t('commands.help.title');
```

## 📝 أمثلة الاستخدام

### مثال 1: رسالة ترحيبية
```javascript
const welcome = i18n.t('bot.ready', {
  username: client.user.tag
});
console.log(welcome);
// النتيجة: "البوت جاهز! تم تسجيل الدخول باسم: HSR Bot#1234"
```

### مثال 2: رسالة خطأ مخصصة
```javascript
const error = i18n.t('errors.invalidCharacter');
await interaction.reply(error);
// النتيجة: "❌ اسم الشخصية غير صحيح. استخدم `/list` لعرض جميع الشخصيات"
```

### مثال 3: نصيحة عشوائية
```javascript
const tip = i18n.random('tips');
const embed = new EmbedBuilder()
  .setTitle(i18n.t('commands.tip.title'))
  .setDescription(tip);
```

### مثال 4: مقارنة مع متغيرات متعددة
```javascript
const comparison = i18n.t('commands.compare.title', {
  char1: 'فايرفلاي',
  char2: 'روان مي'
});
// النتيجة: "⚔️ مقارنة: فايرفلاي vs روان مي"
```

## 🎯 قائمة الترجمات الكاملة

### أوامر البحث
- `commands.character.*` - أوامر الشخصيات
- `commands.search.*` - أوامر البحث
- `commands.list.*` - أوامر القوائم

### أوامر الاستراتيجية
- `commands.team.*` - أوامر الفرق
- `commands.compare.*` - أوامر المقارنة
- `commands.tier.*` - أوامر Tier List

### أوامر المعدات
- `commands.relics.*` - أوامر الآثار
- `commands.lightcone.*` - أوامر مخاريط الضوء

### أوامر المعلومات
- `commands.path.*` - أوامر المسارات
- `commands.element.*` - أوامر العناصر
- `commands.stats.*` - أوامر الإحصائيات

### أوامر أخرى
- `commands.help.*` - أوامر المساعدة
- `commands.tip.*` - أوامر النصائح
- `commands.ai.*` - أوامر الذكاء الاصطناعي
- `commands.daily.*` - أوامر التحديات اليومية
- `commands.build.*` - أوامر البناء

### الأخطاء
- `errors.invalidCharacter` - شخصية غير صحيحة
- `errors.invalidPath` - مسار غير صحيح
- `errors.invalidElement` - عنصر غير صحيح
- `errors.databaseError` - خطأ قاعدة البيانات
- `errors.timeoutError` - انتهاء المهلة الزمنية
- `errors.permissionError` - خطأ الصلاحيات
- `errors.maintenanceError` - خطأ الصيانة

### السجلات
- `logs.commandExecuted` - تم تنفيذ الأمر
- `logs.commandFailed` - فشل الأمر
- `logs.userJoined` - انضم المستخدم
- `logs.userLeft` - غادر المستخدم
- `logs.botStarted` - تم بدء البوت
- `logs.botStopped` - تم إيقاف البوت
- `logs.errorOccurred` - حدث خطأ
- `logs.databaseConnected` - تم الاتصال بقاعدة البيانات
- `logs.databaseDisconnected` - تم قطع الاتصال بقاعدة البيانات

## 🔍 البحث عن الترجمات

للبحث عن ترجمة معينة:
```javascript
// البحث في جميع الترجمات
const allTranslations = i18n.getLanguage('ar');
console.log(allTranslations);
```

## 💾 حفظ الترجمات المخصصة

```javascript
// إضافة ترجمات مخصصة
i18n.addLanguage('custom', {
  "myFeature": {
    "title": "عنوان مخصص"
  }
});

// استخدام الترجمة المخصصة
i18n.setLanguage('custom');
const title = i18n.t('myFeature.title');
```

## ⚙️ الإعدادات المتقدمة

### تغيير اللغة الافتراضية
```javascript
const i18n = require('./locales/i18n.js');
i18n.setLanguage('en'); // تغيير إلى الإنجليزية
```

### الحصول على اللغات المدعومة
```javascript
const supported = i18n.getSupportedLanguages();
console.log(supported); // ['ar', 'en', ...]
```

## 📚 أفضل الممارسات

1. **استخدم مفاتيح واضحة**: `commands.character.title` بدلاً من `char_title`
2. **استخدم المتغيرات**: `{username}` بدلاً من دمج النصوص
3. **استخدم المصفوفات للتنويع**: نصائح وردود متعددة
4. **معالجة الأخطاء**: استخدم `safe()` للعمليات الحساسة
5. **تنظيم الملفات**: احفظ الترجمات في مجلد منفصل

## 🚀 الخطوات التالية

1. ✅ تحديث البوت باستخدام `bot-arabic.js`
2. ✅ اختبار جميع الأوامر
3. ✅ إضافة لغات جديدة حسب الحاجة
4. ✅ توسيع الترجمات حسب المميزات الجديدة

---

**البوت الآن مترجم بالكامل إلى اللغة العربية! 🎉**
