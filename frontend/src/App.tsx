import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CodeEditor from "./pages/CodeEditor";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Relax from "./pages/Relax";
import Meditate from "./pages/Mediate";
import Games from "./pages/Games";
import TicTacToe from "./pages/Games/TicTacToe";
import CodingQuests from "./pages/CodingQuests";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor" element={<CodeEditor />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/relax" element={<Relax />} />
        <Route path="/meditate" element={<Meditate />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/tictactoe" element={<TicTacToe />} />
        <Route path="/quests" element={<CodingQuests />} />
      </Routes>
    </Router>
  );
}

export default App;
