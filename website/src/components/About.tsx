'use client';

import { useI18n } from './I18nProvider';

const techStack = [
  { key: 'gemini', icon: '🤖', color: 'bg-sky-500' },
  { key: 'supabase', icon: '🗄️', color: 'bg-green-500' },
  { key: 'telegram', icon: '📱', color: 'bg-blue-500' },
  { key: 'vercel', icon: '▲', color: 'bg-slate-500' },
  { key: 'node', icon: '⚙️', color: 'bg-green-600' },
];

export default function About() {
  const { t } = useI18n();

  return (
    <section id="about" className="section bg-slate-50 dark:bg-slate-800/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">{t('about.title')}</h2>
            <p className="section-subtitle">{t('about.description')}</p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none mb-16">
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {t('about.mission')}
            </p>
          </div>

          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-slate-900 dark:text-white">
              {t('about.tech')}
            </h3>
            <div className="grid grid-3 max-w-3xl mx-auto gap-6">
              {techStack.map((tech) => (
                <div key={tech.key} className="card text-center group">
                  <div className={`w-16 h-16 rounded-xl ${tech.color} flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    {tech.icon}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 font-medium">
                    {t(`about.tech.${tech.key}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-2 gap-8 max-w-4xl mx-auto">
            <div className="card">
              <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Personalized Learning
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">✅ CEFR level detection (A1-C2)</li>
                <li className="flex items-center gap-2">✅ Estimated IELTS band score</li>
                <li className="flex items-center gap-2">✅ Weak/strong topic identification</li>
                <li className="flex items-center gap-2">✅ Study pattern analysis</li>
                <li className="flex items-center gap-2">✅ Personalized recommendations</li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                Privacy & Security
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">✅ Data encrypted in transit & at rest</li>
                <li className="flex items-center gap-2">✅ No data sold to third parties</li>
                <li className="flex items-center gap-2">✅ Full data export on request</li>
                <li className="flex items-center gap-2">✅ Delete account anytime (/clear)</li>
                <li className="flex items-center gap-2">✅ GDPR compliant</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}