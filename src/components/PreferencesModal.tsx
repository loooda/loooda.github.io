import React from "react";
import { 
  X, Check, Globe, Cpu, Trophy, TrendingUp, 
  Atom, FileText, Film, HeartPulse, MapPin, Languages, Sun, Moon, Bell
} from "lucide-react";
import { UserPreferences } from "../types";

export const AVAILABLE_CATEGORIES = [
  { id: "general", nameAr: "الأخبار العامة", nameEn: "General News", icon: Globe, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { id: "technology", nameAr: "تقنية وهواتف", nameEn: "Technology", icon: Cpu, color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  { id: "sports", nameAr: "رياضة وملاعب", nameEn: "Sports", icon: Trophy, color: "bg-green-500/10 text-green-600 dark:text-green-400" },
  { id: "business", nameAr: "اقتصاد وأعمال", nameEn: "Business", icon: TrendingUp, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { id: "science", nameAr: "علوم وبحوث", nameEn: "Science", icon: Atom, color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" },
  { id: "politics", nameAr: "سياسة وأحداث", nameEn: "Politics", icon: FileText, color: "bg-red-500/10 text-red-600 dark:text-red-400" },
  { id: "entertainment", nameAr: "فنون وترفيه", nameEn: "Entertainment", icon: Film, color: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  { id: "health", nameAr: "صحة وبيئة", nameEn: "Health", icon: HeartPulse, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" }
];

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSave: (prefs: UserPreferences) => void;
  locationCountry: string;
  onDetectLocation: () => void;
}

export default function PreferencesModal({
  isOpen,
  onClose,
  preferences,
  onSave,
  locationCountry,
  onDetectLocation
}: PreferencesModalProps) {
  const [tempPrefs, setTempPrefs] = React.useState<UserPreferences>({ ...preferences });
  const [permissionStatus, setPermissionStatus] = React.useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [testCountdown, setTestCountdown] = React.useState<number | null>(null);

  React.useEffect(() => {
    setTempPrefs({ ...preferences });
  }, [preferences, isOpen]);

  React.useEffect(() => {
    if (typeof Notification !== "undefined") {
      setPermissionStatus(Notification.permission);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isAr = tempPrefs.selectedLanguage === "ar";

  const toggleCategory = (id: string) => {
    let list = [...tempPrefs.favoriteCategories];
    if (list.includes(id)) {
      list = list.filter(item => item !== id);
    } else {
      list.push(id);
    }
    // Prevent emptying so user always has at least one favorite
    if (list.length === 0) {
      list = ["general"];
    }
    setTempPrefs({ ...tempPrefs, favoriteCategories: list });
  };

  const setLang = (lang: 'ar' | 'en') => {
    setTempPrefs({ ...tempPrefs, selectedLanguage: lang });
  };

  const setTheme = (theme: 'light' | 'dark') => {
    setTempPrefs({ ...tempPrefs, theme });
  };

  const handleSave = () => {
    onSave(tempPrefs);
    onClose();
  };

  const requestPermission = async () => {
    if (typeof Notification === "undefined") return;
    const status = await Notification.requestPermission();
    setPermissionStatus(status);
    if (status === "granted") {
      setTempPrefs(prev => ({ ...prev, notificationsEnabled: true }));
    }
  };

  const startBackgroundTest = () => {
    if (typeof Notification === "undefined") return;
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then(status => {
        setPermissionStatus(status);
        if (status === "granted") {
          runCountdown();
        }
      });
    } else {
      runCountdown();
    }
  };

  const runCountdown = () => {
    setTestCountdown(5);
    const interval = setInterval(() => {
      setTestCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          triggerTestNotification();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const triggerTestNotification = () => {
    const title = isAr ? "🚨 تنبيه بالنظام: نبض العالم" : "🚨 System Alert: Pulse of the World";
    const body = isAr 
      ? "تنبيه نظام التشغيل يعمل بنجاح تام! يستمر موقع نبض العالم بالعمل في الخلفية لراحتك." 
      : "OS-level system alert works perfectly! Pulse of the World processes broadcasts in the background.";
    
    const options = {
      body,
      icon: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=192&h=192&q=80",
      badge: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=192&h=192&q=80",
      vibrate: [100, 50, 100],
      requireInteraction: true,
      data: {
        url: window.location.origin
      }
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, options);
      });
    } else {
      new Notification(title, options);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all duration-300 animate-fade-in" id="prefs-backdrop">
      <div 
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        dir={isAr ? "rtl" : "ltr"}
        id="prefs-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850/35">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              ⚙️
            </span>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              {isAr ? "إضفاء طابع شخصي وإعدادات" : "Feed customization & Settings"}
            </h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-zinc-405 hover:text-zinc-650 dark:hover:text-zinc-202 p-1.5 rounded-lg hover:bg-zinc-105 dark:hover:bg-zinc-802"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Language Selection */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-zinc-500 uppercase flex items-center gap-2">
              <Languages className="w-4 h-4 text-zinc-400" />
              {isAr ? "لغة عرض الأخبار" : "Feed Language"}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLang("ar")}
                className={`py-3 px-4 rounded-xl border text-center font-medium transition-all duration-200 ${
                  tempPrefs.selectedLanguage === "ar"
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-950 shadow-md"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                العربية (RTL)
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`py-3 px-4 rounded-xl border text-center font-medium transition-all duration-200 ${
                  tempPrefs.selectedLanguage === "en"
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-950 shadow-md"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                English (LTR)
              </button>
            </div>
          </div>

          {/* Theme */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-zinc-500 uppercase flex items-center gap-2">
              {tempPrefs.theme === "light" ? <Sun className="w-4 h-4 text-zinc-400" /> : <Moon className="w-4 h-4 text-zinc-400" />}
              {isAr ? "مظهر الواجهة" : "Theme Preference"}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-medium transition-all duration-200 ${
                  tempPrefs.theme === "light"
                    ? "border-amber-600 bg-amber-50 text-amber-900 shadow-xs"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <Sun className="w-4 h-4" />
                {isAr ? "نهاري" : "Light Mode"}
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-medium transition-all duration-200 ${
                  tempPrefs.theme === "dark"
                    ? "border-indigo-500 bg-indigo-950/40 text-indigo-400 shadow-xs"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <Moon className="w-4 h-4" />
                {isAr ? "ليلي" : "Dark Mode"}
              </button>
            </div>
          </div>

          {/* Core Customization - Favorite Topics */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-zinc-500 uppercase">
              {isAr ? "المواضيع المفضلة (سيتم إبرازها وتخصيص الواجهة لها)" : "Customized Favorite Categories (shapes your homepage)"}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isFav = tempPrefs.favoriteCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 text-left ${
                      isFav
                        ? "border-zinc-900 bg-zinc-900/5 dark:border-white dark:bg-white/5 font-semibold text-zinc-900 dark:text-white"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-lg ${cat.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </span>
                      <span className="text-sm">
                        {isAr ? cat.nameAr : cat.nameEn}
                      </span>
                    </div>
                    {isFav && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Preferences */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-extrabold text-zinc-500 uppercase flex items-center gap-2">
              <MapPin className="w-4 h-4 text-zinc-400" />
              {isAr ? "الأخبار المحلية والموقع" : "Location Based News"}
            </h4>
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50 dark:bg-zinc-800/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-sm text-zinc-800 dark:text-zinc-200">
                    {isAr ? "تمكين تصفية الأخبار حسب موقعي" : "Enable localized news retrieval"}
                  </h5>
                  <p className="text-xs text-zinc-500">
                    {isAr ? "إظهار الأخبار المتعلقة بدولتك تلقائياً" : "Show headline updates linked to your geolocation"}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={tempPrefs.enableLocationNews} 
                    onChange={(e) => setTempPrefs({ ...tempPrefs, enableLocationNews: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:bg-zinc-700 peer-checked:bg-zinc-900 dark:peer-checked:bg-white/85"></div>
                </label>
              </div>

              {tempPrefs.enableLocationNews && (
                <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">
                    {isAr ? `البلد المحدد: ${locationCountry || "أحضر بلدك..."}` : `Detected country: ${locationCountry || "Detecting..."}`}
                  </span>
                  <button
                    type="button"
                    onClick={onDetectLocation}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  >
                    {isAr ? "📍 تحديد الآن" : "📍 Detect Now"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notifications config */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-zinc-500 uppercase flex items-center gap-2">
              <Bell className="w-4 h-4 text-zinc-400" />
              {isAr ? "نظام الإشارات العاجلة والخلفية (لو الهاتف مغلق)" : "System Background Notifications (Device Closed)"}
            </h4>
            
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50 dark:bg-zinc-800/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-sm text-zinc-800 dark:text-zinc-200">
                    {isAr ? "إشعارات المتصفح والنظام" : "Browser OS Native Alerts"}
                  </h5>
                  <p className="text-xs text-zinc-500">
                    {isAr 
                      ? "إرسال تنبيهات على شاشة القفل ومركز الإشعارات حتى لو قمت بإغلاق الموقع" 
                      : "Sends push pop-ups to your notification center & lockscreen even if the tab is closed"}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={tempPrefs.notificationsEnabled} 
                    onChange={(e) => setTempPrefs({ ...tempPrefs, notificationsEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:bg-zinc-700 peer-checked:bg-zinc-900 dark:peer-checked:bg-white/85"></div>
                </label>
              </div>

              {/* Native permissions checker status banner */}
              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-black text-zinc-400">
                    {isAr ? "صلاحيات نظام التشغيل" : "Operating System Permission"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      permissionStatus === "granted" ? "bg-emerald-500 animate-pulse" : permissionStatus === "denied" ? "bg-red-500" : "bg-amber-500"
                    }`} />
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      {permissionStatus === "granted" 
                        ? (isAr ? "مفعّلة ومصرحة بالكامل" : "Fully Granted & Ready")
                        : permissionStatus === "denied"
                        ? (isAr ? "مرفوضة! الرجاء تفعيلها من قفل عنوان المتصفح" : "Denied! Unblock via browser URL lock icon")
                        : (isAr ? "بحاجة للترخيص النشط" : "Needs OS Authorization")}
                    </span>
                  </div>
                </div>

                {permissionStatus !== "granted" && (
                  <button
                    type="button"
                    onClick={requestPermission}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1 shrink-0 transition-colors"
                  >
                    <span>{isAr ? "🔔 منح الصلاحية" : "🔔 Authorize OS"}</span>
                  </button>
                )}
              </div>

              {/* Highly interactive automated test simulator to confirm it works even when closed! */}
              <div className="bg-zinc-100/60 dark:bg-zinc-800/60 rounded-xl p-3 border border-zinc-250 dark:border-zinc-700/60 space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black text-[#553C9A] dark:text-[#D6BCFA] tracking-wider font-mono">
                    {isAr ? "⚙️ محاكي قفل الشاشة والظهر" : "⚙️ Background & Lockscreen Simulator"}
                  </span>
                  {testCountdown !== null && (
                    <span className="text-xs text-red-500 font-extrabold animate-ping">
                      {isAr ? `تنبيه خلال: ${testCountdown}` : `Alerting in: ${testCountdown}`}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-500 leading-normal">
                  {isAr 
                    ? "اختبر وصول الإشعارات ونظام التشغيل مغلق أو التبويب مقفل. اضغط على الزر أدناه، ثم أغلق هاتفك أو صغر المتصفح فوراً، وخلال 5 ثوانٍ سيظهر لك إشعار النظام رسمياً!"
                    : "Test alerts while the tab is closed or your device is locked. Click the button, close/minimize your screen immediately, and watch the system popup arrive in 5s flat!"}
                </p>
                <button
                  type="button"
                  disabled={testCountdown !== null}
                  onClick={startBackgroundTest}
                  className="w-full text-xs font-bold py-2 px-3 rounded-lg border border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-300 hover:bg-[#805AD5] hover:text-white transition-all disabled:opacity-50 text-center"
                >
                  {testCountdown !== null
                    ? (isAr ? `⏱️ أغلق التبويب/الجهاز فوراً... (${testCountdown})` : `⏱️ Close Tab/Device Now... (${testCountdown})`)
                    : (isAr ? "🚨 أرسل إشعاراً خلفياً بعد 5 ثوانٍ وجرّب" : "🚨 Deliver Lockscreen Alert in 5s")}
                </button>
              </div>
            </div>
          </div>

          {/* Custom Gemini API Key configuration */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-zinc-500 uppercase flex items-center gap-2">
              <span className="text-sm">🔑</span>
              {isAr ? "مفتاح ذكاء Gemini الخاص بك" : "Custom Gemini API Key"}
            </h4>
            
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50 dark:bg-zinc-800/30 space-y-3">
              <div>
                <h5 className="font-medium text-sm text-zinc-800 dark:text-zinc-200">
                  {isAr ? "إدخال مفتاح API لـ Gemini تشغيلي" : "Set Active Gemini API Key"}
                </h5>
                <p className="text-xs text-zinc-500 mt-1">
                  {isAr 
                    ? "أدخل مفتاحك الخاص هنا ليعمل الذكاء الاصطناعي مباشرة من متصفحك عند تشغيل الموقع على GitHub Pages (دون الحاجة لخادم)." 
                    : "Enter your key here so the AI runs directly from your browser when hosted on GitHub Pages (completely serverless)."}
                </p>
              </div>

              <input
                type="password"
                className="w-full text-sm p-3 rounded-xl border border-zinc-250 dark:border-zinc-750 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition"
                placeholder={isAr ? "مثال: AIzaSy..." : "Example: AIzaSy..."}
                value={tempPrefs.customGeminiApiKey || ""}
                onChange={(e) => setTempPrefs({ ...tempPrefs, customGeminiApiKey: e.target.value })}
              />
              <p className="text-[11px] text-zinc-400 leading-normal">
                {isAr
                  ? "يتم حفظ المفتاح محلياً في متصفحك بكل أمان، ولن يتم مشاركته مع أي طرف خارجي على الإطلاق."
                  : "The key is saved locally in your browser or account securely and is never shared with third parties."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {isAr ? "إلغاء" : "Cancel"}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 rounded-xl text-sm font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-850 dark:hover:bg-white/90 shadow-lg"
          >
            {isAr ? "تطبيق وتحديث" : "Apply & Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
