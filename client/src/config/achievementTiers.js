// src/config/achievementTiers.js
export const ACHIEVEMENT_TIERS = {
    powerUps: [
      { level: 1, min: 0, max: 49, reward: 100, name: "Energy Collector" },
      { level: 2, min: 50, max: 499, reward: 500, name: "Loot Seeker" },
      { level: 3, min: 500, max: 2999, reward: 2000, name: "Boost Master" },
      { level: 4, min: 3000, max: 10000, reward: 5000, name: "Power Overlord" }
    ],
    criticals: [
      { level: 1, min: 0, max: 9, reward: 100, name: "Critical Slayer" },
      { level: 2, min: 10, max: 19, reward: 300, name: "Chaos Bringer" },
      { level: 3, min: 20, max: 29, reward: 500, name: "Shadow Assassin" },
      { level: 4, min: 30, max: 50, reward: 1000, name: "Phantom Eliminator" }
    ],
    strikes: [
      { level: 1, min: 0, max: 29, reward: 200, name: "Skybound Adventurer" },
      { level: 2, min: 31, max: 299, reward: 1000, name: "Sky Blazer" },
      { level: 3, min: 300, max: 999, reward: 3000, name: "Star Voyager" },
      { level: 4, min: 1000, max: 3000, reward: 10000, name: "Astral Dominator" }
    ],
    referrals: [
      { level: 1, min: 0, max: 3, reward: 200, name: "Link Scout" },
      { level: 2, min: 4, max: 9, reward: 1000, name: "Network Ninja" },
      { level: 3, min: 10, max: 29, reward: 3000, name: "Connection Guru" },
      { level: 4, min: 30, max: 100, reward: 10000, name: "Alliance Commander" }
    ]
  };