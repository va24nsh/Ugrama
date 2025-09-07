import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [userType, setUserType] = useState<"student" | "educator" | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
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

    // Simulate API call
    const user = await fetch(
      "http://localhost:5000/api/v1/user/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: userType,
        }),
        credentials: "include",
      }
    );
    const userData = await user.json();

    localStorage.setItem("accessToken", JSON.stringify(userData.data.accessToken));

    toast({
      title: "Welcome to Ugram!",
      description: "Your account has been created successfully",
    });

    // Navigate based on user type
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Role Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">I am a...</Label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setUserType("student")}
            className={`flex-1 p-3 border-2 rounded-lg font-medium transition-all ${
              userType === "student"
                ? "border-primary bg-primary text-primary-foreground shadow-brutal"
                : "border-muted bg-muted hover:border-primary"
            }`}
          >
            🎓 Student
          </button>
          <button
            type="button"
            onClick={() => setUserType("educator")}
            className={`flex-1 p-3 border-2 rounded-lg font-medium transition-all ${
              userType === "educator"
                ? "border-primary bg-primary text-primary-foreground shadow-brutal"
                : "border-muted bg-muted hover:border-primary"
            }`}
          >
            👨‍🏫 Educator
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            required
            className="border-2 border-foreground"
          />
        </div>

        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName : e.target.value }))}
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
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        variant="brutal" 
        size="lg" 
        className="w-full"
      >
        Create Account
      </Button>

      {/* Google Sign-up */}
      <Button 
        type="button"
        variant="outline"
        size="lg"
        className="w-full border-2 border-foreground"
        onClick={handleGoogleSignup}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </Button>

      {/* Login Link */}
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
    </form>
  );
};