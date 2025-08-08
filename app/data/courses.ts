import { Course } from '@/app/types/course';

export const courses: Course[] = [
  {
    id: 'automatizacion-basico',
    title: 'Fundamentos de Automatización',
    description: 'Inicia tu camino en la automatización de pruebas aprendiendo los conceptos básicos y herramientas fundamentales.',
    duration: '8 semanas',
    level: 'Básico',
    price: '$399 USD',
    instructor: 'Laura Sánchez',
    instructorRole: 'QA Automation Lead',
    instructorImage: 'https://randomuser.me/api/portraits/women/32.jpg',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    whatYouWillLearn: [
      'Configurar un entorno de desarrollo para automatización',
      'Escribir tus primeros scripts de automatización',
      'Implementar patrones de diseño como Page Object Model',
      'Crear reportes de ejecución de pruebas',
      'Aplicar buenas prácticas en automatización'
    ],
    courseContent: [
      'Módulo 1: Introducción a la automatización de pruebas',
      'Módulo 2: Fundamentos de Java para QA',
      'Módulo 3: Selenium WebDriver básico',
      'Módulo 4: Localizadores y elementos web',
      'Módulo 5: Patrones de diseño en automatización',
      'Módulo 6: Reportes y configuración CI/CD básica'
    ],
    tools: [
      {
        name: 'Java',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg'
      },
      {
        name: 'Selenium',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg'
      },
      {
        name: 'Git',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg'
      }
    ],
    topics: [
      {
        title: 'Fundamentos de Java',
        icon: 'M6.37 12.87h-.87v-1.75l.87-.87h1.75v.87l-.87.88h-.88Zm8.75 0h-.87v-1.75l.87-.87h1.75v.87l-.87.88h-.88Z',
        content: [
          'Sintaxis básica y estructuras de control',
          'Programación orientada a objetos',
          'Manejo de excepciones',
          'Colecciones básicas'
        ]
      },
      {
        title: 'Fundamentos de Testing',
        icon: 'M9.879 16.121A3 3 0 1012 17.243V6.758a3 3 0 10-2.121 1.121zm0-8.242a3 3 0 104.242-4.242A3 3 0 009.879 7.879z',
        content: [
          'Conceptos básicos de testing',
          'Tipos de pruebas',
          'Casos de prueba',
          'Estrategias de testing'
        ]
      },
      {
        title: 'Control de Versiones',
        icon: 'M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z',
        content: [
          'Git básico',
          'Flujos de trabajo',
          'Resolución de conflictos',
          'Mejores prácticas'
        ]
      },
      {
        title: 'Automatización Básica',
        icon: 'M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z',
        content: [
          'Selenium WebDriver',
          'Localizadores',
          'Acciones básicas',
          'Primeros scripts'
        ]
      }
    ],
    benefits: [
      {
        title: 'Certificación Profesional',
        description: 'Obtén una certificación avalada por la industria',
        icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z'
      },
      {
        title: 'Soporte 24/7',
        description: 'Acceso a mentores expertos cuando los necesites',
        icon: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z'
      },
      {
        title: 'Proyectos Reales',
        description: 'Practica con proyectos de la vida real',
        icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25'
      }
    ],
    requirements: [
      'Conocimientos básicos de programación',
      'Computadora con Java instalado',
      'Conocimientos básicos de HTML y CSS',
      'Disposición para aprender y practicar'
    ],
    targetAudience: [
      'Testers manuales que quieren automatizar',
      'Desarrolladores interesados en testing',
      'Estudiantes de QA',
      'Profesionales en transición a QA'
    ]
  },
  {
    id: 'serenity-java',
    title: 'SerenityBDD y Java Intermedio',
    description: 'Domina las técnicas intermedias de automatización con SerenityBDD y mejora tus habilidades en Java.',
    duration: '12 semanas',
    level: 'Intermedio',
    price: '$599 USD',
    instructor: 'Carlos Ramírez',
    instructorRole: 'Senior QA Automation Engineer',
    instructorImage: 'https://randomuser.me/api/portraits/men/45.jpg',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    whatYouWillLearn: [
      'Implementar SerenityBDD en proyectos reales',
      'Crear arquitecturas de automatización escalables',
      'Integrar Cucumber con SerenityBDD',
      'Generar reportes avanzados de testing',
      'Aplicar patrones de diseño avanzados'
    ],
    courseContent: [
      'Módulo 1: SerenityBDD Framework avanzado',
      'Módulo 2: Integración con Cucumber BDD',
      'Módulo 3: Patrones de diseño intermedios',
      'Módulo 4: Manejo de datos y configuración',
      'Módulo 5: Integración continua avanzada',
      'Módulo 6: Reportes y análisis de resultados'
    ],
    tools: [
      {
        name: 'Java',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg'
      },
      {
        name: 'Selenium',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg'
      },
      {
        name: 'Cucumber',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cucumber/cucumber-plain.svg'
      },
      {
        name: 'Gradle',
        icon: '/gradle.svg'
      }
    ],
    topics: [
      {
        title: 'SerenityBDD Framework',
        icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
        content: [
          'Arquitectura del framework',
          'Configuración y setup',
          'Integración con JUnit',
          'Reportes detallados'
        ]
      },
      {
        title: 'Patrones de Diseño',
        icon: 'M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z',
        content: [
          'Page Object Model',
          'Screen Play Pattern',
          'Factory Pattern',
          'Builder Pattern'
        ]
      },
      {
        title: 'Testing Avanzado',
        icon: 'M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-13.5 0l-2.62 10.726c-.122.499.106 1.028.589 1.202a5.989 5.989 0 002.031.352 5.989 5.989 0 002.031-.352c.483-.174.711-.703.59-1.202L5.25 4.97z',
        content: [
          'Data Driven Testing',
          'BDD con Cucumber',
          'API Testing',
          'Cross-browser Testing'
        ]
      },
      {
        title: 'Reportes y CI/CD',
        icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
        content: [
          'Reportes personalizados',
          'Integración con Jenkins',
          'Pipeline automation',
          'Despliegue continuo'
        ]
      }
    ],
    benefits: [
      {
        title: 'Proyectos Empresariales',
        description: 'Trabaja en proyectos reales de empresas',
        icon: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21'
      },
      {
        title: 'Mentoría Personalizada',
        description: 'Sesiones one-on-one con expertos',
        icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z'
      },
      {
        title: 'Certificación Avanzada',
        description: 'Certificación profesional en SerenityBDD',
        icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z'
      }
    ],
    requirements: [
      'Conocimientos sólidos de Java',
      'Experiencia básica en automatización',
      'Familiaridad con Git',
      'Conocimientos de testing'
    ],
    targetAudience: [
      'QA Engineers con experiencia básica',
      'Desarrolladores de pruebas junior',
      'Profesionales de QA',
      'Ingenieros de software interesados en testing'
    ]
  },
  {
    id: 'automatizacion-profesional',
    title: 'Automatización Profesional',
    description: 'Alcanza el nivel profesional en automatización dominando herramientas avanzadas y mejores prácticas de la industria.',
    duration: '16 semanas',
    level: 'Profesional',
    price: '$799 USD',
    instructor: 'Ana Martínez',
    instructorRole: 'QA Architecture Lead',
    instructorImage: 'https://randomuser.me/api/portraits/women/68.jpg',
    image: 'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    whatYouWillLearn: [
      'Diseñar arquitecturas de testing escalables',
      'Implementar CI/CD avanzado para testing',
      'Gestionar testing en contenedores con Docker',
      'Aplicar testing de performance y seguridad',
      'Liderar equipos de automatización'
    ],
    courseContent: [
      'Módulo 1: Arquitecturas avanzadas de testing',
      'Módulo 2: CI/CD y DevOps para QA',
      'Módulo 3: Testing en contenedores y cloud',
      'Módulo 4: Performance y Security Testing',
      'Módulo 5: AI y Machine Learning en testing',
      'Módulo 6: Liderazgo técnico en QA'
    ],
    tools: [
      {
        name: 'Jenkins',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg'
      },
      {
        name: 'Docker',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg'
      },
      {
        name: 'Kubernetes',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg'
      },
      {
        name: 'AWS',
        icon: '/aws.svg'
      }
    ],
    topics: [
      {
        title: 'Arquitectura de Automatización',
        icon: 'M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75',
        content: [
          'Diseño de frameworks',
          'Patrones arquitectónicos',
          'Escalabilidad y mantenimiento',
          'Mejores prácticas'
        ]
      },
      {
        title: 'DevOps y CI/CD',
        icon: 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125',
        content: [
          'Jenkins avanzado',
          'Docker y contenedores',
          'Pipelines complejos',
          'Monitoreo y logging'
        ]
      },
      {
        title: 'Testing Especializado',
        icon: 'M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75',
        content: [
          'Performance Testing',
          'Security Testing',
          'Mobile Testing',
          'Cloud Testing'
        ]
      },
      {
        title: 'Gestión y Liderazgo',
        icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
        content: [
          'Gestión de equipos QA',
          'Estrategias de testing',
          'Estimación y planificación',
          'Mejora continua'
        ]
      }
    ],
    benefits: [
      {
        title: 'Certificación Elite',
        description: 'Certificación de nivel arquitecto en automatización',
        icon: 'M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0'
      },
      {
        title: 'Consultoría Empresarial',
        description: 'Acceso a consultorías para empresas',
        icon: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z'
      },
      {
        title: 'Red Profesional',
        description: 'Acceso a red exclusiva de profesionales QA',
        icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z'
      }
    ],
    requirements: [
      'Experiencia sólida en automatización ',
      'Dominio de Java y patrones de diseño',
      'Conocimientos de CI/CD',
      'Experiencia en gestión de proyectos'
    ],
    targetAudience: [
      'QA Engineers senior',
      'Líderes de equipos de automatización',
      'Arquitectos de testing',
      'Profesionales que buscan roles de liderazgo'
    ]
  }
];