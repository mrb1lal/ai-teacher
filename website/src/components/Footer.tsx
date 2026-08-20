'use client';

import Link from 'next/link';
import { useI18n } from './I18nProvider';

const socialLinks = [
  { href: 'https://t.me/myaitecherbot', icon: '🤖', label: 'Telegram Bot', ariaLabel: 'Telegram Bot' },
  { href: 'https://www.linkedin.com/in/bilal-ahmadjanov-391784414', icon: '💼', label: 'LinkedIn', ariaLabel: 'LinkedIn' },
  { href: 'https://x.com/Feluvan1', icon: '🐦', label: 'X (Twitter)', ariaLabel: 'X (Twitter)' },
  { href: 'https://www.codewars.com/users/mrb1lal', icon: '⚔️', label: 'Codewars', ariaLabel: 'Codewars' },
  { href: 'https://github.com/mrb1lal/ai-teacher', icon: '🐙', label: 'GitHub', ariaLabel: 'GitHub' },
];

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-4 gap-8 mb-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-sky-400 mb-4">
              <span className="text-2xl">🎓</span>
              <span>AI English Teacher</span>
            </Link>
            <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">
              {t('footer.made')}
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-sky-900/30 text-sm"
                  aria-label={social.ariaLabel}
                >
                  <span>{social.icon}</span>
                  <span>{social.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="#features" className="footer-link">{t('nav.features')}</Link></li>
              <li><Link href="#about" className="footer-link">{t('nav.about')}</Link></li>
              <li><Link href="/privacy" className="footer-link">{t('nav.privacy')}</Link></li>
              <li><Link href="#contact" className="footer-link">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="https://t.me/myaitecherbot" target="_blank" rel="noopener noreferrer" className="footer-link">Telegram Bot</a></li>
              <li><a href="https://github.com/mrb1lal/ai-teacher" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a></li>
              <li><a href="#" className="footer-link">Documentation</a></li>
              <li><a href="#" className="footer-link">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-slate-500">
          <p>{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}