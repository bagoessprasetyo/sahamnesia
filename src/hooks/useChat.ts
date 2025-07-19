import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, ChatState } from '@/types/chat';
import { openAIService } from '@/services/openai';

const STORAGE_KEY = 'saham-cerdas-chat-history';

export const useChat = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    isOpen: false,
    error: null
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages).map((msg: Omit<ChatMessage, 'timestamp'> & { timestamp: string }) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setState(prev => ({
          ...prev,
          messages: parsedMessages
        }));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (state.messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.messages));
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    }
  }, [state.messages]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || state.isLoading) return;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: content.trim(),
      role: 'user',
      timestamp: new Date()
    };

    // Add user message and set loading state
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null
    }));

    try {
      abortControllerRef.current = new AbortController();
      
      // Send messages to OpenAI
      const updatedMessages = [...state.messages, userMessage];
      const aiResponse = await openAIService.sendMessage(updatedMessages);

      // Create AI response message
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      };

      // Add AI response
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false
      }));

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove the user message if API call failed
      setState(prev => ({
        ...prev,
        messages: prev.messages.slice(0, -1),
        isLoading: false,
        error: error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui'
      }));
    }
  }, [state.messages, state.isLoading]);

  const clearChat = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: [],
      error: null
    }));
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  }, []);

  const toggleChat = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: !prev.isOpen,
      error: null // Clear error when toggling
    }));
  }, []);

  const closeChat = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    sendMessage,
    clearChat,
    toggleChat,
    closeChat,
    clearError
  };
};