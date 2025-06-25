import React, { useState } from "react";
import { db } from "../firebase";
import {
  doc,
  setDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";

const TAGS = [
  "Array", "String", "DP", "Binary Search", "Greedy", "Graph", "Tree", "Math",
  "Bits", "Recursion", "Hash Table", "Sorting", "Stack", "Queue", "Linked List",
];

const AddProblem = () => {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState("");
  const [link, setLink] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const user = JSON.parse(localStorage.getItem("dsa-user"));

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

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

    // ✅ Also update XP in leaderboard
  const leaderboardRef = doc(db, "leaderboard", user.email);
  await setDoc(leaderboardRef, {
    name: user.name,
    email: user.email,
    photoURL: user.photoURL || user.photo || "",
    xp,
  });
    await recalculateXPAndStreak();// add new line htane ke liye
    window.dispatchEvent(new Event("xpChanged"));
    window.dispatchEvent(new Event("streakChanged"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return alert("⚠️ Please login to add problems.");

    const docId = Date.now().toString();
    const newProblem = {
      id: docId,
      docId,
      title,
      platform,
      status,
      link,
      tags: selectedTags,
      date: new Date().toISOString().split("T")[0],
      userId: user.email,
    };

    try {
      await setDoc(doc(db, "problems", docId), newProblem);
      alert("✅ Problem added to Firestore!");

      await recalculateXPAndStreak();

      setTitle("");
      setPlatform("");
      setStatus("");
      setLink("");
      setSelectedTags([]);
    } catch (err) {
      console.error("Error adding problem:", err);
      alert("❌ Failed to add problem.");
    }
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-purple-700">
          ➕ Add New Problem
        </h2>

        <input
          type="text"
          placeholder="Problem Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <input
          type="text"
          placeholder="Platform (e.g., LeetCode, Codeforces)"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="">-- Select Status --</option>
          <option value="Solved">✅ Solved</option>
          <option value="In Progress">⏳ In Progress</option>
          <option value="Unsolved">❌ Unsolved</option>
        </select>

        <input
          type="url"
          placeholder="Problem Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <div>
          <p className="font-medium text-gray-700 mb-1">Tags:</p>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 text-sm rounded-full border transition ${
                  selectedTags.includes(tag)
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          Add Problem 🚀
        </button>
      </form>
    </div>
  );
};

export default AddProblem;
