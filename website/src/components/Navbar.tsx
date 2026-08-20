'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from './I18nProvider';
import { Menu, X, Bot, Linkedin, X, Code, Github, ChevronDown } from 'lucide-react';

const socialLinks = [
  { href: 'https://t.me/myaitecherbot', icon: Bot, label: 'Bot', ariaLabel: 'Telegram Bot' },
  { href: 'https://www.linkedin.com/in/bilal-ahmadjanov-391784414', icon: Linkedin, label: 'LinkedIn', ariaLabel: 'LinkedIn' },
  { href: 'https://x.com/Feluvan1', icon: X, label: 'X', ariaLabel: 'X (Twitter)' },
  { href: 'https://www.codewars.com/users/mrb1lal', icon: Code, label: 'Codewars', ariaLabel: 'Codewars' },
];

export default function Navbar() {
  const { language, setLanguage, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl lg:text-2xl text-sky-500"
            whileHover={{ scale: 1.05 }}
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 3 }}
              className="text-2xl lg:text-3xl"
            >
              🎓
            </motion.span>
            <span className="bg-gradient-to-r from-sky-500 to-purple-500 bg-clip-text text-transparent">
              AI English Teacher
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            <Link href="#features" className="nav-link relative py-2">{t('nav.features')}</Link>
            <Link href="#about" className="nav-link relative py-2">{t('nav.about')}</Link>
            <Link href="#contact" className="nav-link relative py-2">{t('nav.contact')}</Link>
            <Link href="/privacy" className="nav-link relative py-2">{t('nav.privacy')}</Link>
          </div>

          {/* Desktop Social + Language + CTA */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-all duration-300 p-2 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-900/20"
                  aria-label={social.ariaLabel}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguage(!showLanguage)}
                className="flex items-center gap-2 form-input py-2 px-3 text-sm bg-transparent appearance-none cursor-pointer"
              >
                <span className="text-lg">
                  {language === 'en' ? '🇺🇸' : language === 'uz' ? '🇺🇿' : '🇷🇺'}
                </span>
                <span className="font-medium capitalize">{language}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showLanguage ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showLanguage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50"
                  >
                    {['en', 'uz', 'ru'].map((lang) => (
                      <motion.button
                        key={lang}
                        onClick={() => { setLanguage(lang as 'en' | 'uz' | 'ru'); setShowLanguage(false); }}
                        whileHover={{ backgroundColor: 'rgba(14, 165, 233, 0.1)' }}
                        className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-sky-50 dark:hover:bg-sky-900/20"
                      >
                        <span className="text-lg">
                          {lang === 'en' ? '🇺🇸' : lang === 'uz' ? '🇺🇿' : '🇷🇺'}
                        </span>
                        <span className="capitalize">{lang}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Button */}
            <motion.a
              href="https://t.me/myaitecherbot"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2, boxShadow: '0 10px 25px rgba(14, 165, 233, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary px-6 py-3 flex items-center gap-2 shadow-lg shadow-sky-500/25"
            >
              <Bot className="w-5 h-5" />
              <span className="font-semibold">{t('hero.bot')}</span>
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:hidden overflow-hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {/* Mobile Nav Links */}
              <div className="space-y-2">
                <Link href="#features" className="block py-3 px-4 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-medium" onClick={() => setIsOpen(false)}>{t('nav.features')}</Link>
                <Link href="#about" className="block py-3 px-4 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-medium" onClick={() => setIsOpen(false)}>{t('nav.about')}</Link>
                <Link href="#contact" className="block py-3 px-4 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-medium" onClick={() => setIsOpen(false)}>{t('nav.contact')}</Link>
                <Link href="/privacy" className="block py-3 px-4 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-medium" onClick={() => setIsOpen(false)}>{t('nav.privacy')}</Link>
              </div>

              {/* Mobile Social */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                    aria-label={social.ariaLabel}
                  >
                    <social.icon className="w-6 h-6" />
                  </motion.a>
                ))}
              </div>

              {/* Mobile Language */}
              <div className="pt-4">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'uz' | 'ru')}
                  className="w-full form-input py-2 px-3 text-sm"
                >
                  <option value="en">🇺🇸 English</option>
                  <option value="uz">🇺🇿 O'zbek</option>
                  <option value="ru">🇷🇺 Русский</option>
                </select>
              </div>

              {/* Mobile CTA */}
              <motion.a
                href="https://t.me/myaitecherbot"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-primary w-full py-4 text-center flex items-center justify-center gap-2 mt-4 shadow-lg shadow-sky-500/25"
              >
                <Bot className="w-5 h-5" />
                <span className="font-semibold">{t('hero.bot')}</span>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </motion.nav>
  );
}