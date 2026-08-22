// src/utils/i18n.ts
import { dashboardEN } from '@/modules/dashboard/i18n/en';
import { dashboardBN } from '@/modules/dashboard/i18n/bn';

export type Language = 'en' | 'bn';

const translations = {
  en: {
    dashboard: dashboardEN,
  },
  bn: {
    dashboard: dashboardBN,
  },
};

export function getTranslations(lang: Language) {
  return translations[lang] || translations.en;
}

export function t(translations: any, key: string): string {
  const value = key.split('.').reduce((obj, k) => obj?.[k], translations);
  
  // Always return string, never object
  if (typeof value === 'string') {
    return value;
  }
  
  return key; // Fallback to key if not found
}