"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RecipeCard } from "@/components/recipe-card"
import { BottomNav } from "@/components/bottom-nav"
import { categories } from "@/data/categories"
import { recipes } from "@/data/recipes"
import { getCompletedRecipes } from "@/lib/storage"
import { ArrowLeft } from "lucide-react"

export default function CategoryPage() {
  const params = useParams()
  const categoryId = params.id as string
  const [completedRecipes, setCompletedRecipes] = useState<string[]>([])

  useEffect(() => {
    setCompletedRecipes(getCompletedRecipes())
  }, [])

  const category = categories.find((c) => c.id === categoryId)
  const categoryRecipes = recipes.filter((r) => r.categoryId === categoryId)
  const completedCount = categoryRecipes.filter((r) => completedRecipes.includes(r.id)).length
  const progress = (completedCount / category!.totalRecipes) * 100

  if (!category) {
    return <div>Categoria não encontrada</div>
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/categorias">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-balance">{category.name}</h1>
            <p className="text-sm text-muted-foreground">8 receitas sem fogo</p>
          </div>
        </div>

        <div className="space-y-2 p-4 rounded-xl bg-card border border-border/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="text-primary font-semibold">{completedCount}/8 receitas</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid gap-4">
          {categoryRecipes.map((recipe) => (
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
      </div>

      <BottomNav />
    </div>
  )
}
