export interface Article {
  id: number
  url: string | null
  title: string | null
  author: string | null
  description: string | null
  date_post: string | null
  content: string | null
  keywords: string | null
  created_at: string
  source: string | null
  image_url: string | null
}

export interface ArticleFilters {
  category?: string
  search?: string
  limit?: number
  offset?: number
}

export interface ArticleResponse {
  data: Article[]
  total: number
  hasMore: boolean
}