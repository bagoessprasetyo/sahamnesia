export interface ChatMessage {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
  }
  
  export interface ChatState {
    messages: ChatMessage[];
    isLoading: boolean;
    isOpen: boolean;
    error: string | null;
  }
  
  export interface ChatbotProps {
    isOpen: boolean;
    onClose: () => void;
    onToggle: () => void;
  }