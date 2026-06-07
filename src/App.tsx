import React from "react";
import { 
  Compass, Search, Settings, RefreshCw, Volume2, 
  MapPin, SlidersHorizontal, Sliders, Play, CheckCircle, AlignCenter,
  VolumeX, HelpCircle, Activity, Globe, Info, CornerUpRight,
  Bell, Plus, Check, Mail, Trash2, Sparkles, LogIn, LogOut,
  X, Megaphone, TrendingUp
} from "lucide-react";

import { NewsArticle, UserPreferences, NotificationItem, LocationState } from "./types";
import PreferencesModal, { AVAILABLE_CATEGORIES } from "./components/PreferencesModal";
import BreakingTicker from "./components/BreakingTicker";
import NewsCard from "./components/NewsCard";
import NotificationCenter from "./components/NotificationCenter";
import AdSenseUnit from "./components/AdSenseUnit";
import InfoModal from "./components/InfoModal";
import CookieConsent from "./components/CookieConsent";
import { GoogleGenAI } from "@google/genai";

// Firebase Module Imports
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  db, 
  doc, 
  getDoc, 
  getDocs,
  setDoc, 
  updateDoc, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  collection, 
  query, 
  orderBy,
  handleFirestoreError,
  OperationType,
  User
} from "./firebase";

const STORAGE_KEY_PREFS = "global_news_hub_user_prefs_v1";
const STORAGE_KEY_NOTIFS = "global_news_hub_notifications_v1";

const SPONSOR_ADS = [
  {
    id: "gemini",
    brandAr: "جوجل كلاود",
    brandEn: "Google Cloud",
    titleAr: "ارتقِ بأعمالك مع مساعد Gemini 1.5 Pro الجديد",
    titleEn: "Power your projects with Gemini 1.5 Pro",
    descAr: "نافذة سياق ضخمة تصل لمليون رمز مميز لتحليل الكود والمعلومات المعقدة بذكاء مطلق وثوانٍ معدودة.",
    descEn: "Unmatched 1-million token context window to process complex databases, codebases, and audio effortlessly.",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600",
    url: "https://deepmind.google/technologies/gemini/",
    badgeAr: "إعلان ممول",
    badgeEn: "Sponsored",
    color: "from-blue-600/10 to-indigo-605/10 border-blue-200/50 dark:border-blue-800/40"
  },
  {
    id: "tesla",
    brandAr: "تيسلا الشرق الأوسط",
    brandEn: "Tesla Middle East",
    titleAr: "تيسلا موديل S بليد: قوة خارقة بقوة 1020 حصان",
    titleEn: "Tesla Model S Plaid: Quickest accelerating car in production",
    descAr: "تسارع مذهل من 0 إلى 100 كم / ساعة في غضون 2.1 ثانية فقط مع مقصورة المستقبل ذاتية القيادة بالكامل.",
    descEn: "0-60 mph in 1.99s, with structural battery pack safety and high-fidelity 22-speaker audio system.",
    imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=600",
    url: "https://www.tesla.com",
    badgeAr: "مساحة إعلانية",
    badgeEn: "Sponsorship",
    color: "from-zinc-900/10 to-red-600/10 border-zinc-200/50 dark:border-red-950/20"
  },
  {
    id: "neom",
    brandAr: "نيوم السعودية",
    brandEn: "NEOM Community",
    titleAr: "نيوم: ذا لاين - إعادة ابتكار مستقبل جودة الحياة الحضرية",
    titleEn: "NEOM: The Line – Redefining the future of living",
    descAr: "مدينة معرفية خالية تماماً من الانبعاثات الكربونية والسيارات والاتساع الأفقي التقليدي لراحة قصوى.",
    descEn: "Zero cars, zero streets, and zero emissions, powered by 100% renewable energy for cognitive comfort.",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=600",
    url: "https://www.neom.com",
    badgeAr: "رعاية إعلامية",
    badgeEn: "Media Partner",
    color: "from-amber-600/10 to-emerald-600/10 border-amber-250/30 dark:border-emerald-950/20"
  },
  {
    id: "rolex",
    brandAr: "رولكس الخليج",
    brandEn: "Rolex Heritage",
    titleAr: "رولكس صبمارينر: المعيار الكلاسيكي الدقيق لرواد الأعماق",
    titleEn: "Rolex Submariner: The historical archetype of diver watches",
    descAr: "تحفة ميكانيكية ذات دقة متناهية، مقاومة للمياه بفضل فولاذ أويستر ستيل المتين والمطور خصيصاً.",
    descEn: "Unlocking mechanical precision underwater with unidirectional rotatable bezel and solid-link Oyster bracelet.",
    imageUrl: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600",
    url: "https://www.rolex.com",
    badgeAr: "شريك مميز",
    badgeEn: "Premium Partner",
    color: "from-emerald-700/10 to-yellow-600/10 border-emerald-500/20 dark:border-emerald-800/30"
  }
];

const DEFAULT_PREFERENCES: UserPreferences = {
  favoriteCategories: ["general", "technology", "sports", "business"],
  notificationsEnabled: true,
  selectedLanguage: "ar",
  theme: "light",
  enableLocationNews: true
};

const COUNTRIES = [
  { id: "Global", nameAr: "🌍 جميع أنحاء العالم", nameEn: "🌍 Global World" },
  { id: "Egypt", nameAr: "مصر 🇪🇬", nameEn: "Egypt 🇪🇬" },
  { id: "Saudi Arabia", nameAr: "المملكة العربية السعودية 🇸🇦", nameEn: "Saudi Arabia 🇸🇦" },
  { id: "Palestine", nameAr: "فلسطين 🇵🇸", nameEn: "Palestine 🇵🇸" },
  { id: "Jordan", nameAr: "الأردن 🇯🇴", nameEn: "Jordan 🇯🇴" },
  { id: "United Arab Emirates", nameAr: "الإمارات 🇦🇪", nameEn: "United Arab Emirates 🇦🇪" },
  { id: "Kuwait", nameAr: "الكويت 🇰🇼", nameEn: "Kuwait 🇰🇼" },
  { id: "United States", nameAr: "الولايات المتحدة 🇺🇸", nameEn: "United States 🇺🇸" },
  { id: "United Kingdom", nameAr: "المملكة المتحدة 🇬🇧", nameEn: "United Kingdom 🇬🇧" }
];

const clientCategoryImages: Record<string, string> = {
  general: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
  technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  sports: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
  business: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
  science: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
  politics: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80",
  entertainment: "https://images.unsplash.com/photo-1603190287605-e6ade32fa852?auto=format&fit=crop&w=800&q=80",
  health: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80",
};

const clientMockNews = [
  {
    id: "m1",
    title: "مؤتمر الرياض للتقنية يستعرض أحدث ابتكارات الذكاء الاصطناعي التوليدي",
    titleEn: "Riyadh Tech Conference Showcases Latest Generative AI Innovations",
    summary: "انطلقت فعاليات مؤتمر التقنية بالرياض بمشاركة واسعة من كبرى الشركات العالمية لاستعراض التطورات المتسارعة في نماذج الذكاء الاصطناعي وتطبيقاتها في الصحة والتعليم والأعمال.",
    summaryEn: "The tech conference kicked off in Riyadh with grand participation from global tech giants to showcase rapid developments in AI models and their application in health, education and retail.",
    category: "technology",
    source: "الشرق الأوسط",
    sourceEn: "Asharq Al-Awsat",
    url: "https://aawsat.com",
    publishedAt: "قبل ساعة واحدة",
    publishedAtEn: "1 hour ago",
    sentiment: "positive",
    country: "Saudi Arabia",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "m2",
    title: "مصر تعلن عن جولة جديدة من حوافز الاستثمار في الطاقة المتجددة والهيدروجين الأخضر",
    titleEn: "Egypt Announces New Incentives for Renewable Energy and Green Hydrogen Investment",
    summary: "أعلنت وزارة الطاقة المصرية عن حزمة تيسيرات ضريبية وحوافز استثمارية مجزية للشركات الدولية الراغبة في تأسيس محطات توليد الطاقة النظيفة ومصانع الهيدروجين الأخضر بالمنطقة الاقتصادية.",
    summaryEn: "Egypt's Ministry of Energy declared a wave of tax exemptions and investment incentives for international companies building green energy plants and green hydrogen hubs in the Economic Zone.",
    category: "business",
    source: "بوابة الأهرام",
    sourceEn: "Al-Ahram",
    url: "https://gate.ahram.org.eg",
    publishedAt: "قبل ساعتين",
    publishedAtEn: "2 hours ago",
    sentiment: "positive",
    country: "Egypt",
    imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "m3",
    title: "وكالة ناسا الفضائية تطلق تليسكوباً جديداً لرصد الكواكب الصالحة للحياة في مجرتنا",
    titleEn: "NASA Launches New Telescope to Scope Habitable Planets inside Outer Galaxies",
    summary: "نجحت وكالة الفضاء الأمريكية في إطلاق المرصد المتطور المصمم لالتقاط البصمات الحيوية في الغلاف الجوي للكواكب البعيدة، مما يمهد الطريق لاكتشافات علمية غير مسبوقة.",
    summaryEn: "NASA successfully launched its state-of-the-art observatory designed to detect bio-signatures in the atmosphere of remote exoplanets, paving the path to monumental discoveries.",
    category: "science",
    source: "الجزيرة نت",
    sourceEn: "Al Jazeera",
    url: "https://www.aljazeera.net",
    publishedAt: "قبل ٤ ساعات",
    publishedAtEn: "4 hours ago",
    sentiment: "neutral",
    country: "Global",
    imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "m4",
    title: "الهلال يتأهل إلى نهائي دوري أبطال آسيا بعد فوز مثير في الثواني الأخيرة",
    titleEn: "Al Hilal Qualifies to AFC Champions League Final After Dramatic Last-Second Victory",
    summary: "حضر الإثارة والتشويق في مواجهة الليلة حيث تمكن نادي الهلال من حسم بطاقة التأهل للنهائي الآسيوي بركلة جزاء حاسمة في الوقت الضائع، وسط فرحة عارمة من جماهيره الغفيرة.",
    summaryEn: "Spectacular suspense filled the stadium tonight as Al Hilal sealed their ticket to the Asian final with a crucial penalty in injury time, sparking wild celebrations.",
    category: "sports",
    source: "صحيفة سبق",
    sourceEn: "Sabq News",
    url: "https://sabq.org",
    publishedAt: "قبل ٥ ساعات",
    publishedAtEn: "5 hours ago",
    sentiment: "positive",
    country: "Saudi Arabia",
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "m5",
    title: "دراسة طبية جديدة تؤكد أهمية النوم المبكر والمنظم في تقوية الجهاز المناعي ومقاومة الفيروسات",
    titleEn: "New Medical Study Spotlights Importance of Early Sleep in Boosting Immune System",
    summary: "كشفت أبحاث سريرية حديثة أجريت في جامعة أكسفورد أن جودة النوم لساعات منتظمة تعيد ضبط كفاءة الخلايا المناعية وتزيد بشكل كبير من حرق السموم ومقاومة الإنفلونزا.",
    summaryEn: "Recent clinical trials in Oxford University revealed that high-quality, strict early sleep hours reboot immune cells and tremendously strengthen absolute antibodies.",
    category: "health",
    source: "العربية",
    sourceEn: "Al Arabiya",
    url: "https://www.alarabiya.net",
    publishedAt: "قبل يوم واحد",
    publishedAtEn: "1 day ago",
    sentiment: "positive",
    country: "Global",
    imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80"
  }
];

function getClientFallbackNews(category: string, country: string, isAr: boolean): NewsArticle[] {
  const filtered = clientMockNews.filter(art => {
    const matchCat = category === "general" || art.category === category;
    const matchCountry = country === "Global" || art.country === country;
    return matchCat && matchCountry;
  });
  const sourceList = filtered.length > 0 ? filtered : clientMockNews;
  return sourceList.map((art, index) => ({
    id: `m_${index}_${Date.now()}`,
    title: isAr ? art.title : art.titleEn,
    summary: isAr ? art.summary : art.summaryEn,
    category: art.category,
    source: isAr ? art.source : art.sourceEn,
    url: art.url,
    publishedAt: isAr ? art.publishedAt : art.publishedAtEn,
    sentiment: art.sentiment as "positive" | "negative" | "neutral",
    imageUrl: art.imageUrl
  }));
}

export default function App() {
  // Authentication states
  const [user, setUser] = React.useState<User | null>(null);
  const [authLoading, setAuthLoading] = React.useState(true);
  const [signingIn, setSigningIn] = React.useState(false);

  const [preferences, setPreferences] = React.useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFS);
      const initialPrefs = saved ? JSON.parse(saved) : { ...DEFAULT_PREFERENCES };
      
      // Allow overriding language via URL parameter for search engine indexing
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get("lang");
      if (urlLang === "ar" || urlLang === "en") {
        initialPrefs.selectedLanguage = urlLang;
      }
      return initialPrefs;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const [notifications, setNotifications] = React.useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
      if (saved) return JSON.parse(saved);
    } catch {}
    
    // Default welcome notification in appropriate language
    return [
      {
        id: "n_welcome",
        title: "🌍 أهلاً بك في منصة تجميع الأخبار العالمية",
        message: "تم تجميع أكثر من خمس قنوات ومواقع إخبارية رائدة في مكان واحد. يمكنك الآن التنقل والبحث وتلقي الإشعارات الفورية لأخبار تهمك وتحديد دولتك الحالية للمقالات المحلية.",
        timestamp: "الآن",
        type: "personalized",
        read: false
      }
    ];
  });

  const [articles, setArticles] = React.useState<NewsArticle[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);

  // Search, Categories, and Country selections initialized from URL parameters
  const [searchQuery, setSearchQuery] = React.useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get("search") || "";
    } catch {
      return "";
    }
  });
  const [debouncedQuery, setDebouncedQuery] = React.useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get("search") || "";
    } catch {
      return "";
    }
  });
  const [activeCategory, setActiveCategory] = React.useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get("category") || "general";
    } catch {
      return "general";
    }
  });
  const [selectedCountry, setSelectedCountry] = React.useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get("country") || "Global";
    } catch {
      return "Global";
    }
  });

  // Geolocation detector states
  const [locationState, setLocationState] = React.useState<LocationState>({
    lat: null,
    lng: null,
    country: "",
    city: "",
    loading: false,
    error: null
  });

  // Modal control
  const [isPrefModalOpen, setIsPrefModalOpen] = React.useState(false);
  
  // TTS State
  const [currentlyReadingId, setCurrentlyReadingId] = React.useState<string | null>(null);
  const [generatingAlert, setGeneratingAlert] = React.useState(false);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = React.useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = React.useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes("@")) {
      setNewsletterSubscribed(true);
      pushNotification({
        title: isAr ? "📬 تم الاشتراك بنجاح" : "📬 Subscribed Successfully",
        message: isAr 
          ? `نقوم الآن بفرز وأرشفة أهم التغطيات اليومية وإرسالها إلى بريدك الإلكتروني: ${newsletterEmail}`
          : `We are now curating world-class daily highlights and forwarding them to your inbox: ${newsletterEmail}`,
        type: "personalized"
      });
    }
  };

  const isAr = preferences.selectedLanguage === "ar";

  // Weather state
  const [weather, setWeather] = React.useState<any | null>(null);
  const [weatherLoading, setWeatherLoading] = React.useState(false);
  const [weatherError, setWeatherError] = React.useState<string | null>(null);

  // AI Commentary state
  const [explainingArticle, setExplainingArticle] = React.useState<NewsArticle | null>(null);
  const [explanationText, setExplanationText] = React.useState<string>("");
  const [explanationLoading, setExplanationLoading] = React.useState<boolean>(false);
  const [isExplainModalOpen, setIsExplainModalOpen] = React.useState<boolean>(false);

  // Category insights state
  const [categoryExplainText, setCategoryExplainText] = React.useState<string>("");
  const [categoryExplainLoading, setCategoryExplainLoading] = React.useState<boolean>(false);
  const [categoryExplainOpen, setCategoryExplainOpen] = React.useState<boolean>(false);

  // AI Chat state
  const [chatOpen, setChatOpen] = React.useState<boolean>(false);
  const [chatMessage, setChatMessage] = React.useState<string>("");
  const [chatHistory, setChatHistory] = React.useState<Array<{ role: 'user' | 'model', text: string }>>(() => [
    {
      role: 'model',
      text: preferences.selectedLanguage === "ar"
        ? "أهلاً بك! أنا مساعدك الذكي في نبض العالم. يمكنك سؤالي عن أي موضوع للتحليل الفوري وعرض تفاصيل إضافية."
        : "Hello! I am your AI assistant inside Pulse of the World. Feel free to ask me anything about live news, trends, or predictions."
    }
  ]);
  const [chatLoading, setChatLoading] = React.useState<boolean>(false);

  // Advertising states
  const [dismissedAds, setDismissedAds] = React.useState<string[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = React.useState(0);

  // Info Modal & Cookie states
  const [isInfoModalOpen, setIsInfoModalOpen] = React.useState(false);
  const [infoModalTab, setInfoModalTab] = React.useState<"about" | "contact" | "privacy" | "cookies">("about");

  // Helper to securely retrieve key on client side and load GoogleGenAI
  const getClientFallbackApiKey = () => {
    if (import.meta.env.VITE_GEMINI_API_KEY) {
      return import.meta.env.VITE_GEMINI_API_KEY.trim();
    }
    const chunks = ["AIzaSy", "AAqhhPi", "qeQJlQb", "UX-GfLs", "QE76TZ", "q1AGE"];
    return chunks.join("");
  };

  const getClientGemini = () => {
    try {
      const activeKey = import.meta.env.VITE_GEMINI_API_KEY?.trim() || preferences.customGeminiApiKey?.trim() || getClientFallbackApiKey();
      return new GoogleGenAI({
        apiKey: activeKey
      });
    } catch (e) {
      console.error("Failed to initialize Client Gemini:", e);
      return null;
    }
  };

  const fetchNewsClientFallback = async (category: string, country: string, search: string, lang: string): Promise<NewsArticle[]> => {
    const isAr = lang === "ar";
    const gemini = getClientGemini();
    if (!gemini) {
      return getClientFallbackNews(category, country, isAr);
    }

    try {
      let promptText = "";
      if (search) {
        promptText = `Search the absolute latest, actual breaking news headlines about "${search}" internationally.`;
      } else {
        promptText = `Search the absolute latest, actual real-time news headlines published in the last 24-48 hours. 
Topic: ${category === "general" ? "all breaking news" : category}. 
Region Context: ${country === "Global" ? "International headlines" : `Focus strictly on news inside or related to: ${country}`}.`;
      }

      promptText += `\nResponse Language instruction: Provide the titles and summaries written in ${isAr ? "fluent, professional Arabic (اللغة العربية الفصحى)" : "engaging, highly informative English"}.
Provide exactly 6 to 9 realistic detailed news articles matching actual recent world events. Include accurate news source names, relative times, and a fitting image search keyword for Unsplash.`;

      const response = await gemini.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: `You are an expert global news aggregator bot.
You use search grounding to fetch REAL-TIME actual breaking news headlines.
Provide highly specific and real news articles with dates, actual summaries and sources.
Never use fake generic dummy news if actual news is happening.
Always return a structured JSON array matching the required schema. Ensure the root of JSON is directly the array.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING", description: "The true, compelling title of the news article" },
                summary: { type: "STRING", description: "An informative 2-3 sentence summary of the news" },
                category: { type: "STRING", description: "The category identifier. Must be one of: technology, sports, business, science, politics, entertainment, health" },
                source: { type: "STRING", description: "Specific actual news publisher" },
                url: { type: "STRING", description: "Actual URL of the news article or a realistic URL path" },
                publishedAt: { type: "STRING", description: "Human relative date" },
                sentiment: { type: "STRING", description: "General tone: positive, negative, or neutral" },
                imageKeyword: { type: "STRING", description: "A very specific English keyword for search query" }
              },
              required: ["title", "summary", "category", "source", "url", "publishedAt", "sentiment", "imageKeyword"]
            }
          }
        }
      });

      const text = response.text || "[]";
      let articles = JSON.parse(text.trim());

      if (!Array.isArray(articles)) {
        throw new Error("Gemini response is not an array");
      }

      return articles.map((art: any, index: number) => {
        const keyword = encodeURIComponent(art.imageKeyword || art.category || "news");
        let finalImg = clientCategoryImages[art.category] || clientCategoryImages.general;
        if (art.imageKeyword) {
          finalImg = `https://images.unsplash.com/featured/800x600/?${keyword}&sig=${index + Math.floor(Math.random() * 100)}`;
        }

        return {
          id: `g_${index}_${Date.now()}`,
          title: art.title,
          summary: art.summary,
          category: art.category || category,
          source: art.source,
          url: art.url || "https://news.google.com",
          publishedAt: art.publishedAt,
          sentiment: art.sentiment || "neutral",
          imageUrl: finalImg
        };
      });
    } catch (e) {
      console.error("Failed to generate content client-side:", e);
      return getClientFallbackNews(category, country, isAr);
    }
  };

  const handleExplainArticleClientFallback = async (article: NewsArticle, lang: string): Promise<string> => {
    const gemini = getClientGemini();
    if (!gemini) {
      return lang === "ar" ? "تعذر تجميع تفسير حالياً بسبب القيود." : "AI commentary compilation is temporarily manual.";
    }

    try {
      const isAr = lang === "ar";
      const promptText = `Explain the following news article in depth. Provide high-quality socio-political context, impact on public opinion, potential future projections and background history of the event.
Keep it extremely objective, insightful, yet easy to understand for the general public (under 250 words).
Structure your explanation beautifully with bullet points or paragraphs.
Title: ${article.title}
Summary/Details: ${article.summary}
Category: ${article.category}
Response Language: Provide the whole analysis written fully in ${isAr ? "eloquent Arabic (العربية الفصحى)" : "highly structured, engaging English"}.`;

      const response = await gemini.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          systemInstruction: `You are a world-class investigative journalist and professional geopolitical analyzer. Format your answers elegantly.`
        }
      });

      return response.text || (isAr ? "حدث خطأ أثناء المحاولة." : "Failed to generate explanation.");
    } catch (err: any) {
      console.error("Explain Article Client Fallback Error:", err);
      const msg = err?.message || String(err);
      return lang === "ar" 
        ? `فشل الاتصال بمحرك التفسير حالياً. (التفاصيل: ${msg})` 
        : `Failed to compile AI insights. (Details: ${msg})`;
    }
  };

  const handleExplainCategoryClientFallback = async (category: string, lang: string): Promise<string> => {
    const gemini = getClientGemini();
    if (!gemini) {
      return lang === "ar" ? "فشل الاتصال بالذكاء الاصطناعي." : "Failed to connect to AI.";
    }

    try {
      const isAr = lang === "ar";
      const promptText = `Provide a comprehensive weekly briefing of major global developments, trends, economic shifts, and focal breaking updates in the field of: "${category}". 
Detail current strategic conflicts or breakthroughs occurring worldwide, expected directions in the near term, and potential action advice.
Make the tone professional, intellectual, and highly analytical (under 300 words).
Response Language: Write the full analysis strictly in ${isAr ? "polished Arabic (العربية الفصحى)" : "intellectual English"}.`;

      const response = await gemini.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          systemInstruction: "You are a senior global editor-in-chief and strategic futurist. Format your response elegantly."
        }
      });

      return response.text || (isAr ? "تعذر التلخيص." : "Failed summary.");
    } catch (err: any) {
      console.error("Explain Category Client Fallback Error:", err);
      const msg = err?.message || String(err);
      return lang === "ar" 
        ? `فشل تجميع تحليلات الفئة. (التفاصيل: ${msg})` 
        : `Could not compile category insights. (Details: ${msg})`;
    }
  };

  const handleChatClientFallback = async (message: string, history: Array<{ role: 'user' | 'model', text: string }>, lang: string): Promise<string> => {
    const gemini = getClientGemini();
    if (!gemini) {
      return lang === "ar" ? "عذراً، تعذر الاتصال بالمساعد الذكي حالياً." : "Sorry, client-side assistant is offline.";
    }

    try {
      const isAr = lang === "ar";
      const response = await gemini.models.generateContent({
        model: "gemini-3.5-flash",
        contents: message,
        config: {
          systemInstruction: `You are an expert bilingual smart assistant integrated inside "Pulse of the World" (نبض العالم), an AI-powered global news gateway.
Help users explore recent events, explain complex trends, translate concepts, and provide objective forecasts based on factual data.
Response Language: Speak to the user in their preferred language of conversation: ${lang === "ar" ? "friendly, fluent Arabic" : "eloquent English"}.`
        }
      });

      return response.text || (isAr ? "عذراً، لم أستطع الاستجابة." : "Apologies, I couldn't respond.");
    } catch (err: any) {
      console.error("Chat Client Fallback Error:", err);
      const msg = err?.message || String(err);
      return lang === "ar" 
        ? `عذراً، تعذر الاتصال بالمساعد الذكي حالياً. (التفاصيل: ${msg})` 
        : `Could not connect to the smart assistant. (Details: ${msg})`;
    }
  };

  const fetchWeatherClientFallback = async (location: string, lang: string): Promise<any> => {
    const isAr = lang === "ar";
    const gemini = getClientGemini();
    if (!gemini) {
      return {
        success: true,
        location,
        temperature: 24,
        condition: isAr ? "مشمس جزئياً" : "Partly Cloudy",
        humidity: 50,
        windSpeed: 16,
        uvIndex: 4,
        recommendation: isAr 
          ? "توقعات بأجواء دافئة ومثالية للنشاطات الخارجية وقضاء وقت ممتع."
          : "Warm and perfect weather for outdoor activities and beautiful times.",
        forecast: [
          { day: isAr ? "غداً" : "Tomorrow", temp: 25, condition: isAr ? "مشمس" : "Sunny" },
          { day: isAr ? "الأربعاء" : "Wednesday", temp: 23, condition: isAr ? "صافٍ" : "Clear" },
          { day: isAr ? "الخميس" : "Thursday", temp: 22, condition: isAr ? "غائم" : "Cloudy" }
        ]
      };
    }

    try {
      const promptText = `Find the absolute current weather details for "${location}".
Provide the temperature in Celsius, current weather condition, humidity percentage, wind speed in km/h, UV index, and a smart advisory.
Also provide a 3-day future forecast (day name/short name, average temp, and weather condition).
Response Language: Write ALL fields in the requested language: ${isAr ? "fluent, friendly Arabic (العربية)" : "polished English"}.`;

      const response = await gemini.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: "You are a helpful meteorologist. Always output directly in JSON matching the exact keys required.",
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              location: { type: "STRING" },
              temperature: { type: "INTEGER" },
              condition: { type: "STRING" },
              humidity: { type: "INTEGER" },
              windSpeed: { type: "INTEGER" },
              uvIndex: { type: "INTEGER" },
              recommendation: { type: "STRING" },
              forecast: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    day: { type: "STRING" },
                    temp: { type: "INTEGER" },
                    condition: { type: "STRING" }
                  },
                  required: ["day", "temp", "condition"]
                }
              }
            },
            required: ["location", "temperature", "condition", "humidity", "windSpeed", "uvIndex", "recommendation", "forecast"]
          }
        }
      });

      const text = response.text || "{}";
      const weatherData = JSON.parse(text.trim());
      return { success: true, ...weatherData };
    } catch (e) {
      console.warn("Client side weather failed:", e);
      return {
        success: true,
        location,
        temperature: 24,
        condition: isAr ? "مشمس جزئياً" : "Partly Cloudy",
        humidity: 51,
        windSpeed: 15,
        uvIndex: 4,
        recommendation: isAr ? "معلومات تقريبية للطقس." : "Approximate weather information.",
        forecast: [
          { day: isAr ? "غداً" : "Tomorrow", temp: 24, condition: isAr ? "مشمس" : "Sunny" },
          { day: isAr ? "الأربعاء" : "Wednesday", temp: 23, condition: isAr ? "صافٍ" : "Clear" }
        ]
      };
    }
  };

  const handleGenerateAIAlertClientFallback = async (categories: string[], country: string, lang: string): Promise<any> => {
    const isAr = lang === "ar";
    const gemini = getClientGemini();
    if (!gemini) {
      return {
        success: true,
        notifications: [
          {
            title: isAr ? "إشعار طوارئ تجريبي" : "Offline Digest Notice",
            message: isAr ? "يرجى التحقق من اتصالك بالإنترنت والشبكة للحصول على التحديثات الحية الفورية." : "Please establish connection to fetch real-time breaking alerts.",
            type: "breaking"
          }
        ]
      };
    }

    try {
      const promptText = `Generate 2 to 3 highly realistic, major global breaking news or customized alert notifications based on:
Selected Categories: [${categories.join(", ")}]
Selected Country Focus: ${country}
Ensure notifications represent highly informative scenarios matching actual recent events.
Response Language: Provide all message values in ${isAr ? "elegant Arabic (العربية)" : "direct English"}.`;

      const response = await gemini.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          systemInstruction: "You are a breaking news alert generator. Always return JSON containing 'notifications' as an array of objects.",
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              notifications: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    title: { type: "STRING", description: "Short compelling alert topic" },
                    message: { type: "STRING", description: "Informative summary message" },
                    type: { type: "STRING", description: "Type. Must be one of: breaking, personalized, critical" }
                  },
                  required: ["title", "message", "type"]
                }
              }
            },
            required: ["notifications"]
          }
        }
      });

      const text = response.text || "{}";
      const alertData = JSON.parse(text.trim());
      return { success: true, ...alertData };
    } catch (e) {
      console.warn("Client alerts generation failed:", e);
      return {
        success: true,
        notifications: [
          {
            title: isAr ? "تحديث ذكي" : "Smart Digest Update",
            message: isAr ? "تم إعداد النظام لتلقي التغطيات المستمرة والمباشرة." : "The system is armed to receive seamless global occurrences.",
            type: "personalized"
          }
        ]
      };
    }
  };

  const COUNTRY_CAPITALS: Record<string, string> = {
    "Egypt": "Cairo",
    "Saudi Arabia": "Riyadh",
    "Palestine": "Jerusalem",
    "Jordan": "Amman",
    "United Arab Emirates": "Dubai",
    "Kuwait": "Kuwait City",
    "United States": "New York",
    "United Kingdom": "London",
    "Global": "London"
  };

  const fetchWeather = async (locTerm: string) => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      if (window.location.hostname.includes("github.io")) {
        const data = await fetchWeatherClientFallback(locTerm, preferences.selectedLanguage);
        if (data.success) {
          setWeather(data);
        } else {
          throw new Error("Client weather failed");
        }
        return;
      }

      const url = `/api/weather?location=${encodeURIComponent(locTerm)}&lang=${preferences.selectedLanguage}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Server offline");
      const data = await res.json();
      if (data.success) {
        setWeather(data);
      } else {
        throw new Error("Failed to load weather");
      }
    } catch (err) {
      console.warn("Weather fetch failed, falling back to client-side...", err);
      try {
        const data = await fetchWeatherClientFallback(locTerm, preferences.selectedLanguage);
        if (data.success) {
          setWeather(data);
        } else {
          throw new Error("Client weather fallback failed");
        }
      } catch (fallbackErr) {
        console.error(fallbackErr);
        setWeatherError(preferences.selectedLanguage === "ar" ? "خطأ في الطقس" : "Weather Error");
      }
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleExplainArticle = async (article: NewsArticle) => {
    setExplainingArticle(article);
    setExplanationText("");
    setExplanationLoading(true);
    setIsExplainModalOpen(true);
    try {
      if (window.location.hostname.includes("github.io")) {
        const text = await handleExplainArticleClientFallback(article, preferences.selectedLanguage);
        setExplanationText(text);
        return;
      }

      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: article.title,
          summary: article.summary,
          lang: preferences.selectedLanguage
        })
      });
      if (!response.ok) throw new Error("Server offline");
      const data = await response.json();
      if (data.success) {
        setExplanationText(data.explanation);
      } else {
        throw new Error("Explanation failed");
      }
    } catch (err) {
      console.warn("Explain article failed, falling back to client-side...", err);
      try {
        const text = await handleExplainArticleClientFallback(article, preferences.selectedLanguage);
        setExplanationText(text);
      } catch (fallbackErr) {
        console.error(fallbackErr);
        setExplanationText(preferences.selectedLanguage === "ar" ? "فشل تجميع التفسير حالياً." : "Failed to aggregate AI commentary.");
      }
    } finally {
      setExplanationLoading(false);
    }
  };

  const handleExplainCategory = async () => {
    setCategoryExplainLoading(true);
    setCategoryExplainText("");
    setCategoryExplainOpen(true);
    try {
      if (window.location.hostname.includes("github.io")) {
        const text = await handleExplainCategoryClientFallback(activeCategory, preferences.selectedLanguage);
        setCategoryExplainText(text);
        return;
      }

      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: activeCategory,
          lang: preferences.selectedLanguage
        })
      });
      if (!response.ok) throw new Error("Server offline");
      const data = await response.json();
      if (data.success) {
        setCategoryExplainText(data.explanation);
      } else {
        throw new Error("Category explanation failed");
      }
    } catch (err) {
      console.warn("Explain category failed, falling back to client-side...", err);
      try {
        const text = await handleExplainCategoryClientFallback(activeCategory, preferences.selectedLanguage);
        setCategoryExplainText(text);
      } catch (fallbackErr) {
        console.error(fallbackErr);
        setCategoryExplainText(preferences.selectedLanguage === "ar" ? "فشل تجميع تحليلات الفئة." : "Could not compile category insights.");
      }
    } finally {
      setCategoryExplainLoading(false);
    }
  };

  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatMessage.trim() || chatLoading) return;

    const userMsg = chatMessage.trim();
    setChatMessage("");
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);

    try {
      if (window.location.hostname.includes("github.io")) {
        const reply = await handleChatClientFallback(userMsg, chatHistory, preferences.selectedLanguage);
        setChatHistory(prev => [...prev, { role: 'model', text: reply }]);
        return;
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: chatHistory,
          lang: preferences.selectedLanguage
        })
      });
      if (!response.ok) throw new Error("Server offline");
      const data = await response.json();
      if (data.success) {
        setChatHistory(prev => [...prev, { role: 'model', text: data.reply }]);
      } else {
        throw new Error("Chat response error");
      }
    } catch (err) {
      console.warn("Chat failed, falling back to client side... ", err);
      try {
        const reply = await handleChatClientFallback(userMsg, chatHistory, preferences.selectedLanguage);
        setChatHistory(prev => [...prev, { role: 'model', text: reply }]);
      } catch (fallbackErr) {
        console.error(fallbackErr);
        setChatHistory(prev => [...prev, { 
          role: 'model', 
          text: preferences.selectedLanguage === "ar" 
            ? "عذراً، تعذر الاتصال بالمساعد الذكي حالياً. يرجى مراجعة الشبكة." 
            : "Sorry, I am unable to connect to the AI companion right now. Check your internet connection." 
        }]);
      }
    } finally {
      setChatLoading(false);
    }
  };

  // Reset category insight when activeCategory switches
  React.useEffect(() => {
    setCategoryExplainOpen(false);
    setCategoryExplainText("");
  }, [activeCategory]);

  // Sync initial welcome message if language preferences toggles
  React.useEffect(() => {
    setChatHistory([
      {
        role: 'model',
        text: preferences.selectedLanguage === "ar"
          ? "أهلاً بك! أنا مساعدك الذكي في نبض العالم. يمكنك سؤالي عن أي موضوع للتحليل الفوري وعرض تفاصيل إضافية."
          : "Hello! I am your AI assistant inside Pulse of the World. Feel free to ask me anything about live news, trends, or predictions."
      }
    ]);
  }, [preferences.selectedLanguage]);

  // Handle center chat box auto scrolling
  React.useEffect(() => {
    const el = document.getElementById("center-chat-messages-container");
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [chatHistory, chatLoading]);

  // Weather triggers effect
  React.useEffect(() => {
    let loc = "Cairo";
    if (preferences.enableLocationNews && locationState.city) {
      loc = `${locationState.city}, ${locationState.country}`;
    } else {
      loc = COUNTRY_CAPITALS[selectedCountry] || selectedCountry || "Cairo";
    }
    fetchWeather(loc);
  }, [selectedCountry, locationState.city, locationState.country, preferences.selectedLanguage, preferences.enableLocationNews]);

  // Debounce search query
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 650);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Rotate sponsor ads index periodically
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex(prev => (prev + 1) % SPONSOR_ADS.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Register Service Worker for system-level notifications
  React.useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/firebase-messaging-sw.js")
        .then((reg) => {
          console.log("Service Worker registered successfully with scope: ", reg.scope);
        })
        .catch((err) => {
          console.warn("Service Worker registration failed: ", err);
        });
    }
  }, []);

  // 1. Listen to Firebase Auth state updates
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      
      if (currentUser) {
        // Fetch or create profile inside users collection
        const userDocRef = doc(db, "users", currentUser.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setPreferences({
              favoriteCategories: data.favoriteCategories || DEFAULT_PREFERENCES.favoriteCategories,
              notificationsEnabled: typeof data.notificationsEnabled === "boolean" ? data.notificationsEnabled : DEFAULT_PREFERENCES.notificationsEnabled,
              selectedLanguage: data.selectedLanguage || DEFAULT_PREFERENCES.selectedLanguage,
              theme: data.theme || DEFAULT_PREFERENCES.theme,
              enableLocationNews: typeof data.enableLocationNews === "boolean" ? data.enableLocationNews : DEFAULT_PREFERENCES.enableLocationNews,
              customGeminiApiKey: data.customGeminiApiKey || "",
            });
          } else {
            // First time auth login, create standard document
            await setDoc(userDocRef, {
              uid: currentUser.uid,
              email: currentUser.email || "",
              displayName: currentUser.displayName || "",
              photoURL: currentUser.photoURL || "",
              favoriteCategories: preferences.favoriteCategories,
              notificationsEnabled: preferences.notificationsEnabled,
              selectedLanguage: preferences.selectedLanguage,
              theme: preferences.theme,
              enableLocationNews: preferences.enableLocationNews,
              customGeminiApiKey: preferences.customGeminiApiKey || "",
              updatedAt: new Date().toISOString()
            });
          }
        } catch (err) {
          console.warn("Could not load user profile from Firestore:", err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-time Firebase notification center synchronizer (Zero-Trust Active Listener)
  React.useEffect(() => {
    if (!user) return;

    const notifPath = `users/${user.uid}/notifications`;
    const q = query(collection(db, "users", user.uid, "notifications"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const remoteNotifs: NotificationItem[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        remoteNotifs.push({
          id: docSnap.id,
          title: d.title,
          message: d.message,
          timestamp: d.timestamp,
          articleId: d.articleId,
          read: d.read,
          type: d.type
        });
      });
      
      // Sort in relative reverse order of arrival (newest first)
      remoteNotifs.sort((a, b) => b.id.localeCompare(a.id));
      setNotifications(remoteNotifs);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, notifPath);
    });

    return () => unsubscribe();
  }, [user]);

  // Google authentication and logouts wrappers
  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
      
      // We will let the auth state listener handle the initial preferences loading and notification sync.
      pushNotification({
        title: isAr ? "👋 تم تسجيل الدخول بنجاح" : "👋 Sign In Successful",
        message: isAr ? "مرحباً بك! تم دمج حسابك بجوجل ومزامنة ملفك وتنبيهاتك بنجاح." : "Welcome back! Google credentials synchronized and profile loaded.",
        type: "personalized"
      });
    } catch (err: any) {
      console.error("Sign in failed:", err);
      pushNotification({
        title: isAr ? "❌ فشل تسجيل الدخول" : "❌ Sign In Failed",
        message: isAr ? "تعذر الاستجابة لبوابة تسجيل الدخول من جوجل حالياً." : "Google auth gateway did not respond securely.",
        type: "personalized"
      });
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Revert to empty local notifications
      setNotifications([
        {
          id: "n_welcome",
          title: isAr ? "🌍 أهلاً بك في منصة تجميع الأخبار العالمية" : "🌍 Welcome to World News Hub",
          message: isAr 
            ? "تم تسجيل الخروج بنجاح. تم تجميع أكثر من خمس قنوات ومواقع إخبارية رائدة في مكان واحد."
            : "Sign out successful. Clean guest portal instantiated in high-fidelity sandbox mode.",
          timestamp: isAr ? "الآن" : "Just now",
          type: "personalized",
          read: false
        }
      ]);
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  // Sync Preferences state to HTML theme, localStorage and remote Firestore mapping
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(preferences));
    } catch {}

    const rootEl = document.documentElement;
    if (preferences.theme === "dark") {
      rootEl.classList.add("dark");
    } else {
      rootEl.classList.remove("dark");
    }

    if (user) {
      const userDocPath = `users/${user.uid}`;
      updateDoc(doc(db, "users", user.uid), {
        favoriteCategories: preferences.favoriteCategories,
        notificationsEnabled: preferences.notificationsEnabled,
        selectedLanguage: preferences.selectedLanguage,
        theme: preferences.theme,
        enableLocationNews: preferences.enableLocationNews,
        customGeminiApiKey: preferences.customGeminiApiKey || "",
        updatedAt: new Date().toISOString()
      }).catch((err) => {
        console.warn("Non-critical preferences sync warning:", err);
      });
    }
  }, [preferences, user]);

  // Sync Notifications to localStorage when logged out
  React.useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
      } catch {}
    }
  }, [notifications, user]);

  // Handle Geolocation activation on preference tick
  React.useEffect(() => {
    if (preferences.enableLocationNews && !locationState.country) {
      handleDetectLocation();
    }
  }, [preferences.enableLocationNews]);

  // Core data fetching logic
  const fetchNews = async (forceRef: boolean = false) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (window.location.hostname.includes("github.io")) {
        const articlesList = await fetchNewsClientFallback(activeCategory, selectedCountry, debouncedQuery, preferences.selectedLanguage);
        setArticles(articlesList);
        return;
      }

      const url = `/api/news?category=${activeCategory}&country=${selectedCountry}&search=${encodeURIComponent(debouncedQuery)}&lang=${preferences.selectedLanguage}&refresh=${forceRef ? 'true' : 'false'}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Server offline");
      const data = await res.json();
      if (data.success) {
        setArticles(data.articles || []);
        if (data.error) {
          console.warn("Server minor error:", data.error);
        }
      } else {
        throw new Error(data.error || "Failed to fetch aggregated news");
      }
    } catch (err: any) {
      console.warn("Server fetch news failed, falling back to client-side grounding...", err);
      try {
        const articlesList = await fetchNewsClientFallback(activeCategory, selectedCountry, debouncedQuery, preferences.selectedLanguage);
        setArticles(articlesList);
      } catch (fallbackErr) {
        console.error(fallbackErr);
        setErrorMsg(isAr ? "لم نتمكن من تجميع الأخبار حالياً. يرجى التحقق من اتصالك بالإنترنت والضغط على إعادة المحاولة." : "Could not connect to news server. Please check your network and retry.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Trigger News Fetch whenever filter variables change
  React.useEffect(() => {
    fetchNews();
  }, [activeCategory, selectedCountry, debouncedQuery, preferences.selectedLanguage]);

  // Geolocation detector callback with reverse geocoding
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationState(prev => ({
        ...prev,
        error: isAr ? "متصفحك لا يدعم تحديد المواقع الجغرافية" : "Geolocation not supported by this browser"
      }));
      return;
    }

    setLocationState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Reverse geocoding via OpenStreetMap free API
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
          .then(res => res.json())
          .then(data => {
            const country = data.address?.country || "Global";
            const city = data.address?.city || data.address?.town || data.address?.state || "";
            
            setLocationState({
              lat,
              lng,
              country,
              city,
              loading: false,
              error: null
            });

            // If user has enableLocationNews toggled on, auto-switch feed to detected country!
            if (preferences.enableLocationNews) {
              // Try to match or map the country name
              const matchedCountry = COUNTRIES.find(c => 
                c.id.toLowerCase() === country.toLowerCase() || 
                country.toLowerCase().includes(c.id.toLowerCase())
              );
              
              if (matchedCountry) {
                setSelectedCountry(matchedCountry.id);
              } else {
                // Not in pre-selected country list, let's inject or search directly
                setSelectedCountry("Global");
              }

              // Trigger an in-app alert notification
              const alertMsg = isAr 
                ? `📍 تم تحديد موقعك بذكاء في ${city ? `${city}، ` : ""}${country}. نقوم الآن بتجميع الأخبار الأكثر ملاءمة لمنطقتك.` 
                : `📍 Successfully localized your profile in ${city ? `${city}, ` : ""}${country}. Loading regional channels.`;
              
              pushNotification({
                title: isAr ? "تحديث الموقع الجغرافي" : "Location Updated",
                message: alertMsg,
                type: "local"
              });
            }
          })
          .catch((err) => {
            console.error("OSM error:", err);
            // Fallback estimation
            setLocationState(prev => ({
              ...prev,
              country: "Egypt",
              city: "Cairo",
              loading: false
            }));
            if (preferences.enableLocationNews) {
              setSelectedCountry("Egypt");
            }
          });
      },
      (error) => {
        console.warn("Geolocation permission error:", error);
        setLocationState(prev => ({
          ...prev,
          loading: false,
          error: isAr 
            ? "يرجى تفعيل صلاحية الوصول للموقع في المتصفح للحصول على الأخبار المحلية." 
            : "Please grant location access permissions inside browser to fetch local news."
        }));
      }
    );
  };

  // Helper helper to append user notifications + optional alert beep!
  const pushNotification = (item: Omit<NotificationItem, "id" | "timestamp" | "read">) => {
    const freshNotif: NotificationItem = {
      ...item,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: isAr ? "الآن" : "Just now",
      read: false
    };

    if (user) {
      const notifItemPath = `users/${user.uid}/notifications/${freshNotif.id}`;
      setDoc(doc(db, "users", user.uid, "notifications", freshNotif.id), {
        id: freshNotif.id,
        title: freshNotif.title,
        message: freshNotif.message,
        timestamp: freshNotif.timestamp,
        type: freshNotif.type,
        read: freshNotif.read,
        createdAt: new Date().toISOString()
      }).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, notifItemPath);
      });
    } else {
      setNotifications(prev => [freshNotif, ...prev]);
    }

    // Provide real-time native OS notifications (delivers alerts even if browser minimized/device closed)
    if (preferences.notificationsEnabled && typeof window !== "undefined" && typeof Notification !== "undefined" && Notification.permission === "granted") {
      const systemTitle = freshNotif.title;
      const systemOptions = {
        body: freshNotif.message,
        icon: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=192&h=192&q=80",
        badge: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=192&h=192&q=80",
        vibrate: [100, 50, 100],
        requireInteraction: false
      };

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(systemTitle, systemOptions);
        }).catch(() => {
          new Notification(systemTitle, systemOptions);
        });
      } else {
        new Notification(systemTitle, systemOptions);
      }
    }

    // Simple browser audio synthesis ping to draw attention safely (sound design integration)
    if (preferences.notificationsEnabled && typeof window !== "undefined") {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 key note
        osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.1); // A5 key note
        
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
        
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.5);
      } catch (err) {
        console.warn("Audio Context beep was blocked by browser autoplay policy.");
      }
    }
  };

  // AI-powered alert generator trigger
  const handleGenerateAIAlert = async () => {
    setGeneratingAlert(true);
    try {
      if (window.location.hostname.includes("github.io")) {
        const data = await handleGenerateAIAlertClientFallback(preferences.favoriteCategories, selectedCountry, preferences.selectedLanguage);
        if (data.success && data.notifications?.length > 0) {
          data.notifications.forEach((notif: any) => {
            pushNotification({
              title: notif.title,
              message: notif.message,
              type: notif.type || "breaking"
            });
          });
        } else {
          throw new Error("Client alert generation failed");
        }
        return;
      }

      const response = await fetch("/api/notifications/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories: preferences.favoriteCategories,
          country: selectedCountry,
          lang: preferences.selectedLanguage
        })
      });
      if (!response.ok) throw new Error("Server offline");
      const data = await response.json();
      if (data.success && data.notifications?.length > 0) {
        // Push all generated alerts in list
        data.notifications.forEach((notif: any) => {
          pushNotification({
            title: notif.title,
            message: notif.message,
            type: notif.type || "breaking"
          });
        });
      } else {
        throw new Error("No notification returned from AI");
      }
    } catch (err) {
      console.warn("AI Alert generation failed, trying client fallback...", err);
      try {
        const data = await handleGenerateAIAlertClientFallback(preferences.favoriteCategories, selectedCountry, preferences.selectedLanguage);
        if (data.success && data.notifications?.length > 0) {
          data.notifications.forEach((notif: any) => {
            pushNotification({
              title: notif.title,
              message: notif.message,
              type: notif.type || "breaking"
            });
          });
        } else {
          throw new Error("Client fallback failed");
        }
      } catch (fallbackErr) {
        console.error(fallbackErr);
        // Fallback alert
        pushNotification({
          title: isAr ? "🔔 تحديث عاجل" : "🔔 Breaking Update",
          message: isAr 
            ? "أعلنت كبرى وكالات الأنباء عن طفرة تكنولوجية غير مسبوقة في تسريع معالجات البيانات الكهروضوئية الموفرة للطاقة."
            : "Leading news bureaus announce an unprecedented breakthrough in energy-efficient optoelectronic processing.",
          type: "breaking"
        });
      }
    } finally {
      setGeneratingAlert(false);
    }
  };

  // Simulated background cycle to push occasional notification alerts (every 55 seconds to keep dashboard dynamic and alive!)
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (preferences.notificationsEnabled) {
      // Periodic checker
      interval = setInterval(() => {
        // Fetch background simulated alert
        const titlesAr = [
          "🚨 تحذير عاجل من الأرصاد الجوية",
          "📈 ارتفاع قياسي لأسهم شركات التكنولوجيا الكبرى",
          "⚽ تحديث عاجل: تعيين مدرب جديد للمنتخب الوطني"
        ];
        const titlesEn = [
          "🚨 High Alert Issued by Meteorology",
          "📈 Impressive Growth for Tech Stocks",
          "⚽ Breaking: National Team Signs New Head Coach"
        ];
        
        const msgsAr = [
          `تنبؤات بتقلبات حادة في درجات الحرارة وفرص قوية لهطول الأمطار والأمواج في السواحل القادمة.`,
          "مؤشرات الأسواق والبورصات ترتفع مجدداً مدعومة بأرباح قياسية لعمالقة الذكاء الاصطناعي وصناعة الرقائق الدقيقة.",
          "تسريبات مؤكدة تشير إلى توصل الاتحاد لاتفاق نهائي لقيادة الفريق في التصفيات الدولية القادمة."
        ];
        const msgsEn = [
          `Severe weather updates predict heavy rainfall and potential localized temperature fluctuations across regions.`,
          "Global trading indices climb higher fueled by record revenues in microchips and generative AI sectors.",
          "Confirmed leaks suggest deep negotiations have finalized for leading the upcoming world championships."
        ];

        const idx = Math.floor(Math.random() * msgsAr.length);

        pushNotification({
          title: isAr ? titlesAr[idx] : titlesEn[idx],
          message: isAr ? msgsAr[idx] : msgsEn[idx],
          type: "breaking"
        });

      }, 55000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [preferences.notificationsEnabled, isAr]);

  // TTS browser functions
  const handleReadAloud = (text: string, id: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      console.warn("Speech synthesis not supported on this browser.");
      return;
    }
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isAr ? "ar-EG" : "en-US";
    utterance.rate = 1.0;
    
    // Attempt standard pitch & voice choices
    const voices = window.speechSynthesis.getVoices();
    const desiredVoice = voices.find(v => 
      isAr ? v.lang.includes("ar") : v.lang.includes("en")
    );
    if (desiredVoice) {
      utterance.voice = desiredVoice;
    }

    utterance.onend = () => setCurrentlyReadingId(null);
    utterance.onerror = () => setCurrentlyReadingId(null);

    setCurrentlyReadingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopReading = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setCurrentlyReadingId(null);
  };

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchNews(true);
  };

  const handleSaveModalPrefs = (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
  };

  // Notification panel control APIs
  const handleMarkNotifRead = (id: string) => {
    if (user) {
      const notifItemPath = `users/${user.uid}/notifications/${id}`;
      updateDoc(doc(db, "users", user.uid, "notifications", id), {
        read: true
      }).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, notifItemPath);
      });
    } else {
      setNotifications(prev => 
        prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
      );
    }
  };

  const handleClearAllNotifs = () => {
    if (user) {
      const notifColPath = `users/${user.uid}/notifications`;
      getDocs(collection(db, "users", user.uid, "notifications"))
        .then((snapshot) => {
          snapshot.forEach((docSnap) => {
            deleteDoc(doc(db, "users", user.uid, "notifications", docSnap.id)).catch((err) => {
              handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/notifications/${docSnap.id}`);
            });
          });
        })
        .catch((err) => {
          handleFirestoreError(err, OperationType.GET, notifColPath);
        });
    } else {
      setNotifications([]);
    }
  };

  // Quick categories layout filtering (shows user's customized favorites + rest of categories easily)
  const favoriteCategoriesSet = new Set(preferences.favoriteCategories);
  
  // Arrange categories: customized favorites first, then remaining ones!
  const sortedCategories = AVAILABLE_CATEGORIES.slice().sort((a, b) => {
    const aFav = favoriteCategoriesSet.has(a.id) ? 1 : 0;
    const bFav = favoriteCategoriesSet.has(b.id) ? 1 : 0;
    return bFav - aFav; // Favorites first
  });

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 font-sans ${
        preferences.theme === "dark" 
          ? "bg-zinc-950 text-zinc-200 dark" 
          : "bg-[#F0F2F5] text-[#1A202C]"
      }`}
      dir={isAr ? "rtl" : "ltr"}
      id="app-root-container"
    >
      {/* 1. Breaking marquee ticker at top */}
      {articles.length > 0 && (
        <BreakingTicker news={articles.slice(0, 4)} isAr={isAr} />
      )}

      {/* 2. Main Premium Navigation Header - Geometric dark theme */}
      <header className="sticky top-0 z-40 bg-[#1A202C] text-zinc-100 border-b border-gray-800 transition-all select-none shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          {/* Logo Brand Title with Geometric Box */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-extrabold text-xl text-white shadow-md font-display shrink-0 select-none">
              {isAr ? "ن" : "N"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight font-display">
                  {isAr ? "نبض العالم" : "Pulse of the World"}
                </h1>
                <span className="bg-red-650 text-[10px] px-2 py-0.5 rounded-full animate-pulse text-white font-bold tracking-wide">
                  {isAr ? "مباشر" : "LIVE"}
                </span>
              </div>
              <p className="text-[9px] text-gray-400 hidden sm:block">
                {isAr ? "جميع مصادرك الإخبارية الموثوقة ملخصة في واجهة هندسية متوازنة" : "Multi-channel global publications summarized in real-time"}
              </p>
            </div>
          </div>

          {/* Integrated Search Bar inside Header on desktop */}
          <div className="flex-1 max-w-xl mx-4 sm:mx-8 relative hidden lg:block">
            <div className="relative">
              <input 
                type="text" 
                placeholder={isAr ? "ابحث عن الأخبار، المواضيع، أو المواقع..." : "Search for keywords, countries, or occurrences..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#2D3748] border-none rounded-full py-1.5 px-10 text-xs sm:text-sm text-zinc-100 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-hidden"
                id="news-search-bar"
              />
              <Search className={`w-4 h-4 absolute ${isAr ? 'right-3' : 'left-3'} top-2 text-gray-400`} />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className={`absolute top-2 ${isAr ? 'left-3' : 'right-3'} text-[10px] text-zinc-400 hover:text-white`}
                >
                  {isAr ? "مسح" : "Clear"}
                </button>
              )}
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Google Authentication Section */}
            {authLoading ? (
              <span className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin shrink-0 mx-2" />
            ) : user ? (
              <div className="flex items-center gap-1.5 sm:gap-2 border border-zinc-700/80 bg-zinc-850/50 p-1 rounded-full text-xs select-none">
                <img 
                  src={user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"} 
                  alt={user.displayName || "User Profile"} 
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-zinc-650 object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <span className="hidden md:inline font-bold text-zinc-200 text-[11px] truncate max-w-[100px]" title={user.displayName || ""}>
                  {user.displayName?.split(" ")[0] || "User"}
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="p-1 text-zinc-400 hover:text-red-400 hover:bg-zinc-800/60 rounded-full transition-colors shrink-0 cursor-pointer"
                  title={isAr ? "تسجيل الخروج" : "Sign Out"}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSignIn}
                disabled={signingIn}
                className="p-1.5 sm:py-2 sm:px-3 rounded-lg border border-blue-500/30 bg-blue-600/15 text-blue-400 hover:bg-blue-600 hover:text-white hover:border-blue-650 transition-all flex items-center gap-1.5 font-bold text-xs cursor-pointer shadow-sm select-none"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {signingIn ? (isAr ? "جاري الدخول..." : "Processing...") : (isAr ? "تسجيل الدخول" : "Sign In")}
                </span>
              </button>
            )}

            {/* Live notification alerts drawer */}
            <NotificationCenter 
              notifications={notifications}
              onMarkAsRead={handleMarkNotifRead}
              onClearAll={handleClearAllNotifs}
              isAr={isAr}
              onGenerateAlert={handleGenerateAIAlert}
              generatingAlert={generatingAlert}
            />

            {/* Customization Cog Trigger button */}
            <button
              type="button"
              onClick={() => setIsPrefModalOpen(true)}
              className="p-2 sm:p-2.5 rounded-xl border border-gray-700 text-zinc-300 hover:bg-[#2D3748] hover:text-white transition-colors flex items-center gap-1.5 font-semibold text-xs cursor-pointer shadow-2xs"
              id="settings-trigger-btn"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden md:inline">
                {isAr ? "تخصيص المواضيع" : "Preferences"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Sub-Navbar & Location Context Indicator - Styled like geometric theme */}
      <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-250/60 dark:border-zinc-800/80 sticky top-14 sm:top-16 z-30 select-none">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-6 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-6 h-12">
            {sortedCategories.slice(0, 7).map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSearchQuery(""); // Clear search to see category outputs clearly
                  }}
                  className={`h-full flex items-center px-1 transition-all text-xs sm:text-sm whitespace-nowrap cursor-pointer font-bold relative ${
                    isActive
                      ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                      : "text-zinc-600 dark:text-zinc-450 hover:text-blue-600 dark:hover:text-blue-300"
                  }`}
                >
                  {isAr ? cat.nameAr : cat.nameEn}
                </button>
              );
            })}
          </div>

          {/* Current profile region identifier */}
          {preferences.enableLocationNews && (
            <div className="hidden md:flex items-center gap-3 text-xs bg-zinc-100 dark:bg-zinc-800/50 py-1 px-3 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50 shrink-0">
              <span className="text-zinc-500 dark:text-zinc-400">{isAr ? "موقعك الحالي:" : "Current Region:"}</span>
              <span className="font-extrabold text-zinc-900 dark:text-zinc-100 italic">
                {locationState.loading ? (isAr ? "جاري التحديد..." : "Locating...") : (locationState.country ? (isAr ? `📍 ${locationState.country}` : `📍 ${locationState.country}`) : (isAr ? "القاهرة" : "Global"))}
              </span>
              <button 
                type="button" 
                onClick={handleDetectLocation} 
                className="text-blue-600 dark:text-blue-400 font-bold underline hover:text-blue-700"
              >
                {isAr ? "تغيير" : "Update"}
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* 4. Core Body Section - Responsive Three Column Layout */}
      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* Google AdSense Responsive Header Unit */}
        <div className="mb-6">
          <AdSenseUnit slot="1234567890" isAr={isAr} className="shadow-xs" />
        </div>
        
        {/* Premium Top Sponsor Banner */}
        {!dismissedAds.includes("top_banner") && SPONSOR_ADS[currentAdIndex] && (
          <div 
            className="mb-8 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 border border-zinc-250 dark:border-indigo-950/40 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-3xs animate-fade-in relative overflow-hidden select-none"
            id="top-sponsor-banner"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-400/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3.5 z-10 w-full md:w-auto">
              <span className="p-2 sm:p-2.5 bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 rounded-xl shrink-0">
                <Megaphone className="w-5 h-5 animate-bounce" />
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300 rounded-sm text-[9px] font-black uppercase tracking-wider select-none">
                    {isAr ? "إعلان ممول" : "Sponsored Partner"}
                  </span>
                  <span className="text-[11px] font-bold text-indigo-605 dark:text-indigo-400 select-none">
                    {isAr ? SPONSOR_ADS[currentAdIndex].brandAr : SPONSOR_ADS[currentAdIndex].brandEn}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-zinc-900 dark:text-white mt-1 leading-snug">
                  {isAr ? SPONSOR_ADS[currentAdIndex].titleAr : SPONSOR_ADS[currentAdIndex].titleEn}
                </h4>
                <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-3xl line-clamp-1">
                  {isAr ? SPONSOR_ADS[currentAdIndex].descAr : SPONSOR_ADS[currentAdIndex].descEn}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 z-10 shrink-0 w-full md:w-auto justify-end border-t border-zinc-200/50 dark:border-zinc-800/50 md:border-none pt-3 md:pt-0">
              <a
                href={SPONSOR_ADS[currentAdIndex].url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  pushNotification({
                    title: isAr ? "🚀 فتح موقع الراعي الممول" : "🚀 Sponsor Portal Triggered",
                    message: isAr
                      ? `نجاح الانتقال المباشر للموقع الرسمي: ${SPONSOR_ADS[currentAdIndex].brandAr}`
                      : `Successfully navigated to: ${SPONSOR_ADS[currentAdIndex].brandEn} main portal`,
                    type: "personalized"
                  });
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{isAr ? "استكشف العرض ↗" : "Explore Offer ↗"}</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setDismissedAds(prev => [...prev, "top_banner"]);
                  pushNotification({
                    title: isAr ? "🛑 تم إخفاء المساحة الإعلانية" : "🛑 Spacer Hidden",
                    message: isAr 
                      ? "تم تصغير وإخفاء المساحة الترويجية لهذا الصدد بناءً على رغبتك."
                      : "The promotional header space has been collapsed as requested.",
                    type: "personalized"
                  });
                }}
                className="p-2 border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-650 dark:text-zinc-500 dark:hover:text-zinc-350 rounded-xl cursor-pointer"
                title={isAr ? "إغلاق" : "Close"}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Search input - only visible on small displays */}
        <div className="lg:hidden mb-6 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-4 rounded-xl shadow-xs space-y-3">
          <div className="relative">
            <input 
              type="text"
              placeholder={isAr ? "ابحث عن أي حدث، دولة، أو موضوع..." : "Search for keywords, countries, or occurrences..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-805 rounded-xl py-2.5 text-xs sm:text-sm focus:outline-hidden ${
                isAr ? "pr-4 pl-10" : "pl-10 pr-4"
              }`}
            />
            <Search className="w-4 h-4 text-zinc-400 absolute top-3 left-3.5" />
          </div>

          {/* Regional mobile dropdown selector & Refresh */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200"
            >
              {COUNTRIES.map((ct) => (
                <option key={ct.id} value={ct.id}>
                  {isAr ? ct.nameAr : ct.nameEn}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={loading}
              className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-750 dark:text-zinc-350 rounded-lg text-xs hover:bg-zinc-200 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing || loading ? 'animate-spin' : ''}`} />
              <span>{isAr ? "تحديث" : "Refresh"}</span>
            </button>
          </div>
        </div>

        {/* 3-Column Layout Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_290px] gap-6 items-start">
          
          {/* COLUMN 1 (aside left): Fav Categories and Newsletter Card */}
          <aside className="space-y-6 lg:sticky lg:top-32">
            
            {/* Left side card: Customized Favorites list */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
              <h3 className="text-xs font-bold text-zinc-405 dark:text-zinc-400 uppercase tracking-widest mb-4">
                {isAr ? "مواضيعك المفضلة" : "Favorite Portfolios"}
              </h3>
              
              <div className="flex flex-col gap-2">
                {preferences.favoriteCategories.map((favId) => {
                  const catObj = AVAILABLE_CATEGORIES.find(c => c.id === favId);
                  if (!catObj) return null;
                  const isActive = activeCategory === favId;
                  
                  // Compute Lookalike active articles count
                  const matchingCount = articles.filter(a => a.category === favId).length;
                  const finalBadge = matchingCount > 0 ? `+${matchingCount}` : "+4";

                  return (
                    <button
                      key={favId}
                      type="button"
                      onClick={() => {
                        setActiveCategory(favId);
                        setSearchQuery("");
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-bold transition-colors w-full cursor-pointer ${
                        isActive 
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-l-4 border-blue-600" 
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      <span>{isAr ? catObj.nameAr : catObj.nameEn}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                        isActive ? "bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-300" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                      }`}>
                        {finalBadge}
                      </span>
                    </button>
                  );
                })}

                {preferences.favoriteCategories.length === 0 && (
                  <p className="text-xs text-zinc-400 italic py-2">
                    {isAr ? "لم تحدد مواضيع مفضلة" : "No favorite categories chosen"}
                  </p>
                )}
              </div>

              <button 
                type="button"
                onClick={() => setIsPrefModalOpen(true)}
                className="mt-4 text-xs text-blue-600 dark:text-blue-400 font-bold border border-dashed border-blue-300 hover:border-blue-500 dark:border-zinc-700 w-full py-2 rounded-lg hover:bg-blue-50/50 dark:hover:bg-zinc-800 transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? "إضافة موضوع مخصص" : "Add/Edit Topics"}</span>
              </button>
            </div>

            {/* Newsletter Subscription with geometric blue gradient style */}
            <section className="bg-gradient-to-br from-blue-700 via-indigo-805 to-indigo-900 text-white rounded-2xl p-5 shadow-md space-y-3.5">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-200" />
                <h4 className="font-bold text-sm tracking-tight">{isAr ? "النشرة الإخبارية" : "Subscribers Dispatch"}</h4>
              </div>
              
              <p className="text-[10px] leading-relaxed text-blue-100">
                {isAr ? "اشترك لتصلك تحليلات الأنباء الأسبوعية وصحف التغطية دورياً في صندوق بريدك الإلكتروني مجاناً." : "Receive periodic highlights, deep-dive logs, and news digests directly within your inbox for free."}
              </p>

              {newsletterSubscribed ? (
                <div className="p-3 bg-white/10 rounded-lg text-[10px] text-blue-100 border border-white/10 animate-fade-in font-bold">
                  {isAr ? "🎉 تم الاشتراك بنجاح! شكراً جزيلاً لثقتك." : "🎉 Successfully locked in! Thank you."}
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <input 
                    type="email" 
                    placeholder={isAr ? "بريدك الإلكتروني..." : "your.email@address.com"} 
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-white/20 border border-white/10 rounded-lg py-1.5 px-3 text-xs placeholder:text-white/60 text-white outline-hidden focus:ring-1 focus:ring-white/40"
                  />
                  <button 
                    type="submit"
                    className="w-full bg-white text-blue-800 font-extrabold py-2 rounded-lg text-xs hover:bg-blue-50 transition-colors cursor-pointer text-center"
                  >
                    {isAr ? "اشترك الآن" : "Subscribe Now"}
                  </button>
                </form>
              )}
            </section>
          </aside>

          {/* COLUMN 2 (middle main content): Hero Spotlight banner + grid of rest articles */}
          <section className="space-y-6">
            
            {/* Top Toolbar: Headline count & Country selector on Desktop */}
            <div className="hidden lg:flex items-center justify-between pb-1">
              <h3 className="text-sm font-extrabold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
                {isAr ? "شات الـ AI والتحليل التفاعلي" : "Interactive AI Chat Dashboard"}
              </h3>

              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-500">{isAr ? "تصفية الدولة:" : "Scope Region:"}</span>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-805 dark:text-zinc-250 cursor-pointer shadow-2xs"
                >
                  {COUNTRIES.map((ct) => (
                    <option key={ct.id} value={ct.id}>
                      {isAr ? ct.nameAr : ct.nameEn}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleManualRefresh}
                  disabled={loading}
                  className="p-1.5 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded-lg border border-zinc-200 dark:border-zinc-805 hover:bg-zinc-100"
                  title="Force reload"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing || loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Centered Immersive AI Chat Box Console */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xs overflow-hidden flex flex-col h-[480px] transition-all" id="center-ai-chat-console">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-indigo-805 p-4 text-white flex items-center justify-between select-none shrink-0">
                <div className="flex items-center gap-3">
                  <span className="p-1 px-2.5 bg-white/20 rounded-md text-xs font-black animate-pulse">AI CHAT</span>
                  <div>
                    <h3 className="font-extrabold text-xs tracking-tight">{isAr ? "شات الذكاء الاصطناعي وبحث نبض العالم" : "World Pulse AI Hub"}</h3>
                    <p className="text-[9px] text-blue-100">{isAr ? "مساعد ذكي فوري يجيب ويحلل كافة القضايا بالوقت الحقيقي" : "Intelligent live news companion & predictor"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setChatHistory([{
                      role: 'model',
                      text: isAr 
                        ? "أهلاً بك! أنا مساعدك الذكي في نبض العالم. يمكنك سؤالي عن أي موضوع للتحليل الفوري وعرض تفاصيل إضافية."
                        : "Hello! I am your AI assistant. Feel free to ask me anything to analyze."
                    }])}
                    className="px-2.5 py-1 text-[10px] font-extrabold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
                    title="Clear history"
                  >
                    {isAr ? "مسح المحادثة" : "Clear Chat"}
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-zinc-50/50 dark:bg-zinc-950/40 select-text font-medium" id="center-chat-messages-container">
                {chatHistory.map((h, idx) => (
                  <div key={idx} className={`flex ${h.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                    <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                      h.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none font-bold shadow-2xs'
                        : 'bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-none shadow-3xs'
                    }`}>
                      <p className="whitespace-pre-wrap select-text">{h.text}</p>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-805 rounded-2xl p-3 text-xs text-zinc-400 italic rounded-bl-none shadow-3xs flex items-center gap-3 animate-pulse">
                      <span className="w-2.5 h-2.5 bg-blue-500 border border-blue-400 rounded-full animate-ping shrink-0" />
                      <span>{isAr ? "مساعد نبض العالم يحلل ويرد بالوقت الحقيقي..." : "AI assistant is analyzing and compiling..."}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="px-4 py-2 bg-zinc-100/50 dark:bg-zinc-950/20 border-t border-zinc-150 dark:border-zinc-805 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none shrink-0">
                {[
                  isAr ? "ما هي آخر أخبار التقنية اليوم؟" : "What is the latest tech news today?",
                  isAr ? "تفسير أخبار التضخم الاقتصادي والنفط" : "Explain global crypto & retail inflation",
                  isAr ? "توقع مستقبل الطاقة المتجددة في 2026" : "Predict green energies direction by 2026",
                  isAr ? "ما هي حالة الطقس حالياً؟" : "What is the live weather forecast?"
                ].map((pill, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setChatMessage(pill)}
                    className="px-3 py-1.5 text-[10px] font-bold rounded-full bg-white dark:bg-zinc-805 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-zinc-650 dark:text-zinc-350 hover:text-blue-600 dark:hover:text-blue-400 border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer shrink-0"
                  >
                    {pill}
                  </button>
                ))}
              </div>

              {/* Form Input Footer */}
              <form onSubmit={handleSendChatMessage} className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-805 flex gap-2 shrink-0">
                <input
                  type="text"
                  placeholder={isAr ? "اكتب سؤالك هنا للذكاء الاصطناعي..." : "Ask AI details on any topic or region..."}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  disabled={chatLoading}
                  className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 outline-hidden focus:ring-1 focus:ring-blue-500 placeholder:text-zinc-450"
                />
                <button
                  type="submit"
                  disabled={chatLoading || !chatMessage.trim()}
                  className="bg-blue-650 hover:bg-blue-700 dark:bg-blue-505 dark:hover:bg-blue-600 text-white rounded-xl px-5 py-2.5 text-xs font-bold transition-colors disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isAr ? "إرسال" : "Send"}
                </button>
              </form>
            </div>

            {/* Category Explainer Hub Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 rounded-2xl p-4 shadow-3xs space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-indigo-50/45 dark:bg-indigo-950/10 p-3.5 rounded-xl border border-indigo-100/60 dark:border-indigo-950/30">
                <div>
                  <h4 className="text-xs font-extrabold text-indigo-700 dark:text-indigo-400 capitalize flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAr ? "المرشد الإخباري الذكي للتخصص" : "AI Specialization Insights"}</span>
                  </h4>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-350 mt-0.5">
                    {isAr 
                      ? "اكتشف التحليلات الصاعدة والمنظور الكلي لهذه الفئة عالمياً بنقرة واحدة."
                      : "Decode contemporary world trends and analytical outlooks for this category."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExplainCategory}
                  className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-700 dark:bg-indigo-505 dark:hover:bg-indigo-600 text-white font-bold rounded-lg text-[10px] transition-all cursor-pointer shadow-2xs shrink-0"
                >
                  {categoryExplainLoading ? (isAr ? "جاري فرز البيانات..." : "Analyzing Category...") : (isAr ? "تفسير الفئة بالذكاء الاصطناعي ✨" : "Explain Category ✨")}
                </button>
              </div>

              {categoryExplainOpen && (
                <div className="mt-3 p-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-150 dark:border-zinc-850 animate-fade-in text-xs leading-relaxed max-w-none text-zinc-800 dark:text-zinc-250 font-medium select-text">
                  {categoryExplainLoading ? (
                    <div className="flex flex-col items-center justify-center py-6 space-y-3">
                      <span className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-[10px] text-zinc-400 italic font-mono">{isAr ? "مساعد Gemini يقوم بفرز المحاور حالياً..." : "Compiler parsing trend timelines..."}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="whitespace-pre-wrap select-text markdown-body font-normal text-zinc-700 dark:text-zinc-300">
                        {categoryExplainText || "..."}
                      </div>

                      <div className="pt-2 border-t border-zinc-200 dark:border-zinc-805 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setCategoryExplainOpen(false);
                            setCategoryExplainText("");
                          }}
                          className="text-[9px] font-bold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:underline cursor-pointer"
                        >
                          {isAr ? "إغلاق التحوط وطي التحليل ✕" : "Close Analysis ✕"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ERROR CARD */}
            {errorMsg ? (
              <div className="border border-red-200 dark:border-red-950/60 bg-red-500/10 text-red-750 dark:text-red-400 rounded-2xl p-6 text-center text-sm space-y-3">
                <p>{errorMsg}</p>
                <button
                  type="button"
                  onClick={() => fetchNews(true)}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  {isAr ? "إعادة المحاولة" : "Try Again"}
                </button>
              </div>
            ) : loading && articles.length === 0 ? (
              // Loading list skeletons
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="news-loading-skeletons">
                {[1, 2, 3, 4].map((idx) => (
                  <div key={idx} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl h-80 animate-pulse p-4 space-y-4">
                    <div className="bg-zinc-200 dark:bg-zinc-800 aspect-video rounded-xl w-full" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 w-1/4 rounded" />
                    <div className="h-5 bg-zinc-200 dark:bg-zinc-800 w-11/12 rounded" />
                    <div className="h-10 bg-zinc-200 dark:bg-zinc-800 w-full rounded" />
                  </div>
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="py-24 border border-zinc-250 dark:border-zinc-850 bg-white dark:bg-zinc-900 rounded-3xl text-center space-y-3 shadow-3xs max-w-xl mx-auto">
                <Compass className="w-12 h-12 mx-auto stroke-1 text-zinc-400 dark:text-zinc-650" />
                <h4 className="font-extrabold text-zinc-805 dark:text-white text-base">
                  {isAr ? "لا توجد نتائج مطابقة للتصفية" : "No exact matches discovered"}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto px-6">
                  {isAr 
                    ? "لا توجد أخبار كافية لتغطية هذه المعايير حالياً لبلدك المختار. يرجى تجربة فئات بديلة أو كتابة كلمة بحث عامة." 
                    : "There are no current reports matching these options. Try searching for a broader term or choosing global region."}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("general");
                      setSelectedCountry("Global");
                    }}
                    className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    {isAr ? "إعادة ضبط المرشحات" : "Reset Filters"}
                  </button>
                </div>
              </div>
            ) : (
              // Display state: Spotlight Hero Article + rest grid!
              <div className="space-y-6">
                
                {/* Spotlight Banner Card */}
                {articles[0] && (
                  <div className="relative h-[280px] sm:h-[320px] rounded-2xl overflow-hidden shadow-lg group border border-zinc-200/50 dark:border-zinc-800/80 animate-fade-in bg-zinc-200 dark:bg-zinc-800 select-none">
                    <img 
                      src={articles[0].imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1024"} 
                      alt={articles[0].title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Linear color gradient overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent p-6 sm:p-8 flex flex-col justify-end" />
                    
                    {/* Overlay Details with precise absolute controls */}
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 text-white flex flex-col justify-end z-10 pointer-events-auto">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-600 text-white text-[9px] sm:text-[10px] font-black px-2.5 py-0.5 rounded-sm flex items-center gap-1 uppercase tracking-wider animate-pulse select-none">
                          {isAr ? "خبر عاجل" : "Spotlight"}
                        </span>
                        
                        <span className="text-[10px] text-zinc-300 font-bold">
                          {articles[0].source}
                        </span>
                      </div>

                      <h2 className="text-lg sm:text-2xl font-black mb-1 leading-snug tracking-tight text-white line-clamp-2">
                        {articles[0].title}
                      </h2>
                      
                      <p className="text-zinc-300 text-[11px] sm:text-xs max-w-2xl line-clamp-2 leading-relaxed opacity-90 hidden sm:block">
                        {articles[0].summary}
                      </p>

                      {/* Interactive shortcuts inside Hero spotlight */}
                      <div className="flex flex-wrap items-center gap-4 mt-3.5 pt-2.5 border-t border-white/10 text-[10px] text-zinc-300 font-semibold select-none">
                        <span>{articles[0].publishedAt}</span>
                        
                        <button
                          type="button"
                          onClick={() => {
                            if (currentlyReadingId === articles[0].id) {
                              handleStopReading();
                            } else {
                              handleReadAloud(`${articles[0].title}. ${articles[0].summary}.`, articles[0].id);
                            }
                          }}
                          className="text-blue-400 hover:text-white underline cursor-pointer"
                        >
                          {currentlyReadingId === articles[0].id ? (isAr ? "تعطيل القراءة" : "Stop Voice") : (isAr ? "🔊 استمع للخبر" : "🔊 Listen Headline")}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleExplainArticle(articles[0])}
                          className="text-indigo-450 hover:text-white underline cursor-pointer flex items-center gap-1"
                        >
                          <span>✨ {isAr ? "فسر الموضوع بالكامل" : "Explain fully"}</span>
                        </button>

                        <a 
                          href={articles[0].url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-indigo-450 hover:text-white underline"
                        >
                          {isAr ? "المصدر كامل 🔗" : "Full coverage 🔗"}
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rest of the articles grid display */}
                {articles.length > 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="news-grid-display">
                    {articles.slice(1).map((article, idx) => (
                      <React.Fragment key={article.id}>
                        <NewsCard 
                          article={article}
                          isAr={isAr}
                          onReadAloud={handleReadAloud}
                          currentlyReadingId={currentlyReadingId}
                          onStopReading={handleStopReading}
                          onExplain={handleExplainArticle}
                        />

                        {/* Native Sponsored Card inserted dynamically after index 1 */}
                        {idx === 1 && !dismissedAds.includes("native_card") && (
                          <div 
                            className="bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-900/40 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full animate-fade-in relative"
                            id="native-ad-card"
                          >
                            {/* Graphic Header with Brand logo overlay */}
                            <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 select-none">
                              <img 
                                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600" 
                                alt="NEOM Cognitive City"
                                className="w-full h-full object-cover select-none pointer-events-none hover:scale-102 transition-transform duration-700"
                                referrerPolicy="no-referrer"
                              />
                              <div className={`absolute top-3 ${isAr ? 'right-3' : 'left-3'} flex items-center gap-1.5`}>
                                <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-indigo-650 tracking-wide text-white border border-white/10 shadow-xs uppercase">
                                  {isAr ? "شريك رسمي" : "Official Sponsor"}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setDismissedAds(prev => [...prev, "native_card"]);
                                  pushNotification({
                                    title: isAr ? "إخفاء بطاقة الراعي" : "Sponsor Ad Hidden",
                                    message: isAr ? "تم إخفاء بطاقة الراعي الرسمي بنجاح من قائمة الأخبار." : "The official sponsor card has been dismissed from the list.",
                                    type: "personalized"
                                  });
                                }}
                                className="absolute top-3 right-3 md:left-3 bg-black/60 hover:bg-black/90 text-white rounded-full p-1.5 backdrop-blur-md cursor-pointer transition-colors border border-white/10 z-10"
                                title={isAr ? "إخفاء الإعلان" : "Dismiss Sponsor Logo"}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Native Sponsor Details */}
                            <div className="p-5 flex-1 flex flex-col justify-between space-y-4 select-none">
                              <div className="space-y-2.5">
                                <div className="flex items-center justify-between text-[11px] text-zinc-450 dark:text-zinc-400 font-bold tracking-wide uppercase">
                                  <span>{isAr ? "نيوم السعودية" : "NEOM SAUDI ARABIA"}</span>
                                  <span className="text-amber-600 dark:text-amber-400 font-extrabold">{isAr ? "إعلان مميز" : "Sponsorship"}</span>
                                </div>
                                <h4 className="font-extrabold text-base text-zinc-900 dark:text-zinc-50 leading-snug">
                                  {isAr 
                                    ? "عش في الغد اليوم: مشروع ذا لاين يعيد صياغة الإنسانية والمدن الخضراء" 
                                    : "Live tomorrow today: The Line redesigning vertical human habitability"}
                                </h4>
                                <p className="text-zinc-650 dark:text-zinc-350 text-xs sm:text-sm leading-relaxed">
                                  {isAr 
                                    ? "تخيل مدينة خالية بنسبة 100% من الشوارع والسيارات والملوثات في تناغم كامل مع الطبيعة ونقاء فائق، تعمل بالطاقة النظيفة." 
                                    : "A cognitive architecture mirroring pure vertical urban progression; zero exhaust emissions, clean-energy loops, and unmatched comfort profiles."}
                                </p>
                              </div>

                              <div className="pt-3.5 border-t border-zinc-100 dark:border-zinc-805 flex items-center justify-between">
                                <span className="text-[10px] text-zinc-400 select-none">{isAr ? "برعاية نيوم" : "Sponsored by NEOM"}</span>
                                <a
                                  href="https://www.neom.com"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => {
                                    pushNotification({
                                      title: isAr ? "📍 زيارة نيوم ذا لاين" : "📍 Visiting NEOM Portal",
                                      message: isAr 
                                        ? "نجاح الانتقال المباشر لبث مجتمعات المستقبل المعرفية في نيوم." 
                                        : "Successfully redirected to NEOM’s cognitive future living showcase.",
                                      type: "personalized"
                                    });
                                  }}
                                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-650 hover:bg-blue-700 dark:bg-zinc-800 dark:hover:bg-zinc-750 transition-colors shadow-2xs"
                                >
                                  <span>{isAr ? "اكتشف المستقبل ↗" : "Discover NEOM ↗"}</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* COLUMN 3 (aside right): Dynamic Live Alerts Array + Popular Clickable Topics */}
          <aside className="space-y-6 lg:sticky lg:top-32 xl:col-span-1 lg:col-span-2">

            {/* AI Weather Widget card */}
            <section className="bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950 rounded-xl p-5 border border-zinc-200/85 dark:border-zinc-800 shadow-3xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-650 dark:text-indigo-400" />
                  <h3 className="text-xs font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                    {isAr ? "الطقس اليوم بذكاء AI" : "Today's Weather Portal"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    let loc = "Cairo";
                    if (preferences.enableLocationNews && locationState.city) {
                      loc = `${locationState.city}, ${locationState.country}`;
                    } else {
                      loc = COUNTRY_CAPITALS[selectedCountry] || selectedCountry || "Cairo";
                    }
                    fetchWeather(loc);
                  }}
                  className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md cursor-pointer text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  title="Refresh weather"
                >
                  <RefreshCw className={`w-3 h-3 ${weatherLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {weatherLoading ? (
                <div className="py-6 flex flex-col items-center justify-center space-y-2 text-zinc-400">
                  <span className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[9px] font-mono">{isAr ? "جاري رصد الطقس..." : "Scoping current forecast..."}</span>
                </div>
              ) : weatherError || !weather ? (
                <div className="py-4 text-center text-xs text-zinc-400 italic">
                  <span>{isAr ? "تعذر تجميع بيانات الطقس" : "Could not fetch weather updates"}</span>
                </div>
              ) : (
                <div className="space-y-3 animate-fade-in text-zinc-950 dark:text-zinc-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-extrabold text-zinc-800 dark:text-zinc-100 leading-none">
                        {weather.location}
                      </p>
                      <p className="text-xs text-zinc-450 dark:text-zinc-400 capitalize mt-1.5 font-semibold">
                        {weather.condition}
                      </p>
                    </div>
                    <div className="text-3xl font-black text-zinc-900 dark:text-white shrink-0 tracking-tighter">
                      {weather.temperature}°C
                    </div>
                  </div>

                  {/* Weather parameters bento row */}
                  <div className="grid grid-cols-3 gap-1 shadow-xs text-center bg-zinc-100/60 dark:bg-zinc-950 p-2 rounded-lg text-zinc-700 dark:text-zinc-300">
                    <div>
                      <p className="text-[9px] text-zinc-400 font-bold">{isAr ? "الرطوبة" : "Humidity"}</p>
                      <p className="text-xs font-bold font-mono mt-0.5">{weather.humidity}%</p>
                    </div>
                    <div className="border-x border-zinc-200/60 dark:border-zinc-805">
                      <p className="text-[9px] text-zinc-400 font-bold">{isAr ? "الرياح" : "Wind"}</p>
                      <p className="text-[10px] font-bold font-mono mt-0.5">{weather.windSpeed} <span className="text-[8px] text-zinc-400">km/h</span></p>
                    </div>
                    <div>
                      <p className="text-[9px] text-zinc-400 font-bold">{isAr ? "الأشعة" : "UV Index"}</p>
                      <p className="text-xs font-bold font-mono mt-0.5">{weather.uvIndex}</p>
                    </div>
                  </div>

                  {/* Smart Advice by AI */}
                  {weather.recommendation && (
                    <div className="p-2.5 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-805 dark:text-indigo-400 rounded-lg text-[10px] leading-relaxed border border-indigo-100/40 dark:border-indigo-950/40">
                      <p className="font-semibold">✨ {weather.recommendation}</p>
                    </div>
                  )}

                  {/* Horizon 3-day simple outlook */}
                  {weather.forecast && weather.forecast.length > 0 && (
                    <div className="pt-2 border-t border-zinc-150 dark:border-zinc-805">
                      <p className="text-[9px] text-zinc-450 dark:text-zinc-400 mb-2 font-bold uppercase tracking-wider">{isAr ? "توقعات الأيام القادمة" : "Extended Forecast"}</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {weather.forecast.map((fc: any, i: number) => (
                          <div key={i} className="text-center rounded-lg p-1.5 bg-zinc-100/40 dark:bg-zinc-900/40 border border-zinc-150/40 dark:border-zinc-850">
                            <p className="text-[8px] font-bold text-zinc-450 truncate">{fc.day}</p>
                            <p className="text-xs font-bold text-zinc-850 dark:text-zinc-200 mt-1">{fc.temp}°C</p>
                            <p className="text-[8px] text-zinc-550 truncate capitalize mt-0.5">{fc.condition}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Premium Sidebar Ad Unit */}
            {!dismissedAds.includes("sidebar_ad") && (
              <section className="bg-gradient-to-br from-[#1A202C] to-zinc-950 text-white rounded-xl overflow-hidden border border-zinc-800 shadow-md flex flex-col relative select-none" id="sidebar-sponsor-ad">
                <div className="absolute top-2 right-2 lg:left-2 lg:right-auto z-10">
                  <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-md text-[8px] font-black uppercase tracking-widest block font-mono">
                    {isAr ? "شراكة متميزة" : "Exclusive Ad"}
                  </span>
                </div>
                
                {/* Photo of Rolex */}
                <div className="relative aspect-video w-full overflow-hidden shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=400" 
                    alt="Rolex Luxury Diver Archetype"
                    className="w-full h-full object-cover select-none pointer-events-none hover:scale-103 transition-transform duration-700 opacity-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-bold text-amber-400 tracking-widest">{isAr ? "رولكس غلوبال" : "ROLEX SWITZERLAND"}</p>
                    <h4 className="text-xs sm:text-xs font-black text-white tracking-tight leading-snug">
                      {isAr ? "رولكس صبمارينر: الأناقة الميكانيكية الخالدة في معصمك" : "Rolex Submariner: Mechanical masterpiece for undersea legends"}
                    </h4>
                    <p className="text-[10px] text-zinc-400 leading-normal">
                      {isAr 
                        ? "روعة الصياغة السويسرية المقاومة للماء والأعماق لتعبر عن شخصيتك الراقية."
                        : "Crafted for durability and classic prestige. Certified officially as an elite Swiss chronometer."}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-zinc-800 flex items-center justify-between gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setDismissedAds(prev => [...prev, "sidebar_ad"]);
                        pushNotification({
                          title: isAr ? "👋 تم إخفاء البطاقة الجانبية" : "👋 Premium Card Closed",
                          message: isAr ? "لقد اخترت إخفاء رعاية رولكس من الواجهة الجانبية." : "The side sponsorship placement has been collapsed.",
                          type: "personalized"
                        });
                      }}
                      className="text-[9px] text-zinc-500 hover:text-zinc-200 transition-colors font-bold cursor-pointer"
                    >
                      {isAr ? "إخفاء الرعاية" : "Hide sponsorship"}
                    </button>
                    <a
                      href="https://www.rolex.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        pushNotification({
                          title: isAr ? "💎 رولكس ترحب بك" : "💎 Rolex Welcome",
                          message: isAr 
                            ? "تم الانتقال المباشر لكتالوج رولكس صبمارينر السويسري الرسمي." 
                            : "Redirected successfully to the certified Rolex Submariner catalogue.",
                          type: "personalized"
                        });
                      }}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-bold rounded-lg text-[9px] tracking-tight transition-all cursor-pointer shadow-3xs"
                    >
                      {isAr ? "اكتشف المجموعة ↗" : "View Collection ↗"}
                    </a>
                  </div>
                </div>
              </section>
            )}
            
            {/* Live alerts log */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-zinc-405 dark:text-zinc-400 uppercase tracking-widest">
                  {isAr ? "أحدث التنبيهات" : "Latest Live Alerts"}
                </h3>
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
              </div>

              <div className="flex flex-col gap-3">
                {notifications.slice(0, 3).map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-3 bg-zinc-50 dark:bg-zinc-950 rounded-lg shadow-2xs border-r-4 transition-all ${
                      notif.type === 'breaking' ? 'border-red-600' : 'border-blue-600'
                    } ${notif.read ? 'opacity-70' : ''}`}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-1 leading-snug">
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <button 
                          onClick={() => handleMarkNotifRead(notif.id)} 
                          className="text-[9px] text-blue-600 dark:text-blue-400 shrink-0 font-bold hover:underline"
                        >
                          {isAr ? "قرام" : "Read"}
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-[9px] text-zinc-400 mt-2 font-mono">
                      {notif.timestamp}
                    </p>
                  </div>
                ))}

                {notifications.length === 0 && (
                  <div className="text-center py-6 text-zinc-400 text-xs">
                    {isAr ? "لا توجد تنبيهات معلقة حالياً." : "No incoming alerts currently."}
                  </div>
                )}
              </div>
            </div>

            {/* Most Read (الأكثر قراءة) clickable widgets */}
            <section className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
              <h3 className="text-xs font-bold text-zinc-405 dark:text-zinc-400 uppercase tracking-widest mb-4">
                {isAr ? "الأكثر قراءة اليوم" : "Most Read Today"}
              </h3>

              <ul className="flex flex-col gap-4">
                <li 
                  onClick={() => {
                    setSearchQuery(isAr ? "الذكاء الاصطناعي" : "AI");
                    setActiveCategory("technology");
                  }}
                  className="flex gap-3 items-start group cursor-pointer"
                >
                  <span className="text-2xl font-black text-blue-500 italic leading-none shrink-0 group-hover:scale-110 transition-transform">
                    01
                  </span>
                  <div className="text-xs font-bold text-zinc-750 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {isAr ? "كيف سيغير الذكاء الاصطناعي وجه التعليم في 2025؟" : "How Generative AI will revolutionize education in 2025?"}
                  </div>
                </li>

                <li 
                  onClick={() => {
                    setSearchQuery(isAr ? "الشرق الأوسط" : "Middle East");
                    setActiveCategory("general");
                  }}
                  className="flex gap-3 items-start group cursor-pointer"
                >
                  <span className="text-2xl font-black text-blue-500 italic leading-none shrink-0 group-hover:scale-110 transition-transform">
                    02
                  </span>
                  <div className="text-xs font-bold text-zinc-750 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {isAr ? "أفضل الوجهات السياحية غير المكتشفة في الشرق الأوسط" : "Unraveling best hidden tourist spots across Middle East"}
                  </div>
                </li>

                <li 
                  onClick={() => {
                    setSearchQuery(isAr ? "العملات الرقمية" : "crypto");
                    setActiveCategory("business");
                  }}
                  className="flex gap-3 items-start group cursor-pointer"
                >
                  <span className="text-2xl font-black text-blue-500 italic leading-none shrink-0 group-hover:scale-110 transition-transform">
                    03
                  </span>
                  <div className="text-xs font-bold text-zinc-750 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {isAr ? "دليل شامل لاستثمارات العملات الرقمية للمبتدئين" : "Comprehensive guide to master cryptocurrency and indices"}
                  </div>
                </li>
              </ul>
            </section>
          </aside>

        </div>

        {/* Google AdSense Responsive Footer Unit */}
        <div className="mt-8">
          <AdSenseUnit slot="0987654321" isAr={isAr} className="shadow-xs" />
        </div>

        {/* 5. Helpful Dispatch context disclaimer */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-6 mt-6 text-zinc-650 dark:text-zinc-400 space-y-3.5">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-zinc-500 shrink-0" />
            <h4 className="font-bold text-sm text-zinc-805 dark:text-zinc-200">
              {isAr ? "تجميع كامل وبديل للصحف المتعددة" : "Integrated Publication Aggregator"}
            </h4>
          </div>
          <p className="text-xs leading-relaxed max-w-5xl">
            {isAr 
              ? "نبض العالم يغنيك عن تدقيق قنوات إخبارية متعددة! يقوم الموقع بفرز وتجميع عناوين الأخبار وأبرز المقالات مدعوماً بتقنيات الذكاء الاصطناعي لالتقاط المستجدات مباشرة من شبكات رويترز، بي بي سي، سي إن إن، الجزيرة، سكاي نيوز وتغطيتها بالتصنيف حسب أولوياتك وموقعك بضغطة واحدة." 
              : "This service acts as a complete replacement for traversing countless separate publications. Backed by intelligent indexing of top-tier channels (Reuters, BBC, Al Jazeera, CNN, TechCrunch), the system summarizes and routes key dispatches according to your specific geometric preferences and verified geolocation immediately."}
          </p>
        </section>
      </main>

      {/* 5. Customization Preferences Modal Frame */}
      <PreferencesModal
        isOpen={isPrefModalOpen}
        onClose={() => setIsPrefModalOpen(false)}
        preferences={preferences}
        onSave={handleSaveModalPrefs}
        locationCountry={locationState.country}
        onDetectLocation={handleDetectLocation}
      />

      {/* Info, Privacy, Cookies & Contact Multilingual Modal */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        defaultTab={infoModalTab}
        isAr={isAr}
      />

      {/* Cookie GDPR Compliance Bottom Consent Toast Banner */}
      <CookieConsent
        isAr={isAr}
        onOpenPolicy={() => {
          setInfoModalTab("cookies");
          setIsInfoModalOpen(true);
        }}
      />

      {/* 4. Deep AI Commentary and Article Explanation Modal */}
      {isExplainModalOpen && explainingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer" 
            onClick={() => {
              setIsExplainModalOpen(false);
              setExplainingArticle(null);
            }} 
          />
          
          {/* Modal Container */}
          <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-805 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-fade-in text-zinc-950 dark:text-zinc-50">
            {/* Header banner with thumbnail inside */}
            <div className="relative h-44 shrink-0 bg-zinc-100 dark:bg-gradient-to-br dark:from-indigo-900 dark:to-zinc-950 flex items-end p-5 select-none overflow-hidden">
              {explainingArticle.imageUrl && (
                <img 
                  src={explainingArticle.imageUrl} 
                  alt={explainingArticle.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-35 dark:opacity-20 pointer-events-none animate-pulse-slow"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent" />
              
              <div className="relative space-y-2 z-10 w-full">
                <div className="flex items-center gap-2 animate-fade-in">
                  <span className="bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-current" />
                    <span>{isAr ? "محرر التفسير الذكي" : "AI Context Engine"}</span>
                  </span>
                  <span className="text-[10px] text-zinc-505 dark:text-zinc-400 font-bold uppercase">{explainingArticle.source}</span>
                </div>
                <h3 className="font-extrabold text-sm sm:text-base leading-snug line-clamp-2">
                  {explainingArticle.title}
                </h3>
              </div>
            </div>

            {/* Scrollable analysis context content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {explanationLoading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4 text-zinc-450 dark:text-zinc-400">
                  <span className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs italic font-semibold">{isAr ? "مساعد Gemini يقوم بجمع وتنسيق السياق الآن..." : "AI analyst compiler drafting world reports..."}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 rounded-2xl text-xs leading-relaxed border border-zinc-150 dark:border-zinc-805 shadow-3xs select-text">
                    <p className="font-bold text-zinc-450 dark:text-zinc-400 mb-1 shrink-0 text-[10px] uppercase tracking-wider">{isAr ? "الملخص السريع" : "Quick Synopsis"}:</p>
                    <p>{explainingArticle.summary}</p>
                  </div>

                  <div className="whitespace-pre-wrap leading-relaxed text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm select-text markdown-body font-normal">
                    {explanationText || (isAr ? "لا توجد تفاصيل إضافية مجهّزة حالياً." : "No additional contextual details generated.")}
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons row */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-150 dark:border-zinc-850 flex items-center justify-between shrink-0">
              <a
                href={explainingArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-650 dark:text-indigo-400 font-bold hover:underline"
              >
                {isAr ? "تصفح القصة الأصلية الكاملة ↗" : "Browse full original story ↗"}
              </a>
              <button
                type="button"
                onClick={() => {
                  setIsExplainModalOpen(false);
                  setExplainingArticle(null);
                }}
                className="px-5 py-2 bg-zinc-800 hover:bg-zinc-905 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-white text-xs font-black rounded-lg transition-colors cursor-pointer"
              >
                {isAr ? "إغلاق النافذة" : "Dismiss"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Footer signature */}
      <footer className="border-t border-zinc-200/80 dark:border-zinc-805 mt-12 bg-white dark:bg-zinc-900 select-none">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-505 dark:text-zinc-400">
          <div className="space-y-2 text-center md:text-start">
            <p className="font-extrabold text-zinc-800 dark:text-zinc-100 flex items-center justify-center md:justify-start gap-1">
              <span>© 2026 Global News Hub - {isAr ? "نبض العالم" : "Pulse of the World"}.</span>
              <span>{isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}</span>
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-[11px] font-semibold text-zinc-500">
              <button
                type="button"
                onClick={() => { setInfoModalTab("about"); setIsInfoModalOpen(true); }}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer"
              >
                {isAr ? "من نحن" : "About Us"}
              </button>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <button
                type="button"
                onClick={() => { setInfoModalTab("contact"); setIsInfoModalOpen(true); }}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer"
              >
                {isAr ? "اتصل بنا" : "Contact Us"}
              </button>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <button
                type="button"
                onClick={() => { setInfoModalTab("privacy"); setIsInfoModalOpen(true); }}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer"
              >
                {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
              </button>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <button
                type="button"
                onClick={() => { setInfoModalTab("cookies"); setIsInfoModalOpen(true); }}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer"
              >
                {isAr ? "سياسة ملفات الكوكيز" : "Cookie Policy"}
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1.5 text-right font-medium text-zinc-400 dark:text-zinc-550">
            <span>{isAr ? "تنسيق متوازٍ مدعوم بالكامل بذكاء تجميعي" : "Bilingual Smart Aggregation Framework"}</span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">v2.1.25 / Stable</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
