---
title: Pulse of the World (نبض العالم)
emoji: 🌐
colorFrom: indigo
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# 🌐 Pulse of the World - نبض العالم

A highly polished, responsive, and multilingual global news curation and AI analysis hub. Inside, users can explore latest updates, hear headlines read aloud (TTS), chat with an AI News Companion, read deep analytical breakdowns, and inspect local smart weather insights.

---

## ✨ الميزات الرئيسية / Core Features

### 1. 🎙️ القارئ الصوتي التفاعلي (TTS)
- استمع إلى العناوين بوضوح تام بنبرة هادئة ومريحة وبدعم كامل للغة العربية والإنجليزية.
- Controls to play/stop high-fidelity vocal read-alouds of the headline contents.

### 2. 🧠 مفسر ومحلل الأخبار بالذكاء الاصطناعي (AI Editorial Explainer)
- اضغط على زر "تفسير الذكاء الاصطناعي" للحصول على تحليل متميز من 3 محاور أساسية (السياق التاريخي، المصالح والأطراف المعنية، المستقبل والنتائج).
- Generates real-time contextual analysis on arbitrary world articles via dedicated `/api/explain` proxy backed by Gemini models.

### 3. 💬 المساعد الإخباري التفاعلي (AI News Companion Chat)
- محادثة مستمرة بذكاء اصطناعي تفاعلي لمناقشة أبعاد الأخبار العالمية وتوليد التوقعات لعام 2026.
- Interactive conversational assistant built on top of high-performance LLM engines, supporting bilingual context tracking.

### 4. 🌤️ بوابة الطقس الذكي بذكاء اصطناعي (Smart AI Weather Portal)
- رصد الطقس للمدينة المحلية أو عاصمة البلد الحالي مستنداً إلى البحث والخرائط المدعمة بـ AI.
- Personalized weather metrics and outfit/outdoor clothing suggestions generated through real-time search grounding.

---

## 🛠️ كيف يعمل داخلياً / Technical Architecture

- **Frontend**: Single-Page Application (SPA) powered by **React**, **Vite**, **Tailwind CSS**, and **Motion** for highly liquid and fluid visual transitions.
- **Backend Service**: Native **Express.js** proxy running in dynamic container states, serving built static client-side directories and routing API middleware.
- **LLM Engine**: Connected cleanly to **Gemini SDK** (`@google/genai`) for safe server-side queries.

---

## 🔑 المتطلبات والتشغيل / Requirements & Deployment Checklists

To unlock full interactive Gemini features on Hugging Face Spaces, declare your **Gemini API Key** inside your Space secrets setting page:

- Go to your **Space settings** ⚙️
- Find **Repository Secrets** (Variables and Secrets)
- Create a new Secret:
  - **Key**: `GEMINI_API_KEY`
  - **Value**: *Your Gemini developer key*

---

Designed with 💙 by AI Studio Build.
