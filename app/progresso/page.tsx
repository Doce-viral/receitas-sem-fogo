"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BottomNav } from "@/components/bottom-nav"
import { categories } from "@/data/categories"
import { recipes } from "@/data/recipes"
import { getCompletedRecipes } from "@/lib/storage"
import { ArrowLeft, Trophy, Award, Star, Sparkles } from "lucide-react"

export default function ProgressoPage() {
  const [completedRecipes, setCompletedRecipes] = useState<string[]>([])

  useEffect(() => {
    setCompletedRecipes(getCompletedRecipes())
  }, [])

  const totalRecipes = recipes.length
  const completedCount = completedRecipes.length
  const overallProgress = (completedCount / totalRecipes) * 100

  const badges = [
    {
      id: "first",
      name: "Primeira Receita",
      description: "Faça sua primeira receita",
      icon: Star,
      unlocked: completedCount >= 1,
    },
    {
      id: "category",
      name: "Categoria Completa",
      description: "Complete uma categoria inteira",
      icon: Award,
      unlocked: categories.some((cat) => {
        const catRecipes = recipes.filter((r) => r.categoryId === cat.id)
        return catRecipes.every((r) => completedRecipes.includes(r.id))
      }),
    },
    {
      id: "eight",
      name: "8 Receitas Feitas",
      description: "Complete 8 receitas",
      icon: Sparkles,
      unlocked: completedCount >= 8,
    },
    {
      id: "sixteen",
      name: "16 Receitas Feitas",
      description: "Complete 16 receitas",
      icon: Trophy,
      unlocked: completedCount >= 16,
    },
    {
      id: "all",
      name: "Mestre Chef",
      description: "Complete todas as 32 receitas",
      icon: Trophy,
      unlocked: completedCount >= 32,
    },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Progresso</h1>
            <p className="text-sm text-muted-foreground">Acompanhe sua jornada</p>
          </div>
        </div>

        {/* Overall Progress */}
        <Card className="p-6 space-y-4 border-border/50 bg-gradient-to-br from-primary/10 to-transparent">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Progresso Geral</h2>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-lg px-3">
              {completedCount}/{totalRecipes}
            </Badge>
          </div>
          <Progress value={overallProgress} className="h-3" />
          <p className="text-sm text-muted-foreground">
            {completedCount === 0 && "Comece fazendo sua primeira receita!"}
            {completedCount > 0 &&
              completedCount < totalRecipes &&
              `Faltam ${totalRecipes - completedCount} receitas para completar`}
            {completedCount === totalRecipes && "🎉 Parabéns! Você completou todas as receitas!"}
          </p>
        </Card>

        {/* Progresso Por Categoria */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Por Categoria</h2>
          {categories.map((category) => {
            const categoryRecipes = recipes.filter((r) => r.categoryId === category.id)
            const completedCount = categoryRecipes.filter((r) => completedRecipes.includes(r.id)).length
            const progress = (completedCount / category.totalRecipes) * 100

            return (
              <Card key={category.id} className="p-5 space-y-3 border-border/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{category.name}</h3>
                  <span className="text-sm text-primary font-medium">
                    {completedCount}/{category.totalRecipes}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </Card>
            )
          })}
        </div>

        {/* Conquistas */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Conquistas</h2>
          <div className="grid gap-3">
            {badges.map((badge) => {
              const Icon = badge.icon
              return (
                <Card
                  key={badge.id}
                  className={`p-5 flex items-start gap-4 border-border/50 ${
                    badge.unlocked ? "bg-gradient-to-br from-primary/10 to-transparent" : "opacity-50"
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl ${
                      badge.unlocked ? "bg-primary/20 border border-primary/30" : "bg-muted"
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${badge.unlocked ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold flex items-center gap-2">
                      {badge.name}
                      {badge.unlocked && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          Desbloqueada
                        </Badge>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
