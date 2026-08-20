'use client';

import Link from 'next/link';
import { useI18n } from './I18nProvider';

const socialLinks = [
  { href: 'https://t.me/myaitecherbot', icon: '🤖', label: 'Bot', ariaLabel: 'Telegram Bot' },
  { href: 'https://www.linkedin.com/in/bilal-ahmadjanov-391784414', icon: '💼', label: 'LinkedIn', ariaLabel: 'LinkedIn' },
  { href: 'https://x.com/Feluvan1', icon: '🐦', label: 'X', ariaLabel: 'X (Twitter)' },
  { href: 'https://www.codewars.com/users/mrb1lal', icon: '⚔️', label: 'Codewars', ariaLabel: 'Codewars' },
];

export default function Navbar() {
  const { language, setLanguage, t } = useI18n();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-sky-500">
            <span className="text-2xl">🎓</span>
            <span>AI English Teacher</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="nav-link">{t('nav.features')}</Link>
            <Link href="#about" className="nav-link">{t('nav.about')}</Link>
            <Link href="#contact" className="nav-link">{t('nav.contact')}</Link>
            <Link href="/privacy" className="nav-link">{t('nav.privacy')}</Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 dark:text-slate-400 hover:text-sky-500 transition-colors text-sm font-medium flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-900/20"
                  aria-label={social.ariaLabel}
                >
                  <span>{social.icon}</span>
                  <span>{social.label}</span>
                </a>
              ))}
            </div>

            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'uz' | 'ru')}
                className="form-input py-2 px-3 text-sm bg-transparent appearance-none cursor-pointer"
              >
                <option value="en">🇺🇸 English</option>
                <option value="uz">🇺🇿 O'zbek</option>
                <option value="ru">🇷🇺 Русский</option>
              </select>
            </div>

            <a
              href="https://t.me/myaitecherbot"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary hidden sm:inline-flex"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.302 3.438 9.8 8.207 11.387.599.101.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.628-5.373-12-12-12z"/></svg>
              {t('hero.bot')}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}