import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Header from "../components/Header";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      const snapshot = await getDocs(collection(db, "leaderboard"));
      const data = snapshot.docs.map((doc) => doc.data());
      data.sort((a, b) => b.xp - a.xp); // Sort by XP descending
      setUsers(data);
    }
    fetchLeaderboard();
  }, []);

  return (
    <>
      <Header />
      <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-700 dark:text-purple-300">
          🏆 Leaderboard
        </h1>
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b dark:border-gray-600">
                <th className="py-2">#</th>
                <th>Name</th>
                <th>XP</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr
                  key={u.email}
                  className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <td className="py-2">
                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : index + 1}
                  </td>
                  <td className="flex items-center gap-2 py-2">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold uppercase text-sm">
                      {u.name?.charAt(0) || "U"}
                    </div>
                    {u.name}
                  </td>
                  <td>{u.xp}</td>
                  <td>{Math.floor(u.xp / 100) + 1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
