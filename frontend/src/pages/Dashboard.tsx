import { JSX, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogOut, User, Code, Swords, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User");
  const [, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, redirecting to login...");
      navigate("/login", { replace: true });
    }
    setUsername(localStorage.getItem("username") || "User");
    setUserId(localStorage.getItem("userId") || "");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-purple-800 to-indigo-900 flex items-center justify-center overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Pulsing waves */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`wave-${i}`}
            className="absolute rounded-full border border-white/10"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ width: 0, height: 0, opacity: 0.7 }}
            animate={{
              width: ['0%', '150%'],
              height: ['0%', '150%'],
              opacity: [0.7, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 2.5,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Floating particles */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-white/20"
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, -50, -150, 0],
              x: [0, 50, -30, 20, 0],
              opacity: [0.2, 0.8, 0.5, 0.9, 0.2],
            }}
            transition={{
              duration: Math.random() * 8 + 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Moving geometric shapes */}
        {[...Array(8)].map((_, i) => {
          const shapes = ["rounded-lg", "rounded-full", "rounded", "rounded-xl"];
          const colors = [
            "bg-blue-500/10", 
            "bg-purple-500/10", 
            "bg-pink-500/10", 
            "bg-indigo-500/10"
          ];
          
          return (
            <motion.div
              key={`shape-${i}`}
              className={`absolute ${shapes[i % shapes.length]} ${colors[i % colors.length]} border border-white/10`}
              style={{
                width: Math.random() * 100 + 80,
                height: Math.random() * 100 + 80,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                rotate: [0, 90, 180, 270, 360],
                scale: [1, 1.2, 0.9, 1.1, 1],
                x: [0, 100, -50, 150, 0],
                y: [0, -100, 50, -150, 0],
              }}
              transition={{
                duration: Math.random() * 25 + 20,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Diagonal moving lines */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute bg-gradient-to-r from-white/0 via-white/20 to-white/0"
            style={{
              height: Math.random() * 1 + 2,
              width: '150%',
              top: `${Math.random() * 100}%`,
              left: '-25%',
              transform: `rotate(${Math.random() * 60 - 30}deg)`,
            }}
            animate={{
              x: ['-100%', '100%'],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "linear",
              delay: i * 1.5,
            }}
          />
        ))}
      </div>

      {/* Dashboard Content */}
      <motion.div
        className="w-full max-w-4xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <User className="w-12 h-12 text-yellow-400" strokeWidth={2.5} />
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Welcome, <span className="text-yellow-400">{username}</span>
            </h1>
          </div>
          <motion.button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600/20 hover:bg-red-600/30
            border border-red-500/30 text-red-300 px-4 py-2 rounded-xl transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </motion.button>
        </div>
        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <SectionCard
            title="Playground"
            description="Manage and collaborate on your coding projects"
            icon={<Code className="w-8 h-8 text-blue-400" />}
            onClick={() => navigate("/editor")}
          />
          <SectionCard
            title="Profile"
            description="View and edit your personal information"
            icon={<User className="w-8 h-8 text-green-400" />}
            onClick={() => navigate("/profile")}
          />
          <SectionCard
  title="Coding Quests"
  description="Solve coding challenges and improve your skills"
  icon={<Swords className="w-8 h-8 text-red-400" />}
  onClick={() => navigate("/quests")}
/>

          <SectionCard
            title="Relax"
            description="Take a break with meditation and games"
            icon={<Coffee className="w-8 h-8 text-yellow-400" />}
            onClick={() => navigate("/relax")}
          />
        </div>
      </motion.div>
    </div>
  );
};

const SectionCard: React.FC<{ title: string; description: string; icon: JSX.Element; onClick?: () => void }> = ({ 
  title, 
  description, 
  icon, 
  onClick 
}) => {
  return (
    <motion.div
      className="bg-white/10 border border-white/20 rounded-xl p-6 space-y-4 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        {icon}
        <span className="text-sm text-gray-400">Active</span>
      </div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </motion.div>
  );
};

export default Dashboard;