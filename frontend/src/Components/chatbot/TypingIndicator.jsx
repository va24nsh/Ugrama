// components/chatbot/TypingIndicator.jsx
import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex gap-3 mb-4 justify-start">
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
        <div className="flex gap-1 items-center">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div 
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
            style={{animationDelay: '0.1s'}}
          ></div>
          <div 
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
            style={{animationDelay: '0.2s'}}
          ></div>
          <span className="ml-2 text-xs text-gray-500">EduBot is typing...</span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;