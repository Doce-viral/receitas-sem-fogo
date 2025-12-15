"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RecipeCard } from "@/components/recipe-card"
import { BottomNav } from "@/components/bottom-nav"
import { recipes } from "@/data/recipes"
import { getFavoriteRecipes } from "@/lib/storage"
import { ArrowLeft, Heart } from "lucide-react"

export default function FavoritasPage() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])

  useEffect(() => {
    setFavoriteIds(getFavoriteRecipes())
  }, [])

  const favoriteRecipes = recipes.filter((r) => favoriteIds.includes(r.id))

  return (
    <div className="min-h-screen bg-background" style={{ paddingBottom: "88px" }}>
      <div className="max-w-md mx-auto px-5 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full min-w-[44px] min-h-[44px] flex-shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold truncate">Favoritas</h1>
            <p className="text-sm text-muted-foreground whitespace-nowrap">{favoriteRecipes.length} receitas salvas</p>
          </div>
        </div>

        {favoriteRecipes.length === 0 ? (
          <Card className="p-12 text-center space-y-4 border-border/50">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-balance">Nenhuma receita favorita ainda</p>
              <p className="text-sm text-muted-foreground text-balance">
                Explore as receitas e adicione suas favoritas
              </p>
            </div>
            <Link href="/">
              <Button className="mt-4 min-h-[44px]">Explorar receitas</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-4">
            {favoriteRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                name={recipe.name}
                description={recipe.description}
                time={recipe.time}
                servings={recipe.servings}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
