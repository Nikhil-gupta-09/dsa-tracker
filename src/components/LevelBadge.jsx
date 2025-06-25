// src/components/LevelBadge.jsx
export default function LevelBadge({ level }) {
  let color = "bg-gray-400 text-white";

  if (level >= 2 && level < 5) color = "bg-blue-500 text-white";
  else if (level >= 5 && level < 8) color = "bg-purple-500 text-white";
  else if (level >= 8 && level < 12) color = "bg-yellow-400 text-black";
  else if (level >= 12) color = "bg-green-500 text-white";

  return (
    <div className={`px-4 py-1 rounded-full font-bold text-sm shadow ${color}`}>
      Level {level}
    </div>
  );
}
