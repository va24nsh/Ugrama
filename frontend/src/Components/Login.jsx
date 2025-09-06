import React, { useState } from "react";
import { Mail, Lock, User } from "lucide-react";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("Children"); // default role

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-r from-[rgba(234,237,237,1)] to-[rgba(31,119,180,0.70)] px-4">
      <div className="fade-in bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md">
        {/* Toggle Heading */}
        {isLogin ? (
          <>
            <h2 className="text-2xl font-bold text-center">Log in to your account</h2>
            <p className="text-gray-600 text-center mt-2">
              Enter your email address and password to log in
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center">Sign up to create an account</h2>
            <p className="text-gray-600 text-center mt-2">
              Enter your details to create a new account
            </p>
          </>
        )}

        {/* Role Selector */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            type="button"
            className={`px-4 py-2 rounded-xl border ${
              role === "Children"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700"
            }`}
            onClick={() => setRole("Children")}
          >
            Children
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-xl border ${
              role === "Educator"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700"
            }`}
            onClick={() => setRole("Educator")}
          >
            Educator
          </button>
        </div>

        {/* Forms */}
        {isLogin ? (
          <form className="mt-6">
            {/* Email */}
            <div className="relative mb-4">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Email address"
                className="w-full pl-10 p-3 bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Password */}
            <div className="relative mb-4">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 p-3 bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <a href="#" className="text-sm text-blue-600 font-medium block text-right">
              Forgot password?
            </a>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-2xl mt-4 shadow-md hover:bg-blue-700 transition"
            >
              Login as {role}
            </button>

            <div className="text-center my-4 text-gray-500">or</div>

            {/* Google Button */}
            <button
              type="button"
              className="w-full border p-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100"
            >
              <span className="text-xl font-bold">G</span> Continue with Google
            </button>

            {/* Switch to signup */}
            <p className="text-sm text-center mt-6">
              Don’t have an account?{" "}
              <button
                type="button"
                className="text-blue-600 font-medium"
                onClick={() => setIsLogin(false)}
              >
                SIGN UP
              </button>
            </p>
          </form>
        ) : (
          <form className="mt-6">
            {/* Full Name */}
            <div className="relative mb-4">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full pl-10 p-3 bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Email */}
            <div className="relative mb-4">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Email address"
                className="w-full pl-10 p-3 bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Password */}
            <div className="relative mb-6">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 p-3 bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-2xl shadow-md hover:bg-blue-700 transition"
            >
              Sign Up as {role}
            </button>

            {/* Switch to login */}
            <p className="text-sm text-center mt-6">
              Already have an account?{" "}
              <button
                type="button"
                className="text-blue-600 font-medium"
                onClick={() => setIsLogin(true)}
              >
                LOGIN
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
