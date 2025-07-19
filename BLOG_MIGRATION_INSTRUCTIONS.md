# Blog Migration Instructions

## Overview

The codebase has been successfully restructured to separate content types:

- **News Page**: Now uses the existing `articles` table from Supabase
- **Blog Page**: Uses new dedicated blog tables (`blog_posts`, `blog_categories`, `blog_authors`)

## Database Setup

### 1. Run the Blog Schema

Execute the SQL commands in `blog_schema.sql` in your Supabase SQL editor to create the new blog tables:

```bash
# The file contains:
- blog_authors table
- blog_categories table  
- blog_posts table
- Indexes for performance
- Row Level Security policies
- Sample data
```

### 2. Environment Variables

Ensure your `.env` file has the required Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## New File Structure

### Types
- `src/types/blog.ts` - Blog-specific TypeScript interfaces
- `src/types/article.ts` - Existing article types (used by News page)

### Services
- `src/services/blog.ts` - Blog data operations (new)
- `src/services/articles.ts` - Article data operations (existing, used by News)

### Pages
- `src/pages/News.tsx` - Now connected to `articles` table
- `src/pages/Blog.tsx` - Now connected to new blog tables
- `src/pages/BlogDetail.tsx` - Updated to use blog service

## Key Changes

### News Page (`src/pages/News.tsx`)
- ✅ Removed all hardcoded mock data
- ✅ Connected to Supabase `articles` table
- ✅ Real-time search functionality
- ✅ Dynamic categories from article keywords
- ✅ Loading and error states

### Blog Page (`src/pages/Blog.tsx`)
- ✅ Connected to new `blog_posts` table
- ✅ Author and category relationships
- ✅ Premium content support
- ✅ Featured posts
- ✅ Enhanced search and filtering

### New Blog Service Features
- Full CRUD operations for blog posts
- Author and category management
- Advanced filtering and search
- Statistics and analytics
- View counting
- Related posts functionality

## Content Management

### Sample Data

The schema includes sample blog posts and categories. You can:

1. **Add new authors**:
```sql
INSERT INTO blog_authors (name, slug, bio, role, avatar_url) 
VALUES ('Your Name', 'your-name', 'Bio here', 'Author', 'avatar_url');
```

2. **Add new categories**:
```sql
INSERT INTO blog_categories (name, slug, description, color) 
VALUES ('New Category', 'new-category', 'Description', '#3B82F6');
```

3. **Add new blog posts**:
```sql
INSERT INTO blog_posts (title, slug, excerpt, content, author_id, category_id, status, published_at) 
VALUES ('Post Title', 'post-slug', 'Excerpt', 'Content', 1, 1, 'published', NOW());
```

### Content Types

**Blog Content** (new tables):
- Educational articles
- Trading strategies  
- Tutorials
- Success stories
- Market analysis

**News Content** (existing articles table):
- Breaking news
- Market updates
- Regulatory changes
- Company announcements

## API Usage

### Blog Service Methods

```typescript
import { blogService } from '@/services/blog';

// Get blog posts with filters
const posts = await blogService.getBlogPosts({
  category: 'trading-strategy',
  limit: 10
});

// Get single post
const post = await blogService.getBlogPostById(1);

// Search posts
const results = await blogService.searchBlogPosts('BBCA');

// Get categories
const categories = await blogService.getBlogCategories();
```

### Article Service (News)

```typescript
import { articleService } from '@/services/articles';

// Get articles for news
const articles = await articleService.getArticles({ limit: 20 });
```

## Testing

1. **Start development server**:
```bash
npm run dev
```

2. **Test News page**:
   - Navigate to `/news`
   - Verify real data loads from articles table
   - Test search functionality

3. **Test Blog page**:
   - Navigate to `/blog`  
   - Verify blog posts load (will show sample data initially)
   - Test category filtering

## Next Steps

1. **Populate Blog Content**: Add real blog posts using the Supabase dashboard or the API
2. **Content Migration**: If you have existing blog content, migrate it to the new blog tables
3. **Customize**: Adjust the UI/UX based on your content strategy
4. **SEO**: Add meta tags and structured data for better search visibility

## Troubleshooting

### Common Issues

1. **No blog posts showing**: 
   - Ensure you've run the `blog_schema.sql`
   - Check sample data was inserted

2. **Supabase connection errors**:
   - Verify environment variables
   - Check RLS policies allow public read access

3. **Build errors**:
   - Run `npm run build` to check for TypeScript errors
   - Ensure all imports are correct

### Support

For issues or questions about the blog system implementation, refer to:
- Supabase documentation
- TypeScript interfaces in `src/types/blog.ts`
- Service methods in `src/services/blog.ts`