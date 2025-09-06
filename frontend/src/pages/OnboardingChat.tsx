import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
}

const QUESTIONS = [
  "Hi there! 🎉 I'm excited to help you find the perfect courses. What subject or skill are you most passionate about learning?",
  "That's awesome! 🚀 What's your current experience level with this topic? (Beginner, Intermediate, or Advanced)",
  "Perfect! How much time can you dedicate to learning each week? This helps me recommend the right pace for you.",
  "Great! Are you looking to learn for personal growth, career advancement, or academic purposes?",
  "Wonderful! One last question - do you prefer structured learning with deadlines or flexible self-paced learning?"
];

const MOTIVATIONAL_QUOTES = [
  "The beautiful thing about learning is that no one can take it away from you. - B.B. King",
  "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
  "Live as if you were to die tomorrow. Learn as if you were to live forever. - Mahatma Gandhi",
  "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice. - Brian Herbert"
];

const OnboardingChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Add initial bot message and motivational quote
  useEffect(() => {
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    
    setTimeout(() => {
      setMessages([
        {
          id: "quote",
          text: `✨ ${randomQuote}`,
          sender: "bot",
          timestamp: new Date(),
        }
      ]);
    }, 500);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: "welcome",
        text: QUESTIONS[0],
        sender: "bot",
        timestamp: new Date(),
      }]);
    }, 1500);
  }, []);

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentInput,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setUserResponses(prev => [...prev, currentInput]);
    setCurrentInput("");
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      setIsTyping(false);
      
      if (currentQuestionIndex < QUESTIONS.length - 1) {
        const nextQuestion = QUESTIONS[currentQuestionIndex + 1];
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: nextQuestion,
          sender: "bot",
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botMessage]);
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Conversation complete
        const finalMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Perfect! Based on your responses, I've found some amazing courses that match your interests and goals. Let me show you what I've curated just for you! 🎯",
          sender: "bot",
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, finalMessage]);
        
        // Store user preferences
        localStorage.setItem("ugram_preferences", JSON.stringify(userResponses));
        
        setTimeout(() => {
          navigate("/recommendations");
        }, 2000);
      }
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b-4 border-foreground p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-black text-foreground">AI Learning Assistant</h1>
          <p className="text-muted-foreground">Let's find your perfect courses!</p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 flex flex-col">
        {/* Messages */}
        <div className="flex-1 space-y-4 mb-6 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg border-2 border-foreground ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground shadow-brutal"
                    : message.id === "quote"
                    ? "bg-ugram-yellow text-foreground font-medium italic"
                    : "bg-card text-card-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <span className="text-xs opacity-70 mt-2 block">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-card border-2 border-foreground p-4 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        {currentQuestionIndex < QUESTIONS.length && (
          <div className="bg-card border-4 border-foreground rounded-lg p-4 shadow-brutal">
            <div className="flex gap-3">
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your response here..."
                className="flex-1 border-2 border-foreground"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                variant="brutal"
                disabled={!currentInput.trim() || isTyping}
              >
                Send 📤
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingChat;