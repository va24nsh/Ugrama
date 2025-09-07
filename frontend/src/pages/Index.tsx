import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import { BiMessageRoundedCheck } from "react-icons/bi";

const Index = () => {
  const navigate = useNavigate();

  const fadeInUp: Variants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
  };

  const staggerChildren: Variants = {
    initial: {},
    animate: {
      transition: {
        delayChildren: 0.5,
        staggerChildren: 0.4,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <header className="absolute top-0 right-0 p-6 z-10 bg-white w-full flex justify-between items-center border-b-4 border-foreground h-[67px]">
        <h2 className="text-2xl font-bold font-">EdVerse</h2>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-black px-6 py-2 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer font-medium"
            style={{ borderWidth: "3px" }}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-white text-black px-6 py-2 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer font-medium"
            style={{ borderWidth: "3px" }}
          >
            Signup
          </button>
        </div>
      </header>
      // Replace the existing eclipse section with this responsive version
      <div className="relative w-full h-[400px] sm:h-[400px] md:h-[500px] flex items-center justify-center mt-20">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative w-full max-w-[1200px] px-4"
        >
          {/* Mobile View */}
          <div className="block sm:hidden">
            <svg
              viewBox="0 0 500 400"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[130%] h-auto"
            >
              <motion.path
                d="M 100 200 C 100 100, 400 100, 400 200 C 400 300, 100 300, 100 200"
                fill="none"
                stroke="black"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </svg>
          </div>

          {/* Desktop View */}
          <div className="hidden sm:block">
            <svg
              viewBox="0 0 1200 700"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] md:w-[130%] h-auto"
            >
              <motion.path
                d="M 150 350 C 150 175, 1050 175, 1050 350 C 1050 525, 150 525, 150 350"
                fill="none"
                stroke="black"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </svg>
          </div>

          <motion.div
            className="relative z-10 text-center px-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-foreground mb-2 sm:mb-4">
              EdVerse
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-2">
              Rule your Learning journey
            </p>
            <p className="text-xs sm:text-sm text-purple-600 font-medium">
              Personalized AI powered education
            </p>
          </motion.div>

          {/* Mobile Floating Elements */}
          <div className="block sm:hidden">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -top-[30px] -right-[-40px] transform rotate-12"
            >
              <div className="bg-[#FFD7B5] text-black px-3 py-1.5 text-sm font-bold rounded-xl border-2 border-black shadow-brutal">
                Read
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute bottom-[100px] left-[55px] transform -rotate-12"
            >
              <div className="bg-[#B5FFD7] text-black px-3 py-1.5 text-sm font-bold rounded-xl border-2 border-black shadow-brutal">
                Learn
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="absolute top-[80px] -right-[-30px] transform rotate-6"
            >
              <div className="bg-[#FFB5D7] text-black px-3 py-1.5 text-sm font-bold rounded-xl border-2 border-black shadow-brutal">
                Rule
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.6, duration: 0.5 }}
              className="absolute bottom-[-30px] right-[300px] transform rotate-6"
            >
              <div className="bg-[#B5D7FF] text-black px-3 py-1.5 text-sm font-bold rounded-xl border-2 border-black shadow-brutal">
                AI
              </div>
            </motion.div>
          </div>

          {/* Desktop Floating Elements */}
          <div className="hidden sm:block">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -top-[60px] -right-[-80px] transform rotate-12"
            >
              <div className="bg-[#FFD7B5] text-black px-4 py-2 font-bold rounded-xl border-2 border-black shadow-brutal">
                Read
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute bottom-[-30px] -left-[-30 px] transform -rotate-12"
            >
              <div className="bg-[#B5FFD7] text-black px-4 py-2 font-bold rounded-xl border-2 border-black shadow-brutal">
                Learn
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="absolute top-[-60px] -right-[-1050px] transform rotate-6"
            >
              <div className="bg-[#FFB5D7] text-black px-4 py-2 font-bold rounded-xl border-2 border-black shadow-brutal">
                Rule
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.6, duration: 0.5 }}
              className="absolute -bottom-[80px] right-[170px] transform rotate-6"
            >
              <div className="bg-[#B5D7FF] text-black px-4 py-2 font-bold rounded-xl border-2 border-black shadow-brutal">
                AI
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 2.2,
          duration: 0.8,
          ease: "easeOut",
        }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 "
      >
        <Button
          variant="brutal"
          size="lg"
          onClick={() => navigate("/signup")}
          className="bg-white text-black px-8 py-4  rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer font-medium"
          style={{ borderWidth: "3px" }}
        >
          Start Learning Today
        </Button>
      </motion.div>
      <div className="relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-1 mb-20 text-center">
          <motion.div
            variants={staggerChildren}
            initial="initial"
            animate="animate"
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-20"
          >
            {[
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="66"
                    height="66"
                    viewBox="0 0 66 66"
                    fill="none"
                  >
                    <path
                      d="M56.9607 22.352L56.2842 23.9085C56.1785 24.162 56.0002 24.3785 55.7716 24.5308C55.5431 24.6831 55.2746 24.7643 55 24.7643C54.7254 24.7643 54.4569 24.6831 54.2284 24.5308C53.9998 24.3785 53.8215 24.162 53.7158 23.9085L53.0393 22.352C51.8498 19.5985 49.6715 17.3908 46.9342 16.1645L44.847 15.2323C44.5938 15.1158 44.3793 14.9292 44.2289 14.6945C44.0785 14.4598 43.9986 14.1869 43.9986 13.9082C43.9986 13.6294 44.0785 13.3566 44.2289 13.1219C44.3793 12.8872 44.5938 12.7005 44.847 12.584L46.8187 11.7068C49.6249 10.4456 51.8404 8.15622 53.009 5.31029L53.7048 3.63004C53.8069 3.36977 53.9852 3.14631 54.2162 2.98881C54.4473 2.83131 54.7204 2.74707 55 2.74707C55.2796 2.74707 55.5527 2.83131 55.7838 2.98881C56.0148 3.14631 56.1931 3.36977 56.2952 3.63004L56.991 5.30754C58.1584 8.154 60.3729 10.4444 63.1785 11.7068L65.153 12.5868C65.4055 12.7036 65.6192 12.8902 65.769 13.1246C65.9188 13.359 65.9984 13.6314 65.9984 13.9095C65.9984 14.1877 65.9188 14.4601 65.769 14.6945C65.6192 14.9289 65.4055 15.1155 65.153 15.2323L63.063 16.1618C60.3262 17.3893 58.1489 19.598 56.9607 22.352ZM27.5 8.25004H38.5V13.75H27.5C23.1239 13.75 18.9271 15.4884 15.8327 18.5828C12.7384 21.6771 11 25.874 11 30.25C11 40.1775 17.7705 46.6565 33 53.57V46.75H38.5C42.8761 46.75 47.0729 45.0117 50.1673 41.9173C53.2616 38.823 55 34.6261 55 30.25H60.5C60.5 36.0848 58.1822 41.6806 54.0564 45.8064C49.9305 49.9322 44.3348 52.25 38.5 52.25V61.875C24.75 56.375 5.5 48.125 5.5 30.25C5.5 24.4153 7.81785 18.8195 11.9437 14.6937C16.0695 10.5679 21.6652 8.25004 27.5 8.25004Z"
                      fill="currentColor"
                    />
                  </svg>
                ),
                title: "Personalized learning",
                description:
                  "Get personalized recommendations based on your interests and learning style.",
                gradientClass: "bg-gradient-to-b from-[#87CEFA] to-white",
              },
              {
                icon: "👥",
                title: "Study Groups",
                description:
                  "Join virtual study rooms with peers who share your interests and goals.",
                gradientClass: "bg-gradient-to-b from-[#CBE8A6] to-white",
              },
              {
                icon: "🎯",
                title: "Expert Educators",
                description:
                  "Learn from industry professionals with real-world experience and proven track records.",
                gradientClass:
                  "bg-gradient-to-b from-[#F8E38F] via-[#F8E38F] via-62% to-white",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`${feature.gradientClass} p-6 sm:p-8 rounded-lg border-[1.5px] border-foreground shadow-brutal hover:scale-105 transition-transform`}
              >
                <div className="text-4xl mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-center">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      <footer className="bg-card border-t-4 border-foreground py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm sm:text-base text-muted-foreground">
            © 2025 EdVerse. Revolutionizing education through community and AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
