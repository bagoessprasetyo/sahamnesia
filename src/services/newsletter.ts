import { supabase } from '../lib/supabase';

export interface NewsletterSubscription {
  id?: number;
  email: string;
  subscribed_at: string;
  is_active: boolean;
  source?: string;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
  data?: NewsletterSubscription;
}

export class NewsletterService {
  /**
   * Subscribe email to newsletter
   */
  async subscribe(email: string, source = 'news-page'): Promise<NewsletterResponse> {
    try {
      // Validate email format
      if (!this.isValidEmail(email)) {
        return {
          success: false,
          message: 'Format email tidak valid'
        };
      }

      // Check if email already exists
      const { data: existingSubscription, error: checkError } = await supabase
        .from('newsletter_subscriptions')
        .select('id, is_active')
        .eq('email', email.toLowerCase())
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected for new subscribers
        throw checkError;
      }

      if (existingSubscription) {
        if (existingSubscription.is_active) {
          return {
            success: false,
            message: 'Email sudah terdaftar dalam newsletter kami'
          };
        } else {
          // Reactivate subscription
          const { data, error: updateError } = await supabase
            .from('newsletter_subscriptions')
            .update({ 
              is_active: true,
              subscribed_at: new Date().toISOString(),
              source
            })
            .eq('id', existingSubscription.id)
            .select()
            .single();

          if (updateError) throw updateError;

          return {
            success: true,
            message: 'Berhasil mengaktifkan kembali subscription newsletter!',
            data
          };
        }
      }

      // Create new subscription
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .insert({
          email: email.toLowerCase(),
          subscribed_at: new Date().toISOString(),
          is_active: true,
          source
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        message: 'Berhasil mendaftar newsletter! Terima kasih telah bergabung.',
        data
      };

    } catch (error) {
      console.error('Newsletter subscription error:', error);
      
      return {
        success: false,
        message: 'Terjadi kesalahan saat mendaftar newsletter. Silakan coba lagi.'
      };
    }
  }

  /**
   * Unsubscribe email from newsletter
   */
  async unsubscribe(email: string): Promise<NewsletterResponse> {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .update({ is_active: false })
        .eq('email', email.toLowerCase())
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        message: 'Berhasil berhenti berlangganan newsletter',
        data
      };

    } catch (error) {
      console.error('Newsletter unsubscribe error:', error);
      
      return {
        success: false,
        message: 'Terjadi kesalahan saat berhenti berlangganan'
      };
    }
  }

  /**
   * Get newsletter statistics
   */
  async getStats(): Promise<{
    totalSubscribers: number;
    activeSubscribers: number;
    recentSubscribers: number;
  }> {
    try {
      const [totalResult, activeResult, recentResult] = await Promise.all([
        supabase
          .from('newsletter_subscriptions')
          .select('id', { count: 'exact' }),
        
        supabase
          .from('newsletter_subscriptions')
          .select('id', { count: 'exact' })
          .eq('is_active', true),
        
        supabase
          .from('newsletter_subscriptions')
          .select('id', { count: 'exact' })
          .eq('is_active', true)
          .gte('subscribed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      return {
        totalSubscribers: totalResult.count || 0,
        activeSubscribers: activeResult.count || 0,
        recentSubscribers: recentResult.count || 0
      };

    } catch (error) {
      console.error('Newsletter stats error:', error);
      return {
        totalSubscribers: 0,
        activeSubscribers: 0,
        recentSubscribers: 0
      };
    }
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get all active subscribers (for admin use)
   */
  async getActiveSubscribers(): Promise<NewsletterSubscription[]> {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .eq('is_active', true)
        .order('subscribed_at', { ascending: false });

      if (error) throw error;

      return data || [];

    } catch (error) {
      console.error('Get subscribers error:', error);
      return [];
    }
  }
}

export const newsletterService = new NewsletterService();