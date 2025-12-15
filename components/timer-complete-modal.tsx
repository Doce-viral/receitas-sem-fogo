"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, RotateCcw } from "lucide-react"

interface TimerCompleteModalProps {
  isOpen: boolean
  recipeName: string
  onStopAlarm: () => void
  onRestart: () => void
  onClose: () => void
}

export function TimerCompleteModal({ isOpen, recipeName, onStopAlarm, onRestart, onClose }: TimerCompleteModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-md p-6 space-y-6 animate-in zoom-in-95 duration-200 border-primary/50 bg-card/95 backdrop-blur-sm">
        <div className="space-y-2 text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-2xl font-bold">Tempo finalizado!</h2>
          <p className="text-muted-foreground">{recipeName} está pronto para ser retirado da geladeira</p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onStopAlarm}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-base"
          >
            <X className="w-5 h-5 mr-2" />
            Parar alarme
          </Button>

          <Button onClick={onRestart} variant="outline" className="w-full h-12 text-base bg-transparent">
            <RotateCcw className="w-5 h-5 mr-2" />
            {/* Usando "temporizador" ao invés de "timer" */}
            Reiniciar temporizador
          </Button>
        </div>

        <Button onClick={onClose} variant="ghost" size="sm" className="w-full">
          Fechar
        </Button>
      </Card>
    </div>
  )
}
