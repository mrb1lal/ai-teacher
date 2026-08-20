'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote, User, Globe, Award, TrendingUp } from 'lucide-react';
import { ScrollReveal } from './ScrollAnimations';

const testimonials = [
  {
    id: 1,
    name: 'Maria Gonzalez',
    role: 'ESL Student',
    country: '🇲🇽 Mexico',
    level: 'B2 → C1',
    text: 'This bot completely changed how I learn English. The AI explanations are so clear, and the pronunciation audio helps me sound more natural. I improved my IELTS score from 6.5 to 7.5 in just 3 months!',
    rating: 5,
    avatar: 'MG',
  },
  {
    id: 2,
    name: 'Ahmed Hassan',
    role: 'Software Engineer',
    country: '🇪🇬 Egypt',
    level: 'B1 → B2',
    text: 'The image analysis feature is incredible. I send photos of textbook exercises and get instant explanations. The PDF lessons help me study offline during my commute. Highly recommended!',
    rating: 5,
    avatar: 'AH',
  },
  {
    id: 3,
    name: 'Priya Sharma',
    role: 'University Student',
    country: '🇮🇳 India',
    level: 'A2 → B1',
    text: 'Finally, an AI tutor that actually understands my level. It tracks my weak topics and gives personalized recommendations. The vocabulary PDFs are perfect for revision before exams.',
    rating: 5,
    avatar: 'PS',
  },
  {
    id: 4,
    name: 'Thomas Mueller',
    role: 'Business Analyst',
    country: '🇩🇪 Germany',
    level: 'C1 → C2',
    text: 'Even at advanced level, this bot challenges me. The image analysis for business documents is a game-changer. The personalized study reports keep me motivated and on track.',
    rating: 5,
    avatar: 'TM',
  },
  {
    id: 5,
    name: 'Yuki Tanaka',
    role: 'Marketing Specialist',
    country: '🇯🇵 Japan',
    level: 'B1 → B2',
    text: 'The multi-language support is perfect - I can switch between English and Japanese explanations. The pronunciation audio with IPA transcription helped me fix my accent issues.',
    rating: 5,
    avatar: 'YT',
  },
  {
    id: 6,
    name: 'Carlos Rodriguez',
    role: 'English Teacher',
    country: '🇨🇴 Colombia',
    level: 'C2',
    text: 'As an English teacher, I recommend this to all my students. The AI explanations are pedagogically sound. The PDF reports help me track student progress efficiently.',
    rating: 5,
    avatar: 'CR',
  },
];

const stats = [
  { label: 'Active Learners', value: '10,000+', icon: Globe, color: 'from-sky-500 to-blue-500' },
  { label: 'Lessons Generated', value: '50,000+', icon: Award, color: 'from-purple-500 to-pink-500' },
  { label: 'Images Analyzed', value: '25,000+', icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
  { label: 'Countries', value: '50+', icon: Globe, color: 'from-amber-500 to-orange-500' },
];

const svgPattern = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230ea5e9' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2V6h4V4h-4zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

export default function Testimonials() {
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const testimonialsPerView = typeof window !== 'undefined' 
    ? (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1) 
    : 3;

  const maxIndex = Math.max(0, testimonials.length - testimonialsPerView);

  const handleNext = () => setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  const handlePrev = () => setCurrentIndex(prev => Math.max(prev - 1, 0));
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? handleNext() : handlePrev();
  };

  return (
    <section className="relative py-24 overflow-hidden bg-white dark:bg-slate-900">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("${svgPattern}")` }} />
      
      <div className="container mx-auto px-4 relative">
        {/* Stats */}
        <ScrollReveal direction="up" delay={0.1} className="mb-16">
          <div className="grid grid-2 md:grid-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <ScrollReveal key={stat.label} direction="up" delay={0.2 + index * 0.1} className="text-center">
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 ${stat.color} bg-opacity-10`}
                >
                  <div className={`w-14 h-14 rounded-xl mx-auto mb-4 bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                    <stat.icon className="w-7 h-7" />
                  </motion.div>
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        {/* Testimonials Header */}
        <ScrollReveal direction="up" delay={0.2} className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
            </span>
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-slate-900 via-sky-600 to-purple-600 dark:from-slate-100 dark:via-sky-400 dark:to-purple-400 bg-clip-text text-transparent">
            Loved by learners worldwide
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Join thousands of learners who improved their English with AI Teacher
          </p>
        </ScrollReveal>

        {/* Carousel */}
        <div className="relative group">
          {/* Navigation */}
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

          <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} className="relative">
            <motion.div
              className="flex gap-6 pb-8"
              style={{
                transform: `translateX(-${currentIndex * (100 / testimonialsPerView)}%)`,
                transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex-shrink-0 w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-2rem)]`}
                  style={{ flexShrink: 0, width: `calc(100% / ${testimonialsPerView} - ${testimonialsPerView > 1 ? '1.5rem' : '0'})` }}
                >
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="group p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-500 h-full"
                  >
                    {/* Quote icon */}
                    <div className="absolute top-6 right-6 w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center opacity-50">
                      <Quote className="w-8 h-8 text-sky-500" />
                    </div>

                    <div className="relative z-10">
                      {/* Stars */}
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <motion.span
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 200 }}
                          >
                            <Star className="w-5 h-5 text-amber-400 fill-current" />
                          </motion.span>
                        ))}
                      </div>

                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 text-lg">
                        "{testimonial.text}"
                      </p>

                      <div className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg"
                        >
                          {testimonial.avatar}
                        </motion.div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</div>
                          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <span>{testimonial.country}</span>
                            <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full" />
                            <span className="px-2 py-0.5 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full text-xs font-medium">
                              {testimonial.level}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

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
                    i === currentIndex ? 'bg-sky-500 w-8' : 'bg-slate-300 dark:bg-slate-600 hover:bg-sky-400'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </motion.div>
          </div>
        </section>
      </div>
    </section>
  );
}