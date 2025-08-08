/**
 * Utilities for blog functionality
 */

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100); // Limit to 100 characters
}

/**
 * Calculate estimated reading time based on content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * Extract plain text from HTML content
 */
export function stripHtmlTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/**
 * Generate excerpt from content
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  const plainText = stripHtmlTags(content);
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  const truncated = plainText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  return lastSpaceIndex > 0 
    ? truncated.substring(0, lastSpaceIndex) + '...'
    : truncated + '...';
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format date for display with time
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Get relative time (e.g., "hace 2 días")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return 'hace 1 día';
  } else if (diffDays < 7) {
    return `hace ${diffDays} días`;
  } else if (diffDays < 30) {
    const weeks = Math.ceil(diffDays / 7);
    return weeks === 1 ? 'hace 1 semana' : `hace ${weeks} semanas`;
  } else if (diffDays < 365) {
    const months = Math.ceil(diffDays / 30);
    return months === 1 ? 'hace 1 mes' : `hace ${months} meses`;
  } else {
    const years = Math.ceil(diffDays / 365);
    return years === 1 ? 'hace 1 año' : `hace ${years} años`;
  }
}

/**
 * Validate blog post data
 */
export function validateBlogPost(post: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!post.title?.trim()) {
    errors.push('El título es requerido');
  }

  if (!post.content?.trim()) {
    errors.push('El contenido es requerido');
  }

  if (!post.category?.trim()) {
    errors.push('La categoría es requerida');
  }

  if (!post.author?.id) {
    errors.push('El autor es requerido');
  }

  if (post.title && post.title.length > 100) {
    errors.push('El título no puede exceder 100 caracteres');
  }

  if (post.excerpt && post.excerpt.length > 300) {
    errors.push('El extracto no puede exceder 300 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Clean and validate tags
 */
export function cleanTags(tags: string[]): string[] {
  return tags
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0 && tag.length <= 20)
    .slice(0, 10); // Maximum 10 tags
}

/**
 * Generate SEO-friendly meta title
 */
export function generateMetaTitle(title: string, siteName: string = 'TeamsQA'): string {
  const maxLength = 60;
  const fullTitle = `${title} | ${siteName}`;
  
  if (fullTitle.length <= maxLength) {
    return fullTitle;
  }
  
  const truncatedTitle = title.substring(0, maxLength - siteName.length - 3);
  return `${truncatedTitle}... | ${siteName}`;
}

/**
 * Generate SEO-friendly meta description
 */
export function generateMetaDescription(excerpt: string): string {
  const maxLength = 160;
  
  if (excerpt.length <= maxLength) {
    return excerpt;
  }
  
  const truncated = excerpt.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  return lastSpaceIndex > 0 
    ? truncated.substring(0, lastSpaceIndex) + '...'
    : truncated + '...';
}

/**
 * Search posts by title, content, or tags
 */
export function searchPosts(posts: any[], query: string): any[] {
  if (!query.trim()) {
    return posts;
  }
  
  const searchTerm = query.toLowerCase();
  
  return posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm) ||
    post.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm)) ||
    post.categoryInfo?.name?.toLowerCase().includes(searchTerm)
  );
}

/**
 * Sort posts by various criteria
 */
export function sortPosts(posts: any[], sortBy: 'date' | 'views' | 'likes' | 'title', order: 'asc' | 'desc' = 'desc'): any[] {
  return [...posts].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.publishedAt || a.createdAt).getTime() - new Date(b.publishedAt || b.createdAt).getTime();
        break;
      case 'views':
        comparison = a.views - b.views;
        break;
      case 'likes':
        comparison = a.likes - b.likes;
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
    }
    
    return order === 'desc' ? -comparison : comparison;
  });
}
