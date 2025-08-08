export type Topic = {
  title: string;
  icon?: string;
  content: string[];
};

export type Benefit = {
  title: string;
  description: string;
  icon?: string;
};

export type Tool = {
  name: string;
  icon?: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  price: string;
  instructor: string;
  instructorRole: string;
  instructorImage: string;
  image: string;
  tools: Tool[];
  topics: Topic[];
  benefits: Benefit[];
  requirements: string[];
  targetAudience: string[];
  whatYouWillLearn: string[]; // Lo que aprenderás
  courseContent: string[];    // Contenido del curso
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
};