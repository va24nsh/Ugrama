// hooks/useChatbot.js
import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { INITIAL_MESSAGES } from '../utils/constants';

export const useChatbot = () => {
  const [messages, setMessages] = useLocalStorage('chatbot_messages', INITIAL_MESSAGES);
  const [isOpen, setIsOpen] = useLocalStorage('chatbot_open', false);
  const [isMinimized, setIsMinimized] = useLocalStorage('chatbot_minimized', false);
  const [isTyping, setIsTyping] = useState(false);
  const [messageIdCounter, setMessageIdCounter] = useState(messages.length + 1);

  const addMessage = (messageData) => {
    const newMessage = {
      id: messageIdCounter,
      ...messageData,
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessageIdCounter(prev => prev + 1);
  };

  const clearMessages = () => {
    setMessages(INITIAL_MESSAGES);
    setMessageIdCounter(2);
  };

  const getLastBotMessage = () => {
    return messages.filter(msg => msg.isBot).pop();
  };

  const getLastUserMessage = () => {
    return messages.filter(msg => !msg.isBot).pop();
  };

  const markAsRead = () => {
    // Implementation for marking messages as read
    // This could be useful for notifications
  };

  // Auto-close after inactivity
  useEffect(() => {
    let timeout;
    if (isOpen && !isTyping) {
      timeout = setTimeout(() => {
        // Auto-minimize after 5 minutes of inactivity
        setIsMinimized(true);
      }, 5 * 60 * 1000);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isOpen, isTyping, setIsMinimized]);

  return {
    messages,
    isOpen,
    isMinimized,
    isTyping,
    setIsOpen,
    setIsMinimized,
    setIsTyping,
    addMessage,
    clearMessages,
    getLastBotMessage,
    getLastUserMessage,
    markAsRead,
    messageCount: messages.length
  };
};