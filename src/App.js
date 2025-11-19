import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// ✅ Page imports
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ThemeToggle from "./components/ThemeToggle";
import LearningPath from "./pages/LearningPath";
import Goals from "./pages/Goals"; // ✅ Added Goals page
import ChatBot from "./pages/ChatBot";


// ================== Navbar Component ==================
function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md">
      <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
        CareerPath AI
      </h1>

      <div className="flex items-center space-x-6">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>

        {/* Show these only when logged in */}
        {token && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/learning-path">Learning Path</Link>
            <Link to="/goals">Goals</Link> {/* ✅ Added Goals Link */}
            <Link to="/chat">Chatbot</Link>
          </>
        )}

        {/* Login / Logout */}
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              👋 {user.name || "User"}
            </span>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          </>
        )}

        <ThemeToggle />
      </div>
    </nav>
  );
}

// ================== Animated Routes ==================
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/learning-path" element={<LearningPath />} />
        <Route path="/goals" element={<Goals />} /> {/* ✅ Correctly added here */}
        <Route path="/chat" element={<ChatBot />} />
      </Routes>
    </AnimatePresence>
  );
}

// ================== Main App Component ==================
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white transition-colors">
        <Navbar />
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
