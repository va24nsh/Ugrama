import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Variants } from "framer-motion"; // Add this import


export const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

const fadeInUp: Variants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 1,
      ease: "easeOut"
    }
  }
};

const staggerChildren: Variants = {
  initial: {}, // Add initial state
  animate: {
    transition: {
      delayChildren: 0.5,
      staggerChildren: 0.4
    }
  }
};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate login - in real app, this would be an API call
    const user = await fetch("http://localhost:5000/api/V1/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      }),
      credentials: "include"
    });
    const userData = await user.json();

    localStorage.setItem("accessToken", JSON.stringify(userData.data.accessToken));

    toast({
      title: "Welcome back!",
      description: "You've been successfully logged in",
    });

    navigate("/dashboard");
  };

  const handleGoogleLogin = () => {
    toast({
      title: "Google Sign-in",
      description: "Google OAuth integration would be implemented here",
    });
  };

  const handleForgotPassword = () => {
    toast({
      title: "Password Reset",
      description: "Password reset link would be sent to your email",
    });
  };
  const handleSignIn = () => {
    try{
      const res = fetch("http://localhost:5000/api/V1/user/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      navigate("/dashboard");
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in",
      });
    }catch(error){
      console.error("Sign-in error:", error);
      toast({
        title: "Sign-in Failed",
        description: "An error occurred during sign-in. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={staggerChildren}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div 
        variants={fadeInUp}
        className="space-y-4"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center mb-6">Welcome Back!</h2>
        </motion.div>

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
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            required
            className="border-2 border-foreground"
          />
        </div>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Button 
          type="submit" 
          variant="brutal" 
          size="lg" 
          className="w-full"
          onClick={handleSignIn}
        >
          Sign In
        </Button>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Button 
          type="button"
          variant="outline"
          size="lg"
          className="w-full border-2 border-foreground"
          onClick={handleGoogleLogin}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            {/* ... Google SVG paths ... */}
          </svg>
          Continue with Google
        </Button>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-primary font-semibold hover:underline"
          >
            Sign up here
          </button>
        </p>
      </motion.div>
    </motion.form>
  );
};