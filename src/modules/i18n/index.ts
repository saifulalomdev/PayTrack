// src/modules/i18n/index.ts

export const locales = ["en", "bn"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string | undefined): value is Locale {
  return !!value && locales.includes(value as Locale);
}