
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { Language } from '@/types';

// Import language resources
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';

// Define available languages
export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

// Initialize i18next
i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  .init({
    // Resources contain translations
    resources: {
      en: {
        translation: enTranslation,
      },
      es: {
        translation: esTranslation,
      },
    },
    // Default language
    fallbackLng: 'en',
    // Debug mode in development
    debug: process.env.NODE_ENV === 'development',
    // Common namespace used around the app
    defaultNS: 'translation',
    // Avoid suspense on the server side
    react: {
      useSuspense: true,
    },
    interpolation: {
      // Not needed for React as it escapes by default
      escapeValue: false,
    },
  });

export default i18n;
