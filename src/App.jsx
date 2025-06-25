// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import AddProblem from "./pages/AddProblem";
import NotFound from "./pages/NotFound";
import Leaderboard from "./pages/Leaderboard"; // ✅ Import Leaderboard
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-100 text-gray-800 dark:bg-gray-900 dark:text-white">
          <Header />
          <main className="p-4 max-w-5xl mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/add" element={<AddProblem />} />
              <Route path="/leaderboard" element={<Leaderboard />} /> {/* ✅ Leaderboard Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}




