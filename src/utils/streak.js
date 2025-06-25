// src/utils/streak.js

export function getSolvedDates() {
  return JSON.parse(localStorage.getItem("solvedDates")) || [];
}

export function getCurrentStreak(dates) {
  if (!dates.length) return 0;

  const sorted = dates.map(d => new Date(d)).sort((a, b) => b - a);
  const today = new Date();
  let streak = 0;

  for (let i = 0; i < sorted.length; i++) {
    const diff = Math.floor((today - sorted[i]) / (1000 * 60 * 60 * 24));
    if (diff === streak) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function getStreakXP(dates) {
  return dates.length * 5;
}
