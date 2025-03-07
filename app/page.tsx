import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import CoursesSection from './components/CoursesSection';
import MethodologySection from './components/MethodologySection';
import NewsletterSection from './components/NewsletterSection';
import CTASection from './components/CTASection';
import { courses } from './data/courses';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CoursesSection courses={courses} />
      <MethodologySection />
      <NewsletterSection />
      <CTASection />
    </main>
  );
}