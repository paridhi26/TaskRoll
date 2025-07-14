"use client"

import { useEffect, useState } from "react"

export default function Home() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const [fullDate, setFullDate] = useState("")
  const [playerNumber, setPlayerNumber] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())

  // Time bar calculations
  const getTimeProgress = () => {
    const now = currentTime
    const startHour = 8 // 8am
    const endHour = 18 // 6pm
    const totalWorkingMinutes = (endHour - startHour) * 60 // 10 hours = 600 minutes

    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTotalMinutes = currentHour * 60 + currentMinute
    const startTotalMinutes = startHour * 60
    const endTotalMinutes = endHour * 60

    if (currentTotalMinutes < startTotalMinutes) {
      // Before work hours
      return {
        percentage: 0,
        status: "before",
        timeRemaining: totalWorkingMinutes,
        currentTimeStr: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
    } else if (currentTotalMinutes > endTotalMinutes) {
      // After work hours
      return {
        percentage: 100,
        status: "after",
        timeRemaining: 0,
        currentTimeStr: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
    } else {
      // During work hours
      const elapsedMinutes = currentTotalMinutes - startTotalMinutes
      const percentage = (elapsedMinutes / totalWorkingMinutes) * 100
      const remainingMinutes = totalWorkingMinutes - elapsedMinutes

      return {
        percentage: Math.min(percentage, 100),
        status: "during",
        timeRemaining: remainingMinutes,
        currentTimeStr: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
    }
  }

  const formatTimeRemaining = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode")
    if (savedTheme) setDarkMode(savedTheme === "true")

    const today = new Date()
    const dayName = today.toLocaleDateString("en-US", { weekday: "long" })
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const date = String(today.getDate()).padStart(2, "0")
    const year = today.getFullYear()
    setFullDate(`${dayName}, ${month}/${date}/${year}`)
    setPlayerNumber(`${year}${month}${date}`)

    const todayStr = today.toDateString()
    const lastOpened = localStorage.getItem("lastOpenedDate")
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]")

    if (lastOpened !== todayStr) {
      const carryOver = storedTasks.filter((task) => !task.done)
      localStorage.setItem("tasks", JSON.stringify(carryOver))
      localStorage.setItem("lastOpenedDate", todayStr)
      setTasks(carryOver)
    } else {
      setTasks(storedTasks)
    }

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timeInterval)
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem("darkMode", newMode.toString())
  }

  const addTask = () => {
    if (!input.trim()) return
    const newTask = { text: input.trim(), done: false }
    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    setInput("")
  }

  const toggleTask = (index) => {
    const updatedTasks = tasks.map((task, i) => (i === index ? { ...task, done: !task.done } : task))
    setTasks(updatedTasks)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
  }

  const timeProgress = getTimeProgress()

  return (
    <main className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen p-6`}>
      <div className="max-w-xl mx-auto">
        {/* Time Awareness Bar */}
        <div className={`p-4 rounded-lg mb-4 shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">⏰ Work Day Progress</h3>
            <span className="text-sm font-mono">{timeProgress.currentTimeStr}</span>
          </div>

          <div className="mb-2">
            <div className={`w-full h-4 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"} overflow-hidden`}>
              <div
                className={`h-full transition-all duration-1000 ${
                  timeProgress.status === "before"
                    ? "bg-blue-500"
                    : timeProgress.status === "after"
                      ? "bg-red-500"
                      : timeProgress.percentage < 50
                        ? "bg-green-500"
                        : timeProgress.percentage < 80
                          ? "bg-yellow-500"
                          : "bg-orange-500"
                }`}
                style={{ width: `${timeProgress.percentage}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-1">
              <span>8:00 AM</span>
              <span className="text-xs opacity-70">start</span>
            </span>

            <div className="text-center">
              {timeProgress.status === "before" && (
                <span className="text-blue-500 font-medium">
                  Work starts in{" "}
                  {formatTimeRemaining(8 * 60 - (currentTime.getHours() * 60 + currentTime.getMinutes()))}
                </span>
              )}
              {timeProgress.status === "during" && (
                <span className="font-medium">
                  {Math.round(timeProgress.percentage)}% complete • {formatTimeRemaining(timeProgress.timeRemaining)}{" "}
                  left
                </span>
              )}
              {timeProgress.status === "after" && (
                <span className="text-red-500 font-medium">Work day complete! 🎉</span>
              )}
            </div>

            <span className="flex items-center gap-1">
              <span className="text-xs opacity-70">end</span>
              <span>6:00 PM</span>
            </span>
          </div>
        </div>

        <div
          className={`flex justify-between items-center p-2 rounded mb-4 shadow ${darkMode ? "bg-gray-800" : "bg-blue-100"}`}
        >
          <p className="text-sm font-medium">📅 {fullDate}</p>
          <button onClick={toggleDarkMode} className="text-sm px-3 py-1 border rounded shadow">
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
            <li
              key={i}
              className={`flex items-center justify-between p-2 rounded shadow ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <span
                onClick={() => toggleTask(i)}
                className={`flex-1 cursor-pointer ${task.done ? "line-through text-gray-400" : ""}`}
              >
                {task.text}
              </span>
              <button
                onClick={() => toggleTask(i)}
                className={`ml-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  task.done ? "bg-green-500 border-green-500" : "border-gray-400"
                }`}
              >
                {task.done ? "✓" : ""}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}