'use client';

import Link from 'next/link';
import { useI18n } from './I18nProvider';

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
            <div className="flex gap-4">
              <a href="https://t.me/ai_teacher_bot" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.302 3.438 9.8 8.207 11.387.599.101.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.628-5.373-12-12-12z"/></svg>
              </a>
              <a href="https://github.com/mrb1lal/ai-teacher" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.628-5.373-12-12-12z"/></svg>
              </a>
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
              <li><a href="https://t.me/ai_teacher_bot" target="_blank" rel="noopener noreferrer" className="footer-link">Telegram Bot</a></li>
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