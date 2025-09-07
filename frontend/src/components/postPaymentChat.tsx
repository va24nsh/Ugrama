import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Bot,
  User,
  BookOpen,
  Target,
  Calendar,
  Trophy,
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  Music,
  Coffee,
  Moon,
  Sun,
  Brain,
  Sparkles,
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: "bot" | "user";
  content: string;
  timestamp: Date;
  options?: string[];
  isTyping?: boolean;
  component?: React.ReactNode;
}

interface StudyVibeProfile {
  user_id: string;
  vibe_tag: string;
  parameters: {
    sound: string;
    rhythm: string;
    time: string;
  };
  description: string;
  recommendations: string[];
}

interface PostPaymentChatProps {
  courseName: string;
  onComplete: () => void;
}

export const PostPaymentChat: React.FC<PostPaymentChatProps> = ({
  courseName,
  onComplete,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userResponses, setUserResponses] = useState<Record<string, string>>(
    {}
  );
  const [studyVibeProfile, setStudyVibeProfile] =
    useState<StudyVibeProfile | null>(null);
  const [isLoadingVibe, setIsLoadingVibe] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const chatSteps = [
    {
      id: "welcome",
      message: `🎉 Congratulations! Welcome to "${courseName}"! I'm your learning assistant and I'm here to help you get the most out of your course.`,
      options: ["Let's get started!", "Tell me more about the course"],
    },
    {
      id: "course_overview",
      message:
        "Great! Let me give you a quick overview of what you can expect:\n\n📚 48 comprehensive lessons\n🎯 Hands-on projects\n👥 Community access\n📜 Certificate upon completion\n🎤 1-on-1 mentorship sessions\n\nWhat interests you most?",
      options: [
        "The projects",
        "Community features",
        "Mentorship sessions",
        "Everything!",
      ],
    },
    {
      id: "learning_goals",
      message:
        "Excellent! Setting clear goals helps you stay motivated. What do you hope to achieve by completing this course?",
      options: [
        "Get a new job in tech",
        "Advance in my current role",
        "Start a side project",
        "Learn for personal growth",
      ],
    },
    {
      id: "study_vibe_intro",
      message:
        "That's a fantastic goal! 🎯 Now, let's personalize your learning experience. I'd like to understand your study preferences to create the perfect learning environment for you.\n\nCould you describe how you like to study? For example, when do you prefer to study, what kind of environment helps you focus, and how do you like to structure your learning sessions?",
      options: [
        "I'm a night owl who likes music while studying",
        "I prefer quiet morning sessions with long focus periods",
        "I like afternoon study with breaks and ambient sounds",
        "Let me type my own description",
      ],
    },
    {
      id: "study_vibe_processing",
      message:
        "Perfect! Let me analyze your study preferences and create a personalized learning profile for you...",
      options: [],
    },
    {
      id: "features_intro",
      message:
        "Awesome! Based on your preferences, here are some key features you should know about:\n\n🔥 **Smart Doubt System**: Bookmark questions at specific video timestamps\n🎥 **Video Conferencing**: Study with peers in virtual rooms\n📝 **Note Taking**: Integrated note-taking with auto-save\n⏲️ **Pomodoro Timer**: Built-in focus sessions\n🏆 **Progress Tracking**: See your learning journey\n\nReady to explore your course?",
      options: ["Yes, let's go!", "Tell me about study groups"],
    },
    {
      id: "study_groups",
      message:
        "Study groups are amazing for learning! 👥 You can:\n\n• Join virtual study rooms with other students\n• Start video calls while watching lectures\n• Chat in real-time during sessions\n• Share notes and doubts\n• Form accountability partnerships\n\nI highly recommend trying the study features once you're comfortable with the basics!",
      options: ["Sounds great!", "I prefer studying alone for now"],
    },
    {
      id: "final_tips",
      message:
        "Here are my top tips for success in this course:\n\n✅ **Start with Lesson 1** - Don't skip the fundamentals\n✅ **Take notes actively** - Use the built-in note feature\n✅ **Mark your doubts** - Use timestamps to remember questions\n✅ **Practice consistently** - Little and often beats cramming\n✅ **Join the community** - Connect with fellow learners\n✅ **Use the Pomodoro timer** - 25-minute focused sessions work wonders\n\nAre you ready to begin your learning journey?",
      options: ["Yes, take me to my course!", "I have a question first"],
    },
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize chat with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: "1",
      type: "bot",
      content: chatSteps[0].message,
      timestamp: new Date(),
      options: chatSteps[0].options,
    };

    setTimeout(() => {
      setMessages([welcomeMessage]);
    }, 500);
  }, []);

  // Function to call the study vibe API
  const getStudyVibeProfile = async (description: string) => {
    setIsLoadingVibe(true);
    try {
      const response = await fetch(
        "http://localhost:8001/get-study-vibe-profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: "user_" + Date.now(),
            description: description,
          }),
        }
      );

      if (response.ok) {
        const vibeProfile: StudyVibeProfile = await response.json();
        setStudyVibeProfile(vibeProfile);

        // Store in localStorage for CourseModule
        localStorage.setItem("user_study_vibe", JSON.stringify(vibeProfile));

        return vibeProfile;
      } else {
        console.error("Failed to get study vibe profile");
        return null;
      }
    } catch (error) {
      console.error("Error calling study vibe API:", error);
      return null;
    } finally {
      setIsLoadingVibe(false);
    }
  };

  // Component for displaying study vibe profile
  const StudyVibeDisplay: React.FC<{ profile: StudyVibeProfile }> = ({
    profile,
  }) => {
    const getVibeIcon = (vibeTag: string) => {
      if (vibeTag.includes("night")) return <Moon className="h-5 w-5" />;
      if (vibeTag.includes("morning")) return <Sun className="h-5 w-5" />;
      if (vibeTag.includes("lofi") || vibeTag.includes("music"))
        return <Music className="h-5 w-5" />;
      return <Brain className="h-5 w-5" />;
    };

    const getVibeColor = (vibeTag: string) => {
      if (vibeTag.includes("night")) return "bg-purple-100 border-purple-300";
      if (vibeTag.includes("morning")) return "bg-yellow-100 border-yellow-300";
      if (vibeTag.includes("lofi")) return "bg-blue-100 border-blue-300";
      return "bg-green-100 border-green-300";
    };

    return (
      <div
        className={`p-4 rounded-lg border-2 ${getVibeColor(
          profile.vibe_tag
        )} space-y-3`}
      >
        <div className="flex items-center gap-2">
          {getVibeIcon(profile.vibe_tag)}
          <h3 className="font-bold text-lg">Your Study Vibe Profile</h3>
        </div>

        <p className="text-sm text-muted-foreground">{profile.description}</p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            🎵 {profile.parameters.sound}
          </Badge>
          <Badge variant="outline" className="text-xs">
            ⏰ {profile.parameters.rhythm}
          </Badge>
          <Badge variant="outline" className="text-xs">
            🕒 {profile.parameters.time}
          </Badge>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-sm">
            📋 Personalized Recommendations:
          </h4>
          <div className="space-y-1">
            {profile.recommendations.slice(0, 4).map((rec, index) => (
              <div
                key={index}
                className="text-xs bg-white/70 p-2 rounded border"
              >
                {rec}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const addMessage = (
    content: string,
    type: "bot" | "user",
    options?: string[],
    component?: React.ReactNode
  ) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      options,
      component,
    };

    if (type === "user") {
      setMessages((prev) => [...prev, newMessage]);
      handleUserResponse(content);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, newMessage]);
        setIsTyping(false);
      }, 1000 + Math.random() * 1000);
    }
  };

  const handleUserResponse = async (response: string) => {
    const stepKey = chatSteps[currentStep]?.id;
    if (stepKey) {
      setUserResponses((prev) => ({ ...prev, [stepKey]: response }));
    }

    // Special handling for study vibe step
    if (currentStep === 3) {
      // study_vibe_intro step
      let studyDescription = response;

      if (response === "Let me type my own description") {
        // Wait for user to type their own description
        return;
      }

      // Move to processing step
      setCurrentStep(4);
      setTimeout(() => {
        addMessage(chatSteps[4].message, "bot");

        // Process the study vibe
        setTimeout(async () => {
          const vibeProfile = await getStudyVibeProfile(studyDescription);

          if (vibeProfile) {
            addMessage(
              "🎉 Your personalized study profile is ready! Here's what I've learned about your learning style:",
              "bot",
              [
                "This looks perfect!",
                "Tell me more about these recommendations",
              ],
              <StudyVibeDisplay profile={vibeProfile} />
            );
          } else {
            addMessage(
              "I've created a basic study profile for you. Don't worry - you can always adjust your preferences later in the course!",
              "bot",
              ["That's fine!", "Let's continue"]
            );
          }
        }, 2000);
      }, 1500);
      return;
    }

    // Handle study vibe processing responses
    if (currentStep === 4) {
      setCurrentStep(5);
      setTimeout(() => {
        addMessage(chatSteps[5].message, "bot", chatSteps[5].options);
      }, 1500);
      return;
    }

    // Move to next step for other cases
    const nextStep = currentStep + 1;

    if (nextStep < chatSteps.length) {
      setCurrentStep(nextStep);

      // Special handling for specific responses
      if (currentStep === 5 && response === "Tell me about study groups") {
        setTimeout(() => {
          addMessage(chatSteps[6].message, "bot", chatSteps[6].options);
        }, 1500);
        return;
      } else if (currentStep === 6) {
        setTimeout(() => {
          addMessage(chatSteps[7].message, "bot", chatSteps[7].options);
        }, 1500);
        return;
      }

      // Normal flow
      if (nextStep < chatSteps.length) {
        setTimeout(() => {
          addMessage(
            chatSteps[nextStep].message,
            "bot",
            chatSteps[nextStep].options
          );
        }, 1500);
      }
    } else {
      // Chat completed
      if (
        response === "Yes, take me to my course!" ||
        response === "Sounds great!" ||
        response === "Yes, let's go!" ||
        response === "This looks perfect!" ||
        response === "That's fine!" ||
        response === "Let's continue"
      ) {
        setTimeout(() => {
          const finalMessage = studyVibeProfile
            ? `🚀 Perfect! You're all set up for success with your personalized ${studyVibeProfile.vibe_tag.replace(
                /_/g,
                " "
              )} study profile. Taking you to your course now...\n\nRemember, learning is a journey - enjoy every step! 💫`
            : "🚀 Perfect! You're all set up for success. Taking you to your course now...\n\nRemember, learning is a journey - enjoy every step! 💫";

          addMessage(finalMessage, "bot");

          setTimeout(() => {
            onComplete();
          }, 2000);
        }, 1000);
      } else {
        setTimeout(() => {
          addMessage(
            "No problem! You can always reach out to our support team or use the help features within the course. For now, let's get you started!\n\nTaking you to your course... 🎓",
            "bot"
          );

          setTimeout(() => {
            onComplete();
          }, 2000);
        }, 1000);
      }
    }
  };

  const handleOptionClick = (option: string) => {
    addMessage(option, "user");
  };

  const handleInputSubmit = () => {
    if (currentInput.trim()) {
      addMessage(currentInput, "user");
      setCurrentInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInputSubmit();
    }
  };

  const getProgressPercentage = () => {
    return Math.min(((currentStep + 1) / chatSteps.length) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="border-4 border-foreground shadow-brutal mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-purple-600" />
                AI Learning Assistant
                {isLoadingVibe && <Sparkles className="h-4 w-4 animate-spin" />}
              </span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                ~3 minutes
              </div>
            </CardTitle>
            {/* Progress Bar */}
            <div className="w-full bg-muted h-2 rounded-full border-2 border-foreground">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {chatSteps.length} • Creating your
              personalized learning experience
            </p>
          </CardHeader>
        </Card>

        {/* Chat Interface */}
        <Card className="border-4 border-foreground shadow-brutal">
          <CardContent className="p-0">
            <ScrollArea className="h-96 p-6" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.type === "bot" && (
                      <Avatar className="border-2 border-foreground">
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`max-w-md p-4 rounded-lg border-2 border-foreground shadow-brutal ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card"
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>

                      {/* Custom Component Display */}
                      {message.component && (
                        <div className="mt-3">{message.component}</div>
                      )}

                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>

                      {/* Quick Reply Options */}
                      {message.options &&
                        message.type === "bot" &&
                        message.options.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {message.options.map((option, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleOptionClick(option)}
                                className="w-full text-left justify-start border-2 border-foreground hover:bg-primary hover:text-primary-foreground"
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        )}
                    </div>

                    {message.type === "user" && (
                      <Avatar className="border-2 border-foreground">
                        <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {(isTyping || isLoadingVibe) && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="border-2 border-foreground">
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-card p-4 rounded-lg border-2 border-foreground shadow-brutal">
                      <div className="flex gap-1 items-center">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                        {isLoadingVibe && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            Analyzing your study preferences...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t-2 border-foreground bg-muted/50">
              <div className="flex gap-2">
                <Input
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    currentStep === 3 &&
                    userResponses["study_vibe_intro"] ===
                      "Let me type my own description"
                      ? "Describe your ideal study environment, time preferences, and habits..."
                      : "Type your message or use the quick replies above..."
                  }
                  className="border-2 border-foreground"
                  disabled={isLoadingVibe}
                />
                <Button
                  onClick={handleInputSubmit}
                  variant="brutal"
                  size="sm"
                  className="bg-primary text-primary-foreground"
                  disabled={!currentInput.trim() || isLoadingVibe}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={onComplete}
            className="border-2 border-foreground"
            disabled={isLoadingVibe}
          >
            Skip Setup & Go to Course
          </Button>
        </div>

        {/* Study Vibe Summary (if available) */}
        {studyVibeProfile && (
          <Card className="mt-6 border-4 border-foreground shadow-brutal">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Brain className="h-5 w-5" />
                Your Study Profile Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Profile saved and will be applied to your course experience! You
                can always adjust these preferences later.
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
