"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Grid3x3, TrendingUp, Heart, Calculator } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  const links = [
    { href: "/", icon: Home, label: "Início" },
    { href: "/categorias", icon: Grid3x3, label: "Categorias" },
    { href: "/precificacao", icon: Calculator, label: "Preço" },
    { href: "/progresso", icon: TrendingUp, label: "Progresso" },
    { href: "/favoritas", icon: Heart, label: "Favoritas" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around px-2" style={{ height: "68px" }}>
        {links.map((link) => {
          const isActive = pathname === link.href
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] px-3 py-2 text-xs transition-colors rounded-lg",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-[11px] leading-none">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
