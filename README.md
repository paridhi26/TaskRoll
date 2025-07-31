# Game of Life (formerly TaskRoll)

**Game of Life** turns your real-life to-do list into a mini RPG game.  
Each day, you are a new *Player* on a quest to complete tasks, earn XP, and leave a solid foundation for tomorrow's player (your future self). Each day, you're assigned a unique **Player Number**, and your unfinished quests (tasks) carry over to tomorrow.

Designed to help people with ADHD and time-blindness stay focused, motivated, and aware of their progress. Great for productivity lovers, ADHD brains, and anyone who wants to treat life like a game.

## 🔗 Live Demo

This is the initial deployed version (v1) with a limited feature set.
👉 [https://task-roll-nine.vercel.app](https://task-roll-nine.vercel.app)

## 🧠 Features

- 🎯 **Daily Quests**: Tasks reset each day, with uncompleted quests carrying forward.
- 🕒 **Time Awareness Bar**: Visualizes how much of your workday (8 AM–6 PM) has passed.
- 🧾 **XP & Leveling**: Earn 10 XP per completed task. Level up your productivity!
- 🎭 **Player Handoff**: Motivational messages from "tomorrow’s player" based on your effort.
- 🌗 **Dark Mode** toggle
- 🎮 Daily “Player Number” based on the date (e.g., `20250710`)
- 📝 **Welcome screen** on first visit
- 🧠 **ADHD brains friendly**: Visual structure, time awareness, gamified feedback

## 🛠 Tech Stack

- [Next.js (App Router)](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- `localStorage` for persistence (per-device)
- Custom state-based logic for XP, time, and motivation

## 🛠 Getting Started (For Developers)

```bash
git clone https://github.com/your-username/taskroll.git
cd taskroll
npm install
npm run dev
```
