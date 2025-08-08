'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Course } from '@/app/types/course';
import { Button } from '@/app/ui';

type CourseModalProps = {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
};

export default function CourseModal({ course, isOpen, onClose }: CourseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-75"
          onClick={onClose}
        />

        <div className="inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 rounded-xl shadow-xl">
          <div className="relative h-72">
            <Image
              src={course.image || '/aws.svg'}
              alt={course.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>
              <div className="flex flex-wrap gap-3">
                <span className="bg-lime-500 dark:bg-lime-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  {course.duration}
                </span>
                <span className={`text-white px-4 py-1 rounded-full text-sm font-medium ${
                  course.level === 'Básico' ? 'bg-green-500 dark:bg-green-600' :
                  course.level === 'Intermedio' ? 'bg-blue-500 dark:bg-blue-600' :
                  'bg-purple-500 dark:bg-purple-600'
                }`}>
                  {course.level}
                </span>
                <span className="bg-orange-500 dark:bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  {course.price}
                </span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-8">
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  {course.description}
                </p>

                {/* Lo que aprenderás */}
                {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                  <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold mb-6 dark:text-white">Lo que aprenderás</h2>
                    <ul className="space-y-4">
                      {course.whatYouWillLearn.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <svg className="w-6 h-6 text-lime-500 dark:text-lime-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-600 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Contenido del curso */}
                {course.courseContent && course.courseContent.length > 0 && (
                  <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold mb-6 dark:text-white">Contenido del curso</h2>
                    <ul className="space-y-4">
                      {course.courseContent.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-lime-100 dark:bg-lime-900 rounded-full flex items-center justify-center text-lime-600 dark:text-lime-400 font-semibold text-sm flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-gray-600 dark:text-gray-300 mt-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Temas del curso */}
                <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-6 dark:text-white">Temas del curso</h2>
                  <div className="space-y-6">
                    {course.topics.map((topic, index) => (
                      <div 
                        key={index}
                        className="group border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:border-lime-500 dark:hover:border-lime-400 transition-colors"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          {topic.icon ? (
                            <div className="p-3 bg-lime-100 dark:bg-lime-900 rounded-lg group-hover:bg-lime-500 dark:group-hover:bg-lime-500 transition-colors">
                              <svg 
                                className="w-6 h-6 text-lime-600 dark:text-lime-400 group-hover:text-white transition-colors" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={topic.icon} />
                              </svg>
                            </div>
                          ) : (
                            <div className="p-3 bg-lime-100 dark:bg-lime-900 rounded-lg group-hover:bg-lime-500 dark:group-hover:bg-lime-500 transition-colors">
                              <svg 
                                className="w-6 h-6 text-lime-600 dark:text-lime-400 group-hover:text-white transition-colors" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                          )}
                          <h3 className="text-xl font-semibold group-hover:text-lime-600 dark:text-white dark:group-hover:text-lime-400 transition-colors">
                            {topic.title}
                          </h3>
                        </div>
                        <ul className="space-y-3 pl-14">
                          {topic.content.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-2">
                              <svg 
                                className="w-5 h-5 text-lime-500 dark:text-lime-400 mt-0.5 flex-shrink-0" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-gray-600 dark:text-gray-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-6 dark:text-white">Requisitos</h2>
                  <ul className="space-y-4">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-lime-500 dark:text-lime-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Instructor Card */}
                <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4 dark:text-white">Instructor</h2>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={course.instructorImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(course.instructor || 'Instructor') + '&background=10b981&color=ffffff&size=64'}
                        alt={course.instructor}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg dark:text-white">{course.instructor}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{course.instructorRole}</p>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4 dark:text-white">Beneficios del curso</h2>
                  <div className="space-y-4">
                    {course.benefits.map((benefit, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="p-2 bg-lime-100 dark:bg-lime-900 rounded-lg">
                            <svg 
                              className="w-6 h-6 text-lime-600 dark:text-lime-400" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={benefit.icon || "M5 13l4 4L19 7"} />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold dark:text-white">{benefit.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-br from-lime-500 to-lime-600 dark:from-lime-600 dark:to-lime-700 rounded-xl shadow-lg p-6 text-white">
                  <h2 className="text-xl font-bold mb-2">¿Listo para empezar?</h2>
                  <p className="mb-4 opacity-90">Únete a nuestros estudiantes y comienza tu carrera en automatización.</p>
                  <Link href="/inscripcion" className="block w-full">
                    <Button variant="secondary" fullWidth>
                      Inscríbete ahora
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}