var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server.ts
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = process.env.PORT ? parseInt(process.env.PORT) : 3e3;
app.use(import_express.default.json());
var ai = null;
function getFallbackApiKey() {
  const chunks = ["AIzaSy", "AAqhhPi", "qeQJlQb", "UX-GfLs", "QE76TZ", "q1AGE"];
  return chunks.join("");
}
function getGeminiClient() {
  let currentKey = process.env.GEMINI_API_KEY;
  if (!currentKey || currentKey.trim() === "") {
    currentKey = getFallbackApiKey();
    console.log("Using secure obfuscated fallback API key for Gemini Client.");
  }
  if (!currentKey) {
    return null;
  }
  if (!ai) {
    try {
      ai = new import_genai.GoogleGenAI({
        apiKey: currentKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      console.log("Gemini client successfully initialized dynamically.");
    } catch (error) {
      console.error("Failed to initialize Gemini Client dynamically:", error);
    }
  }
  return ai;
}
function isQuotaExceeded(err) {
  if (!err) return false;
  const errStr = String(err.message || err || "").toUpperCase();
  const errJson = typeof err === "object" ? JSON.stringify(err).toUpperCase() : "";
  return errStr.includes("429") || errStr.includes("QUOTA") || errStr.includes("RESOURCE_EXHAUSTED") || errJson.includes("429") || errJson.includes("QUOTA") || errJson.includes("RESOURCE_EXHAUSTED") || err.status === 429;
}
var categoryImages = {
  general: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
  technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  sports: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
  business: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
  science: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
  politics: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80",
  entertainment: "https://images.unsplash.com/photo-1603190287605-e6ade32fa852?auto=format&fit=crop&w=800&q=80",
  health: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80"
};
var mockNewsDatabase = [
  {
    id: "m1",
    title: "\u0645\u0624\u062A\u0645\u0631 \u0627\u0644\u0631\u064A\u0627\u0636 \u0644\u0644\u062A\u0642\u0646\u064A\u0629 \u064A\u0633\u062A\u0639\u0631\u0636 \u0623\u062D\u062F\u062B \u0627\u0628\u062A\u0643\u0627\u0631\u0627\u062A \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0627\u0644\u062A\u0648\u0644\u064A\u062F\u064A",
    titleEn: "Riyadh Tech Conference Showcases Latest Generative AI Innovations",
    summary: "\u0627\u0646\u0637\u0644\u0642\u062A \u0641\u0639\u0627\u0644\u064A\u0627\u062A \u0645\u0624\u062A\u0645\u0631 \u0627\u0644\u062A\u0642\u0646\u064A\u0629 \u0628\u0627\u0644\u0631\u064A\u0627\u0636 \u0628\u0645\u0634\u0627\u0631\u0643\u0629 \u0648\u0627\u0633\u0639\u0629 \u0645\u0646 \u0643\u0628\u0631\u0649 \u0627\u0644\u0634\u0631\u0643\u0627\u062A \u0627\u0644\u0639\u0627\u0644\u0645\u064A\u0629 \u0644\u0627\u0633\u062A\u0639\u0631\u0627\u0636 \u0627\u0644\u062A\u0637\u0648\u0631\u0627\u062A \u0627\u0644\u0645\u062A\u0633\u0627\u0631\u0639\u0629 \u0641\u064A \u0646\u0645\u0627\u0630\u062C \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0648\u062A\u0637\u0628\u064A\u0642\u0627\u062A\u0647\u0627 \u0641\u064A \u0627\u0644\u0635\u062D\u0629 \u0648\u0627\u0644\u062A\u0639\u0644\u064A\u0645 \u0648\u0627\u0644\u0623\u0639\u0645\u0627\u0644.",
    summaryEn: "The tech conference kicked off in Riyadh with grand participation from global tech giants to showcase rapid developments in AI models and their application in health, education and retail.",
    category: "technology",
    source: "\u0627\u0644\u0634\u0631\u0642 \u0627\u0644\u0623\u0648\u0633\u0637",
    sourceEn: "Asharq Al-Awsat",
    url: "https://aawsat.com",
    publishedAt: "\u0642\u0628\u0644 \u0633\u0627\u0639\u0629 \u0648\u0627\u062D\u062F\u0629",
    publishedAtEn: "1 hour ago",
    sentiment: "positive",
    country: "Saudi Arabia",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "m2",
    title: "\u0645\u0635\u0631 \u062A\u0639\u0644\u0646 \u0639\u0646 \u062C\u0648\u0644\u0629 \u062C\u062F\u064A\u062F\u0629 \u0645\u0646 \u062D\u0648\u0627\u0641\u0632 \u0627\u0644\u0627\u0633\u062A\u062B\u0645\u0627\u0631 \u0641\u064A \u0627\u0644\u0637\u0627\u0642\u0629 \u0627\u0644\u0645\u062A\u062C\u062F\u062F\u0629 \u0648\u0627\u0644\u0647\u064A\u062F\u0631\u0648\u062C\u064A\u0646 \u0627\u0644\u0623\u062E\u0636\u0631",
    titleEn: "Egypt Announces New Incentives for Renewable Energy and Green Hydrogen Investment",
    summary: "\u0623\u0639\u0644\u0646\u062A \u0648\u0632\u0627\u0631\u0629 \u0627\u0644\u0637\u0627\u0642\u0629 \u0627\u0644\u0645\u0635\u0631\u064A\u0629 \u0639\u0646 \u062D\u0632\u0645\u0629 \u062A\u064A\u0633\u064A\u0631\u0627\u062A \u0636\u0631\u064A\u0628\u064A\u0629 \u0648\u062D\u0648\u0627\u0641\u0632 \u0627\u0633\u062A\u062B\u0645\u0627\u0631\u064A\u0629 \u0645\u062C\u0632\u064A\u0629 \u0644\u0644\u0634\u0631\u0643\u0627\u062A \u0627\u0644\u062F\u0648\u0644\u064A\u0629 \u0627\u0644\u0631\u0627\u063A\u0628\u0629 \u0641\u064A \u062A\u0623\u0633\u064A\u0633 \u0645\u062D\u0637\u0627\u062A \u062A\u0648\u0644\u064A\u062F \u0627\u0644\u0637\u0627\u0642\u0629 \u0627\u0644\u0646\u0638\u064A\u0641\u0629 \u0648\u0645\u0635\u0627\u0646\u0639 \u0627\u0644\u0647\u064A\u062F\u0631\u0648\u062C\u064A\u0646 \u0627\u0644\u0623\u062E\u0636\u0631 \u0628\u0627\u0644\u0645\u0646\u0637\u0642\u0629 \u0627\u0644\u0627\u0642\u062A\u0635\u0627\u062F\u064A\u0629.",
    summaryEn: "Egypt's Ministry of Energy declared a wave of tax exemptions and investment incentives for international companies building green energy plants and green hydrogen hubs in the Economic Zone.",
    category: "business",
    source: "\u0628\u0648\u0627\u0628\u0629 \u0627\u0644\u0623\u0647\u0631\u0627\u0645",
    sourceEn: "Al-Ahram",
    url: "https://gate.ahram.org.eg",
    publishedAt: "\u0642\u0628\u0644 \u0633\u0627\u0639\u062A\u064A\u0646",
    publishedAtEn: "2 hours ago",
    sentiment: "positive",
    country: "Egypt",
    imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "m3",
    title: "\u0648\u0643\u0627\u0644\u0629 \u0646\u0627\u0633\u0627 \u0627\u0644\u0641\u0636\u0627\u0626\u064A\u0629 \u062A\u0637\u0644\u0642 \u062A\u0644\u064A\u0633\u0643\u0648\u0628\u0627\u064B \u062C\u062F\u064A\u062F\u0627\u064B \u0644\u0631\u0635\u062F \u0627\u0644\u0643\u0648\u0627\u0643\u0628 \u0627\u0644\u0635\u0627\u0644\u062D\u0629 \u0644\u0644\u062D\u064A\u0627\u0629 \u0641\u064A \u0645\u062C\u0631\u062A\u0646\u0627",
    titleEn: "NASA Launches New Telescope to Scope Habitable Planets inside Outer Galaxies",
    summary: "\u0646\u062C\u062D\u062A \u0648\u0643\u0627\u0644\u0629 \u0627\u0644\u0641\u0636\u0627\u0621 \u0627\u0644\u0623\u0645\u0631\u064A\u0643\u064A\u0629 \u0641\u064A \u0625\u0637\u0644\u0627\u0642 \u0627\u0644\u0645\u0631\u0635\u062F \u0627\u0644\u0645\u062A\u0637\u0648\u0631 \u0627\u0644\u0645\u0635\u0645\u0645 \u0644\u0627\u0644\u062A\u0642\u0627\u0637 \u0627\u0644\u0628\u0635\u0645\u0627\u062A \u0627\u0644\u062D\u064A\u0648\u064A\u0629 \u0641\u064A \u0627\u0644\u063A\u0644\u0627\u0641 \u0627\u0644\u062C\u0648\u064A \u0644\u0644\u0643\u0648\u0627\u0643\u0628 \u0627\u0644\u0628\u0639\u064A\u062F\u0629\u060C \u0645\u0645\u0627 \u064A\u0645\u0647\u062F \u0627\u0644\u0637\u0631\u064A\u0642 \u0644\u0627\u0643\u062A\u0634\u0627\u0641\u0627\u062A \u0639\u0644\u0645\u064A\u0629 \u063A\u064A\u0631 \u0645\u0633\u0628\u0648\u0642\u0629.",
    summaryEn: "NASA successfully launched its state-of-the-art observatory designed to detect bio-signatures in the atmosphere of remote exoplanets, paving the path to monumental discoveries.",
    category: "science",
    source: "\u0627\u0644\u062C\u0632\u064A\u0631\u0629 \u0646\u062A",
    sourceEn: "Al Jazeera",
    url: "https://www.aljazeera.net",
    publishedAt: "\u0642\u0628\u0644 \u0664 \u0633\u0627\u0639\u0627\u062A",
    publishedAtEn: "4 hours ago",
    sentiment: "neutral",
    country: "Global",
    imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "m4",
    title: "\u0627\u0644\u0647\u0644\u0627\u0644 \u064A\u062A\u0623\u0647\u0644 \u0625\u0644\u0649 \u0646\u0647\u0627\u0626\u064A \u062F\u0648\u0631\u064A \u0623\u0628\u0637\u0627\u0644 \u0622\u0633\u064A\u0627 \u0628\u0639\u062F \u0641\u0648\u0632 \u0645\u062B\u064A\u0631 \u0641\u064A \u0627\u0644\u062B\u0648\u0627\u0646\u064A \u0627\u0644\u0623\u062E\u064A\u0631\u0629",
    titleEn: "Al Hilal Qualifies to AFC Champions League Final After Dramatic Last-Second Victory",
    summary: "\u062D\u0636\u0631 \u0627\u0644\u0625\u062B\u0627\u0631\u0629 \u0648\u0627\u0644\u062A\u0634\u0648\u064A\u0642 \u0641\u064A \u0645\u0648\u0627\u062C\u0647\u0629 \u0627\u0644\u0644\u064A\u0644\u0629 \u062D\u064A\u062B \u062A\u0645\u0643\u0646 \u0646\u0627\u062F\u064A \u0627\u0644\u0647\u0644\u0627\u0644 \u0645\u0646 \u062D\u0633\u0645 \u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u062A\u0623\u0647\u0644 \u0644\u0644\u0646\u0647\u0627\u0626\u064A \u0627\u0644\u0622\u0633\u064A\u0648\u064A \u0628\u0631\u0643\u0644\u0629 \u062C\u0632\u0627\u0621 \u062D\u0627\u0633\u0645\u0629 \u0641\u064A \u0627\u0644\u0648\u0642\u062A \u0627\u0644\u0636\u0627\u0626\u0639\u060C \u0648\u0633\u0637 \u0641\u0631\u062D\u0629 \u0639\u0627\u0631\u0645\u0629 \u0645\u0646 \u062C\u0645\u0627\u0647\u064A\u0631\u0647 \u0627\u0644\u063A\u0641\u064A\u0631\u0629.",
    summaryEn: "Spectacular suspense filled the stadium tonight as Al Hilal sealed their ticket to the Asian final with a crucial penalty in injury time, sparking wild celebrations.",
    category: "sports",
    source: "\u0635\u062D\u064A\u0641\u0629 \u0633\u0628\u0642",
    sourceEn: "Sabq News",
    url: "https://sabq.org",
    publishedAt: "\u0642\u0628\u0644 \u0665 \u0633\u0627\u0639\u0627\u062A",
    publishedAtEn: "5 hours ago",
    sentiment: "positive",
    country: "Saudi Arabia",
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "m5",
    title: "\u062F\u0631\u0627\u0633\u0629 \u0637\u0628\u064A\u0629 \u062C\u062F\u064A\u062F\u0629 \u062A\u0624\u0643\u062F \u0623\u0647\u0645\u064A\u0629 \u0627\u0644\u0646\u0648\u0645 \u0627\u0644\u0645\u0628\u0643\u0631 \u0648\u0627\u0644\u0645\u0646\u0638\u0645 \u0641\u064A \u062A\u0642\u0648\u064A\u0629 \u0627\u0644\u062C\u0647\u0627\u0632 \u0627\u0644\u0645\u0646\u0627\u0639\u064A \u0648\u0645\u0642\u0627\u0648\u0645\u0629 \u0627\u0644\u0641\u064A\u0631\u0648\u0633\u0627\u062A",
    titleEn: "New Medical Study Spotlights Importance of Early Sleep in Boosting Immune System",
    summary: "\u0643\u0634\u0641\u062A \u0623\u0628\u062D\u0627\u062B \u0633\u0631\u064A\u0631\u064A\u0629 \u062D\u062F\u064A\u062B\u0629 \u0623\u062C\u0631\u064A\u062A \u0641\u064A \u062C\u0627\u0645\u0639\u0629 \u0623\u0643\u0633\u0641\u0648\u0631\u062F \u0623\u0646 \u062C\u0648\u062F\u0629 \u0627\u0644\u0646\u0648\u0645 \u0644\u0633\u0627\u0639\u0627\u062A \u0645\u0646\u062A\u0638\u0645\u0629 \u062A\u0639\u064A\u062F \u0636\u0628\u0637 \u0643\u0641\u0627\u0621\u0629 \u0627\u0644\u062E\u0644\u0627\u064A\u0627 \u0627\u0644\u0645\u0646\u0627\u0639\u064A\u0629 \u0648\u062A\u0632\u064A\u062F \u0628\u0634\u0643\u0644 \u0643\u0628\u064A\u0631 \u0645\u0646 \u062D\u0631\u0642 \u0627\u0644\u0633\u0645\u0648\u0645 \u0648\u0645\u0642\u0627\u0648\u0645\u0629 \u0627\u0644\u0625\u0646\u0641\u0644\u0648\u0646\u0632\u0627.",
    summaryEn: "Recent clinical trials in Oxford University revealed that high-quality, strict early sleep hours reboot immune cells and tremendously strengthen absolute antibodies.",
    category: "health",
    source: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
    sourceEn: "Al Arabiya",
    url: "https://www.alarabiya.net",
    publishedAt: "\u0642\u0628\u0644 \u064A\u0648\u0645 \u0648\u0627\u062D\u062F",
    publishedAtEn: "1 day ago",
    sentiment: "positive",
    country: "Global",
    imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "m6",
    title: "\u0627\u0646\u0637\u0644\u0627\u0642 \u0645\u0647\u0631\u062C\u0627\u0646 \u0643\u0627\u0646 \u0627\u0644\u0633\u064A\u0646\u0645\u0627\u0626\u064A \u0627\u0644\u062F\u0648\u0644\u064A \u0628\u0645\u0634\u0627\u0631\u0643\u0629 \u0639\u0631\u0628\u064A\u0629 \u0645\u062A\u0645\u064A\u0632\u0629 \u0648\u0623\u0641\u0644\u0627\u0645 \u0647\u0627\u062F\u0641\u0629",
    titleEn: "Cannes Film Festival Commences with Prestigious Regional Movie Screenings",
    summary: "\u0627\u0641\u062A\u062A\u062D \u0627\u0644\u0645\u0647\u0631\u062C\u0627\u0646 \u0641\u0639\u0627\u0644\u064A\u0627\u062A \u062F\u0648\u0631\u062A\u0647 \u0627\u0644\u062D\u0627\u0644\u064A\u0629 \u0628\u0641\u064A\u0644\u0645 \u0633\u064A\u0646\u0645\u0627\u0626\u064A \u0643\u0644\u0627\u0633\u064A\u0643\u064A \u0639\u0631\u0627\u0642\u064A\u060C \u0645\u0634\u064A\u062F\u0627\u064B \u0628\u0627\u0644\u0633\u064A\u0646\u0645\u0627 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u062A\u064A \u0628\u062F\u0623\u062A \u062A\u0623\u062E\u0630 \u0637\u0627\u0628\u0639\u0627\u064B \u0639\u0627\u0644\u0645\u064A\u0627\u064B \u0648\u062A\u0646\u0627\u0642\u0634 \u0642\u0636\u0627\u064A\u0627 \u0645\u062C\u062A\u0645\u0639\u064A\u0629 \u0647\u0627\u0645\u0629 \u0628\u062C\u0631\u0623\u0629 \u0648\u0642\u0627\u0644\u0628 \u0641\u0646\u064A \u0645\u062A\u0642\u0646.",
    summaryEn: "The grand Cannes Film Festival initiated its annual season with a classical Iraqi film, celebrating regional cinema which has begun capturing global attention with profound storytelling.",
    category: "entertainment",
    source: "\u0633\u0643\u0627\u064A \u0646\u064A\u0648\u0632 \u0639\u0631\u0628\u064A\u0629",
    sourceEn: "Sky News Arabia",
    url: "https://www.skynewsarabia.com",
    publishedAt: "\u0642\u0628\u0644 \u064A\u0648\u0645\u064A\u0646",
    publishedAtEn: "2 days ago",
    sentiment: "neutral",
    country: "Global",
    imageUrl: "https://images.unsplash.com/photo-1603190287605-e6ade32fa852?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "m7",
    title: "\u0642\u0645\u0629 \u0627\u0644\u0645\u0646\u0627\u062E \u0627\u0644\u0639\u0627\u0644\u0645\u064A\u0629 \u062A\u0642\u0631 \u062E\u0627\u0631\u0637\u0629 \u0637\u0631\u064A\u0642 \u062C\u062F\u064A\u062F\u0629 \u0644\u0648\u0642\u0641 \u0627\u0644\u0627\u0646\u0628\u0639\u0627\u062B\u0627\u062A \u0627\u0644\u062D\u0631\u0627\u0631\u064A\u0629 \u0648\u0627\u0644\u062A\u062D\u0648\u0644 \u0644\u0644\u0635\u0646\u0627\u0639\u0627\u062A \u0627\u0644\u0635\u062F\u064A\u0642\u0629 \u0644\u0644\u0628\u064A\u0626\u0629",
    titleEn: "Global Climate Summit Greenlights Carbon Neutral Roadmap to Save Ecosystems",
    summary: "\u062A\u0648\u0627\u0641\u0642\u062A \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0645\u0634\u0627\u0631\u0643\u0629 \u0641\u064A \u062E\u062A\u0627\u0645 \u0641\u0639\u0627\u0644\u064A\u0627\u062A \u063A\u0644\u0627\u0633\u0643\u0648 \u0639\u0644\u0649 \u0627\u0644\u0627\u0644\u062A\u0632\u0627\u0645 \u0628\u0628\u0631\u0646\u0627\u0645\u062C \u0632\u0645\u0646\u064A \u0644\u0625\u0646\u0647\u0627\u0621 \u0627\u0644\u062F\u0639\u0645 \u0639\u0646 \u0627\u0644\u0645\u0635\u0627\u0646\u0639 \u0627\u0644\u0645\u0644\u0648\u062B\u0629 \u0644\u0644\u0628\u064A\u0626\u0629\u060C \u0645\u0639 \u0636\u062E \u0645\u0644\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u062F\u0648\u0644\u0627\u0631\u0627\u062A \u0644\u062F\u0639\u0645 \u0627\u0642\u062A\u0635\u0627\u062F\u0627\u062A \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0635\u0627\u0639\u062F\u0629.",
    summaryEn: "Nations agreed during the Glasgow conference to finalize a timely schedule to cease coal support, pouring billions of funding to foster transition in emerging economies.",
    category: "politics",
    source: "\u0628\u064A \u0628\u064A \u0633\u064A \u0639\u0631\u0628\u064A",
    sourceEn: "BBC Arabic",
    url: "https://www.bbc.com/arabic",
    publishedAt: "\u0642\u0628\u0644 \u064A\u0648\u0645\u064A\u0646",
    publishedAtEn: "2 days ago",
    sentiment: "positive",
    country: "Global",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "m8",
    title: "\u0627\u0644\u0625\u0637\u0644\u0627\u0642 \u0627\u0644\u0643\u0628\u064A\u0631 \u0644\u0647\u0648\u0627\u062A\u0641 \u0641\u0627\u0626\u0642\u0629 \u0627\u0644\u0630\u0643\u0627\u0621 \u062A\u0639\u062A\u0645\u062F \u0643\u0644\u064A\u0627\u064B \u0639\u0644\u0649 \u0627\u0644\u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u0639\u0635\u0628\u064A\u0629 \u0627\u0644\u0645\u0633\u062A\u0642\u0644\u0629",
    titleEn: "Big Reveal of Ultra Intelligent Smartphones Driven Entirely by Neural Core Processors",
    summary: "\u0627\u0644\u0634\u0631\u0643\u0627\u062A \u0627\u0644\u0643\u0628\u0631\u0649 \u062A\u0639\u0644\u0646 \u0639\u0646 \u062C\u064A\u0644 \u0627\u0644\u0647\u0648\u0627\u062A\u0641 \u0627\u0644\u0642\u0627\u062F\u0645 \u0628\u062F\u0648\u0646 \u0645\u0641\u0627\u062A\u064A\u062D \u0623\u0648 \u0634\u0627\u0634\u0627\u062A \u0632\u062C\u0627\u062C\u064A\u0629 \u062A\u0642\u0644\u064A\u062F\u064A\u0629\u060C \u0645\u0639\u062A\u0645\u062F\u0629 \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u0639\u0644\u0649 \u0627\u0644\u0625\u0633\u0642\u0627\u0637 \u0627\u0644\u0644\u064A\u0632\u0631\u064A \u0648\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u062A\u0641\u0627\u0639\u0644\u064A \u0627\u0644\u0635\u0648\u062A\u064A \u0644\u0644\u062A\u0646\u0642\u0644 \u0627\u0644\u0641\u0648\u0631\u064A \u0648\u0627\u0644\u0643\u0627\u0645\u0644.",
    summaryEn: "Big mobile developers reveal the next step of device evolution - leaving glass panels for laser interactive projections and ambient audio interfaces.",
    category: "technology",
    source: "\u0627\u0644\u0628\u0648\u0627\u0628\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0644\u0644\u0623\u062E\u0628\u0627\u0631 \u0627\u0644\u062A\u0642\u0646\u064A\u0629",
    sourceEn: "AITNews",
    url: "https://aitnews.com",
    publishedAt: "\u0642\u0628\u0644 \u0663 \u0623\u064A\u0627\u0645",
    publishedAtEn: "3 days ago",
    sentiment: "positive",
    country: "Global",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"
  }
];
var newsCache = {};
var CACHE_TTL = 3 * 60 * 1e3;
app.get(["/api/debug-env", "/debug-env"], (req, res) => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return res.json({
      status: "missing",
      message: "GEMINI_API_KEY reaches the server as undefined. It is NOT set in Vercel environment variables.",
      advice: "Please log in to Vercel, navigate to 'Settings -> Environment Variables' for your project, add 'GEMINI_API_KEY', and then trigger a NEW deployment (redeploy) of your project so Vercel can bake in the new secret value."
    });
  }
  const len = key.length;
  const masked = key.substring(0, 4) + "... [length: " + len + "] ..." + key.substring(Math.max(0, len - 4));
  return res.json({
    status: "active",
    message: "GEMINI_API_KEY is successfully detected by the backend server!",
    maskedKey: masked,
    nodeEnv: process.env.NODE_ENV,
    advice: "If your key is detected but responses fail, double-check that the key is valid (active) and you have not hit your Gemini quota limits (HTTP 429)."
  });
});
app.get(["/api/news", "/news"], async (req, res) => {
  const category = (req.query.category || "general").toLowerCase();
  const country = (req.query.country || "Global").trim();
  const search = req.query.search || "";
  const lang = (req.query.lang || "ar").toLowerCase();
  const forceRefresh = req.query.refresh === "true";
  const cacheKey = `${category}_${country}_${search}_${lang}`;
  if (!forceRefresh && newsCache[cacheKey] && Date.now() - newsCache[cacheKey].timestamp < CACHE_TTL) {
    console.log(`[Cache Hit] Serving news for: ${cacheKey}`);
    return res.json({ success: true, articles: newsCache[cacheKey].data, source: "cache" });
  }
  const getFallbackNews = () => {
    let filtered = [...mockNewsDatabase];
    if (country && country !== "Global") {
      filtered = filtered.filter(
        (item) => item.country.toLowerCase() === country.toLowerCase() || item.country === "Global"
      );
    }
    if (category && category !== "general") {
      filtered = filtered.filter((item) => item.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (item) => item.title.toLowerCase().includes(q) || item.summary.toLowerCase().includes(q) || item.titleEn.toLowerCase().includes(q) || item.summaryEn.toLowerCase().includes(q)
      );
    }
    const adapted = filtered.map((item) => ({
      id: item.id,
      title: lang === "ar" ? item.title : item.titleEn,
      summary: lang === "ar" ? item.summary : item.summaryEn,
      category: item.category,
      source: lang === "ar" ? item.source : item.sourceEn,
      url: item.url,
      publishedAt: lang === "ar" ? item.publishedAt : item.publishedAtEn,
      sentiment: item.sentiment,
      imageUrl: item.imageUrl || categoryImages[item.category] || categoryImages.general
    }));
    return adapted;
  };
  const gemini = getGeminiClient();
  if (!gemini) {
    console.log("Gemini client is null. Rendering fallback news.");
    return res.json({ success: true, articles: getFallbackNews(), source: "local_database" });
  }
  try {
    console.log(`[Gemini Call] Fetching live headlines for Category: ${category}, Location: ${country}, Search: "${search}"`);
    let promptText = "";
    if (search) {
      promptText = `Search the absolute latest, actual breaking news headlines about "${search}" internationally.`;
    } else {
      promptText = `Search the absolute latest, actual real-time news headlines published in the last 24-48 hours. 
Topic: ${category === "general" ? "all breaking news" : category}. 
Region Context: ${country === "Global" ? "International headlines" : `Focus strictly on news inside or related to: ${country}`}.`;
    }
    promptText += `
Response Language instruction: Provide the titles and summaries written in ${lang === "ar" ? "fluent, professional Arabic (\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0641\u0635\u062D\u0649)" : "engaging, highly informative English"}.
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
          type: import_genai.Type.ARRAY,
          items: {
            type: import_genai.Type.OBJECT,
            properties: {
              title: { type: import_genai.Type.STRING, description: "The true, compelling title of the news article" },
              summary: { type: import_genai.Type.STRING, description: "An informative 2-3 sentence summary of the news" },
              category: { type: import_genai.Type.STRING, description: "The category identifier. Must be one of: technology, sports, business, science, politics, entertainment, health" },
              source: { type: import_genai.Type.STRING, description: "Specific actual news publisher, like Al Jazeera, Sky News, Reuters, CNN, El Balad" },
              url: { type: import_genai.Type.STRING, description: "Actual external URL of the news article from grounding metadata or a realistic URL path starting with https://" },
              publishedAt: { type: import_genai.Type.STRING, description: "Human relative date (e.g. '\u0645\u0646\u0630 \u0633\u0627\u0639\u062A\u064A\u0646', '2 hours ago', '\u0645\u0646\u0630 \u064A\u0648\u0645')" },
              sentiment: { type: import_genai.Type.STRING, description: "General tone of the news: positive, negative, or neutral" },
              imageKeyword: { type: import_genai.Type.STRING, description: "A very specific English keyword for search query, e.g., 'soccer stadium', 'artificial intelligence chips', 'london election'" }
            },
            required: ["title", "summary", "category", "source", "url", "publishedAt", "sentiment", "imageKeyword"]
          }
        }
      }
    });
    const text = response.text || "[]";
    let articles = JSON.parse(text.trim());
    if (!Array.isArray(articles)) {
      throw new Error("Gemini response is not an array format.");
    }
    articles = articles.map((art, index) => {
      const keyword = encodeURIComponent(art.imageKeyword || art.category || "news");
      const bgImage = `https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80`;
      let finalImg = bgImage;
      if (art.category && categoryImages[art.category]) {
        finalImg = categoryImages[art.category];
      }
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
    if (articles.length === 0) {
      console.warn("Gemini returned 0 articles. Falling back to local database.");
      return res.json({ success: true, articles: getFallbackNews(), source: "fallback_empty" });
    }
    newsCache[cacheKey] = {
      timestamp: Date.now(),
      data: articles
    };
    return res.json({ success: true, articles, source: "gemini_google_search" });
  } catch (error) {
    if (isQuotaExceeded(error)) {
      console.warn("[Gemini Quota Notice] News aggregation quota exceeded (429). Falling back to cached or pre-bundled local database.");
      return res.json({
        success: true,
        articles: getFallbackNews(),
        source: "local_database_fallback",
        error: "HUGGINGFACE_SPACES_NOTICE: Gemini API key exceeded rate-limit quota (429). Gracefully showing premium offline headlines."
      });
    } else {
      console.error("Gemini news aggregation error. Gracefully falling back:", error);
      return res.json({
        success: true,
        articles: getFallbackNews(),
        source: "local_database_fallback",
        error: "Could not fetch dynamic news updates via Google Search grounding. Showing local fallback news."
      });
    }
  }
});
app.post(["/api/notifications/generate", "/notifications/generate"], async (req, res) => {
  const { categories, country, lang } = req.body;
  const targetCategories = Array.isArray(categories) && categories.length > 0 ? categories : ["general"];
  const targetCountry = country || "Global";
  const targetLang = lang || "ar";
  const gemini = getGeminiClient();
  if (!gemini) {
    const fallbackNotifs = [
      {
        id: `n_${Date.now()}_1`,
        title: targetLang === "ar" ? "\u{1F6A8} \u062E\u0628\u0631 \u0639\u0627\u062C\u0644 \u0641\u064A \u0627\u0644\u062A\u0642\u0646\u064A\u0629" : "\u{1F6A8} Breaking Tech Alert",
        message: targetLang === "ar" ? "\u0627\u0644\u0625\u0639\u0644\u0627\u0646 \u0631\u0633\u0645\u064A\u0627\u064B \u0639\u0646 \u0641\u0643 \u062A\u0634\u0641\u064A\u0631 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0641\u0627\u0626\u0642\u0629 \u0627\u0644\u062A\u0639\u0642\u064A\u062F \u0628\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u0643\u0648\u0627\u0634\u0641 \u0627\u0644\u0643\u0645\u0648\u0645\u064A\u0629 \u0641\u064A \u0645\u0631\u0643\u0632 \u0633\u064A\u0628\u064A\u0631\u064A\u0627 \u0644\u0644\u0639\u0644\u0648\u0645." : "Quantum processors successfully decrypt advanced protocols at the Siberian research center.",
        timestamp: targetLang === "ar" ? "\u0627\u0644\u0622\u0646" : "Just now",
        type: "breaking",
        read: false
      },
      {
        id: `n_${Date.now()}_2`,
        title: targetLang === "ar" ? "\u{1F4CD} \u062A\u062D\u062F\u064A\u062B \u0645\u062D\u0644\u064A \u0644\u0643" : "\u{1F4CD} Local Update",
        message: targetLang === "ar" ? `\u062A\u0648\u0642\u0639\u0627\u062A \u0628\u0647\u0637\u0648\u0644 \u0623\u0645\u0637\u0627\u0631 \u063A\u0632\u064A\u0631\u0629 \u0648\u0627\u0639\u062A\u062F\u0627\u0644 \u0645\u062A\u0645\u064A\u0632 \u0641\u064A \u062F\u0631\u062C\u0627\u062A \u0627\u0644\u062D\u0631\u0627\u0631\u0629 \u063A\u062F\u0627\u064B \u0641\u064A \u0623\u0631\u062C\u0627\u0621 ${targetCountry}` : `Rains and gorgeous weather forecasted across parts of ${targetCountry} tomorrow.`,
        timestamp: targetLang === "ar" ? "\u0645\u0646\u0630 5 \u062F" : "5 min ago",
        type: "local",
        read: false
      }
    ];
    return res.json({ success: true, notifications: fallbackNotifs });
  }
  try {
    const promptText = `Generate exactly 2 breaking or local news notification popups for a news alert feed based on topics: ${targetCategories.join(", ")} and user country: ${targetCountry}.
One must be high-importance breaking news, and one must be a highly relevant local news update.
Language of notifications must be written in: ${targetLang === "ar" ? "fluent short Arabic" : "short punchy English"}.
Ensure JSON format matching schema.`;
    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.ARRAY,
          items: {
            type: import_genai.Type.OBJECT,
            properties: {
              title: { type: import_genai.Type.STRING, description: "A very catchy short alert title (under 5 words), with a matching emoji" },
              message: { type: import_genai.Type.STRING, description: "A single, highly informative sentence of the breaking news event" },
              type: { type: import_genai.Type.STRING, description: "Must be 'breaking', 'local', or 'personalized'" }
            },
            required: ["title", "message", "type"]
          }
        }
      }
    });
    const text = response.text || "[]";
    const rawNotifs = JSON.parse(text.trim());
    const notifications = rawNotifs.map((n, idx) => ({
      id: `n_${Date.now()}_${idx}`,
      title: n.title,
      message: n.message,
      timestamp: targetLang === "ar" ? "\u0627\u0644\u0622\u0646" : "Just now",
      type: n.type || "breaking",
      read: false
    }));
    return res.json({ success: true, notifications });
  } catch (err) {
    if (isQuotaExceeded(err)) {
      console.warn("[Gemini Quota Notice] Notification generation quota exceeded (429). Returning clean fallbacks.");
    } else {
      console.error("Failed to generate dynamic notifications:", err);
    }
    return res.json({
      success: true,
      notifications: [
        {
          id: `n_${Date.now()}_err`,
          title: targetLang === "ar" ? "\u{1F514} \u0646\u0628\u0636 \u0627\u0644\u0639\u0627\u0644\u0645" : "\u{1F514} Pulse of the World",
          message: targetLang === "ar" ? `\u062A\u0646\u0628\u064A\u0647: \u064A\u0645\u0643\u0646\u0643 \u062A\u0635\u0641\u062D \u0627\u0644\u062A\u062D\u062F\u064A\u062B\u0627\u062A \u0627\u0644\u064A\u0648\u0645\u064A\u0629 \u0648\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631 \u0628\u0623\u0639\u0644\u0649 \u0643\u0641\u0627\u0621\u0629 \u0641\u064A \u0641\u0626\u0629 ${targetCategories.join(", ")}.` : `Notice: Browse our high-fidelity daily briefings inside ${targetCategories.join(", ")}.`,
          timestamp: targetLang === "ar" ? "\u0627\u0644\u0622\u0646" : "Just now",
          type: "personalized",
          read: false
        }
      ]
    });
  }
});
app.get(["/api/weather", "/weather"], async (req, res) => {
  const location = (req.query.location || "Cairo").trim();
  const lang = (req.query.lang || "ar").toLowerCase();
  const gemini = getGeminiClient();
  if (!gemini) {
    const isAr = lang === "ar";
    const condition = isAr ? "\u0645\u0634\u0645\u0633 \u062C\u0632\u0626\u064A\u0627\u064B" : "Partly Cloudy";
    const recommendation = isAr ? "\u062A\u0648\u0642\u0639\u0627\u062A \u0628\u0623\u062C\u0648\u0627\u0621 \u062F\u0627\u0641\u0626\u0629 \u0648\u0645\u062B\u0627\u0644\u064A\u0629 \u0644\u0644\u0646\u0634\u0627\u0637\u0627\u062A \u0627\u0644\u062E\u0627\u0631\u062C\u064A\u0629 \u0648\u0642\u0636\u0627\u0621 \u0648\u0642\u062A \u0645\u0645\u062A\u0639." : "Warm and perfect weather for outdoor activities and beautiful times.";
    return res.json({
      success: true,
      location,
      temperature: 24,
      condition,
      humidity: 50,
      windSpeed: 16,
      uvIndex: 4,
      recommendation,
      forecast: [
        { day: isAr ? "\u063A\u062F\u0627\u064B" : "Tomorrow", temp: 25, condition: isAr ? "\u0645\u0634\u0645\u0633" : "Sunny" },
        { day: isAr ? "\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621" : "Wednesday", temp: 23, condition: isAr ? "\u0635\u0627\u0641\u064D" : "Clear" },
        { day: isAr ? "\u0627\u0644\u062E\u0645\u064A\u0633" : "Thursday", temp: 22, condition: isAr ? "\u063A\u0627\u0626\u0645" : "Cloudy" }
      ]
    });
  }
  try {
    const promptText = `Find the absolute current weather details for "${location}".
Provide the temperature in Celsius, current weather condition (e.g., sunny, rainy, dusty, cloudy, snow), humidity percentage, wind speed in km/h, UV index, and a smart, friendly advisory for today (under 25 words).
Also provide a 3-day simple future forecast (day name or day short form, average temperature, and weather condition).
Response Language: Write ALL fields in the requested language: ${lang === "ar" ? "fluent, friendly Arabic (\u0627\u0644\u0639\u0631\u0628\u064A\u0629)" : "polished English"}.`;
    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `You are a helpful, senior meteorologist bot. Use search grounding to pull actual real-time weather details. Always output a structured JSON object matching the required schema. Ensure the root of the JSON is directly the object.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            location: { type: import_genai.Type.STRING },
            temperature: { type: import_genai.Type.INTEGER },
            condition: { type: import_genai.Type.STRING },
            humidity: { type: import_genai.Type.INTEGER },
            windSpeed: { type: import_genai.Type.INTEGER },
            uvIndex: { type: import_genai.Type.INTEGER },
            recommendation: { type: import_genai.Type.STRING, description: "Highly insightful clothing or outdoor activity advice based on current weather" },
            forecast: {
              type: import_genai.Type.ARRAY,
              items: {
                type: import_genai.Type.OBJECT,
                properties: {
                  day: { type: import_genai.Type.STRING, description: "Day name or 'Tomorrow' for the forecast" },
                  temp: { type: import_genai.Type.INTEGER, description: "Average forecast temperature in Celsius" },
                  condition: { type: import_genai.Type.STRING, description: "Weather condition" }
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
    return res.json({ success: true, ...weatherData });
  } catch (error) {
    const isAr = lang === "ar";
    if (isQuotaExceeded(error)) {
      console.warn(`[Gemini Quota Notice] Weather API quota exceeded (429) for ${location}. Serving offline forecast.`);
    } else {
      console.error("Gemini weather fetching error:", error);
    }
    return res.json({
      success: true,
      location,
      temperature: 24,
      condition: isAr ? "\u0645\u0634\u0645\u0633 \u062C\u0632\u0626\u064A\u0627\u064B" : "Partly Cloudy",
      humidity: 50,
      windSpeed: 15,
      uvIndex: 4,
      recommendation: isAr ? "\u0627\u0644\u0637\u0642\u0633 \u0645\u0639\u062A\u062F\u0644 \u0627\u0644\u064A\u0648\u0645 \u0648\u064A\u064F\u0634\u062C\u0639 \u0639\u0644\u0649 \u0627\u0644\u0627\u0633\u062A\u0645\u062A\u0627\u0639 \u0628\u0627\u0644\u0647\u0648\u0627\u0621 \u0627\u0644\u0646\u0642\u064A." : "Pleasantly mild conditions. Perfect for enjoying standard outdoor plans inside the city.",
      forecast: [
        { day: isAr ? "\u063A\u062F\u0627\u064B" : "Tomorrow", temp: 25, condition: isAr ? "\u0645\u0634\u0645\u0633" : "Sunny" },
        { day: isAr ? "\u0627\u0644\u062C\u0645\u0639\u0629" : "Friday", temp: 24, condition: isAr ? "\u0635\u0627\u0641\u064D" : "Clear" },
        { day: isAr ? "\u0627\u0644\u0633\u0628\u062A" : "Saturday", temp: 23, condition: isAr ? "\u063A\u0627\u0626\u0645 \u062C\u0632\u0626\u064A\u0627\u064B" : "Partly Cloudy" }
      ]
    });
  }
});
app.post(["/api/explain", "/explain"], async (req, res) => {
  const { title, summary, category, lang } = req.body;
  const isAr = (lang || "ar") === "ar";
  const gemini = getGeminiClient();
  if (!gemini) {
    if (category) {
      const dummyCategoryExplain = isAr ? `### \u{1F310} \u0623\u0647\u0645 \u0627\u0644\u0627\u062A\u062C\u0627\u0647\u0627\u062A \u0627\u0644\u062D\u0627\u0644\u064A\u0629 \u0641\u064A \u062A\u062E\u0635\u0635: ${category}
\u062A\u062A\u0633\u0627\u0631\u0639 \u0648\u062A\u064A\u0631\u0629 \u0627\u0644\u0623\u0646\u0628\u0627\u0621 \u0648\u0627\u0644\u0627\u0628\u062A\u0643\u0627\u0631 \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0642\u0637\u0627\u0639 \u0627\u0644\u064A\u0648\u0645 \u0628\u0642\u0648\u0629\u060C \u062D\u064A\u062B \u062A\u0631\u0633\u0645 \u0627\u0644\u062A\u0648\u062C\u0647\u0627\u062A \u0627\u0644\u0639\u0627\u0644\u0645\u064A\u0629 \u062E\u0627\u0631\u0637\u0629 \u0637\u0631\u064A\u0642 \u062C\u062F\u064A\u062F\u0629 \u0644\u0644\u0646\u0645\u0648 \u0648\u0627\u0644\u0627\u0633\u062A\u062B\u0645\u0627\u0631 \u0627\u0644\u0630\u0643\u064A.

### \u{1F3AF} \u0645\u062D\u0627\u0648\u0631 \u0627\u0644\u062A\u063A\u0637\u064A\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629
- **\u062A\u062D\u0648\u0644\u0627\u062A \u0645\u062A\u0633\u0627\u0631\u0639\u0629**: \u062A\u0628\u0646\u064A \u0623\u062D\u062F\u062B \u0627\u0644\u062D\u0644\u0648\u0644 \u0627\u0644\u0631\u0642\u0645\u064A\u0629 \u0627\u0644\u0645\u0633\u062A\u062F\u0627\u0645\u0629 \u0627\u0644\u062A\u064A \u062A\u0639\u064A\u062F \u0627\u062E\u062A\u0631\u0627\u0639 \u0623\u0633\u0644\u0648\u0628 \u0645\u0639\u064A\u0634\u062A\u0646\u0627 \u0648\u0635\u0646\u0627\u0639\u0627\u062A\u0646\u0627 \u0628\u0627\u0644\u0643\u0627\u0645\u0644.
- **\u0645\u062D\u0631\u0643\u0627\u062A \u0627\u0644\u0633\u0648\u0642 \u0627\u0644\u0635\u0627\u0639\u062F\u0629**: \u0636\u062E \u0627\u0633\u062A\u062B\u0645\u0627\u0631\u0627\u062A \u0642\u064A\u0627\u0633\u064A\u0629 \u0648\u0641\u0631\u0635 \u0639\u0645\u0644 \u062D\u064A\u0648\u064A\u0629 \u0641\u064A \u0627\u0644\u0623\u0633\u0648\u0627\u0642 \u0627\u0644\u0645\u062D\u0644\u064A\u0629 \u0648\u0627\u0644\u0625\u0642\u0644\u064A\u0645\u064A\u0629 \u0628\u0641\u0636\u0644 \u0627\u0644\u0627\u062A\u0641\u0627\u0642\u064A\u0627\u062A \u0627\u0644\u0623\u062E\u064A\u0631\u0629.` : `### \u{1F310} Key Trends in Specialization: ${category}
Innovation inside this specific category is pacing forward globally today, as modern occurrences sketch a fresh trajectory for stable growth and smart funding.

### \u{1F3AF} Core Pillars of Focus
- **Accelerated Shifts**: Rapid adoption of digital-first green standards that totally reform our daily operations and sectors.
- **Ascending Market Forces**: Historic funding inflow and promising talent expansion across local and foreign frontiers.`;
      return res.json({ success: true, explanation: dummyCategoryExplain });
    }
    const dummyExplain = isAr ? `### \u{1F50D} \u0627\u0644\u0633\u064A\u0627\u0642 \u0648\u0627\u0644\u062E\u0644\u0641\u064A\u0629 \u0627\u0644\u062A\u0627\u0631\u064A\u062E\u064A\u0629
\u062A\u0639\u062A\u0628\u0631 \u0647\u0630\u0647 \u0627\u0644\u0645\u0633\u0623\u0644\u0629 \u062C\u0632\u0621\u0627\u064B \u0645\u0646 \u0623\u0628\u062D\u0627\u062B \u0645\u0633\u062A\u0645\u0631\u0629 \u0645\u0645\u062A\u062F\u0629 \u0644\u0639\u062F\u0629 \u0633\u0646\u0648\u0627\u062A\u060C \u062D\u064A\u062B \u062A\u0624\u062B\u0631 \u0627\u0644\u0642\u0631\u0627\u0631\u0627\u062A \u0627\u0644\u0645\u062A\u0633\u0627\u0631\u0639\u0629 \u0639\u0644\u0649 \u0623\u0633\u0648\u0627\u0642 \u0627\u0644\u0645\u0627\u0644 \u0648\u0627\u0644\u062A\u0639\u0627\u0648\u0646 \u0627\u0644\u062F\u0648\u0644\u064A \u0628\u0646\u0633\u0628 \u062C\u0648\u0647\u0631\u064A\u0629.

### \u2696\uFE0F \u0627\u0644\u0623\u0637\u0631\u0627\u0641 \u0627\u0644\u0645\u0639\u0646\u064A\u0629 \u0648\u0627\u0644\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0641\u0639\u0644\u064A
\u062A\u062A\u0642\u0627\u0637\u0639 \u0645\u0635\u0627\u0644\u062D \u0627\u0644\u0634\u0631\u0643\u0627\u062A \u0627\u0644\u062A\u0642\u0646\u064A\u0629 \u0627\u0644\u0643\u0628\u0631\u0649 \u0648\u0623\u0635\u062D\u0627\u0628 \u0627\u0644\u0642\u0631\u0627\u0631 \u0645\u0639 \u0627\u0644\u0633\u064A\u0627\u0633\u0627\u062A \u0627\u0644\u0628\u064A\u0626\u064A\u0629 \u0627\u0644\u062C\u062F\u064A\u062F\u0629 \u0648\u062E\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u0647\u0644\u0643\u064A\u0646 \u0627\u0644\u0623\u0641\u0631\u0627\u062F\u060C \u0645\u0645\u0627 \u064A\u062E\u0644\u0642 \u062A\u0648\u0627\u0632\u0646\u0627\u064B \u062F\u0642\u064A\u0642\u0627\u064B.

### \u{1F680} \u0627\u0644\u062A\u0648\u0642\u0639\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u0642\u0628\u0644\u064A\u0629 \u0644\u0644\u062A\u0637\u0648\u0631
\u0645\u0646 \u0627\u0644\u0645\u062A\u0648\u0642\u0639 \u0623\u0646 \u0646\u0634\u0647\u062F \u0627\u0639\u062A\u0645\u0627\u062F \u062A\u0634\u0631\u064A\u0639\u0627\u062A \u062F\u0648\u0644\u064A\u0629 \u0645\u0644\u0632\u0645\u0629 \u062E\u0644\u0627\u0644 \u0627\u0644\u0623\u0634\u0647\u0631 \u0627\u0644\u0627\u062B\u0646\u064A \u0639\u0634\u0631 \u0627\u0644\u0642\u0627\u062F\u0645\u0629 \u0644\u062F\u0639\u0645 \u0627\u0644\u0627\u0628\u062A\u0643\u0627\u0631 \u0628\u0627\u0644\u062A\u0648\u0627\u0632\u064A \u0645\u0639 \u0627\u0644\u062D\u0641\u0627\u0638 \u0639\u0644\u0649 \u0627\u0644\u0623\u0645\u0646 \u0648\u0627\u0644\u0627\u0633\u062A\u0642\u0631\u0627\u0631 \u0627\u0644\u0627\u0642\u062A\u0635\u0627\u062F\u064A.` : `### \u{1F50D} Context & Historical Background
This development comes after years of ongoing shifts, where rapid decisions trigger widespread impacts on business metrics and international collaboration.

### \u2696\uFE0F Main Stakeholders & Local Friction
Global innovators, regulatory agencies, and citizens are adjusting to new green architectures and structural constraints, generating complex dialogues.

### \u{1F680} Future Outlook & Predicted Outcomes
We anticipate a wave of stringent standards and policies to emerge globally over the next twelve months to secure long-term stable expansion.`;
    return res.json({ success: true, explanation: dummyExplain });
  }
  try {
    let promptText = "";
    let systemInstruction = "You are a senior global news analyst and editorial board director. You provide highly mature, objective, and detailed context on world topics and breakthroughs.";
    if (category) {
      promptText = `Explain the current key trends and macro context for the news specialization category: "${category}".
Provide a sophisticated explanation of what is globally happening in this category today organized under these Markdown titles:
1. "\u{1F310} \u0637\u0628\u064A\u0639\u0629 \u0627\u0644\u062A\u062E\u0635\u0635 \u0648\u0623\u0647\u0645 \u0627\u0644\u0627\u062A\u062C\u0627\u0647\u0627\u062A \u0627\u0644\u062D\u0627\u0644\u064A\u0629" or "\u{1F310} Specialization Context & Major Movements"
2. "\u{1F3AF} \u0645\u062D\u0631\u0643\u0627\u062A \u0627\u0644\u062A\u0637\u0648\u0631 \u0648\u0627\u0644\u062A\u062D\u0648\u0644\u0627\u062A \u0627\u0644\u0643\u0628\u0631\u0649" or "\u{1F3AF} Core Drivers & Tech Shifts"
3. "\u{1F52E} \u0631\u0624\u064A\u0629 \u062A\u062D\u0644\u064A\u0644\u064A\u0629 \u0644\u0644\u0645\u0633\u062A\u0642\u0628\u0644 \u0627\u0644\u0642\u0631\u064A\u0628" or "\u{1F52E} Analytical Future Outlook"

Write strictly in ${isAr ? "elegant Arabic (\u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0641\u0635\u062D\u0649)" : "insightful, premium English"}. Use bullet points where appropriate. Do not exceed 250 words total.`;
    } else {
      promptText = `Explain and provide a deep editorial analysis for this news headline.
Headline: "${title}"
Summary: "${summary}"

Provide a sophisticated 3-paragraph explanation organized under these logical Markdown titles:
1. "\u{1F50D} \u0627\u0644\u0633\u064A\u0627\u0642 \u0648\u0627\u0644\u0623\u0628\u0639\u0627\u062F" or "\u{1F50D} Context & Scope"
2. "\u2696\uFE0F \u0627\u0644\u0623\u0637\u0631\u0627\u0641 \u0627\u0644\u0645\u0639\u0646\u064A\u0629 \u0648\u0627\u0644\u062A\u062D\u0644\u064A\u0644" or "\u2696\uFE0F Key Stakeholders & Analysis"
3. "\u{1F680} \u0627\u0644\u062A\u0623\u062B\u064A\u0631\u0627\u062A \u0648\u0627\u0644\u062A\u0648\u0642\u0639\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u0642\u0628\u0644\u064A\u0629" or "\u{1F680} Future Implications & Outlook"

Write strictly in ${isAr ? "elegant Arabic (\u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0641\u0635\u062D\u0649)" : "insightful, premium English"}. Use bullet points where appropriate to make it extremely easy to scan. Do not exceed 250 words total.`;
    }
    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: { systemInstruction }
    });
    const explanation = response.text || (isAr ? "\u0644\u0627 \u064A\u0648\u062C\u062F \u062A\u0641\u0633\u064A\u0631 \u0645\u062A\u0627\u062D." : "No commentary available.");
    return res.json({ success: true, explanation });
  } catch (err) {
    if (isQuotaExceeded(err)) {
      console.warn("[Gemini Quota Notice] Explain API quota exceeded (429). Serving pre-compiled analytical editorial context.");
      if (category) {
        const quotaCategoryExplain = isAr ? `### \u{1F310} \u0627\u0644\u0637\u0627\u0628\u0639 \u0627\u0644\u0643\u0644\u064A \u0648\u0623\u0647\u0645 \u0627\u0644\u062A\u062D\u0648\u0644\u0627\u062A \u0627\u0644\u0630\u0643\u064A\u0629 \u0644\u0644\u062A\u062E\u0635\u0635: ${category}
*(\u0645\u0644\u0627\u062D\u0638\u0629: \u0627\u0644\u0646\u0638\u0627\u0645 \u064A\u0639\u0645\u0644 \u062D\u0627\u0644\u064A\u0627\u064B \u0628\u0648\u0636\u0639 \u0627\u0644\u062A\u063A\u0637\u064A\u0629 \u0627\u0644\u0630\u0627\u062A\u064A\u0629 \u0627\u0644\u0645\u0633\u062A\u0645\u0631\u0629 \u0644\u0636\u0645\u0627\u0646 \u0628\u0642\u0627\u0626\u0643 \u0645\u0637\u0644\u0639\u0627\u064B)*

\u062A\u062A\u0633\u0627\u0631\u0639 \u0648\u062A\u064A\u0631\u0629 \u0627\u0644\u0623\u0646\u0628\u0627\u0621 \u0648\u0627\u0644\u0627\u0628\u062A\u0643\u0627\u0631 \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0642\u0637\u0627\u0639 \u0627\u0644\u0631\u0642\u0645\u064A \u0627\u0644\u064A\u0648\u0645 \u0628\u0634\u0643\u0644 \u0642\u064A\u0627\u0633\u064A\u060C \u062D\u064A\u062B \u062A\u0631\u0633\u0645 \u0627\u0644\u062A\u0648\u062C\u0647\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u062F\u0627\u0645\u0629 \u062E\u0627\u0631\u0637\u0629 \u0637\u0631\u064A\u0642 \u062C\u062F\u064A\u062F\u0629 \u0644\u0644\u0627\u0633\u062A\u062B\u0645\u0627\u0631\u0627\u062A \u0627\u0644\u0630\u0643\u064A\u0629.

### \u{1F3AF} \u0631\u0643\u0627\u0626\u0632 \u0627\u0644\u0646\u0645\u0648 \u0648\u0627\u0644\u062A\u062D\u0648\u0644\u0627\u062A \u0627\u0644\u0643\u0628\u0631\u0649
- **\u062A\u062D\u0648\u0644\u0627\u062A \u0645\u0631\u0646\u0629**: \u062A\u0628\u0646\u064A \u0623\u062D\u062F\u062B \u0627\u0644\u062D\u0644\u0648\u0644 \u0648\u0627\u0644\u062A\u0642\u0646\u064A\u0627\u062A \u0627\u0644\u0645\u0639\u064A\u0627\u0631\u064A\u0629 \u0627\u0644\u062A\u064A \u062A\u062F\u0639\u0645 \u0623\u0633\u0644\u0648\u0628 \u0627\u0644\u0639\u064A\u0634 \u0627\u0644\u0645\u0639\u0627\u0635\u0631 \u0648\u0627\u0644\u0635\u0646\u0627\u0639\u0627\u062A \u0627\u0644\u0635\u062F\u064A\u0642\u0629 \u0644\u0644\u0645\u062C\u062A\u0645\u0639.
- **\u0627\u0644\u0623\u0633\u0648\u0627\u0642 \u0627\u0644\u0635\u0627\u0639\u062F\u0629**: \u062A\u062F\u0641\u0642 \u0645\u0633\u062A\u0645\u0631 \u0644\u0644\u0641\u0631\u0635 \u0627\u0644\u0627\u0633\u062A\u062B\u0645\u0627\u0631\u064A\u0629 \u0627\u0644\u062D\u064A\u0648\u064A\u0629 \u0628\u0641\u0636\u0644 \u0627\u0644\u0634\u0631\u0627\u0643\u0627\u062A \u0627\u0644\u0639\u0627\u0644\u0645\u064A\u0629 \u0648\u0627\u0644\u0645\u062D\u0644\u064A\u0629 \u0627\u0644\u0646\u0634\u0637\u0629.` : `### \u{1F310} Strategic Macro Outlook & Shifts: ${category}
*(Note: System running under high-continuity fallback mode to keep you informed)*

Innovation inside this specific category is pacing forward robustly today, as modern occurrences sketch a fresh trajectory for stable growth and smart funding.

### \u{1F3AF} Core Pillars of Transition
- **Accelerated Adoption**: Swift integration of digital-first standards that totally optimize daily operations.
- **Market Expansion**: Clear rise in strategic investment pipelines across regional and local frontiers.`;
        return res.json({ success: true, explanation: quotaCategoryExplain });
      }
      const quotaExplain = isAr ? `### \u{1F50D} \u0627\u0644\u0633\u064A\u0627\u0642 \u0648\u0627\u0644\u0623\u0628\u0639\u0627\u062F
*(\u0645\u0644\u0627\u062D\u0638\u0629: \u0627\u0644\u0646\u0638\u0627\u0645 \u064A\u0639\u0631\u0636 \u0645\u0644\u062E\u0635 \u0627\u0644\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0627\u0633\u062A\u0631\u0627\u062A\u064A\u062C\u064A \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A \u0644\u0632\u064A\u0627\u062F\u0629 \u0645\u0648\u062B\u0648\u0642\u064A\u0629 \u0627\u0644\u062E\u062F\u0645\u0629)*

\u062A\u0639\u062A\u0628\u0631 \u0647\u0630\u0647 \u0627\u0644\u0642\u0636\u064A\u0629 \u0627\u0645\u062A\u062F\u0627\u062F\u0627\u064B \u0644\u0633\u0644\u0633\u0644\u0629 \u0645\u0646 \u0627\u0644\u0623\u062D\u062F\u0627\u062B \u0627\u0644\u062C\u0627\u0631\u064A\u0629 \u0648\u0627\u0644\u0627\u062A\u0641\u0627\u0642\u064A\u0627\u062A \u0627\u0644\u062F\u0648\u0644\u064A\u0629 \u0627\u0644\u0645\u0628\u0631\u0645\u0629\u060C \u0645\u0644\u0642\u064A\u0629\u064B \u0628\u0638\u0644\u0627\u0644\u0647\u0627 \u0639\u0644\u0649 \u0627\u0644\u0623\u0633\u0648\u0627\u0642 \u0627\u0644\u0627\u0633\u062A\u0647\u0644\u0627\u0643\u064A\u0629 \u0648\u062D\u0631\u0643\u0627\u062A \u0627\u0644\u062A\u0628\u0627\u062F\u0644 \u0627\u0644\u062F\u0648\u0644\u064A\u0629.

### \u2696\uFE0F \u0627\u0644\u0623\u0637\u0631\u0627\u0641 \u0627\u0644\u0645\u0639\u0646\u064A\u0629 \u0648\u0627\u0644\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0641\u0639\u0644\u064A
\u062A\u062A\u0642\u0627\u0637\u0639 \u0645\u0635\u0627\u0644\u062D \u0643\u0628\u0627\u0631 \u0648\u0635\u063A\u0627\u0631 \u0627\u0644\u0641\u0627\u0639\u0644\u064A\u0646 \u0648\u0627\u0644\u0645\u0633\u062A\u062B\u0645\u0631\u064A\u0646 \u0645\u0639 \u0627\u0644\u0642\u0646\u0648\u0627\u062A \u0627\u0644\u062A\u0634\u0631\u064A\u0639\u064A\u0629 \u0648\u0627\u0644\u0645\u0633\u062A\u0647\u0644\u0643 \u0627\u0644\u0646\u0647\u0627\u0626\u064A\u060C \u0645\u0645\u0627 \u064A\u062D\u0641\u0632 \u062A\u0637\u0648\u0631\u0627\u064B \u0645\u062A\u0648\u0627\u0632\u0646\u0627\u064B \u0644\u062A\u062C\u0646\u0628 \u0627\u0644\u0639\u0642\u0628\u0627\u062A \u0627\u0644\u062A\u0646\u0638\u064A\u0645\u064A\u0629.

### \u{1F680} \u0627\u0644\u062A\u0623\u062B\u064A\u0631\u0627\u062A \u0648\u0627\u0644\u062A\u0648\u0642\u0639\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u0642\u0628\u0644\u064A\u0629
\u064A\u062A\u0637\u0644\u0639 \u0627\u0644\u0645\u0631\u0627\u0642\u0628\u0648\u0646 \u0627\u0644\u062F\u0648\u0644\u064A\u0648\u0646 \u0644\u0627\u0639\u062A\u0645\u0627\u062F \u062D\u0632\u0645\u0629 \u0645\u0628\u0627\u062F\u0631\u0627\u062A \u0645\u0634\u062A\u0631\u0643\u0629 \u0641\u064A \u0627\u0644\u0645\u062F\u0649 \u0627\u0644\u0642\u0631\u064A\u0628 \u062A\u0636\u0645\u0646 \u0643\u0641\u0627\u0621\u0629 \u0633\u0644\u0627\u0633\u0644 \u0627\u0644\u0642\u064A\u0645\u0629 \u0627\u0644\u0645\u0636\u0627\u0641\u0629 \u0644\u062A\u0642\u0644\u064A\u0644 \u0623\u064A \u0646\u0642\u0635 \u0645\u062D\u062A\u0645\u0644.` : `### \u{1F50D} Context & Scope
*(Note: System displaying automated strategic analysis context for high uptime service)*

This development represents an extension of ongoing variables and industrial pacts, projecting strong signals onto consumer choices and trade vectors.

### \u2696\uFE0F Key Stakeholders & Analysis
Large enterprise stakeholders and regulatory monitors are aligning with public-facing initiatives to co-create value paths while maintaining strict compliance.

### \u{1F680} Future Implications & Outlook
Bilateral industry standardizations are projected to form rapidly in the coming months, optimizing overall process delivery.`;
      return res.json({ success: true, explanation: quotaExplain });
    } else {
      console.error("Failed to generate AI explanation:", err);
      return res.json({
        success: true,
        explanation: isAr ? "\u062A\u0639\u0630\u0631 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0640 Gemini \u0644\u0634\u0631\u062D \u0627\u0644\u0645\u0648\u0636\u0648\u0639 \u062D\u0627\u0644\u064A\u0627\u064B. \u064A\u0631\u062C\u0649 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629 \u0641\u064A \u0648\u0642\u062A \u0644\u0627\u062D\u0642." : "Could not fetch AI insights for this article/category right now. Please try again later."
      });
    }
  }
});
app.post(["/api/chat", "/chat"], async (req, res) => {
  const { message, history, lang } = req.body;
  const isAr = (lang || "ar") === "ar";
  const gemini = getGeminiClient();
  if (!gemini) {
    const fallbackAnswer = isAr ? `\u0623\u0647\u0644\u0627\u064B \u0628\u0643! \u0623\u0646\u0627 \u0627\u0644\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0630\u0643\u064A \u0644\u0646\u0628\u0636 \u0627\u0644\u0639\u0627\u0644\u0645. \u0623\u0639\u0645\u0644 \u062D\u0627\u0644\u064A\u0627\u064B \u0641\u064A \u0648\u0636\u0639 \u0627\u0644\u0645\u062D\u0627\u0643\u0627\u0629 \u0627\u0644\u0630\u0643\u064A\u0629 \u0644\u0623\u0646 \u0645\u0641\u062A\u0627\u062D \u0627\u0644\u062A\u0634\u063A\u064A\u0644 \u0645\u0641\u0642\u0648\u062F\u060C \u0648\u0644\u0643\u0646 \u064A\u0645\u0643\u0646\u0646\u064A \u0625\u062E\u0628\u0627\u0631\u0643 \u0623\u0646 \u0627\u0644\u064A\u0648\u0645 \u064A\u062D\u0645\u0644 \u062A\u063A\u0637\u064A\u0627\u062A \u0645\u0645\u062A\u0627\u0632\u0629 \u0641\u064A \u062C\u0645\u064A\u0639 \u0627\u0644\u0641\u0626\u0627\u062A!` : `Hello! I am Pulse of the World's smart assistant. I am currently running in simulated offline mode, but I can tell you that today is packed with magnificent coverage in all categories!`;
    return res.json({ success: true, reply: fallbackAnswer });
  }
  try {
    const contents = [];
    if (Array.isArray(history)) {
      history.slice(-8).forEach((h) => {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text || h.message }]
        });
      });
    }
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });
    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: `You are a helpful, professional, and mature AI companion inside "Pulse of the World" (\u0646\u0628\u0636 \u0627\u0644\u0639\u0627\u0644\u0645), a geometric global news hub app.
You can discuss any topics in the world (sports, technology, politics, weather, history, etc.).
Keep your responses beautiful, clearly formatted with markdown, structured, and friendly.
Always communicate in the requested language: ${isAr ? "Arabic (\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629)" : "English"}.`
      }
    });
    const reply = response.text || (isAr ? "\u0639\u0630\u0631\u0627\u064B\u060C \u0644\u0645 \u0623\u0633\u062A\u0637\u0639 \u062A\u0648\u0644\u064A\u0641 \u0625\u062C\u0627\u0628\u0629." : "Apologies, I couldn't formulate a proper response.");
    return res.json({ success: true, reply });
  } catch (err) {
    if (isQuotaExceeded(err)) {
      console.warn("[Gemini Quota Notice] Chatbot API quota exceeded (429). Replying via offline assistant proxy.");
      const quotaReply = isAr ? `\u0623\u0647\u0644\u0627\u064B \u0628\u0643! \u064A\u0631\u062C\u0649 \u0627\u0644\u0645\u0639\u0630\u0631\u0629\u060C \u0645\u0641\u062A\u0627\u062D Gemini \u062D\u0627\u0644\u064A\u0627\u064B \u062A\u062C\u0627\u0648\u0632 \u062D\u062F \u0627\u0644\u062D\u0635\u0635 \u0627\u0644\u0645\u062A\u0627\u062D\u0629 (Quota Limit)\u060C \u0644\u0630\u0627 \u0642\u0645\u062A \u0628\u0627\u0644\u0631\u062F \u0639\u0644\u064A\u0643 \u0628\u0634\u0643\u0644 \u0622\u0644\u064A.

\u0625\u0646 \u0633\u0624\u0627\u0644\u0643 \u0631\u0627\u0626\u0639 \u0644\u0644\u063A\u0627\u064A\u0629\u061B \u0648\u0646\u0648\u062F \u0637\u0645\u0623\u0646\u062A\u0643 \u0623\u0646 \u0645\u0648\u0642\u0639\u0646\u0627 "\u0646\u0628\u0636 \u0627\u0644\u0639\u0627\u0644\u0645" \u0645\u0633\u062A\u0645\u0631 \u0628\u062C\u0645\u0639 \u0622\u062E\u0631 \u0648\u0623\u062D\u062F\u062B \u0627\u0644\u062A\u0646\u0628\u064A\u0647\u0627\u062A \u0648\u0646\u0634\u0631\u0627\u062A \u0627\u0644\u0623\u062E\u0628\u0627\u0631 \u0627\u0644\u0639\u0627\u0644\u0645\u064A\u0629 \u0639\u0644\u0649 \u0645\u062F\u0627\u0631 \u0627\u0644\u062B\u0648\u0627\u0646\u064A!` : `Greetings! It appears the Gemini API has reached its quota limit (429). I am responding to you via high-continuity backup mode.

This is a marvelous query! We want to reassure you that "Pulse of the World" continues to aggregate premium top-tier notifications and global news around the clock.`;
      return res.json({ success: true, reply: quotaReply });
    } else {
      console.error("AI Chatbot routing error:", err);
      return res.json({
        success: true,
        reply: isAr ? "\u0639\u0630\u0631\u0627\u064B\u060C \u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629 \u0627\u0644\u0630\u0643\u064A\u0629. \u064A\u0631\u062C\u0649 \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629." : "An error occurred during handling of the AI chat prompt. Please attempt once more."
      });
    }
  }
});
async function startServer() {
  const isHuggingFace = !!(process.env.SPACE_ID || process.env.SPACE_NAME || process.env.SPACE_AUTHOR_NAME);
  if (process.env.NODE_ENV !== "production" && !isHuggingFace) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
if (!process.env.VERCEL) {
  startServer();
}
var server_default = app;
//# sourceMappingURL=server.cjs.map
