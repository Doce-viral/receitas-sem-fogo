"use client"

import { useEffect, useState } from "react"
import { CategoryCard } from "@/components/category-card"
import { BottomNav } from "@/components/bottom-nav"
import { categories } from "@/data/categories"
import { recipes } from "@/data/recipes"
import { getCompletedRecipes } from "@/lib/storage"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CategoriasPage() {
  const [completedRecipes, setCompletedRecipes] = useState<string[]>([])

  useEffect(() => {
    setCompletedRecipes(getCompletedRecipes())
  }, [])

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
            <h1 className="text-3xl font-bold truncate">Categorias</h1>
            <p className="text-sm text-muted-foreground whitespace-nowrap">4 categorias • 32 receitas</p>
          </div>
        </div>

        <div className="grid gap-4">
          {categories.map((category) => {
            const categoryRecipes = recipes.filter((r) => r.categoryId === category.id)
            const completedCount = categoryRecipes.filter((r) => completedRecipes.includes(r.id)).length

            return (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                description={category.description}
                totalRecipes={category.totalRecipes}
                completedCount={completedCount}
              />
            )
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
