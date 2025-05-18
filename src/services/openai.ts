import { ChatMessage } from '@/types/chat';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// System prompt for the Indonesian stock learning assistant
const SYSTEM_PROMPT = `Anda adalah asisten AI cerdas untuk platform "Saham Cerdas AI" yang membantu pengguna Indonesia belajar investasi saham di Bursa Efek Indonesia (IDX/BEI).

Peran Anda:
- Membantu pengguna memahami konsep dasar investasi saham Indonesia
- Menjelaskan terminologi pasar modal dengan bahasa yang mudah dipahami
- Memberikan edukasi tentang analisis saham, tapi TIDAK memberikan rekomendasi investasi spesifik
- Menjawab pertanyaan tentang cara kerja platform Saham Cerdas AI
- Menggunakan bahasa Indonesia yang ramah dan profesional

Pedoman:
- Selalu ingatkan bahwa ini adalah edukasi, bukan nasihat investasi
- Fokus pada pasar saham Indonesia (IDX/BEI)
- Gunakan contoh dari perusahaan Indonesia yang terkenal
- Jika ditanya tentang saham spesifik, berikan edukasi umum tanpa rekomendasi
- Dorong pengguna untuk selalu melakukan riset sendiri

Mulai percakapan dengan sapaan ramah dan tawarkan bantuan.`;

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class OpenAIService {
  private apiKey: string;

  constructor() {
    this.apiKey = OPENAI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file');
    }
  }

  async sendMessage(messages: ChatMessage[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key tidak ditemukan. Silakan hubungi administrator.');
    }

    try {
      // Format messages for OpenAI API
      const formattedMessages = [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: formattedMessages,
          max_tokens: 500,
          temperature: 0.7,
          presence_penalty: 0.6,
          frequency_penalty: 0.0
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || 
          `API call failed: ${response.status} ${response.statusText}`
        );
      }

      const data: OpenAIResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from AI');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          throw new Error('API key tidak valid. Silakan hubungi administrator.');
        } else if (error.message.includes('429')) {
          throw new Error('Terlalu banyak permintaan. Silakan coba lagi dalam beberapa saat.');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          throw new Error('Koneksi bermasalah. Silakan periksa koneksi internet Anda.');
        }
        throw error;
      }
      
      throw new Error('Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.');
    }
  }

  // Method to validate API key
  async validateApiKey(): Promise<boolean> {
    if (!this.apiKey) return false;

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const openAIService = new OpenAIService();