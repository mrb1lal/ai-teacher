import Hero from '@/components/Hero';
import FeatureCarousel from '@/components/FeatureCarousel';
import Testimonials from '@/components/Testimonials';
import About from '@/components/About';
import Contact from '@/components/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeatureCarousel />
      <Testimonials />
      <About />
      <Contact />
    </>
  );
}