import Hero from '@/components/Hero';
import { Manifesto, BentoGrid, ProfessionFinder, ValueCalculator, CourseProgram } from '@/components/Sections1';
import { Pricing, Reviews, FAQ, FinalCTA, Footer } from '@/components/Sections2';

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Manifesto />
      <BentoGrid />
      <ProfessionFinder />
      <ValueCalculator />
      <CourseProgram />
      <Pricing />
      <Reviews />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}