"use client"

import { useEffect, useState } from "react"

export default function Home() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const [fullDate, setFullDate] = useState("")
  const [playerNumber, setPlayerNumber] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showWelcome, setShowWelcome] = useState(false)

  // Game stats
  const completedTasks = tasks.filter((task) => task.done).length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const xpEarned = completedTasks * 10
  const level = Math.floor(xpEarned / 100) + 1

  // Time bar calculations
  const getTimeProgress = () => {
    const now = currentTime
    const startHour = 8
    const endHour = 18
    const totalWorkingMinutes = (endHour - startHour) * 60

    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTotalMinutes = currentHour * 60 + currentMinute
    const startTotalMinutes = startHour * 60
    const endTotalMinutes = endHour * 60

    if (currentTotalMinutes < startTotalMinutes) {
      return {
        percentage: 0,
        status: "before",
        timeRemaining: totalWorkingMinutes,
        currentTimeStr: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        phase: "🌅 Pre-Game",
      }
    } else if (currentTotalMinutes > endTotalMinutes) {
      return {
        percentage: 100,
        status: "after",
        timeRemaining: 0,
        currentTimeStr: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        phase: "🌙 Complete",
      }
    } else {
      const elapsedMinutes = currentTotalMinutes - startTotalMinutes
      const percentage = (elapsedMinutes / totalWorkingMinutes) * 100
      const remainingMinutes = totalWorkingMinutes - elapsedMinutes

      let phase = "🌅 Early Game"
      if (percentage > 75) phase = "🌆 Final Sprint"
      else if (percentage > 50) phase = "🌤️ Mid Game"
      else if (percentage > 25) phase = "☀️ Morning"

      return {
        percentage: Math.min(percentage, 100),
        status: "during",
        timeRemaining: remainingMinutes,
        currentTimeStr: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        phase,
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

  const getMotivationalMessage = () => {
    const timeProgress = getTimeProgress()

    if (timeProgress.status === "before") {
      return "🎮 Game starts soon! Prepare your quests!"
    } else if (timeProgress.status === "after") {
      if (completionRate >= 80) return "🏆 Legendary! Tomorrow's player will be grateful!"
      else if (completionRate >= 60) return "⭐ Solid work! You've set up tomorrow well!"
      else if (completionRate >= 40) return "📈 Good effort! Tomorrow has a fair start!"
      else return "💪 Tomorrow needs your help! Every quest matters!"
    } else {
      if (completionRate >= 80) return "🔥 Crushing it! Keep the momentum!"
      else if (completionRate >= 60) return "⚡ Great progress! Making tomorrow easier!"
      else if (completionRate >= 40) return "🎯 Good start! Push forward!"
      else if (totalTasks === 0) return "📝 Add your first quest to begin!"
      else return "🚀 Time to level up! Complete quests!"
    }
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode")
    if (savedTheme) setDarkMode(savedTheme === "true")

    const hasVisited = localStorage.getItem("hasVisited")
    if (!hasVisited) {
      setShowWelcome(true)
      localStorage.setItem("hasVisited", "true")
    }

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

  if (showWelcome) {
    return (
      <main className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen p-6`}>
        <div className="max-w-2xl mx-auto">
          <div className={`p-8 rounded-xl shadow-2xl ${darkMode ? "bg-gray-800" : "bg-white"} text-center`}>
            <div className="text-6xl mb-4">🎮</div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Welcome to the Game of Life!
            </h1>
            <div className="space-y-4 text-left max-w-lg mx-auto">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h3 className="font-semibold">You Are Player #{playerNumber}</h3>
                  <p className="text-sm opacity-80">Each day, a new player takes control of the life</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚔️</span>
                <div>
                  <h3 className="font-semibold">Complete Daily Quests</h3>
                  <p className="text-sm opacity-80">Finish tasks to make progress and help tomorrow&apos;s player</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <h3 className="font-semibold">Level Up Your Life</h3>
                  <p className="text-sm opacity-80">Every completed quest earns XP and makes the game easier</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⏰</span>
                <div>
                  <h3 className="font-semibold">Beat the Clock</h3>
                  <p className="text-sm opacity-80">Your game session runs 8AM-6PM. Make every hour count!</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowWelcome(false)}
              className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:shadow-lg transition-all"
            >
              🚀 Start Playing!
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen p-4`}>
      <div className="max-w-7xl mx-auto">
        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Game Info & Controls */}
          <div className="space-y-4">
            {/* Game Session Timer */}
            <div
              className={`p-4 rounded-xl shadow-lg border-2 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="text-lg font-bold">{timeProgress.phase}</h3>
                  <p className="text-xs opacity-70">Game Session Progress</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-mono font-bold">{timeProgress.currentTimeStr}</div>
                  <div className="text-xs opacity-70">Current Time</div>
                </div>
              </div>

              <div className="mb-3">
                <div
                  className={`w-full h-4 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"} overflow-hidden relative`}
                >
                  <div
                    className={`h-full transition-all duration-1000 ${
                      timeProgress.status === "before"
                        ? "bg-gradient-to-r from-blue-400 to-blue-600"
                        : timeProgress.status === "after"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500"
                          : timeProgress.percentage < 25
                            ? "bg-gradient-to-r from-green-400 to-green-600"
                            : timeProgress.percentage < 50
                              ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                              : timeProgress.percentage < 75
                                ? "bg-gradient-to-r from-orange-400 to-orange-600"
                                : "bg-gradient-to-r from-red-400 to-red-600"
                    }`}
                    style={{ width: `${timeProgress.percentage}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-difference">
                    {Math.round(timeProgress.percentage)}%
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">🌅 8AM</span>
                <div className="text-center font-medium">
                  {timeProgress.status === "before" && (
                    <span className="text-blue-500">
                      Starts in {formatTimeRemaining(8 * 60 - (currentTime.getHours() * 60 + currentTime.getMinutes()))}
                    </span>
                  )}
                  {timeProgress.status === "during" && (
                    <span>⏱️ {formatTimeRemaining(timeProgress.timeRemaining)} left</span>
                  )}
                  {timeProgress.status === "after" && <span className="text-purple-500">Complete! 🎉</span>}
                </div>
                <span className="font-medium">🌆 6PM</span>
              </div>
            </div>

            {/* Player Stats Dashboard */}
            <div className={`p-4 rounded-xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h2 className="text-xl font-bold">🎮 Player #{playerNumber}</h2>
                  <p className="text-xs opacity-70">📅 {fullDate}</p>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className="text-xs px-2 py-1 border rounded shadow hover:shadow-md transition-shadow"
                >
                  {darkMode ? "☀️" : "🌙"}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-500">{level}</div>
                  <div className="text-xs opacity-70">Level</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-500">{xpEarned}</div>
                  <div className="text-xs opacity-70">XP</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-500">{completionRate}%</div>
                  <div className="text-xs opacity-70">Rate</div>
                </div>
              </div>

              <div
                className={`p-2 rounded text-center text-sm font-medium ${
                  completionRate >= 80
                    ? "bg-green-100 text-green-800"
                    : completionRate >= 60
                      ? "bg-blue-100 text-blue-800"
                      : completionRate >= 40
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                }`}
              >
                {getMotivationalMessage()}
              </div>
            </div>

            {/* Tomorrow's Player Message */}
            <div
              className={`p-3 rounded-xl shadow-lg border-2 ${
                completionRate >= 70
                  ? `${darkMode ? "bg-green-900 border-green-700" : "bg-green-50 border-green-200"}`
                  : completionRate >= 40
                    ? `${darkMode ? "bg-yellow-900 border-yellow-700" : "bg-yellow-50 border-yellow-200"}`
                    : `${darkMode ? "bg-red-900 border-red-700" : "bg-red-50 border-red-200"}`
              }`}
            >
              <h4 className="font-bold mb-1 text-sm">💌 Next Player:</h4>
              <p className="text-xs">
                {completionRate >= 70
                  ? "🌟 Amazing work! You've set me up for success!"
                  : completionRate >= 40
                    ? "👍 Thanks for the solid progress!"
                    : "💪 I believe in you! Every quest matters!"}
              </p>
            </div>
          </div>

          {/* Right Column - Quest List */}
          <div className={`p-4 rounded-xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"} h-fit`}>
            <h3 className="text-xl font-bold mb-4">
              ⚔️ Daily Quests ({completedTasks}/{totalTasks})
            </h3>

            {/* Add Quest Form - moved here */}
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  className={`flex-1 p-2 border rounded ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"} focus:border-blue-500 focus:outline-none`}
                  placeholder="🎯 Add new quest..."
                />
                <button
                  onClick={addTask}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded font-semibold hover:shadow-lg transition-all"
                >
                  ➕ Add
                </button>
              </div>
            </div>

            {totalTasks === 0 ? (
              <div
                className={`text-center p-6 rounded-lg border-2 border-dashed ${darkMode ? "border-gray-600" : "border-gray-300"}`}
              >
                <div className="text-3xl mb-2">🎯</div>
                <p className="font-medium">No quests yet!</p>
                <p className="text-sm opacity-70">Add your first quest to start earning XP</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                {tasks.map((task, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-2 rounded border transition-all ${
                      task.done
                        ? `${darkMode ? "bg-green-900 border-green-700" : "bg-green-50 border-green-200"} opacity-75`
                        : `${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"} hover:shadow-sm`
                    }`}
                  >
                    <button
                      onClick={() => toggleTask(i)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 ${
                        task.done
                          ? "bg-green-500 border-green-500 text-white"
                          : `border-gray-400 hover:border-blue-500 ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-50"}`
                      }`}
                    >
                      {task.done ? "✓" : ""}
                    </button>
                    <span
                      onClick={() => toggleTask(i)}
                      className={`flex-1 cursor-pointer text-sm ${task.done ? "line-through text-gray-500" : ""}`}
                    >
                      {task.done ? "🏆" : "⚔️"} {task.text}
                    </span>
                    {task.done && <span className="text-green-500 font-bold text-xs flex-shrink-0">+10 XP</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

