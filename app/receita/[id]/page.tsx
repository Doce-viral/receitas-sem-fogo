import Link from "next/link"
import Image from "next/image"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { categories } from "@/data/categories"
import { recipes } from "@/data/recipes"

export default function HomePage() {
  // Mostra algumas receitas na home (pode aumentar depois)
  const featured = recipes.slice(0, 12)

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="max-w-md mx-auto px-6 pt-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Receitas</h1>
          <p className="text-sm text-muted-foreground">Escolha uma categoria ou uma receita.</p>
        </div>

        {/* Categorias */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Categorias</h2>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {categories.length}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/categoria/${cat.id}`} className="block">
                <Card className="overflow-hidden border-border/50 hover:border-primary/40 transition-colors">
                  <div className="relative h-24 bg-muted">
                    <Image
                      src={(cat as any).imageUrl || "/placeholder.jpg"}
                      alt={cat.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-sm font-semibold leading-tight">{cat.name}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Receitas */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Receitas</h2>

          <div className="space-y-4">
            {featured.map((r) => {
              const catName = (categories.find((c) => c.id === r.categoryId) || { name: "Categoria" }).name

              return (
                <Link key={r.id} href={`/receita/${r.id}`} className="block">
                  <Card className="p-4 border-border/50 hover:border-primary/40 transition-colors">
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={`/images/recipes/${r.id}.png`}
                          alt={r.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.jpg"
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{r.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>

                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            {catName}
                          </Badge>
                          <Badge variant="secondary" className="bg-muted/50 border-border/50">
                            {r.time}
                          </Badge>
                          <Badge variant="secondary" className="bg-muted/50 border-border/50">
                            {r.servings} porções
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
