import React from "react";
import { Bell, BellOff, X, Check, AlertOctagon, Info, MapPin, Trash2 } from "lucide-react";
import { NotificationItem } from "../types";

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  isAr: boolean;
  onGenerateAlert: () => void;
  generatingAlert: boolean;
}

export default function NotificationCenter({
  notifications,
  onMarkAsRead,
  onClearAll,
  isAr,
  onGenerateAlert,
  generatingAlert
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "breaking":
        return <AlertOctagon className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case "local":
        return <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Info className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "breaking":
        return isAr ? "عاجل" : "Breaking";
      case "local":
        return isAr ? "محلي" : "Local";
      default:
        return isAr ? "موصى به" : "Personalized";
    }
  };

  return (
    <div className="relative" id="notification-center">
      {/* Target Toggle Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-750 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        aria-label="Toggle notifications dropdown"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-extrabold text-white animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Popover Dropdown Container */}
      {isOpen && (
        <>
          {/* Overlay mask to close dropdown */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          
          <div 
            className={`absolute ${isAr ? 'left-0' : 'right-0'} mt-2 w-80 sm:w-96 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[480px] animate-fade-in`}
            dir={isAr ? "rtl" : "ltr"}
            id="notifications-popover"
          >
            {/* Header section */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                  {isAr ? "مركز لإشعارات" : "Notification Feed"}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearAll}
                    className="text-xs text-zinc-500 hover:text-red-500 flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3 h-3" />
                    {isAr ? "مسح الكل" : "Clear All"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List scroll body */}
            <div className="overflow-y-auto flex-1 divide-y divide-zinc-100 dark:divide-zinc-805">
              {/* Trigger dynamic test alert button */}
              <div className="p-3 bg-indigo-50/40 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-950/40 text-center">
                <button
                  type="button"
                  disabled={generatingAlert}
                  onClick={onGenerateAlert}
                  className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {generatingAlert 
                    ? (isAr ? "يقوم الذكاء الاصطناعي بالتحقق حالياً..." : "AI scanning breaking news...")
                    : (isAr ? "🚨 اطلب من الذكاء الاصطناعي اقتراح خبر عاجل الآن" : "🚨 Ask AI to generate fresh Breaking alert")}
                </button>
              </div>

              {notifications.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 dark:text-zinc-400 space-y-2">
                  <BellOff className="w-8 h-8 mx-auto stroke-1" />
                  <p className="text-xs">
                    {isAr ? "لا توجد إشعارات حالياً" : "Your notifications tray is empty"}
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`p-4 flex gap-3 transition-colors ${
                      notif.read 
                        ? "bg-white dark:bg-zinc-900 opacity-75" 
                        : "bg-zinc-50/60 dark:bg-zinc-800/20 border-l-2 border-red-500"
                    }`}
                  >
                    {/* Visual icon representation */}
                    <div className="mt-0.5 shrink-0">
                      {getIcon(notif.type)}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5 rounded-md">
                          {getTypeLabel(notif.type)}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {notif.timestamp}
                        </span>
                      </div>
                      
                      <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                        {notif.title}
                      </h5>
                      <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-300 leading-normal">
                        {notif.message}
                      </p>

                      {/* Quick action button to dismiss single notification */}
                      {!notif.read && (
                        <button
                          type="button"
                          onClick={() => onMarkAsRead(notif.id)}
                          className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          {isAr ? "تعليم كمقروء" : "Mark read"}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary context */}
            {unreadCount > 0 && (
              <div className="p-3 bg-zinc-50 dark:bg-zinc-850/30 text-center border-t border-zinc-100 dark:border-zinc-800">
                <p className="text-[10px] font-medium text-zinc-500">
                  {isAr 
                    ? `لديك ${unreadCount} تنبيهات غير مقروءة` 
                    : `You have ${unreadCount} unread warnings`}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
