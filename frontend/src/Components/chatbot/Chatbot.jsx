// components/chatbot/Chatbot.jsx
import React, {  useEffect, useRef } from 'react';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import ChatMessage from './ChatMessage';
import QuickActions from './QuickActions';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { useChatbot } from '../../Hooks/useChatbot';
import { chatbotService } from '../../services/chatbotService';

const Chatbot = () => {
  const {
    messages,
    isOpen,
    isMinimized,
    isTyping,
    setIsOpen,
    setIsMinimized,
    addMessage,
    setIsTyping
  } = useChatbot();

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    // Add user message
    addMessage({
      text: messageText,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    // Show typing indicator
    setIsTyping(true);

    try {
      // Get bot response
      const response = await chatbotService.getBotResponse(messageText);
      
      setTimeout(() => {
        addMessage({
          text: response,
          isBot: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error('Error getting bot response:', error);
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action, text) => {
    handleSendMessage(text);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center group"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`bg-white rounded-2xl shadow-2xl border transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-80 h-96'
        } sm:w-96 sm:h-[500px]`}>
          
          <ChatHeader
            isMinimized={isMinimized}
            onMinimize={() => setIsMinimized(!isMinimized)}
            onClose={() => setIsOpen(false)}
          />

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="h-64 sm:h-80 overflow-y-auto p-4 bg-gray-50">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message.text}
                    isBot={message.isBot}
                    timestamp={message.timestamp}
                  />
                ))}
                
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="px-4 py-2 border-t bg-white">
                <QuickActions onQuickAction={handleQuickAction} />
              </div>

              {/* Input */}
              <ChatInput
                onSendMessage={handleSendMessage}
                disabled={isTyping}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;