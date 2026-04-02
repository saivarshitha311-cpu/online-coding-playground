import { motion } from "framer-motion";
import { ArrowLeft, Coffee, Gamepad, Moon } from "lucide-react";
import { JSX, useState } from "react";
import { Link } from "react-router-dom";

const Relax = () => {
  const [hoverButton, setHoverButton] = useState<string | null>(null);

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

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 relative z-10"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Coffee className="w-10 h-10 text-yellow-400" strokeWidth={2.5} />
            <h1 className="text-4xl font-bold tracking-tight text-white">Relax Zone</h1>
          </div>

          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back Home</span>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-8">
          {/* Meditation Option */}
          <RelaxOption
            title="Meditation Space"
            description="Clear your mind with guided meditations and breathing exercises"
            link="/meditate"
            buttonText="Start Meditating"
            icon={<Moon className="w-8 h-8 text-blue-400" />}
            hoverButton={hoverButton}
            setHoverButton={setHoverButton}
            buttonKey="meditate"
          />

          {/* Games Option */}
          <RelaxOption
            title="Brain Games"
            description="Unwind with fun, stress-relieving games that help refresh your mind"
            link="/games"
            buttonText="Play Games"
            icon={<Gamepad className="w-8 h-8 text-green-400" />}
            hoverButton={hoverButton}
            setHoverButton={setHoverButton}
            buttonKey="games"
          />
        </div>
      </motion.div>
    </div>
  );
};

// Reusable Relax Option Component - Modified to make the entire container clickable
const RelaxOption = ({
  title,
  description,
  link,
  buttonText,
  icon,
  setHoverButton,
  buttonKey
}: {
  title: string;
  description: string;
  link: string;
  buttonText: string;
  icon: JSX.Element;
  hoverButton: string | null;
  setHoverButton: (key: string | null) => void;
  buttonKey: string;
}) => {
  return (
    <Link to={link}>
      <motion.div 
        className="bg-white/10 border border-white/20 rounded-xl p-6 space-y-4 hover:bg-indigo-600/20 cursor-pointer transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300 }}
        onMouseEnter={() => setHoverButton(buttonKey)}
        onMouseLeave={() => setHoverButton(null)}
      >
        <div className="flex justify-between items-center">
          {icon}
          <span className="text-sm text-gray-400">Available</span>
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
        <div className="text-right">
          <span className="text-indigo-300 font-medium">{buttonText} →</span>
        </div>
      </motion.div>
    </Link>
  );
};

export default Relax;