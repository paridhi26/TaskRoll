"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [fullDate, setFullDate] = useState("");
  const [playerNumber, setPlayerNumber] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) setDarkMode(savedTheme === "true");

    const today = new Date();
    const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const date = String(today.getDate()).padStart(2, "0");
    const year = today.getFullYear();
    setFullDate(`${dayName}, ${month}/${date}/${year}`);
    setPlayerNumber(`${year}${month}${date}`);

    const todayStr = today.toDateString();
    const lastOpened = localStorage.getItem("lastOpenedDate");
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    if (lastOpened !== todayStr) {
      const carryOver = storedTasks.filter((task) => !task.done);
      localStorage.setItem("tasks", JSON.stringify(carryOver));
      localStorage.setItem("lastOpenedDate", todayStr);
      setTasks(carryOver);
    } else {
      setTasks(storedTasks);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  const addTask = () => {
    if (!input.trim()) return;
    const newTask = { text: input.trim(), done: false };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setInput("");
  };

  const toggleTask = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, done: !task.done } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  return (
    <main className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen p-6`}>
      <div className="max-w-xl mx-auto">
        <div className={`flex justify-between items-center p-2 rounded mb-4 shadow ${darkMode ? "bg-gray-800" : "bg-blue-100"}`}>
          <p className="text-sm font-medium">📅 {fullDate}</p>
          <button
            onClick={toggleDarkMode}
            className="text-sm px-3 py-1 border rounded shadow"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-1">🌤️ TaskRoll</h1>
        <h2 className="text-xl font-semibold mb-4">🎮 Quests for Player #{playerNumber}</h2>
        <div className="flex gap-2 mb-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="flex-1 p-2 border rounded text-black"
            placeholder="Add a new task..."
          />
          <button onClick={addTask} className="bg-blue-500 text-white px-4 py-2 rounded">
            Add
          </button>
        </div>
        <ul className="space-y-2">
          {tasks.map((task, i) => (
            <li key={i} className={`flex items-center justify-between p-2 rounded shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <span
                onClick={() => toggleTask(i)}
                className={`flex-1 cursor-pointer ${task.done ? "line-through text-gray-400" : ""}`}
              >
                {task.text}
              </span>
              <button
                onClick={() => toggleTask(i)}
                className={`ml-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${task.done ? "bg-green-500 border-green-500" : "border-gray-400"}`}
              >
                {task.done ? "✓" : ""}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}