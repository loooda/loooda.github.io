import React from "react";
import { ExternalLink, Play, Square, Award, MessageSquare, Flame, CheckCircle, HelpCircle, Sparkles, Share2, Link, Check } from "lucide-react";
import { NewsArticle } from "../types";

interface NewsCardProps {
  key?: string;
  article: NewsArticle;
  isAr: boolean;
  onReadAloud: (text: string, id: string) => void;
  currentlyReadingId: string | null;
  onStopReading: () => void;
  onExplain?: (article: NewsArticle) => void;
}

export default function NewsCard({
  article,
  isAr,
  onReadAloud,
  currentlyReadingId,
  onStopReading,
  onExplain
}: NewsCardProps) {
  const isReading = currentlyReadingId === article.id;

  const getSentimentStyling = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return {
          bg: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
          text: isAr ? "إيجابي" : "Positive",
        };
      case "negative":
        return {
          bg: "bg-red-500/10 text-red-700 dark:bg-red-500/10 dark:text-red-400",
          text: isAr ? "سلبي" : "Negative",
        };
      default:
        return {
          bg: "bg-zinc-500/10 text-zinc-700 dark:bg-zinc-500/10 dark:text-zinc-400",
          text: isAr ? "حيادي" : "Neutral",
        };
    }
  };

  const sentimentStyle = getSentimentStyling(article.sentiment);

  const getCategoryTranslation = (cat: string) => {
    const cats: Record<string, { ar: string; en: string }> = {
      technology: { ar: "تقنية", en: "Tech" },
      sports: { ar: "رياضة", en: "Sports" },
      business: { ar: "اقتصاد", en: "Business" },
      science: { ar: "علوم", en: "Science" },
      politics: { ar: "سياسة", en: "Politics" },
      entertainment: { ar: "ترفيه", en: "Entertainment" },
      health: { ar: "صحة", en: "Health" }
    };
    return cats[cat] ? (isAr ? cats[cat].ar : cats[cat].en) : (isAr ? "عام" : "General");
  };

  const handleReadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isReading) {
      onStopReading();
    } else {
      onReadAloud(`${article.title}. ${article.summary}. المصدر: ${article.source}`, article.id);
    }
  };

  const [isShareOpen, setIsShareOpen] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(article.url || window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + "\n\n" + article.url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(article.url)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(article.url)}&text=${encodeURIComponent(article.title)}`
  };

  return (
    <article 
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-750 transition-all duration-300 flex flex-col h-full animate-fade-in text-zinc-950 dark:text-zinc-50"
      id={`news-card-${article.id}`}
    >
      {/* Article Image Frame */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
        <img 
          src={article.imageUrl} 
          alt={article.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 select-none pointer-events-none"
        />
        
        {/* Category Badge overlay */}
        <div className={`absolute top-3 ${isAr ? 'right-3' : 'left-3'} flex items-center gap-1.5`}>
          <span className="px-3 py-1 text-xs font-bold rounded-lg bg-black/70 backdrop-blur-md text-white border border-white/10 select-none">
            {getCategoryTranslation(article.category)}
          </span>
          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg shadow-xs backdrop-blur-md border border-white/10 flex items-center gap-1 select-none ${sentimentStyle.bg} bg-opacity-90`}>
            {sentimentStyle.text}
          </span>
        </div>
      </div>

      {/* Card Content Spacer */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Header context */}
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full" />
              {article.source}
            </span>
            <span>{article.publishedAt}</span>
          </div>

          {/* Title - Limit lines for visual structure */}
          <h4 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-zinc-50 leading-snug line-clamp-2 hover:text-zinc-750 cursor-pointer">
            {article.title}
          </h4>

          {/* Detailed summary */}
          <p className="text-zinc-600 dark:text-zinc-350 text-xs sm:text-sm line-clamp-3 leading-relaxed">
            {article.summary}
          </p>
        </div>

        {/* Footer controls */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-805 flex flex-wrap items-center justify-between gap-2 relative">
          
          {/* Left action panel */}
          <div className="flex flex-wrap items-center gap-2 bg-transparent">
            {/* TTS Player button */}
            <button
              type="button"
              onClick={handleReadClick}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold select-none transition-colors cursor-pointer ${
                isReading
                  ? "bg-red-500 text-white hover:bg-red-600 animate-pulse"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-250 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {isReading ? (
                <>
                  <Square className="w-3.5 h-3.5 mr-0.5" />
                  <span>{isAr ? "إيقاف القراءة" : "Stop Reading"}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 mr-0.5 fill-current" />
                  <span>{isAr ? "استمع للخبر" : "Listen Aloud"}</span>
                </>
              )}
            </button>

            {onExplain && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onExplain(article); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold select-none bg-indigo-50 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 border border-indigo-100/60 dark:border-zinc-700 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-all cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAr ? "تفسير الذكاء الاصطناعي" : "AI Explainer"}</span>
              </button>
            )}

            {/* Sharing toggle button */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setIsShareOpen(!isShareOpen); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold select-none transition-all duration-200 cursor-pointer ${
                  isShareOpen 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15" 
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-250 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
                title={isAr ? "مشاركة مع الأصدقاء" : "Share article"}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{isAr ? "مشاركة" : "Share"}</span>
              </button>

              {/* Share micro-dropdown dialog */}
              {isShareOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsShareOpen(false)} />
                  <div 
                    className={`absolute bottom-full mb-2 ${isAr ? 'right-0' : 'left-0'} z-20 w-44 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl p-2 flex flex-col gap-1 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 animate-slide-up`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex items-center justify-between w-full text-start px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Link className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{isAr ? "نسخ الرابط" : "Copy Link"}</span>
                      </span>
                      {isCopied && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                    </button>

                    <a
                      href={shareLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsShareOpen(false)}
                      className="flex items-center gap-2 w-full text-start px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                    >
                      <span className="w-4 h-4 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[8px] font-black shrink-0">WA</span>
                      <span>{isAr ? "واتساب" : "WhatsApp"}</span>
                    </a>

                    <a
                      href={shareLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsShareOpen(false)}
                      className="flex items-center gap-2 w-full text-start px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                    >
                      <span className="w-4 h-4 rounded-md bg-zinc-950 dark:bg-zinc-800 text-white flex items-center justify-center text-[8px] font-black shrink-0">X</span>
                      <span>{isAr ? "تويتر" : "X / Twitter"}</span>
                    </a>

                    <a
                      href={shareLinks.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsShareOpen(false)}
                      className="flex items-center gap-2 w-full text-start px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                    >
                      <span className="w-4 h-4 rounded-md bg-sky-500/10 text-sky-500 flex items-center justify-center text-[8px] font-black shrink-0">TG</span>
                      <span>{isAr ? "تليجرام" : "Telegram"}</span>
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Source Grounding button */}
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors capitalize font-semibold border border-transparent dark:hover:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-850"
          >
            <span>{isAr ? "المصدر الأصلي" : "Visit Source"}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
