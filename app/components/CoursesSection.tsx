'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Course } from '@/app/types/course';
import { Badge, Button, Card } from '@/app/ui';
import CourseModal from './CourseModal';

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
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
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
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-200">
                    Herramientas:
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {course.tools.map((tool, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title={tool.name}
                      >
                        <Image
                          src={tool.icon}
                          alt={tool.name}
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {tool.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-8 flex-grow">
                  <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-200">
                    Lo que aprenderás:
                  </h3>
                  <ul className="space-y-2">
                    {course.topics.map((topic, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <svg 
                          className="w-5 h-5 text-lime-500 dark:text-lime-400 mt-1 flex-shrink-0" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                          />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300">
                          {topic.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

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

      {selectedCourse && (
        <CourseModal 
          course={selectedCourse}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCourse(null);
          }}
        />
      )}
    </section>
  );
}