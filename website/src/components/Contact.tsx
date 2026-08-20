'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from './I18nProvider';
import { ScrollReveal, StaggerContainer, StaggerItem } from './ScrollAnimations';
import { Mail, MessageSquare, Send, Bot, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function Contact() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="relative section py-24 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%230ea5e9\" fill-opacity=\"0.03\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" />
      
      {/* Floating orbs */}
      <motion.div className="absolute top-20 right-10 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 20, repeat: Infinity }} />
      <motion.div className="absolute bottom-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 25, repeat: Infinity, delay: 5 }} />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
            </span>
            Contact
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-slate-900 via-sky-600 to-purple-600 dark:from-slate-100 dark:via-sky-400 dark:to-purple-400 bg-clip-text text-transparent">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative p-8 rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-2xl">
              {/* Glow border */}
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-purple-500 rounded-[1.5rem] opacity-20 blur-xl -z-10" />
              
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <StaggerContainer staggerDelay={0.1}>
                  <StaggerItem>
                    <label htmlFor="name" className="form-label flex items-center gap-2">
                      <Mail className="w-5 h-5 text-sky-500" />
                      {t('contact.name')}
                    </label>
                    <motion.div whileFocusWithin={{ scale: 1.01 }}>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="form-input"
                        required
                        placeholder="Your name"
                        aria-label="Your name"
                      />
                    </motion.div>
                  </StaggerItem>

                  <StaggerItem>
                    <label htmlFor="email" className="form-label flex items-center gap-2">
                      <Mail className="w-5 h-5 text-sky-500" />
                      {t('contact.email')}
                    </label>
                    <motion.div whileFocusWithin={{ scale: 1.01 }}>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="form-input"
                        required
                        placeholder="your@email.com"
                        aria-label="Your email"
                      />
                    </motion.div>
                  </StaggerItem>

                  <StaggerItem>
                    <label htmlFor="message" className="form-label flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-sky-500" />
                      {t('contact.message')}
                    </label>
                    <motion.div whileFocusWithin={{ scale: 1.01 }}>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="form-input min-h-[180px] resize-y"
                        required
                        placeholder="Your message..."
                        aria-label="Your message"
                      />
                    </motion.div>
                  </StaggerItem>

                  <StaggerItem>
                    <motion.button
                      type="submit"
                      disabled={status === 'loading'}
                      whileHover={{ scale: 1.02, y: -2, boxShadow: '0 10px 25px rgba(14, 165, 233, 0.4)' }}
                      whileTap={{ scale: 0.98 }}
                      className="btn btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg font-semibold shadow-lg shadow-sky-500/25"
                      disabled={status === 'loading'}
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          <span>{t('common.loading')}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>{t('contact.send')}</span>
                        </>
                      )}
                    </motion.button>
                  </StaggerItem>

                  {status === 'success' && (
                    <StaggerItem>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center gap-3"
                      >
                        <CheckCircle className="w-6 h-6 flex-shrink-0" />
                        <span>{t('contact.success')}</span>
                      </motion.div>
                    </StaggerItem>
                  )}

                  {status === 'error' && (
                    <StaggerItem>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 flex items-center gap-3"
                      >
                        <AlertCircle className="w-6 h-6 flex-shrink-0" />
                        <span>{t('contact.error')}</span>
                      </motion.div>
                    </StaggerItem>
                  )}
                </StaggerContainer>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-8 rounded-3xl bg-gradient-to-br from-sky-500 to-purple-500 text-white shadow-2xl shadow-sky-500/25"
            >
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Bot className="w-7 h-7" />
                <span>{t('contact.telegram')}</span>
              </h3>
              <p className="text-white/90 mb-6 leading-relaxed">
                The fastest way to reach us. Start learning English right now with our AI bot!
              </p>
              <motion.a
                href="https://t.me/myaitecherbot"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-semibold backdrop-blur-sm border border-white/30 transition-all duration-300"
              >
                <Bot className="w-5 h-5" />
                <span>Open in Telegram</span>
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  →
                </motion.span>
              </motion.a>
            </motion.div>

            {/* Other contact methods */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-2 gap-4 mt-8"
            >
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/10"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-4">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Telegram Support</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">@myaitecherbot</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                  <Mail className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Email Us</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">support@aiteacher.com</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}