import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChefHat } from "lucide-react"

interface CategoryCardProps {
  id: string
  name: string
  description: string
  totalRecipes: number
  completedCount: number
}

export function CategoryCard({ id, name, description, totalRecipes, completedCount }: CategoryCardProps) {
  const progress = (completedCount / totalRecipes) * 100

  return (
    <Link href={`/categoria/${id}`}>
      <Card className="p-6 min-h-[120px] hover:bg-accent/50 transition-all cursor-pointer border-border/40 bg-gradient-to-br from-card to-card/50 shadow-sm hover:shadow-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex-shrink-0">
            <ChefHat className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 space-y-3 min-w-0">
            <div>
              <h3 className="font-semibold text-lg text-foreground truncate">{name}</h3>
              <p className="text-sm text-muted-foreground/70 leading-relaxed line-clamp-2">{description}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground/80 whitespace-nowrap">{totalRecipes} receitas</span>
                <span className="text-primary font-medium whitespace-nowrap">
                  {completedCount}/{totalRecipes}
                </span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
