// components/chatbot/ChatMessage.jsx
import React from 'react';
import { Bot, User } from 'lucide-react';

const ChatMessage = ({ message, isBot, timestamp }) => {
  return (
    <div className={`flex gap-3 mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
        isBot 
          ? 'bg-gray-100 text-gray-800 rounded-bl-md' 
          : 'bg-blue-600 text-white rounded-br-md'
      }`}>
        <p className="text-sm whitespace-pre-wrap">{message}</p>
        {timestamp && (
          <p className={`text-xs mt-1 ${isBot ? 'text-gray-500' : 'text-blue-200'}`}>
            {timestamp}
          </p>
        )}
      </div>
      
      {!isBot && (
        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;