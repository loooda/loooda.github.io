# 🚀 دليل رفع تطبيق "نبض العالم" إلى Vercel

لقد قمنا بتهيئة التطبيق بالكامل ليكون متوافقاً مع منصة **Vercel** كـ **Full-Stack Application** (React + Express Serverless Functions). 

إليك خطوات رفع وتشغيل موقعك بنجاح على Vercel:

---

## 🛠️ الخطوة 1: تجهيز المتطلبات على Vercel
1. تأكد من وجود حساب لك على منصة [Vercel](https://vercel.com).
2. قم باستيراد (Import) مستودع المشروع (GitHub Repo) الخاص بك، أو استخدم **Vercel CLI** لرفع الكود مباشرة من جهازك.

---

## ⚙️ الخطوة 2: الإعدادات التلقائية (Build & Development Settings)
عند استيراد المشروع في Vercel، سيتعرف النظام تلقائياً على إعدادات **Vite**. الإعدادات الافتراضية صحيحة وجاهزة:
- **Build Command:** `vite build` *(محددة بالفعل في ملف `vercel.json`)*
- **Output Directory:** `dist` *(محددة بالفعل في ملف `vercel.json`)*

---

## 🔑 الخطوة 3: إضافة مفاتيح البيئة (Environment Variables)
لكي تعمل كافة خدمات الذكاء الاصطناعي بشكل ذكي وتفاعلي، ستحتاج إلى إضافة المتغير التالي في إعدادات المشروع على Vercel (**Settings -> Environment Variables**):

1. **الاسم (Key):** `GEMINI_API_KEY`
2. **القيمة (Value):** *مفتاح الـ API الخاص بـ Google Gemini*

---

## 🌐 الخطوة 4: النشر والتشغيل
* بعد اكتمال الرفع والـ Deploy، سيقوم Vercel بتأمين نطاق (Domain) مجاني لموقعك بصيغة `https://your-project.vercel.app`.
* مسارات الـ API (مثل `/api/news` و `/api/weather`) ستعمل كـ **Vercel Serverless Functions** ذات سرعة وكفاءة عالية جداً.
* تم تفعيل ميزة `ads.txt` تلقائياً عبر مجلد `/public/ads.txt` لتكون متاحة لغايات تحقيق الأرباح.
