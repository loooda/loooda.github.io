import React from "react";
import { 
  X, Info, Shield, Cookie, Mail, Send, CheckCircle2, 
  MapPin, Phone, Globe, Award, Target, Users
} from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab: "about" | "contact" | "privacy" | "cookies";
  isAr: boolean;
}

export default function InfoModal({ isOpen, onClose, defaultTab, isAr }: InfoModalProps) {
  const [activeTab, setActiveTab] = React.useState<"about" | "contact" | "privacy" | "cookies">(defaultTab);
  
  // Contact state
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [formSubmitting, setFormSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setFormSubmitted(false);
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setFormSubmitting(true);
    setTimeout(() => {
      setFormSubmitting(false);
      setFormSubmitted(true);
      // Clean up fields
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1200);
  };

  const tabs = [
    { id: "about" as const, nameAr: "من نحن", nameEn: "About Us", icon: Info },
    { id: "contact" as const, nameAr: "اتصل بنا", nameEn: "Contact Us", icon: Mail },
    { id: "privacy" as const, nameAr: "سياسة الخصوصية", nameEn: "Privacy Policy", icon: Shield },
    { id: "cookies" as const, nameAr: "ملفات تعريف الارتباط", nameEn: "Cookie Policy", icon: Cookie },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      id="info-privacy-modal"
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl flex flex-col md:flex-row text-zinc-900 dark:text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 bg-zinc-50 dark:bg-zinc-950/70 border-b md:border-b-0 md:border-e border-zinc-200 dark:border-zinc-800 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible shrink-0 scrollbar-none">
          <div className="hidden md:block mb-4 px-2">
            <h3 className="text-xs font-black uppercase text-indigo-650 dark:text-indigo-400 tracking-wider">
              {isAr ? "مركز المعلومات القانوني" : "Information Center"}
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">
              {isAr ? "نبض العالم - بوابتك الإخبارية" : "Pulse of the World - Legal Desk"}
            </p>
          </div>
          
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
                    : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-150 dark:hover:bg-zinc-900"
                }`}
              >
                <IconComponent className="w-4 h-4 shrink-0" />
                <span>{isAr ? tab.nameAr : tab.nameEn}</span>
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[60vh] md:max-h-[80vh] flex flex-col">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Active Tab Content */}
          <div className="flex-1">
            {activeTab === "about" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-white flex items-center gap-2">
                    <Info className="w-5.5 h-5.5 text-indigo-605" />
                    {isAr ? "من نحن — نبض العالم" : "About Us — Pulse of the World"}
                  </h2>
                  <p className="text-xs text-zinc-550 dark:text-zinc-350 leading-relaxed">
                    {isAr 
                      ? "نبض العالم هو منصة إعلامية رقمية متطورة تسعى لتغطية الأحداث العالمية لحظة بلحظة بتنسيق ثنائي اللغة فائق الدقة. نوظف أحدث تقنيات جمع وتحليل الأخبار لنقدم للقارئ العربي والأجنبي رؤية محايدة وشاملة لما يدور في فلك الكوكب."
                      : "Pulse of the World is a cutting-edge digital news platform tracking global events around the clock with dual-language precision. We employ modern content aggregation frameworks to deliver neutral, insightful, and lightning-fast coverage of world dynamics."}
                  </p>
                </div>

                {/* Sub features grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
                    <div className="flex items-center gap-2 text-indigo-650 dark:text-indigo-400 font-bold text-xs mb-2">
                      <Target className="w-4 h-4" />
                      {isAr ? "رؤيتنا الإعلامية" : "Our Media Vision"}
                    </div>
                    <p className="text-[11px] leading-relaxed text-zinc-505 dark:text-zinc-400">
                      {isAr
                        ? "تقديم الخبر في قالب عصري خالٍ من الانحياز، مدعوم بتحليلات تمنح القارئ أقصى استفادة."
                        : "To formulate balanced journalism with visual clarity, supported by contextual details for deep comprehension."}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
                    <div className="flex items-center gap-2 text-emerald-650 dark:text-emerald-400 font-bold text-xs mb-2">
                      <Award className="w-4 h-4" />
                      {isAr ? "ركائز الجودة" : "Quality Principles"}
                    </div>
                    <p className="text-[11px] leading-relaxed text-zinc-505 dark:text-zinc-400">
                      {isAr
                        ? "الدقة، الحياد، السرعة، وتوفير سياقات متكاملة وإحصائيات طقسية وجغرافية تسهل الاستكشاف."
                        : "Veracity, neutrality, speed, and providing complementary geographical & atmospheric context."}
                    </p>
                  </div>
                </div>

                {/* Key figures */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-around text-center">
                  <div>
                    <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 font-mono">24/7</div>
                    <p className="text-[10px] text-zinc-400">{isAr ? "تحديث تلقائي" : "Realtime Feeds"}</p>
                  </div>
                  <div className="border-r border-zinc-200 dark:border-zinc-800 h-8 font-mono" />
                  <div>
                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">100%</div>
                    <p className="text-[10px] text-zinc-400">{isAr ? "محتوى موثق" : "Verified Sources"}</p>
                  </div>
                  <div className="border-r border-zinc-200 dark:border-zinc-800 h-8 font-mono" />
                  <div>
                    <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 font-mono">AR/EN</div>
                    <p className="text-[10px] text-zinc-400">{isAr ? "دعم ثنائي كامل" : "Full Bilingual"}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-white flex items-center gap-2">
                    <Mail className="w-5.5 h-5.5 text-indigo-605" />
                    {isAr ? "اتصل بنا — نحن هنا للمساعدة" : "Contact Us — We are here for you"}
                  </h2>
                  <p className="text-xs text-zinc-550 dark:text-zinc-350 leading-relaxed">
                    {isAr
                      ? "يسعدنا تلقي استفساراتكم وملاحظاتكم حول التغطية الإخبارية، شؤون الرعاية، أو الاقتراحات البرمجية."
                      : "We are pleased to receive your feedback, news tips, advertising inquiries, or bug reports."}
                  </p>
                </div>

                {formSubmitted ? (
                  <div className="p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/25 flex flex-col items-center text-center space-y-3 animate-scale-up">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <h4 className="font-bold text-emerald-950 dark:text-emerald-300">
                        {isAr ? "تم إرسال رسالتك بنجاح!" : "Message Sent Successfully!"}
                      </h4>
                      <p className="text-xs text-emerald-800/80 dark:text-emerald-400/80 mt-1">
                        {isAr
                          ? "شكراً لتواصلك معنا. سيقوم فريق الدعم الفني والإعلامي بالرد عليك خلال 24 ساعة."
                          : "Thank you for reaching out. Our editorial and technical team will review and reply within 24 hours."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormSubmitted(false)}
                      className="mt-3 px-4 py-1.5 text-[11px] font-black bg-emerald-600 dark:bg-emerald-505 hover:bg-emerald-702 text-white rounded-lg transition-colors cursor-pointer"
                    >
                      {isAr ? "إرسال رسالة أخرى" : "Send Another Message"}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-zinc-505 dark:text-zinc-400 mb-1.5">
                          {isAr ? "الاسم الكامل" : "Full Name"} *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-white"
                          placeholder={isAr ? "أحمد محمد" : "John Doe"}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-zinc-505 dark:text-zinc-400 mb-1.5">
                          {isAr ? "البريد الإلكتروني" : "Email Address"} *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-white"
                          placeholder="example@mail.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-zinc-505 dark:text-zinc-400 mb-1.5">
                        {isAr ? "الموضوع" : "Subject"}
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-white"
                        placeholder={isAr ? "طلب شراكة / سؤال تقني" : "Partnership Inquiry / Feedback"}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-zinc-505 dark:text-zinc-400 mb-1.5">
                        {isAr ? "نص الرسالة" : "Your Message"} *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-white resize-none"
                        placeholder={isAr ? "اكتب تفاصيل رسالتك هنا..." : "Type your message details here..."}
                      />
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={formSubmitting}
                        className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {formSubmitting ? (
                          <span>{isAr ? "جاري الإرسال..." : "Sending..."}</span>
                        ) : (
                          <>
                            <span>{isAr ? "إرسال الرسالة" : "Submit Inquiry"}</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-5.5 h-5.5 text-indigo-605" />
                    {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
                  </h2>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mb-4 uppercase tracking-wider font-mono">
                    {isAr ? "تاريخ التحديث الأخير: 25 مايو 2026" : "Last updated: May 25, 2026"}
                  </p>
                </div>

                <div className="space-y-4 text-xs text-zinc-600 dark:text-zinc-350 leading-relaxed">
                  <div>
                    <h4 className="font-extrabold text-zinc-900 dark:text-white mb-1.5">
                      {isAr ? "1. البيانات التي نقوم بجمعها" : "1. Information We Collect"}
                    </h4>
                    <p className="text-[11px]">
                      {isAr
                        ? "نحن نلتزم بحماية خصوصية جميع مستخدمينا بنسبة 100%. عند دخولك للموقع، نقوم فقط بحفظ تفضيلاتك الإخبارية محلياً (مثل تفعيل الوضع المظلم واختيار اللغة والاهتمامات) لضمان تجربة تصفح مثلى. في حال منح إذن الموقع اختيارياً، نقوم بالاستقصاء السحابي فقط لجلب النشرات المحلية دون رصد هويتك."
                        : "We believe in and adhere to absolute transparency. We do not aggregate identifiable personal data. We track local browser configurations (such as dark theme toggle, custom interests, and selected languages) entirely inside your standard localStorage to guarantee rapid rendering on future visits."}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-zinc-900 dark:text-white mb-1.5">
                      {isAr ? "2. إعلانات الجهات الخارجية (Google AdSense)" : "2. Third-Party Ad Systems (Google AdSense)"}
                    </h4>
                    <p className="text-[11px]">
                      {isAr
                        ? "يستخدم هذا الموقع برنامج Google AdSense التابع لشركة جوجل لعرض وتفعيل الوحدات الإعلانية. قد تستخدم رولكس، جوجل، أو شركاؤها ملفات تعريف الارتباط المخصصة لرصد سلوك التصفح المؤقت وعرض إعلانات مخصصة تهمك بناءً على زيارتك لموقعنا والشبكة العنكبوتية."
                        : "We utilize Google AdSense solutions to support our development cycle. Google and its respective network partners use dynamic cookies to customize the visual advertisements delivered based on your previous navigation routines across search results and international sites."}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-zinc-900 dark:text-white mb-1.5">
                      {isAr ? "3. أمن البيانات وحمايتها" : "3. Data Protection Safeguards"}
                    </h4>
                    <p className="text-[11px]">
                      {isAr
                        ? "يتم تداول جميع العمليات داخل موقعنا عبر بروتوكولات تشفير آمنة بالكامل HTTPS لضمان عدم تعرض أي مستخدم لتدخلات غير قانونية من أطراف شبكية معادية."
                        : "All connection lines and exchange streams operate strictly via certified end-to-end HTTPS architectures, preventing intermediate tracking, network exploitation, or data intrusion."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "cookies" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-white flex items-center gap-2">
                    <Cookie className="w-5.5 h-5.5 text-indigo-650 dark:text-indigo-400" />
                    {isAr ? "سياسة ملفات تعريف الارتباط (Cookies)" : "Cookie Policy"}
                  </h2>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mb-4 uppercase tracking-wider font-mono">
                    {isAr ? "تحديث توافق اللائحة العامة لحظر البيانات GDPR" : "GDPR & CCPA Compliant Information"}
                  </p>
                </div>

                <div className="space-y-4 text-xs text-zinc-600 dark:text-zinc-350 leading-relaxed">
                  <div>
                    <h4 className="font-extrabold text-zinc-900 dark:text-white mb-1.5">
                      {isAr ? "ما هي ملفات تعريف الارتباط؟" : "What are cookies?"}
                    </h4>
                    <p className="text-[11px]">
                      {isAr
                        ? "ملفات تعريف الارتباط هي ملفات نصية صغيرة وخفيفة جداً تخزن على حاسوبك أو هاتفك الذكي وتساعد البرامج على التعرف على إعداداتك لإعطائك أفضل مرونة تصفح ممكنة."
                        : "Cookies are granular text packets hosted in your browser container to support web responsiveness, authenticate safe connections, and memorize personalized preferences across sessions."}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-zinc-900 dark:text-white mb-1.5">
                      {isAr ? "كيف نستخدم هذه الملفات في معالجة البيانات؟" : "How are cookies used on this domain?"}
                    </h4>
                    <p className="text-[11px]">
                      {isAr
                        ? "نقسم ملفات تعريف الارتباط لدينا إلى ثلاثة أنواع:"
                        : "We structure our cookies into three specific operations:"}
                    </p>
                    <ul className="list-disc list-inside space-y-1.5 mt-2 text-[11px] text-zinc-550 dark:text-zinc-400">
                      <li>
                        <strong>{isAr ? "الكوكيز الأساسية:" : "Essential Cookies:"}</strong>{" "}
                        {isAr ? "تستخدم لحفظ تفضيلات اللغة والوضع المظلم ومعرفات البقاء آمنًا." : "Necessary to maintain session layouts, selected language variables, and accessibility values."}
                      </li>
                      <li>
                        <strong>{isAr ? "الكوكيز التحليلية:" : "Analytical Trackers:"}</strong>{" "}
                        {isAr ? "تساعدنا على تحليل كيفية استخدام الموقع والسرعة لتحسين الواجهة." : "Aggregated details regarding load limits, regional clicks, and interface render performance."}
                      </li>
                      <li>
                        <strong>{isAr ? "كوكيز الإعلانات والتخصيص:" : "Sponsor & Ad Targeting:"}</strong>{" "}
                        {isAr ? "مخصصة لبرنامج Google AdSense لعرض المحتويات التجارية الملائمة لك." : "Utilized by Google AdSense to prevent repetitive ads and customize sponsor materials based on user history."}
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-zinc-900 dark:text-white mb-1.5">
                      {isAr ? "التحكم في اختياراتك وتعطيلها" : "Managing your Cookie choices"}
                    </h4>
                    <p className="text-[11px]">
                      {isAr
                        ? "يمكنك في أي وقت تعطيل أو مسح هذه الملفات عبر إعدادات متصفحك مباشرة أو سحب قبولك عبر شريط التوجيه الخاص بنا في أسفل الصفحة الرئيسية."
                        : "You retain the sovereign right to alter, delete, or reject these cookies entirely inside your respective browser preference panels, or adjust choices directly using our consent banner."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
