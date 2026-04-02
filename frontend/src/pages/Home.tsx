import { To, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Code, Users, Zap, BookOpen } from "lucide-react";

const Home = () => {
    const navigate = useNavigate(); // React Router navigation

    const handleNavigation = (path: To) => {
      navigate(path);  // Client-side navigation
    };
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-purple-800 to-indigo-900 flex items-center justify-center overflow-hidden relative">
      {/* Subtle Background Dots */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl flex items-center justify-between px-8 relative z-10">
        {/* Left Section */}
        <motion.div 
          className="text-left text-white max-w-lg space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <Code className="w-12 h-12 text-yellow-400" strokeWidth={2.5} />
            <h1 className="text-5xl font-bold tracking-tight">
              Code<span className="text-yellow-400">Verse</span>
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-xl text-gray-200 leading-relaxed">
            Revolutionize your coding journey with real-time collaboration, 
            AI-powered assistance, and an engaging learning ecosystem.
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-200">
              <Users className="w-5 h-5 text-blue-400" />
              <span>Collaborative Coding</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-200">
              <Zap className="w-5 h-5 text-green-400" />
              <span>AI Code Assistant</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-200">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <span>Interactive Learning</span>
            </div>
          </div>

          {/* Action Buttons */}
          <motion.div 
            className="flex space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button 
              onClick={() => handleNavigation('/signup')}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl 
              transition duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Get Started</span>
            </button>
            <button 
              onClick={() => handleNavigation('/login')}
              className="w-full px-6 py-3 border-2 border-white/20 bg-white/10 
              hover:bg-white/20 text-white font-semibold rounded-xl 
              transition duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Login</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Right Section - Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:block"
        >
          <motion.img 
  src="/coding.png"  
  alt="Coding Collaboration" 
  className="w-[500px] rounded-2xl shadow-2xl border-4 border-white/10"
  animate={{
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }}
/>

        </motion.div>
      </div>

      {/* Animated Background Shapes */}
      <motion.div 
        className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -50, 0],
          transition: {
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }
        }}
      />
      <motion.div 
        className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          transition: {
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }
        }}
      />
    </div>
  );
};

export default Home;