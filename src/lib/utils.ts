import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Format date to short Indonesian locale
 */
export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

/**
 * Calculate reading time based on content length
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.split(' ').length
  return Math.ceil(words / wordsPerMinute)
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Generate excerpt from content
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  // Remove HTML tags if any
  const cleanContent = content.replace(/<[^>]*>/g, '')
  
  // Get first paragraph or first sentence
  const firstParagraph = cleanContent.split('\n')[0] || cleanContent
  
  return truncateText(firstParagraph, maxLength)
}

/**
 * Extract tags from keywords string
 */
export function extractTags(keywords: string | null): string[] {
  if (!keywords) return []
  return keywords.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/**
 * Format content for display (basic paragraph formatting)
 */
export function formatContent(content: string): string[] {
  return content
    .split('\n')
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 0)
}

/**
 * Get random profit percentage for display
 */
export function getRandomProfitPercentage(): string | undefined {
  if (Math.random() > 0.6) {
    return `+${Math.floor(Math.random() * 30 + 10)}%`
  }
  return undefined
}

/**
 * Generate random view count for display
 */
export function getRandomViewCount(): number {
  return Math.floor(Math.random() * 2000) + 100
}

/**
 * Generate random comment count for display
 */
export function getRandomCommentCount(): number {
  return Math.floor(Math.random() * 50) + 1
}

/**
 * Check if article is premium (placeholder implementation)
 */
export function isPremiumArticle(): boolean {
  // Placeholder logic - you can implement actual premium logic
  return Math.random() > 0.7
}

/**
 * Get article category from tags
 */
export function getArticleCategory(keywords: string | null): string {
  const tags = extractTags(keywords)
  if (tags.length === 0) return 'Analisis Saham'
  
  const categoryMap: { [key: string]: string } = {
    'bbca': 'Analisis Saham',
    'banking': 'Analisis Saham',
    'technical': 'Edukasi Dasar',
    'analysis': 'Edukasi Dasar',
    'success': 'Success Story',
    'story': 'Success Story',
    'trading': 'Strategi Trading',
    'strategy': 'Strategi Trading',
    'ihsg': 'Market Update',
    'market': 'Market Update',
    'dividend': 'Strategi Trading',
    'investment': 'Strategi Trading'
  }
  
  const firstTag = tags[0].toLowerCase()
  for (const [key, category] of Object.entries(categoryMap)) {
    if (firstTag.includes(key)) {
      return category
    }
  }
  
  return 'Analisis Saham'
}

/**
 * Get default author info
 */
export function getDefaultAuthor(authorName?: string | null) {
  return {
    name: authorName || 'Tim Sahamnesia',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    role: 'Analyst'
  }
}

/**
 * Get default article image
 */
export function getDefaultArticleImage(): string {
  const defaultImages = [
    'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg',
    'https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg',
    'https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg',
    'https://images.pexels.com/photos/7567531/pexels-photo-7567531.jpeg',
    'https://images.pexels.com/photos/7567526/pexels-photo-7567526.jpeg',
    'https://images.pexels.com/photos/7567440/pexels-photo-7567440.jpeg'
  ]
  
  return defaultImages[Math.floor(Math.random() * defaultImages.length)]
}
