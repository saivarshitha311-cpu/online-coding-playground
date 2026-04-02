import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Code, Play, Terminal, Cpu, X, Save } from "lucide-react";
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

declare global {
  interface Window {
    chatbase: any;
    chatbaseShowing?: boolean;
  }
}

const CodeEditor = () => {
  const [code, setCode] = useState("// Write your code here...");
  const [output, setOutput] = useState("");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isRunning, setIsRunning] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [isChatVisible, setIsChatVisible] = useState(false);
  const chatWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("codeUpdate", (newCode) => {
      if (newCode !== code) setCode(newCode);
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("codeUpdate");
    };
  }, [code]);

  // Observe when Chatbase widget appears
  useEffect(() => {
    // Create a MutationObserver to detect when chat widget is added to DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          // Look for the Chatbase chat frame
          const chatFrame = document.querySelector('iframe[src*="chatbase"]');
          if (chatFrame) {
            setIsChatVisible(true);
          }
        }
      });
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  // Updated Chatbase script implementation from the HTML file
  useEffect(() => {
    // Using IIFE pattern as in the provided script
    (function() {
      if(!window.chatbase || window.chatbase("getState") !== "initialized") {
        window.chatbase = (...args: any[]) => {
          if (!window.chatbase.q) {
            window.chatbase.q = [];
          }
          window.chatbase.q.push(args);
        };
        window.chatbase = new Proxy(window.chatbase, {
          get(target, prop) {
            if (prop === "q") {
              return target.q;
            }
            return (...args: any[]) => target(prop, ...args);
          }
        });
      }
      
      const onLoad = function() {
        const script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js";
        script.id = "nVcyIYFQouBFN5AhaxLi8";
        script.setAttribute("domain", "www.chatbase.co");
        document.body.appendChild(script);
      };
      
      if (document.readyState === "complete") {
        onLoad();
      } else {
        window.addEventListener("load", onLoad);
      }
    })();
  }, []);

  // Function to hide the Chatbase chat
  const hideChatbase = () => {
    const chatbaseWidget = document.querySelector('[id^="chatbase-bubble-container"]');
    if (chatbaseWidget && chatbaseWidget.parentElement) {
      // We'll hide at the parent level to ensure all elements are hidden
      chatbaseWidget.parentElement.style.display = 'none';
    }
    
    const chatbaseFrame = document.querySelector('iframe[src*="chatbase"]');
    if (chatbaseFrame && chatbaseFrame.parentElement) {
      chatbaseFrame.parentElement.style.display = 'none';
    }
    
    setIsChatVisible(false);
  };

  const handleChange = (value: string | null) => {
    if (value !== null && value !== code) {
      setCode(value);
      socket.emit("codeUpdate", value);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    setCode("// Write your code here...");
  };

  const runCode = async () => {
    setIsRunning(true);
    try {
      const response = await axios.post("http://localhost:5000/execute", {
        language,
        code,
      });
      setOutput(response.data.output);
    } catch (error) {
      console.error("Execution Error:", error);
      setOutput("Error executing code.");
    }
    setIsRunning(false);
  };

  const saveCode = async () => {
    const fileName = prompt("Enter file name:");
    if (!fileName) return;
  
    try {
      await axios.post("http://localhost:5000/save-code", {
        fileName,
        language,
        code,
      });
  
      alert("Code saved successfully!");
    } catch (error) {
      console.error("Error saving code:", error);
      alert("Failed to save code.");
    }
  };
  

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-purple-800 to-indigo-900 flex items-center justify-center overflow-hidden relative">
      {/* Subtle Background Dots */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>
      
      {/* Chat close button - repositioned with higher z-index */}
      {isChatVisible && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-8 right-20 z-[9999] bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg"
          onClick={hideChatbase}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={10} />
        </motion.button>
      )}
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 relative z-10"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Code className="w-10 h-10 text-yellow-400" strokeWidth={2.5} />
            <h1 className="text-4xl font-bold text-white">CodeVerse Playground</h1>
          </div>
          <motion.div 
            className="flex items-center space-x-2 px-4 py-2 rounded-full text-white font-medium text-sm"
            style={{
              backgroundColor: isConnected ? "rgba(34, 197, 94, 0.2)" : "rgba(220, 38, 38, 0.2)",
              borderColor: isConnected ? "rgb(34 197 94)" : "rgb(220 38 38)",
              borderWidth: "1px"
            }}
            whileHover={{ scale: 1.05 }}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: isConnected ? "rgb(34 197 94)" : "rgb(220 38 38)"
              }}
            />
            <span>{isConnected ? "Connected" : "Disconnected"}</span>
          </motion.div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Cpu className="text-white w-6 h-6" />
            <motion.select
              value={language}
              onChange={handleLanguageChange}
              className="w-full max-w-xs px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              whileHover={{ scale: 1.02 }}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
            </motion.select>
          </div>

          <div className="border border-white/20 rounded-xl overflow-hidden">
            <Editor
              height="400px"
              width="100%"
              language={language}
              value={code}
              onChange={(value) => handleChange(value || "")}
              theme="vs-dark"
            />
          </div>

          <motion.button
            onClick={runCode}
            disabled={isRunning}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition duration-300 flex items-center justify-center space-x-2"
          >
            <Play className="w-5 h-5" />
            <span>{isRunning ? "Running..." : "Run Code"}</span>
          </motion.button>

          <motion.button
              onClick={saveCode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-300 flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Code</span>
            </motion.button>

          <div className="bg-white/10 border border-white/20 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Terminal className="text-white w-5 h-5" />
              <h3 className="text-lg font-semibold text-white">Output</h3>
            </div>
            <pre className="text-green-400 font-mono text-sm bg-black/50 p-3 rounded-lg whitespace-pre-wrap">
              {output || "Click Run to see output..."}
            </pre>
          </div>
        </div>
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
      
      {/* Reference div for chat wrapper */}
      <div ref={chatWrapperRef} className="hidden"></div>
    </div>
  );
};

export default CodeEditor;