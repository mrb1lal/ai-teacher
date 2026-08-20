'use client';

import { useI18n } from './I18nProvider';

const sections = [
  { key: 'data', icon: '📊' },
  { key: 'usage', icon: '⚙️' },
  { key: 'storage', icon: '🔒' },
  { key: 'rights', icon: '⚖️' },
];

export default function Privacy() {
  const { t } = useI18n();

  return (
    <section className="section bg-white dark:bg-slate-900 min-h-screen pt-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
              {t('privacy.title')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">{t('privacy.lastUpdated')}</p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('privacy.intro')}
            </p>
          </div>

          <div className="space-y-8">
            {sections.map((section) => (
              <article key={section.key} className="card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-2xl flex-shrink-0">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                      {t(`privacy.${section.key}.title`)}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {t(`privacy.${section.key}.items`)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 p-6 bg-sky-50 dark:bg-sky-900/20 rounded-xl text-center">
            <p className="text-slate-700 dark:text-sky-300 mb-4">{t('privacy.contact')}</p>
            <a href="https://t.me/ai_teacher_bot" target="_blank" rel="noopener noreferrer" className="btn btn-primary inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.302 3.438 9.8 8.207 11.387.599.101.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.628-5.373-12-12-12z"/></svg>
              @ai_teacher_bot
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}