import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import CoursesSection from './components/CoursesSection';
import MethodologySection from './components/MethodologySection';
import BlogSection from './components/BlogSection';
import NewsletterSection from './components/NewsletterSection';
import CTASection from './components/CTASection';
import { Course } from './types/course';
import { BlogPost } from './types/blog';

// Función para obtener cursos del servidor
async function getCourses(): Promise<Course[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/courses`, {
      next: { revalidate: 300 } // Revalidar cada 5 minutos
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error loading courses:', error);
    // Fallback a datos estáticos si hay error
    const { courses } = await import('./data/courses');
    return courses;
  }
}

// Función para obtener posts destacados del blog
async function getFeaturedPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blog/public?featured=true`, {
      next: { revalidate: 180 } // Revalidar cada 3 minutos
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }
    
    const data = await response.json();
    return data.success ? (data.data.posts || []) : [];
  } catch (error) {
    console.error('Error loading featured posts:', error);
    return [];
  }
}

export default async function Home() {
  // Ejecutar ambas peticiones en paralelo
  const [courses, featuredPosts] = await Promise.all([
    getCourses(),
    getFeaturedPosts()
  ]);

  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CoursesSection courses={courses} />
      <MethodologySection />
      <BlogSection posts={featuredPosts} featured={true} />
      <NewsletterSection />
      <CTASection />
    </main>
  );
}