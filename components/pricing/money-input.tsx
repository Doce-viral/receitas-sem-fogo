"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface MoneyInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  placeholder?: string
}

export function MoneyInput({ label, value, onChange, placeholder }: MoneyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number.parseFloat(e.target.value) || 0
    onChange(val)
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={value || ""}
          onChange={handleChange}
          placeholder={placeholder || "0,00"}
          className="pl-10 bg-secondary/50 border-border/50"
        />
      </div>
    </div>
  )
}
