import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, AtSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
  
      console.log("Login Response:", res.data); // Debugging
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard", { replace: true });
      } else {
        setError("Login failed: No token received.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid email or password.");
    }
  };
  
 
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-purple-800 to-indigo-900 flex items-center justify-center overflow-hidden relative">
      {/* Subtle Background Dots */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      {/* Login Container */}
      <motion.div 
        className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Lock className="w-12 h-12 text-yellow-400" strokeWidth={2.5} />
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Welcome <span className="text-yellow-400">Back</span>
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/30 text-red-300 p-3 rounded-xl mb-4 text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AtSign className="w-5 h-5 text-gray-400" />
            </div>
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl 
              text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <input 
              type="password" 
              placeholder="Password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl 
              text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <motion.a 
              href="/forgot-password" 
              className="text-sm text-blue-400 hover:text-blue-300 transition"
              whileHover={{ scale: 1.05 }}
            >
              Forgot Password?
            </motion.a>
          </div>

          {/* Login Button */}
          <motion.button 
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl 
            transition duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>

          {/* Register Link */}
          <div className="text-center mt-4">
            <span className="text-gray-300">
              Don't have an account? {" "}
              <motion.a 
                href="/signup" 
                className="text-blue-400 hover:text-blue-300 transition"
                whileHover={{ scale: 1.05 }}
              >
                Sign Up
              </motion.a>
            </span>
          </div>
        </form>
      </motion.div>

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

export default Login;