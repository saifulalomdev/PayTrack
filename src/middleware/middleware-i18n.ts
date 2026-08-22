// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { getTranslations, t } from '@/utils/i18n';
import type { Language } from '@/utils/i18n';

export const i18nMiddleware = defineMiddleware((context, next) => {
  const cookieHeader = context.request.headers.get('cookie');
  const lang = (cookieHeader?.split('lang=')[1]?.split(';')[0] || 'en') as Language;

  const translations = getTranslations(lang);

  context.locals.lang = lang;
  context.locals.t = (key: string) => t(translations, key); // Pass translations here
  
  if (!cookieHeader?.includes('lang=')) {
    context.cookies.set('lang', lang, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    });
  }

  return next();
})