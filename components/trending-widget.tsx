"use client"

import { cn } from "@/lib/utils"

import { useEffect, useState } from "react"
import { Flame, Sparkles } from "lucide-react"
import { getFavoriteRecipes } from "@/lib/storage"
import { recipes } from "@/data/recipes"

export function TrendingWidget() {
  const [currentRecipe, setCurrentRecipe] = useState<{
    name: string
    count: number
  } | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const updateTrending = () => {
      const favorites = getFavoriteRecipes()

      const favCounts = favorites.reduce(
        (acc, id) => {
          acc[id] = (acc[id] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      const recipesWithFavorites = recipes
        .map((r) => ({
          recipe: r,
          count: favCounts[r.id] || 0,
        }))
        .filter((item) => item.count > 0)
        .sort((a, b) => b.count - a.count)

      if (recipesWithFavorites.length > 0) {
        const trending = recipesWithFavorites[Math.floor(Math.random() * Math.min(3, recipesWithFavorites.length))]
        setCurrentRecipe({
          name: trending.recipe.name,
          count: trending.count,
        })
      } else {
        const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)]
        setCurrentRecipe({
          name: randomRecipe.name,
          count: 0,
        })
      }
    }

    updateTrending()

    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        updateTrending()
        setIsVisible(true)
      }, 300)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  if (!currentRecipe) return null

  const isTrending = currentRecipe.count >= 1
  const label = isTrending ? "Em alta agora" : "Sugestão de hoje"
  const subtitle = isTrending
    ? `Hoje: ${currentRecipe.count} ${currentRecipe.count === 1 ? "pessoa salvou" : "pessoas salvaram"} esta receita`
    : "Uma das receitas perfeitas para começar"

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-5 transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0",
      )}
      style={{ minHeight: "132px" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(251,191,36,0.15),transparent_70%)]" />
      <div className="relative space-y-2">
        <div className="flex items-center gap-2 text-primary">
          {isTrending ? (
            <Flame className="w-4 h-4 flex-shrink-0 animate-pulse" />
          ) : (
            <Sparkles className="w-4 h-4 flex-shrink-0" />
          )}
          <span className="text-sm font-semibold uppercase tracking-wide">{label}</span>
        </div>
        <p className="text-base font-medium leading-relaxed line-clamp-2">{currentRecipe.name}</p>
        <p className="text-sm text-muted-foreground line-clamp-2">{subtitle}</p>
      </div>
    </div>
  )
}
