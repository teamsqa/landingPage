export type BlogPostStatus = 'draft' | 'published' | 'archived';

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  status: BlogPostStatus;
  published: boolean;
  publishedAt?: string;
  category: string; // Category ID
  categoryInfo?: BlogCategory;
  tags: string[];
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  readingTime: number; // in minutes
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
};

export type BlogPostCreate = Omit<BlogPost, 'id' | 'slug' | 'readingTime' | 'views' | 'likes' | 'createdAt' | 'updatedAt' | 'categoryInfo'>;

export type BlogPostUpdate = Partial<BlogPostCreate>;

export type BlogStats = {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  archivedPosts: number;
  totalViews: number;
  totalLikes: number;
  categoriesCount: number;
};

export type BlogFilters = {
  status?: BlogPostStatus;
  category?: string;
  author?: string;
  tag?: string;
  search?: string;
};

export type BlogPaginatedResponse = {
  posts: BlogPost[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export const BLOG_STATUS_LABELS: Record<BlogPostStatus, string> = {
  draft: 'Borrador',
  published: 'Publicado',
  archived: 'Archivado',
};

export const BLOG_DEFAULT_CATEGORIES: BlogCategory[] = [
  {
    id: 'automatizacion',
    name: 'Automatización',
    slug: 'automatizacion',
    description: 'Posts sobre automatización de pruebas',
    color: '#10b981',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'java',
    name: 'Java',
    slug: 'java',
    description: 'Contenido relacionado con Java',
    color: '#f59e0b',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'serenity',
    name: 'SerenityBDD',
    slug: 'serenity',
    description: 'Tutoriales y tips de SerenityBDD',
    color: '#3b82f6',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tutoriales',
    name: 'Tutoriales',
    slug: 'tutoriales',
    description: 'Tutoriales paso a paso',
    color: '#8b5cf6',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'noticias',
    name: 'Noticias',
    slug: 'noticias',
    description: 'Noticias del mundo QA',
    color: '#06b6d4',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
