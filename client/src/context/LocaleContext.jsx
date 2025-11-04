import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { enUS, pl } from 'date-fns/locale';
import { translations } from '../i18n/translations.js';

const LocaleContext = createContext(null);
const STORAGE_KEY = 'myrescal:language';
const FALLBACK_LANG = 'en';
const DATE_FNS_LOCALES = {
  en: enUS,
  pl,
};

function resolveTranslation(lang, key) {
  const segments = key.split('.');
  let value = translations[lang];
  for (const segment of segments) {
    if (value && Object.prototype.hasOwnProperty.call(value, segment)) {
      value = value[segment];
    } else {
      value = undefined;
      break;
    }
  }
  return value;
}

export function LocaleProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') return FALLBACK_LANG;
    return window.localStorage.getItem(STORAGE_KEY) || FALLBACK_LANG;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const translate = useCallback(
    (key, options) => {
      const value =
        resolveTranslation(language, key) ??
        resolveTranslation(FALLBACK_LANG, key) ??
        key;

      if (typeof value !== 'string') {
        return value ?? key;
      }

      if (options) {
        return Object.entries(options).reduce(
          (result, [optionKey, optionValue]) =>
            result.replace(new RegExp(`{{\\s*${optionKey}\\s*}}`, 'g'), optionValue),
          value,
        );
      }

      return value;
    },
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translate,
      availableLanguages: Object.keys(translations),
      dateLocale: DATE_FNS_LOCALES[language] ?? DATE_FNS_LOCALES[FALLBACK_LANG],
    }),
    [language, translate],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
