// src/components/StreakCalendar.jsx
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendarStyles.css";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

// Calculate current streak from sorted list of solved dates
function calculateStreak(datesArray) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;

  const dateSet = new Set(datesArray); // Example: ["2025-06-21", "2025-06-20", ...]

  for (let i = 0; i < 1000; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const formatted = checkDate.toISOString().split("T")[0];

    if (dateSet.has(formatted)) {
      streak++;
    } else {
      if (i === 0) continue; // allow today not solved
      break;
    }
  }

  return streak;
}


// Calculate XP based on number of solved problems
function calculateXP(problems) {
  return problems.filter((p) => p.status === "Solved").length * 10;
}

const StreakCalendar = () => {
  const [solvedDates, setSolvedDates] = useState([]);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);

  const refreshData = async () => {
    const userData = JSON.parse(localStorage.getItem("dsa-user"));
    if (!userData) return;

    const q = query(
      collection(db, "problems"),
      where("userId", "==", userData.email)
    );
    const snapshot = await getDocs(q);
    const problems = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const computedXP = calculateXP(problems);
    setXp(computedXP);
    localStorage.setItem("xp", computedXP);
    window.dispatchEvent(new CustomEvent("xpUpdated", { detail: computedXP }));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dates = problems
      .filter((p) => p.status === "Solved" && p.date)
      .map((p) => {
        const d = new Date(p.date);
        d.setHours(0, 0, 0, 0);
        return d.toISOString().split("T")[0];
      });

    setSolvedDates(dates);
    localStorage.setItem("solvedDates", JSON.stringify(dates));

    const currentStreak = calculateStreak(dates);
    setStreak(currentStreak);
    localStorage.setItem("streak", currentStreak);
    window.dispatchEvent(new Event("streakUpdated"));
  };

  useEffect(() => {
    const update = () => {
      const dates = JSON.parse(localStorage.getItem("solvedDates")) || [];
      setSolvedDates(dates);
      setStreak(calculateStreak(dates));
    };

    refreshData();

    window.addEventListener("streakChanged", update);
    window.addEventListener("xpChanged", refreshData);
    window.addEventListener("problemToggled", refreshData);

    return () => {
      window.removeEventListener("streakChanged", update);
      window.removeEventListener("xpChanged", refreshData);
      window.removeEventListener("problemToggled", refreshData);
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded-2xl shadow-lg mt-8 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Streak Calendar</h2>

      <div className="text-center mb-4">
        <p className="text-lg font-medium">
          🔥 Current Streak:{" "}
          <span className="font-bold text-green-600 dark:text-green-400">
            {streak} day{streak !== 1 && "s"}
          </span>
        </p>
        <p className="text-lg font-medium">
          ⭐ XP:{" "}
          <span className="font-bold text-blue-600 dark:text-blue-400">{xp}</span>
        </p>
      </div>

      <Calendar
        tileClassName={({ date }) => {
          const dateStr = date.toISOString().split("T")[0];
          return solvedDates.includes(dateStr) ? "highlight" : null;
        }}
      />
    </div>
  );
};

export default StreakCalendar;
