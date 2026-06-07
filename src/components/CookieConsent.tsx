import React from "react";
import { Cookie, X, Info, ShieldAlert } from "lucide-react";

interface CookieConsentProps {
  isAr: boolean;
  onOpenPolicy: () => void;
}

export default function CookieConsent({ isAr, onOpenPolicy }: CookieConsentProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // Check if user has already made a selection
    const consent = localStorage.getItem("pulse_of_world_cookie_consent");
    if (!consent) {
      // Delay slightly for smooth appearance
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("pulse_of_world_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("pulse_of_world_cookie_consent", "rejected");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-5 flex flex-col space-y-4 animate-slide-up text-zinc-900 dark:text-zinc-100"
      id="cookie-consent-banner"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0">
          <Cookie className="w-5 h-5 animate-pulse" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-black tracking-tight text-zinc-900 dark:text-white flex items-center gap-1.5">
            {isAr ? "ملفات تعريف الارتباط وتفضيلات الموقع" : "Cookies & Site Preferences"}
          </h4>
          <p className="text-[11px] leading-relaxed text-zinc-550 dark:text-zinc-400">
            {isAr
              ? "نحن نستخدم ملفات تعريف الارتباط لتكييف وتخصيص المحتوى الإخباري، وتفعيل الإعلانات المناسبة (Google AdSense)، واستقصاء مستويات الكفاءة لضمان استقرار البوابة الإخبارية."
              : "We utilize cookies to deliver personalized newsletter content, handle Google AdSense setups, and analyze our traffic levels to provide maximum responsiveness."}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-zinc-100 dark:border-zinc-805">
        <button
          type="button"
          onClick={onOpenPolicy}
          className="text-[10px] text-zinc-502 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 underline font-semibold flex items-center gap-1.5"
        >
          <Info className="w-3.5 h-3.5" />
          {isAr ? "سياسة ملفات الارتباط والخصوصية" : "Cookie Policy & Details"}
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReject}
            className="px-3 py-1.5 text-[10px] text-zinc-550 dark:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors font-bold cursor-pointer"
          >
            {isAr ? "رفض غير الضروري" : "Reject Non-Essential"}
          </button>
          <button
            type="button"
            onClick={handleAcceptAll}
            className="px-3.5 py-1.5 text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-lg transition-shadow shadow-xs hover:shadow-md cursor-pointer"
          >
            {isAr ? "قبول الكل" : "Accept All"}
          </button>
        </div>
      </div>
    </div>
  );
}
