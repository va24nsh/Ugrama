import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Variants } from "framer-motion"; // Add this import


export const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [userType, setUserType] = useState<"student" | "educator" | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

const fadeInUp: Variants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0
  }
};

const staggerChildren: Variants = {
  initial: {},
  animate: {
    transition: {
      delayChildren: 0.5,
      staggerChildren: 0.4
    }
  }
};
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userType) {
      toast({
        title: "Please select your role",
        description: "Choose whether you're a student or educator",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are identical",
        variant: "destructive",
      });
      return;
    }

    const user = {
      id: Math.random(),
      name: formData.name,
      email: formData.email,
      user_type: userType,
    };
    
    localStorage.setItem("EdVerse_user", JSON.stringify(user));
    
    toast({
      title: "Welcome to EdVerse!",
      description: "Your account has been created successfully",
    });

    if (userType === "student") {
      navigate("/onboarding-chat");
    } else {
      navigate("/dashboard");
    }
  };

  const handleGoogleSignup = () => {
    toast({
      title: "Google Sign-up",
      description: "Google OAuth integration would be implemented here",
    });
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      variants={staggerChildren}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <div className="space-y-3">
        <motion.div variants={fadeInUp}
        transition={{ duration: 1, ease: "easeOut" }} className="space-y-3">
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0, duration: 0.5 }}
  >
    <Label className="text-sm font-semibold">I am a...</Label>
  </motion.div>
  <div className="flex gap-3">
    <motion.button
      type="button"
      onClick={() => setUserType("student")}
      className={`flex-1 p-3 border-2 rounded-lg font-medium transition-all ${
        userType === "student"
          ? "border-primary bg-primary text-primary-foreground shadow-brutal"
          : "border-muted bg-muted hover:border-primary"
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      🎓 Student
    </motion.button>
    <motion.button
      type="button"
      onClick={() => setUserType("educator")}
      className={`flex-1 p-3 border-2 rounded-lg font-medium transition-all ${
        userType === "educator"
          ? "border-primary bg-primary text-primary-foreground shadow-brutal"
          : "border-muted bg-muted hover:border-primary"
      }`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      👨‍🏫 Educator
    </motion.button>
  </div>
</motion.div>
      </div>

      <motion.div variants={fadeInUp} transition={{ duration: 1, ease: "easeOut" }}
      className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
            className="border-2 border-foreground"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
            className="border-2 border-foreground"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            required
            className="border-2 border-foreground"
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            required
            className="border-2 border-foreground"
          />
        </div>
      </motion.div>

      <motion.div variants={fadeInUp}
      transition={{ duration: 1, ease: "easeOut" }} >
        <Button 
          type="submit" 
          variant="brutal" 
          size="lg" 
          className="w-full"
        >
          Create Account
        </Button>
      </motion.div>

      <motion.div variants={fadeInUp}
      transition={{ duration: 1, ease: "easeOut" }}>
        <Button 
          type="button"
          variant="outline"
          size="lg"
          className="w-full border-2 border-foreground"
          onClick={handleGoogleSignup}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </Button>
      </motion.div>

      <motion.div variants={fadeInUp}
      transition={{ duration: 1, ease: "easeOut" }}>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-primary font-semibold hover:underline"
          >
            Sign in here
          </button>
        </p>
      </motion.div>
    </motion.form>
  );
};