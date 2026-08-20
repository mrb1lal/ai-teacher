'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Bot, Zap, Shield, Globe, BookOpen, Mic, Image, FileText, Languages } from 'lucide-react';
import { ScrollReveal } from './ScrollAnimations';

const features = [
  { icon: Sparkles, title: 'AI Chat', desc: 'Ask any English question - grammar, vocabulary, idioms, IELTS prep. Get instant explanations with examples.', color: 'from-sky-500 to-blue-500', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
  { icon: Bot, title: 'Pronunciation Audio', desc: 'Generate audio for any word/phrase. Get IPA transcription, stress markers, and native-like pronunciation.', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { icon: Image, title: 'Image Analysis', desc: 'Send up to 6 images at once - textbook pages, exercises, signs. Get explanations, translations, and solutions.', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { icon: FileText, title: 'PDF Generation', desc: 'Create study reports, lesson PDFs, and vocabulary lists. Download and study offline anytime.', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { icon: BookOpen, title: 'Smart Profiling', desc: 'Auto-detects your CEFR level, estimated IELTS band, weak/strong topics, and study patterns.', color: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  { icon: Mic, title: 'Full Memory', desc: 'Complete conversation history saved. Context-aware responses that remember your learning journey.', color: 'from-rose-500 to-pink-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { icon: Languages, title: 'Multi-language', desc: 'Supports English, Uzbek, and Russian. Auto-detects your language preference.', color: 'from-cyan-500 to-blue-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { icon: Shield, title: 'Privacy First', desc: 'Data encrypted in transit & at rest. No data sold. Full export/delete on request. GDPR compliant.', color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
];

const svgPattern = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230ea5e9' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

export default function FeatureCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const testimonialsPerView = typeof window !== 'undefined' 
    ? (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1) 
    : 3;

  const itemsPerView = typeof window !== 'undefined' 
    ? (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1) 
    : 3;

  const maxIndex = Math.max(0, features.length - itemsPerView);

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      diff > 0 ? handleNext() : handlePrev();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const newItemsPerView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
      setCurrentIndex(prev => Math.min(prev, Math.max(0, features.length - newItemsPerView)));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="relative py-24 overflow-hidden bg-white dark:bg-slate-900">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("${svgPattern}")` }} />
      
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
            </span>
            Features
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-slate-900 via-sky-600 to-purple-600 dark:from-slate-100 dark:via-sky-400 dark:to-purple-400 bg-clip-text text-transparent">
            Everything you need to master English
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mt-4 leading-relaxed">
            Powerful features designed to accelerate your English learning journey
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative group">
          {/* Navigation arrows */}
          <motion.button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-12 h-12 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-600 dark:hover:text-sky-400 transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:pointer-events-none"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <motion.button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-12 h-12 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-600 dark:hover:text-sky-400 transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:pointer-events-none"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>

          {/* Carousel track */}
          <div 
            className="relative"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <motion.div
              ref={carouselRef}
              className="flex gap-6 pb-8"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex-shrink-0 w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-2rem)] ${index === features.length - 1 ? 'mr-0' : ''}`}
                  style={{ flexShrink: 0, width: `calc(100% / ${itemsPerView} - ${itemsPerView > 1 ? '1.5rem' : '0'})` }}
                >
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={`group p-8 rounded-3xl ${feature.bg} ${feature.border} border backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-sky-500/10`}
                  >
                    {/* Glow effect */}
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-3xl -z-10`} />
                    
                    <div className="relative z-10">
                      {/* Icon */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-sky-500/25`}
                      >
                        <feature.icon className="w-8 h-8" />
                      </motion.div>

                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                        {feature.desc}
                      </p>

                      {/* Feature tags */}
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/70 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                          Free
                        </span>
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r text-white">
                          AI Powered
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center gap-2 mt-8"
          >
            {[...Array(maxIndex + 1)].map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setCurrentIndex(i)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.8 }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'bg-sky-500 w-8'
                    : 'bg-slate-300 dark:bg-slate-600 hover:bg-sky-400'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </motion.div>

          {/* Keyboard navigation hint */}
          <p className="text-center text-slate-400 dark:text-slate-500 text-sm mt-6 hidden md:block">
            Use ← → keys to navigate
          </p>
        </div>
      </div>
    </section>
  );
}