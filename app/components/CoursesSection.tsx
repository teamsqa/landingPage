'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Course } from '@/app/types/course';
import { Badge, Button, Card } from '@/app/ui';
import LazyModal from './LazyModal';

export default function CoursesSection({ courses }: { courses: Course[] }) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="cursos" className="py-20 bg-gray-50 dark:bg-gray-900 scroll-mt-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          Nuestros Cursos
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-12 text-lg max-w-3xl mx-auto">
          Selecciona el curso que mejor se adapte a tu nivel y objetivos profesionales
        </p>
        
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {courses.map((course) => (
            <Card 
              key={course.id} 
              variant="elevated"
              hover
              className="flex flex-col h-full"
            >
              <div className="relative h-48">
                <Image
                  src={course.image || '/aws.svg'}
                  alt={course.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={course.id === courses[0]?.id} // Prioridad para el primer curso
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex gap-2 mb-2">
                    <Badge variant="primary">
                      {course.duration}
                    </Badge>
                    <Badge 
                      variant={
                        course.level === 'Básico' ? 'success' :
                        course.level === 'Intermedio' ? 'primary' :
                        'warning'
                      }
                    >
                      {course.level}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-8 flex-grow flex flex-col">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                  {course.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {course.description}
                </p>
                
                {/* Tools Section */}
                {course.tools && course.tools.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-200">
                      Herramientas:
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {course.tools.map((tool, index) => (
                        <div 
                          key={`${course.id}-tool-${index}`}
                          className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          title={tool.name || 'Herramienta'}
                        >
                          {tool.icon && tool.icon.trim() !== '' ? (
                            <Image
                              src={tool.icon}
                              alt={tool.name || 'Herramienta'}
                              width={24}
                              height={24}
                              className="w-6 h-6"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center ${tool.icon && tool.icon.trim() !== '' ? 'hidden' : ''}`}>
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            {tool.name || 'Herramienta'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                  <div className="mb-8 flex-grow">
                    <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-200">
                      Lo que aprenderás:
                    </h3>
                    <ul className="space-y-2">
                      {course.whatYouWillLearn.map((item, index) => (
                        <li key={`${course.id}-learn-${index}`} className="flex items-start space-x-2">
                          <svg 
                            className="w-5 h-5 text-lime-500 dark:text-lime-400 mt-1 flex-shrink-0" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth="2" 
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                            />
                          </svg>
                          <span className="text-gray-600 dark:text-gray-300">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-3 mt-auto">
                  <Button 
                    variant="secondary"
                    fullWidth
                    onClick={() => {
                      setSelectedCourse(course);
                      setIsModalOpen(true);
                    }}
                    className="group"
                  >
                    <span>Ver detalles</span>
                    <svg 
                      className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M13 7l5 5m0 0l-5 5m5-5H6" 
                      />
                    </svg>
                  </Button>

                  <Link href="/inscripcion" className="block w-full">
                    <Button variant="primary" fullWidth className="group">
                      <span>Inscríbete ahora</span>
                      <svg 
                        className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M13 7l5 5m0 0l-5 5m5-5H6" 
                        />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <LazyModal 
        course={selectedCourse}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCourse(null);
        }}
      />
    </section>
  );
}