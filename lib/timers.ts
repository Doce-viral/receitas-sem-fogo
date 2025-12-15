// Funções utilitárias para gerenciar temporizadores de receitas

export interface RecipeTimer {
  id: string
  recipeId: string
  recipeName: string
  duration: number // em segundos
  startTime: number // timestamp
  label: string
}

let alarmAudio: HTMLAudioElement | null = null
let alarmTimeoutId: NodeJS.Timeout | null = null

export function initAlarmAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null

  if (!alarmAudio) {
    alarmAudio = new Audio("/sounds/alarm.mp3")
    alarmAudio.loop = true
  }

  return alarmAudio
}

export async function playAlarm(): Promise<void> {
  const audio = initAlarmAudio()
  if (!audio) return

  try {
    await audio.play()

    // Parar alarme após 30 segundos de segurança
    alarmTimeoutId = setTimeout(() => {
      stopAlarm()
    }, 30000)
  } catch (error) {
    console.warn("[v0] Reprodução automática de áudio bloqueada:", error)
  }
}

export function stopAlarm(): void {
  if (alarmAudio) {
    alarmAudio.pause()
    alarmAudio.currentTime = 0
  }

  if (alarmTimeoutId) {
    clearTimeout(alarmTimeoutId)
    alarmTimeoutId = null
  }
}

export function vibrateDevice(): void {
  if (typeof window === "undefined") return

  if ("vibrate" in navigator) {
    navigator.vibrate([200, 100, 200, 100, 200])
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false

  if (Notification.permission === "granted") return true

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission()
    return permission === "granted"
  }

  return false
}

export function sendTimerNotification(recipeName: string): void {
  if (typeof window === "undefined" || !("Notification" in window)) return

  if (Notification.permission === "granted") {
    new Notification("Temporizador finalizado", {
      body: `${recipeName}: tempo de geladeira concluído`,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
    })
  }
}

export function getActiveTimers(): RecipeTimer[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("active-timers")
  return stored ? JSON.parse(stored) : []
}

export function startTimer(recipeId: string, recipeName: string, durationMinutes: number, label: string): RecipeTimer {
  const timer: RecipeTimer = {
    id: Date.now().toString(),
    recipeId,
    recipeName,
    duration: durationMinutes * 60,
    startTime: Date.now(),
    label,
  }

  const timers = getActiveTimers()
  timers.push(timer)
  localStorage.setItem("active-timers", JSON.stringify(timers))

  return timer
}

export function removeTimer(timerId: string): void {
  const timers = getActiveTimers()
  const filtered = timers.filter((t) => t.id !== timerId)
  localStorage.setItem("active-timers", JSON.stringify(filtered))
}

export function getRemainingTime(timer: RecipeTimer): number {
  const elapsed = (Date.now() - timer.startTime) / 1000
  const remaining = timer.duration - elapsed
  return Math.max(0, Math.floor(remaining))
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m ${secs}s`
}
