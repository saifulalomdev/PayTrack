import { persistentAtom } from '@nanostores/persistent';
import { computed } from 'nanostores';
import { en } from '@/i18n/en';
import { bn } from '@/i18n/bn';

export type Language = 'EN' | 'BN';

const translations = { EN: en, BN: bn };

// Store current language in localStorage
export const $language = persistentAtom<Language>('app_language', 'EN');

// Computed store that automatically returns current dictionary
export const $t = computed($language, (lang) => translations[lang] || en);

export function toggleLanguage() {
  $language.set($language.get() === 'EN' ? 'BN' : 'EN');
}