"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Home, Package } from "lucide-react"
import { cn } from "@/lib/utils"

type Mode = "home" | "production"

interface ModeContextType {
  mode: Mode
  setMode: (mode: Mode) => void
}

const ModeContext = createContext<ModeContextType | undefined>(undefined)

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("home")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("app-mode") as Mode | null
      if (stored) {
        setMode(stored)
      }
    }
  }, [])

  const handleSetMode = (newMode: Mode) => {
    setMode(newMode)
    localStorage.setItem("app-mode", newMode)
  }

  return <ModeContext.Provider value={{ mode, setMode: handleSetMode }}>{children}</ModeContext.Provider>
}

export function useMode() {
  const context = useContext(ModeContext)
  if (!context) {
    throw new Error("useMode must be used within ModeProvider")
  }
  return context
}

export function ModeToggle() {
  const { mode, setMode } = useMode()

  return (
    <div className="flex items-center gap-2 p-1 bg-card/50 backdrop-blur-sm rounded-full border border-border/50">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMode("home")}
        className={cn(
          "rounded-full px-4 h-9 transition-all",
          mode === "home" && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
        )}
      >
        <Home className="w-4 h-4 mr-2" />
        Fazer em casa
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMode("production")}
        className={cn(
          "rounded-full px-4 h-9 transition-all",
          mode === "production" &&
            "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
        )}
      >
        <Package className="w-4 h-4 mr-2" />
        Produção
      </Button>
    </div>
  )
}
