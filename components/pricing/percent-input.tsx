"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PercentInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  placeholder?: string
}

export function PercentInput({ label, value, onChange, placeholder }: PercentInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number.parseFloat(e.target.value) || 0
    onChange(val)
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <div className="relative">
        <Input
          type="number"
          step="0.01"
          min="0"
          max="100"
          value={value || ""}
          onChange={handleChange}
          placeholder={placeholder || "0"}
          className="pr-8 bg-secondary/50 border-border/50"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
      </div>
    </div>
  )
}
