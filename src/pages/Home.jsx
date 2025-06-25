import { useEffect, useState } from "react";
import ProblemCard from "../components/ProblemCard";
import StreakCalendar from "../components/StreakCalendar";
import Header from "../components/Header";
import { auth } from "../firebase";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const TAGS = [
  "Array", "String", "DP", "Binary Search", "Greedy", "Graph", "Tree", "Math",
  "Bits", "Recursion", "Hash Table", "Sorting", "Stack", "Queue", "Linked List"
];
const FILTERS = ["All", "Solved", "Unsolved", "In Progress"];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedTag, setSelectedTag] = useState(null);

  // ✅ Fetch problems from Firestore per user
  useEffect(() => {
    const fetchProblems = async () => {
      const userData = JSON.parse(localStorage.getItem("dsa-user"));
      if (!userData) return;

      try {
        const q = query(
          collection(db, "problems"),
          where("userId", "==", userData.email)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ docId: doc.id, ...doc.data() }));

        setProblems(data);
      } catch (err) {
        console.error("Error loading problems:", err);
      }
    };

    fetchProblems();
  }, []);

  // XP & Streak Logic (local)
  useEffect(() => {
    const storedXp = parseInt(localStorage.getItem("xp")) || 0;
    const storedStreak = parseInt(localStorage.getItem("streak")) || 0;
    setXp(storedXp);
    setStreak(storedStreak);
    setLevel(Math.floor(storedXp / 100) + 1);
  }, []);

  useEffect(() => {
    const updateXP = () => {
      const newXP = parseInt(localStorage.getItem("xp")) || 0;
      const newStreak = parseInt(localStorage.getItem("streak")) || 0;
      setXp(newXP);
      setStreak(newStreak);
      setLevel(Math.floor(newXP / 100) + 1);
    };
    window.addEventListener("xpChanged", updateXP);
    window.addEventListener("streakChanged", updateXP);
    return () => {
      window.removeEventListener("xpChanged", updateXP);
      window.removeEventListener("streakChanged", updateXP);
    };
  }, []);

  // Apply filters/search
  useEffect(() => {
    let result = problems.filter((p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedFilter !== "All") {
      result = result.filter((p) => p.status === selectedFilter);
    }

    if (selectedTag) {
      result = result.filter((p) => p.tags?.includes(selectedTag));
    }

    setFilteredProblems(result);
  }, [searchTerm, problems, selectedFilter, selectedTag]);

  return (
    <>
      <Header />
      <div className="px-6 pt-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen">
        {/* XP / Level Summary */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6 mb-6 flex flex-col sm:flex-row gap-4 sm:justify-between items-center text-center sm:text-left">
          <div>
            <h2 className="text-xl font-bold">Level {level}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{xp} XP earned</p>
            <div className="w-64 bg-gray-300 dark:bg-gray-700 rounded-full h-3 mt-2">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${xp % 100}%` }}
              ></div>
            </div>
          </div>
          <div>
            <p className="text-lg font-medium text-green-600 dark:text-green-400">
              🔥 Streak: {streak} days
            </p>
          </div>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search problems..."
          className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Status Filter */}
        <div className="flex flex-wrap gap-4 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium border dark:border-gray-600 transition ${
                selectedFilter === f
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Tag Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-3 py-1 rounded-full text-sm border ${
                selectedTag === tag
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Problems */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProblems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>

        {/* Streak Calendar */}
        <div className="mt-10">
          <StreakCalendar />
        </div>
      </div>
    </>
  );
}
