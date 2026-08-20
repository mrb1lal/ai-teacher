'use client';

import { motion } from 'framer-motion';
import { useI18n } from './I18nProvider';
import { ScrollReveal, StaggerContainer, StaggerItem } from './ScrollAnimations';
import { Brain, Database, MessageSquare, Server, Terminal, Target, Shield, Lock, Globe, CheckCheck } from 'lucide-react';

const techStack = [
  { key: 'gemini', icon: Brain, title: 'Google Gemini', desc: 'Advanced AI for natural language understanding', color: 'from-sky-500 to-blue-500', bg: 'bg-sky-500/10' },
  { key: 'supabase', icon: Database, title: 'Supabase', desc: 'PostgreSQL database with real-time sync', color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/10' },
  { key: 'telegram', icon: MessageSquare, title: 'Telegram Bot API', desc: 'Seamless messaging platform integration', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10' },
  { key: 'vercel', icon: Server, title: 'Vercel', desc: 'Edge network for global performance', color: 'from-slate-500 to-gray-500', bg: 'bg-slate-500/10' },
  { key: 'node', icon: Terminal, title: 'Node.js', desc: 'High-performance JavaScript runtime', color: 'from-green-600 to-emerald-600', bg: 'bg-green-600/10' },
  { key: 'framer', icon: Target, title: 'Framer Motion', desc: 'Smooth animations and interactions', color: 'from-pink-500 to-rose-500', bg: 'bg-pink-500/10' },
];

const features = [
  { icon: Brain, title: 'Personalized Learning', items: ['CEFR level detection (A1-C2)', 'Estimated IELTS band score', 'Weak/strong topic identification', 'Study pattern analysis', 'Personalized recommendations'], color: 'from-sky-500 to-blue-500' },
  { icon: Shield, title: 'Privacy & Security', items: ['Data encrypted in transit & at rest', 'No data sold to third parties', 'Full data export on request', 'Delete account anytime (/clear)', 'GDPR compliant'], color: 'from-green-500 to-emerald-500' },
];

export default function About() {
  const { t } = useI18n();

  return (
    <section id="about" className="relative section py-24 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%230ea5e9\" fill-opacity=\"0.03\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" />
      
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <ScrollReveal direction="up" delay={0.1} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
            </span>
            About
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-slate-900 via-sky-600 to-purple-600 dark:from-slate-100 dark:via-sky-400 dark:to-purple-400 bg-clip-text text-transparent">
            {t('about.title')}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {t('about.description')}
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2} className="max-w-3xl mx-auto mb-16 text-center">
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('about.mission')}
          </p>
        </ScrollReveal>

        {/* Tech Stack */}
        <ScrollReveal direction="up" delay={0.3} className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-slate-900 dark:text-white">
            {t('about.tech')}
          </h3>
          <StaggerContainer staggerDelay={0.1} className="grid grid-2 md:grid-3 lg:grid-6 max-w-5xl mx-auto gap-4">
            {techStack.map((tech) => (
              <StaggerItem key={tech.key} delay={0.1}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`group relative p-6 rounded-2xl ${tech.bg} ${tech.color.replace('from-', 'border-').replace('to-', 'border-').replace('-500', '-500/20')} border backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tech.color} flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <tech.icon className="w-7 h-7" />
                  </motion.div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-center group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {t(`about.tech.${tech.key}`)}
                  </h4>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </ScrollReveal>

        {/* Features */}
        <ScrollReveal direction="up" delay={0.4} className="max-w-4xl mx-auto">
          <StaggerContainer staggerDelay={0.15} className="grid md:grid-2 gap-8">
            {features.map((feature, index) => (
              <StaggerItem key={feature.title} delay={index * 0.15}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`group relative p-8 rounded-3xl bg-gradient-to-br ${feature.color} text-white shadow-xl shadow-sky-500/20 overflow-hidden`}
                >
                  {/* Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                      className={`w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm`}
                    >
                      <feature.icon className="w-8 h-8" />
                    </motion.div>

                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    
                    <ul className="space-y-3">
                      {feature.items.map((item, i) => (
                        <motion.li
                          key={item}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.1 }}
                          className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-300"
                        >
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 180 }}
                            className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0"
                          >
                            <CheckCheck className="w-4 h-4 text-white" />
                          </motion.div>
                          <span className="text-white/90">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </ScrollReveal>
      </div>
    </section>
  );
}