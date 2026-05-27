export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  imageUrl?: string;
}

export interface NewsCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
}

export interface UserPreferences {
  favoriteCategories: string[];
  notificationsEnabled: boolean;
  selectedLanguage: 'ar' | 'en';
  theme: 'light' | 'dark';
  enableLocationNews: boolean;
  customGeminiApiKey?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  articleId?: string;
  read: boolean;
  type: 'breaking' | 'local' | 'personalized';
}

export interface LocationState {
  lat: number | null;
  lng: number | null;
  country: string;
  city: string;
  loading: boolean;
  error: string | null;
}
