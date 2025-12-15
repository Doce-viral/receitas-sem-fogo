"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Heart } from "lucide-react"
import { toggleRecipeFavorite, getFavoriteRecipes } from "@/lib/storage"
import { cn } from "@/lib/utils"

interface RecipeCardProps {
  id: string
  name: string
  description: string
  time: string
  servings: number
  imageUrl?: string
}

export function RecipeCard({ id, name, description, time, servings, imageUrl }: RecipeCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    setIsFavorite(getFavoriteRecipes().includes(id))
  }, [id])

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleRecipeFavorite(id)
    setIsFavorite(!isFavorite)
  }

  const imageSrc = imageUrl || "/images/placeholder.jpg"

  return (
    <Link href={`/receita/${id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/80 group">
        <div className="aspect-[3/2] relative overflow-hidden rounded-t-2xl">
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              if (target.src !== "/images/placeholder.jpg") {
                target.src = "/images/placeholder.jpg"
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "absolute top-3 right-3 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card min-w-[44px] min-h-[44px]",
              isFavorite && "text-red-500",
            )}
            onClick={handleToggleFavorite}
          >
            <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
          </Button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <h3 className="font-semibold text-lg leading-tight text-balance line-clamp-2 min-h-[3.5rem]">{name}</h3>
            <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 min-h-[2.5rem]">{description}</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 flex-shrink-0 text-primary" />
              <span className="whitespace-nowrap">{time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 flex-shrink-0 text-primary" />
              <span className="whitespace-nowrap">{servings} porções</span>
            </div>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 whitespace-nowrap">
            Sem fogo
          </Badge>
        </div>
      </Card>
    </Link>
  )
}
