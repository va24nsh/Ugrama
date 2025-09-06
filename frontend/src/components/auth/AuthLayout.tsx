import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-foreground mb-2">EdVerse</h1>
          <p className="text-sm text-muted-foreground">Rule your Learning journey</p>
        </div>

        {/* Auth Card */}
        <div className="bg-card border-4 border-foreground shadow-brutal-lg p-8 rounded-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground mt-2">{subtitle}</p>
            )}
          </div>
          
          {children}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-ugram-yellow rounded-full opacity-60 animate-float" />
        <div className="absolute bottom-10 right-10 w-12 h-12 bg-ugram-pink rounded-lg opacity-60 animate-pulse-slow" />
        <div className="absolute top-1/2 left-5 w-8 h-8 bg-ugram-blue rounded-full opacity-40" />
      </div>
    </div>
  );
};