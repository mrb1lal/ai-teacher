'use client';

import { useI18n } from './I18nProvider';

const features = [
  { key: 'chat', icon: '💬', color: 'bg-sky-500' },
  { key: 'audio', icon: '🔊', color: 'bg-purple-500' },
  { key: 'images', icon: '🖼️', color: 'bg-emerald-500' },
  { key: 'pdf', icon: '📄', color: 'bg-amber-500' },
  { key: 'profile', icon: '📊', color: 'bg-rose-500' },
  { key: 'memory', icon: '🧠', color: 'bg-indigo-500' },
];

export default function Features() {
  const { t } = useI18n();

  return (
    <section id="features" className="section bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <h2 className="section-title">{t('features.title')}</h2>
        <p className="section-subtitle">{t('features.subtitle')}</p>

        <div className="grid grid-3 max-w-6xl mx-auto">
          {features.map((feature) => (
            <article key={feature.key} className="card group">
              <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                {t(`feature.${feature.key}.title`)}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {t(`feature.${feature.key}.desc`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}