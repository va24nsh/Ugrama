// utils/constants.js

// Initial welcome message
export const INITIAL_MESSAGES = [
  {
    id: 1,
    text: "Hello! I'm EduBot, your learning assistant. How can I help you today?",
    isBot: true,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

// Quick action buttons
export const QUICK_ACTIONS = [
  { text: "Course Recommendations", action: "recommend_courses" },
  { text: "Help with Registration", action: "help_registration" },
  { text: "Payment Issues", action: "payment_help" },
  { text: "Find Educators", action: "find_educators" },
  { text: "Platform Features", action: "platform_features" }
];

// Bot configuration
export const BOT_CONFIG = {
  name: "EduBot",
  typingDelay: 1500,
  maxMessageLength: 500
};

export default {
  INITIAL_MESSAGES,
  QUICK_ACTIONS,
  BOT_CONFIG
};