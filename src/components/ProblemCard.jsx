// src/components/ProblemCard.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, updateDoc, deleteDoc, getDocs, query, collection, where } from "firebase/firestore";

export default function ProblemCard({ problem }) {
  const [status, setStatus] = useState(problem.status);
  const user = JSON.parse(localStorage.getItem("dsa-user"));

  useEffect(() => {
    setStatus(problem.status);
  }, [problem.status]);

  const recalculateXPAndStreak = async () => {
    if (!user) return;

    const q = query(collection(db, "problems"), where("userId", "==", user.email));
    const snapshot = await getDocs(q);
    const allProblems = snapshot.docs.map((doc) => doc.data());

    const solved = allProblems.filter((p) => p.status === "Solved");
    const xp = solved.length * 10;
    localStorage.setItem("xp", xp);

    const solvedDates = solved.map((p) => p.date);
    const uniqueDates = [...new Set(solvedDates)].sort();
    localStorage.setItem("solvedDates", JSON.stringify(uniqueDates));

    window.dispatchEvent(new Event("xpChanged"));
    window.dispatchEvent(new Event("streakChanged"));
    // nahi line hain ye hatani pad sakti ahi
    const leaderboardRef = doc(db, "leaderboard", user.email);
    await updateDoc(leaderboardRef, { xp });
  };

  const handleToggleStatus = async () => {
    const newStatus =
      status === "Solved"
        ? "Unsolved"
        : status === "Unsolved"
        ? "In Progress"
        : "Solved";

    try {
      if (!problem.docId) throw new Error("Missing Firestore docId");
      const docRef = doc(db,"problems", problem.docId);
      await updateDoc(docRef, {
        status: newStatus,
        date: new Date().toISOString().split("T")[0],
      });

      setStatus(newStatus);
      await recalculateXPAndStreak();
    } catch (err) {
      console.error("Toggle failed:", err);
      alert("Failed to toggle problem status");
    }
  };

  const handleDelete = async () => {
    try {
      if (!problem.docId) throw new Error("Missing Firestore docId");
      await deleteDoc(doc(db, "problems", problem.docId));
      await recalculateXPAndStreak();
      window.location.reload();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete problem");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-1">{problem.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          📍 {problem.platform}
        </p>
        <a
          href={problem.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 underline text-sm"
        >
          🔗 View Problem
        </a>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium bg-opacity-20 ${
            status === "Solved"
              ? "bg-green-400 text-green-700"
              : status === "In Progress"
              ? "bg-yellow-400 text-yellow-800"
              : "bg-red-400 text-red-700"
          }`}
        >
          {status}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleToggleStatus}
            className="text-sm px-3 py-1 rounded-md bg-purple-100 hover:bg-purple-200 text-purple-700"
          >
            Toggle Status
          </button>
          <button
            onClick={handleDelete}
            className="text-sm px-3 py-1 rounded-md bg-red-100 hover:bg-red-200 text-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
