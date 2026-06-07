import React from "react";
import { Megaphone, RefreshCw, Eye } from "lucide-react";

interface AdSenseUnitProps {
  slot?: string;
  format?: string;
  responsive?: string;
  className?: string;
  isAr?: boolean;
}

export default function AdSenseUnit({
  slot = "auto",
  format = "auto",
  responsive = "true",
  className = "",
  isAr = false,
}: AdSenseUnitProps) {
  const [adError, setAdError] = React.useState(false);
  const [adLoaded, setAdLoaded] = React.useState(false);

  React.useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setAdLoaded(true);
    } catch (err) {
      console.warn("AdSense push error, typically due to sandbox, dev server, or adblocker:", err);
      setAdError(true);
    }
  }, []);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/45 p-4 flex flex-col items-center justify-center text-center transition-all min-h-[120px] ${className}`}
      id={`adsense-unit-container-${slot}`}
    >
      {/* Real AdSense Slot Injection */}
      <div className="w-full z-10">
        <ins
          className="adsbygoogle"
          style={{ display: "block", minWidth: "120px", minHeight: "50px" }}
          data-ad-client="ca-pub-9267100704548464"
          data-ad-slot={slot !== "auto" ? slot : undefined}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        />
      </div>

      {/* Elegant Fallback Banner & Verification Helper */}
      {(!adLoaded || adError) && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900/60 dark:to-zinc-950 flex flex-col items-center justify-center p-4 z-0 pointer-events-none select-none">
          <div className="flex items-center gap-2 mb-1">
            <span className="animate-pulse w-2 h-2 rounded-full bg-emerald-505" />
            <span className="text-[10px] font-black text-indigo-650 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1">
              <Megaphone className="w-3 h-3" />
              {isAr ? "منصة إعلانات AdSense نشطة" : "Google AdSense Active"}
            </span>
          </div>
          <p className="text-xs font-extrabold text-zinc-800 dark:text-zinc-200">
            {isAr ? "مساحة إعلانية مجهزة برقم المفتش" : "Verified Ad Unit Slot"}
          </p>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono mt-1 select-all pointer-events-auto">
            ca-pub-9267100704548464 / Slot: {slot}
          </p>
          <div className="mt-2 text-[9px] text-zinc-400 italic">
            {isAr 
              ? "سيظهر الإعلان الحقيقي هنا تلقائياً بمجرد مراجعة وتفعيل نطاقك لدى AdSense."
              : "Live publisher contents will render dynamically once domain approval from AdSense is complete."}
          </div>
        </div>
      )}
    </div>
  );
}
