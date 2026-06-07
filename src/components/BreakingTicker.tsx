import React from "react";
import { Zap, AlertCircle } from "lucide-react";

interface BreakingTickerProps {
  news: Array<{ title: string; source: string; category: string }>;
  isAr: boolean;
}

export default function BreakingTicker({ news, isAr }: BreakingTickerProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (news.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [news]);

  if (!news || news.length === 0) return null;

  const activeArticle = news[currentIndex];

  return (
    <div className="bg-zinc-900 text-zinc-100 dark:bg-zinc-950 px-4 py-3 select-none relative overflow-hidden flex items-center shadow-md border-b border-zinc-800" id="breaking-ticker">
      {/* Glow highlight */}
      <div className="absolute inset-0 bg-linear-to-r from-red-600/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-xs sm:text-sm font-sans relative z-10" dir={isAr ? "rtl" : "ltr"}>
        <div className="flex items-center gap-2 overflow-hidden w-full">
          {/* Label Tag */}
          <span className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-md bg-red-600 text-white font-extrabold animate-pulse uppercase tracking-wide">
            <Zap className="w-3.5 h-3.5" />
            {isAr ? "عاجل" : "BREAKING"}
          </span>

          {/* Scrolling text context */}
          <div className="relative h-6 flex-1 overflow-hidden ml-2 mr-2">
            <div 
              key={currentIndex}
              className="absolute inset-0 flex items-center gap-2 truncate text-zinc-200 dark:text-zinc-100 animate-slide-up"
            >
              <span className="font-semibold text-zinc-400">
                [{activeArticle.source}]
              </span>
              <span className="hover:underline cursor-pointer">
                {activeArticle.title}
              </span>
            </div>
          </div>
        </div>

        {/* Counter summary */}
        <div className="hidden md:flex items-center gap-1 text-zinc-500 font-mono text-xs whitespace-nowrap px-2">
          <span>{currentIndex + 1}</span>
          <span>/</span>
          <span>{news.length}</span>
        </div>
      </div>
    </div>
  );
}
