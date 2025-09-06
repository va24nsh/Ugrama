// services/chatbotService.js
import { getChatResponse } from '../utils/chatResponses';

class ChatbotService {
  constructor() {
    this.conversationHistory = [];
    this.userContext = null;
  }

  async getBotResponse(userMessage, userContext = null) {
    try {
      this.userContext = userContext;
      this.conversationHistory.push({
        role: 'user',
        message: userMessage,
        timestamp: new Date()
      });

      // Use local mock responses for UI testing
      const response = await this.getLocalResponse(userMessage);
      
      this.conversationHistory.push({
        role: 'bot',
        message: response,
        timestamp: new Date()
      });

      return response;
    } catch (error) {
      console.error('Error getting bot response:', error);
      return "I'm sorry, I'm having trouble right now. Please try again in a moment.";
    }
  }

  async getLocalResponse(userMessage) {
    // Simulate API delay for realistic UI testing
    await new Promise(resolve => setTimeout(resolve, 800));
    return getChatResponse(userMessage, this.userContext);
  }

  setUserContext(context) {
    this.userContext = context;
  }

  clearConversation() {
    this.conversationHistory = [];
  }

  getConversationHistory() {
    return this.conversationHistory;
  }
}

export const chatbotService = new ChatbotService();