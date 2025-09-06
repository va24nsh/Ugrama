  // utils/chatResponses.js

  export const getChatResponse = (userMessage, userContext) => {
    // Handle undefined parameters
    if (!userMessage) {
      return "I didn't receive your message. Could you please try again?";
    }

    const message = userMessage.toLowerCase().trim();

    // Course-related responses
    if (message.includes('course') || message.includes('recommend')) {
      return "I can help you find courses! Based on your interests, I'd recommend our top-rated courses in Web Development, Data Science, or Digital Marketing. Which field interests you most?";
    }

    // Registration help
    if (message.includes('register') || message.includes('sign up')) {
      return "Registration is simple! You can sign up as either a Student or Educator. Students can browse and enroll in courses, while Educators can create and manage their own courses. Would you like help with creating an account?";
    }

    // Payment help
    if (message.includes('payment') || message.includes('price') || message.includes('cost')) {
      return "We offer flexible pricing! Most courses range from $29-$199. We also have a subscription model at $39/month for unlimited access. Our payment system supports all major cards and PayPal. Having any payment issues?";
    }

    // Educators
    if (message.includes('educator') || message.includes('teacher') || message.includes('instructor')) {
      return "Looking for educators? Our platform has verified instructors across various subjects. You can filter by rating, experience, price range, and availability. What subject are you interested in learning?";
    }

    // Platform features
    if (message.includes('feature') || message.includes('platform') || message.includes('app')) {
      return "Our platform offers video lessons, interactive quizzes, progress tracking, certificates, and direct messaging with instructors. It's fully mobile-responsive and works great on any device!";
    }

    // Greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! Welcome to our education platform. I'm here to help you with anything related to courses, registration, payments, or finding the perfect learning experience. What can I help you with today?";
    }

    // Help requests
    if (message.includes('help') || message.includes('support')) {
      return "I'm here to help! I can assist you with course recommendations, registration, payments, finding educators, or navigating the platform. What specific help do you need?";
    }

    // Context-aware responses (if userContext is provided)
    if (userContext) {
      if (userContext.userType === 'student') {
        return "As a student, you have access to all enrolled courses and progress tracking. " + getDefaultResponse();
      }
      if (userContext.userType === 'educator') {
        return "As an educator, you can manage your courses and view student analytics. " + getDefaultResponse();
      }
    }

    // Default response
    return getDefaultResponse();
  };

  // Helper function for default response
  const getDefaultResponse = () => {
    return "Thanks for your message! I can help you with course recommendations, registration, payments, finding educators, or any other platform questions. What would you like to know more about?";
  };

  export default getChatResponse;