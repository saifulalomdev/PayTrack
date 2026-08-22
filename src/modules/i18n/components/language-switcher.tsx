// src/components/language-switcher.tsx
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { Language } from '@/utils/i18n';

interface LanguageSwitcherProps {
  currentLang: Language;
}

export function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const [loading, setLoading] = useState(false);

  const toggleLanguage = () => {
    setLoading(true);
    const newLang = currentLang === 'en' ? 'bn' : 'en';
    document.cookie = `lang=${newLang}; path=/; max-age=${60 * 60 * 24 * 365}`;
    window.location.reload();
  };

  return (
    <Button
      onClick={toggleLanguage}
      aria-label="Switch Language"
      variant="outline"
      disabled={loading}
    >
      <Globe className="h-4 w-4 text-muted-foreground" />
      <span>{currentLang === 'en' ? 'English' : 'বাংলা'}</span>
    </Button>
  );
}