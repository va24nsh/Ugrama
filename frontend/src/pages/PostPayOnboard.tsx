import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PostPaymentChat } from "@/components/postPaymentChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const PostPaymentOnboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showChat, setShowChat] = useState(false);

  // Get course details from state or localStorage
  const courseName =
    location.state?.courseName ||
    localStorage.getItem("purchased_course_name") ||
    "Full-Stack Web Development Mastery";

  const coursePrice =
    location.state?.coursePrice ||
    localStorage.getItem("course_price") ||
    "199";

  // Show initial success animation, then proceed to chat
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChat(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleChatComplete = () => {
    // Store completion status
    localStorage.setItem("onboarding_completed", "true");
    localStorage.setItem("course_enrolled", "true");

    // Navigate to course module
    navigate("/course-module");
  };

  const handleSkipToCourse = () => {
    localStorage.setItem("course_enrolled", "true");
    navigate("/course-module");
  };

  if (!showChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <Card className="border-4 border-foreground shadow-brutal max-w-md">
            <CardContent className="p-8 text-center space-y-6">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              </motion.div>

              <div>
                <h1 className="text-2xl font-black text-foreground mb-2">
                  Payment Successful! 🎉
                </h1>
                <p className="text-muted-foreground">Welcome to {courseName}</p>
              </div>

              <div className="bg-green-100 p-4 rounded-lg border-2 border-foreground">
                <div className="flex items-center justify-between text-sm">
                  <span>Amount Paid:</span>
                  <span className="font-bold text-green-600">
                    ${coursePrice}
                  </span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                  Setting up your learning experience...
                </div>
                <div className="w-full bg-muted h-2 rounded-full border-2 border-foreground">
                  <motion.div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.5 }}
                  />
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <PostPaymentChat courseName={courseName} onComplete={handleChatComplete} />
  );
};

export default PostPaymentOnboarding;
