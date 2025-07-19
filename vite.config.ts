
import { defineConfig } from 'vite';
import path from "path";
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion') || id.includes('lucide-react')) {
              return 'vendor-ui';
            }
            if (id.includes('react-quill') || id.includes('quill')) {
              return 'vendor-editor';
            }
            if (id.includes('react-markdown') || id.includes('remark-gfm') || id.includes('rehype-raw')) {
              return 'vendor-markdown';
            }
            if (id.includes('@supabase/supabase-js')) {
              return 'vendor-supabase';
            }
            return 'vendor-misc';
          }
          
          // Admin chunks
          if (id.includes('/pages/admin/')) {
            if (id.includes('AdminApp') || id.includes('AdminDashboard') || id.includes('AdminLogin')) {
              return 'admin-core';
            }
            if (id.includes('BlogPost') || id.includes('AdminCategories') || id.includes('AdminAuthors')) {
              return 'admin-blog';
            }
            if (id.includes('AdminAnalytics') || id.includes('AdminUsers') || id.includes('AdminNotifications') || id.includes('AdminSettings') || id.includes('AdminProfile')) {
              return 'admin-analytics';
            }
            if (id.includes('MediaLibrary') || id.includes('AdminNews')) {
              return 'admin-media';
            }
            return 'admin-misc';
          }
          
          // Main app page chunks
          if (id.includes('/pages/Blog') || id.includes('/pages/BlogDetail')) {
            return 'pages-blog';
          }
          if (id.includes('/pages/News') || id.includes('/pages/NewsDetail')) {
            return 'pages-news';
          }
          if (id.includes('/pages/Contact')) {
            return 'pages-contact';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600 // Increase from default 500KB
  }
});
