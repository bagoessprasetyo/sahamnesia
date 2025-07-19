-- Blog Database Schema for Sahamnesia
-- Run these SQL commands in your Supabase SQL editor

-- 1. Blog Authors Table
CREATE TABLE blog_authors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'Author',
  email TEXT,
  social_links JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Blog Categories Table
CREATE TABLE blog_categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Blog Posts Table
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image_url TEXT,
  author_id INTEGER REFERENCES blog_authors(id) ON DELETE SET NULL,
  category_id INTEGER REFERENCES blog_categories(id) ON DELETE SET NULL,
  tags TEXT[], -- Array of tags
  is_featured BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  reading_time INTEGER, -- in minutes
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes for performance
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_featured ON blog_posts(is_featured);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);

-- 5. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Create triggers for updated_at
CREATE TRIGGER update_blog_authors_updated_at 
    BEFORE UPDATE ON blog_authors 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_categories_updated_at 
    BEFORE UPDATE ON blog_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON blog_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Insert default data
-- Default authors
INSERT INTO blog_authors (name, slug, bio, role, avatar_url) VALUES
  ('Tim Sahamnesia', 'tim-sahamnesia', 'Tim analis profesional Sahamnesia yang berpengalaman dalam analisis pasar modal Indonesia.', 'Lead Analyst', 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'),
  ('Ellen May', 'ellen-may', 'Senior Analyst dengan 10+ tahun pengalaman di pasar modal. Spesialis dalam analisis teknikal dan fundamental.', 'Senior Analyst', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'),
  ('Rudi Hartono', 'rudi-hartono', 'Expert dalam trading strategy dan risk management. Mentor bagi 1000+ trader sukses.', 'Trading Expert', 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg');

-- Default categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
  ('Trading Strategy', 'trading-strategy', 'Strategi dan teknik trading untuk berbagai kondisi pasar', '#10B981'),
  ('Analisis Saham', 'analisis-saham', 'Analisis mendalam saham-saham pilihan dan sektor tertentu', '#3B82F6'),
  ('Edukasi', 'edukasi', 'Artikel edukatif untuk pemula hingga advanced trader', '#8B5CF6'),
  ('Market Outlook', 'market-outlook', 'Pandangan dan proyeksi kondisi pasar kedepan', '#F59E0B'),
  ('Success Story', 'success-story', 'Kisah sukses member dan strategi yang terbukti profitable', '#EF4444'),
  ('Tutorial', 'tutorial', 'Panduan step-by-step untuk berbagai aspek trading dan investasi', '#06B6D4');

-- Sample blog posts
INSERT INTO blog_posts (
  title, slug, excerpt, content, featured_image_url, author_id, category_id, 
  tags, is_featured, is_premium, status, published_at, reading_time
) VALUES
  (
    'Strategi Trading BBCA: Analisis Support & Resistance',
    'strategi-trading-bbca-analisis-support-resistance',
    'Pelajari cara mengidentifikasi level support dan resistance pada saham BBCA untuk timing entry dan exit yang optimal.',
    '# Strategi Trading BBCA: Analisis Support & Resistance

## Pendahuluan

Bank Central Asia (BBCA) merupakan salah satu saham blue chip yang paling diperdagangkan di Bursa Efek Indonesia. Dalam artikel ini, kita akan membahas strategi trading BBCA menggunakan analisis support dan resistance.

## Identifikasi Level Support dan Resistance

### Support Level
Support adalah level harga dimana tekanan beli cenderung muncul dan menahan penurunan harga lebih lanjut.

### Resistance Level  
Resistance adalah level harga dimana tekanan jual cenderung muncul dan menahan kenaikan harga lebih lanjut.

## Strategi Entry dan Exit

1. **Entry di Support**: Beli ketika harga mendekati level support dengan konfirmasi reversal pattern
2. **Exit di Resistance**: Jual ketika harga mendekati level resistance
3. **Stop Loss**: Set stop loss 2-3% dibawah support level

## Kesimpulan

Strategi support resistance pada BBCA dapat memberikan probabilitas profit yang tinggi jika dieksekusi dengan disiplin dan risk management yang baik.',
    'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg',
    2, 1, 
    ARRAY['BBCA', 'Support Resistance', 'Technical Analysis', 'Banking'],
    true, true, 'published', NOW() - INTERVAL '2 days', 8
  ),
  (
    '5 Kesalahan Umum Trader Pemula dan Cara Menghindarinya',
    '5-kesalahan-umum-trader-pemula',
    'Hindari kesalahan fatal yang sering dilakukan trader pemula. Pelajari cara mengelola risiko dan emosi dalam trading.',
    '# 5 Kesalahan Umum Trader Pemula dan Cara Menghindarinya

Sebagai trader pemula, wajar jika Anda melakukan kesalahan. Namun, dengan memahami kesalahan umum yang sering terjadi, Anda dapat menghindarinya dan mempercepat pembelajaran.

## 1. Tidak Menggunakan Stop Loss

**Kesalahan**: Banyak trader pemula yang tidak menggunakan stop loss karena berharap harga akan kembali.

**Solusi**: Selalu set stop loss sebelum entry. Risk maksimal 2-3% per trade.

## 2. Overtrading

**Kesalahan**: Trading terlalu sering karena FOMO atau ingin cepat profit.

**Solusi**: Buat trading plan dan stick to the plan. Quality over quantity.

## 3. Mengabaikan Risk Management

**Kesalahan**: Menggunakan position size yang terlalu besar relatif terhadap capital.

**Solusi**: Gunakan position sizing yang konsisten, maksimal 2-3% risk per trade.

## 4. Trading Berdasarkan Emosi

**Kesalahan**: Revenge trading setelah loss atau overconfident setelah profit.

**Solusi**: Develop trading psychology yang kuat. Take break jika emosi tidak stabil.

## 5. Tidak Memiliki Trading Plan

**Kesalahan**: Trading secara impulsif tanpa rencana yang jelas.

**Solusi**: Buat trading plan yang detail mencakup entry, exit, dan risk management.

## Kesimpulan

Menghindari kesalahan-kesalahan ini akan meningkatkan peluang sukses Anda dalam trading. Ingat, consistency beats perfection.',
    'https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg',
    1, 3,
    ARRAY['Trading Psychology', 'Risk Management', 'Beginner Guide'],
    false, false, 'published', NOW() - INTERVAL '1 day', 6
  );

-- 8. Enable Row Level Security (RLS) - Optional
ALTER TABLE blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;  
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read published blog posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public can read active authors" ON blog_authors FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active categories" ON blog_categories FOR SELECT USING (is_active = true);