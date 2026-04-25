# استخدام صورة Node.js الرسمية
FROM node:18-alpine

# تعيين مجلد العمل
WORKDIR /app

# نسخ ملفات المشروع
COPY package*.json ./
COPY . .

# تثبيت المكتبات
RUN npm install --production

# تعريض المنفذ (اختياري)
EXPOSE 3000

# تشغيل البوت
CMD ["node", "bot-advanced.js"]
