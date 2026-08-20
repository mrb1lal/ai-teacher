'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useI18n } from './I18nProvider';
import { ArrowRight, Bot, Sparkles, Zap, Shield, Globe } from 'lucide-react';

const features = [
  { icon: Sparkles, title: 'AI Chat', desc: 'Instant explanations with examples', color: 'from-sky-500 to-blue-500' },
  { icon: Bot, title: 'Pronunciation', desc: 'Audio with IPA transcription', color: 'from-purple-500 to-pink-500' },
  { icon: Zap, title: 'Image Analysis', desc: 'Up to 6 images at once', color: 'from-emerald-500 to-teal-500' },
  { icon: Shield, title: 'PDF Generation', desc: 'Lessons, vocab, reports', color: 'from-amber-500 to-orange-500' },
  { icon: Globe, title: 'Multi-language', desc: 'EN, UZ, RU support', color: 'from-indigo-500 to-purple-500' },
];

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1], x: [0, -15, 0], y: [0, 15, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear', delay: 5 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-sky-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-100, 100],
              x: [0, Math.random() * 200 - 100],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500/20 to-purple-500/20 text-sky-700 dark:text-sky-300 px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-sky-500/30"
          >
            <motion.span
              className="relative flex h-2 w-2"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
            </motion.span>
            <span>Powered by Google Gemini AI</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-slate-900 via-sky-600 to-purple-600 dark:from-slate-100 dark:via-sky-400 dark:to-purple-400 bg-clip-text text-transparent">
              {t('hero.title')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl lg:text-3xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href="https://t.me/myaitecherbot"
              target="_blank"
              rel="noopener noreferrer"
              className="group btn btn-primary text-lg px-10 py-4 flex items-center gap-3 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all duration-300"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Bot className="w-6 h-6" />
              <span>{t('hero.cta')}</span>
              <motion.span
                className="group-hover:translate-x-1 transition-x duration-300"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </Link>
            <Link
              href="#features"
              className="btn btn-secondary text-lg px-10 py-4 flex items-center gap-3 transition-all duration-300 hover:bg-sky-50 dark:hover:bg-sky-900/20"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-6 h-6" />
              <span>{t('nav.features')}</span>
            </Link>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-2 md:grid-3 lg:grid-5 gap-4 mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:border-sky-500/30 hover:shadow-lg hover:shadow-sky-500/10"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{feature.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500 dark:text-slate-400"
          >
            <div className="flex items-center gap-2">
              <span className="badge badge-success">✅ 100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-primary">🤖 Gemini AI</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-warning">📱 Telegram</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-primary">📄 PDF Export</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-success">🔒 Private</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-sky-500/50 rounded-full flex justify-center pt-2"
        >
          <motion.div
            className="w-1.5 h-1.5 bg-sky-500 rounded-full"
            animate={{ y: [0, 20, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}