// src/store/data.js

// This can be used if localStorage is empty (for default problems)
export const problems = [
  {
    id: 1,
    title: "Two Sum",
    platform: "LeetCode",
    status: "Solved",
    link: "https://leetcode.com/problems/two-sum/",
    tags: ["Array"],
    date: "2025-06-21",
  },
  {
    id: 2,
    title: "Longest Increasing Subsequence",
    platform: "LeetCode",
    status: "Unsolved",
    link: "https://leetcode.com/problems/longest-increasing-subsequence/",
    tags: ["DP"],
    date: "2025-06-20",
  },
  {
    id: 3,
    title: "Binary Search on Answers",
    platform: "Codeforces",
    status: "In Progress",
    link: "https://codeforces.com/problemset/problem/1201/B",
    tags: ["Binary Search", "Greedy"],
    date: "2025-06-19",
  },
];

export const TAGS = [
  "Array",
  "DP",
  "Binary Search",
  "Greedy",
  "Graph",
  "Tree",
  "Math",
];
