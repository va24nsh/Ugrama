// components/chatbot/ChatHeader.jsx
import React from 'react';
import { Bot, X, Minimize2, Maximize2 } from 'lucide-react';

const ChatHeader = ({ isMinimized, onMinimize, onClose }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">EduBot Assistant</h3>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <p className="text-xs text-blue-100">Online • Ready to help</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onMinimize}
          className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          title={isMinimized ? "Maximize" : "Minimize"}
        >
          {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
        </button>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;