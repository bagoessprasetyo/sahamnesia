import { useState, useEffect } from 'react'
import { articleService } from '@/services/articles'
import { Article, ArticleFilters } from '@/types/article'

export function useArticles(filters: ArticleFilters = {}) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await articleService.getArticles(filters)
        
        setArticles(response.data)
        setTotal(response.total)
        setHasMore(response.hasMore)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load articles')
      } finally {
        setLoading(false)
      }
    }

    loadArticles()
  }, [filters.category, filters.search, filters.limit, filters.offset])

  return {
    articles,
    loading,
    error,
    total,
    hasMore
  }
}

export function useFeaturedArticle() {
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadFeaturedArticle = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const articles = await articleService.getFeaturedArticles(1)
        setFeaturedArticle(articles[0] || null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load featured article')
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedArticle()
  }, [])

  return {
    featuredArticle,
    loading,
    error
  }
}

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const categoriesData = await articleService.getCategories()
        setCategories(['Semua', ...categoriesData.slice(0, 10)])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories')
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  return {
    categories,
    loading,
    error
  }
}