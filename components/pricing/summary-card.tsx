"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SummaryCardProps {
  recipeName: string
  categoryName: string
  costPerUnit: number
  suggestedPrice: number
  profitPerUnit: number
  marginPercent: number
  onSave: () => void
}

export function SummaryCard({
  recipeName,
  categoryName,
  costPerUnit,
  suggestedPrice,
  profitPerUnit,
  marginPercent,
  onSave,
}: SummaryCardProps) {
  const { toast } = useToast()

  const handleCopyPrice = () => {
    navigator.clipboard.writeText(suggestedPrice.toFixed(2))
    toast({
      title: "Preço copiado!",
      description: `R$ ${suggestedPrice.toFixed(2)} copiado para área de transferência`,
    })
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/10 via-card to-card border-primary/20">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg text-foreground">{recipeName}</h3>
          <Badge variant="secondary" className="mt-1 bg-primary/10 text-primary border-primary/20">
            {categoryName}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Custo/unidade</p>
            <p className="text-lg font-semibold text-foreground">R$ {costPerUnit.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Preço sugerido</p>
            <p className="text-2xl font-bold text-primary">R$ {suggestedPrice.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Lucro/unidade</p>
            <p className="text-lg font-semibold text-green-500">R$ {profitPerUnit.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Margem</p>
            <p className="text-lg font-semibold text-green-500">{marginPercent.toFixed(1)}%</p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleCopyPrice} variant="outline" className="flex-1 bg-transparent">
            <Copy className="w-4 h-4 mr-2" />
            Copiar preço
          </Button>
          <Button onClick={onSave} className="flex-1 bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>
    </Card>
  )
}
