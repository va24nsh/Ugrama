// components/chatbot/ChatInput.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({ onSendMessage, disabled }) => {
  const [inputMessage, setInputMessage] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSend = () => {
    if (inputMessage.trim() && !disabled) {
      onSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    setInputMessage(e.target.value);
  };

  return (
    <div className="p-4 border-t bg-white rounded-b-2xl">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about courses, registration, or the platform..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm transition-all"
          disabled={disabled}
          maxLength={500}
        />
        <button
          onClick={handleSend}
          disabled={!inputMessage.trim() || disabled}
          className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      {inputMessage.length > 400 && (
        <p className="text-xs text-gray-500 mt-1">
          {500 - inputMessage.length} characters remaining
        </p>
      )}
    </div>
  );
};

export default ChatInput;