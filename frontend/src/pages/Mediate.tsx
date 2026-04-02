import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Pause, Volume2, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Meditate = () => {
  const [time, setTime] = useState(5); // Default 5 minutes
  const [secondsLeft, setSecondsLeft] = useState(time * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("nature.mp4");
  const [hasSetup, setHasSetup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const videoOptions = [
    { label: "Nature Sounds", value: "nature.mp4" },
    { label: "Ocean Waves", value: "ocean.mp4" },
    { label: "Rainfall", value: "rain.mp4" },
    { label: "Soft Piano", value: "piano.mp4" },
  ];

  useEffect(() => {
    // Load saved state
    const savedTime = localStorage.getItem("meditationTime");
    const savedVideo = localStorage.getItem("meditationVideo");
    const savedSeconds = localStorage.getItem("secondsLeft");
    const savedRunning = localStorage.getItem("isRunning");
    const savedSetup = localStorage.getItem("hasSetup");
    
    if (savedTime) setTime(parseInt(savedTime));
    if (savedVideo) setSelectedVideo(savedVideo);
    if (savedSeconds) setSecondsLeft(parseInt(savedSeconds));
    if (savedRunning === "true") setIsRunning(true);
    if (savedSetup === "true") setHasSetup(true);
  }, []);

  useEffect(() => {
    // Save state
    localStorage.setItem("meditationTime", time.toString());
    localStorage.setItem("meditationVideo", selectedVideo);
    localStorage.setItem("secondsLeft", secondsLeft.toString());
    localStorage.setItem("isRunning", isRunning.toString());
    localStorage.setItem("hasSetup", hasSetup.toString());
  }, [time, selectedVideo, secondsLeft, isRunning, hasSetup]);

  useEffect(() => {
    let timer: number | undefined;
    if (isRunning && secondsLeft > 0) {
      timer = window.setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
    }
    
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);
 
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSetupComplete = () => {
    setHasSetup(true);
    setShowSettings(false);
  };

  const handleReset = () => {
    setSecondsLeft(time * 60);
    setIsRunning(false);
  };

  const progressPercentage = (secondsLeft / (time * 60)) * 100;
  
  // Get currently selected video label
  const currentVideoLabel = videoOptions.find(opt => opt.value === selectedVideo)?.label || "Meditation";

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-black relative overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover">
          <source src={`/videos/${selectedVideo}`} type="video/mp4" />
        </video>
      </div>

      {/* Main container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 w-full max-w-md"
      >
        {/* Setup UI */}
        {(!hasSetup || showSettings) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/70 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl mx-4"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Meditation Settings</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-white/80 text-sm block">Background Ambience</label>
                <select
                  value={selectedVideo}
                  onChange={(e) => setSelectedVideo(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  {videoOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-800">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-white/80 text-sm block">Session Duration (minutes)</label>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={time}
                  onChange={(e) => {
                    const newTime = parseInt(e.target.value);
                    setTime(newTime);
                    setSecondsLeft(newTime * 60);
                  }}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-white/60 text-xs">
                  <span>1</span>
                  <span>{time} minutes</span>
                  <span>60</span>
                </div>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSetupComplete}
              className="w-full mt-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-medium shadow-lg"
            >
              Begin Session
            </motion.button>
          </motion.div>
        )}

        {/* Meditation timer UI */}
        {hasSetup && !showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-black/50 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl mx-4 text-center"
          >
            <Link to="/relax" className="absolute top-4 left-4 text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            
            <button 
              onClick={() => setShowSettings(true)}
              className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            <h1 className="text-2xl font-bold text-white mb-1">{currentVideoLabel}</h1>
            <p className="text-indigo-300 text-sm mb-8">{time} minute session</p>
            
            {/* Progress circle */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#ffffff20"
                  strokeWidth="5"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * progressPercentage) / 100}
                  transform="rotate(-90 50 50)"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-4xl font-semibold text-white">{formatTime(secondsLeft)}</span>
                <span className="text-indigo-300 text-xs">remaining</span>
              </div>
            </div>
            
            <div className="flex justify-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsRunning(!isRunning)}
                className={`px-8 py-3 rounded-full flex items-center justify-center gap-2 text-white font-medium shadow-lg ${
                  isRunning ? 'bg-pink-600' : 'bg-gradient-to-r from-indigo-600 to-purple-600'
                }`}
              >
                {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {isRunning ? "Pause" : "Start"}
              </motion.button>
              
              {secondsLeft < time * 60 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-full text-white font-medium shadow-lg"
                >
                  Reset
                </motion.button>
              )}
            </div>
            
            <div className="flex items-center justify-center mt-6 text-gray-400">
              <Volume2 className="w-4 h-4 mr-2" />
              <span className="text-xs">Ambient sounds playing</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Meditate;