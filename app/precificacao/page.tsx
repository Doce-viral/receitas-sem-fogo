"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { MoneyInput } from "@/components/pricing/money-input"
import { PercentInput } from "@/components/pricing/percent-input"
import { SummaryCard } from "@/components/pricing/summary-card"
import { BottomNav } from "@/components/bottom-nav"
import { recipes } from "@/data/recipes"
import { categories } from "@/data/categories"
import {
  computeTotalCost,
  computeCostPerUnit,
  computeSuggestedPrice,
  computeProfitPerUnit,
  computeMarginPercent,
  applyRounding,
  type RoundingMode,
  type Costs,
} from "@/lib/pricing"
import { savePricingHistory, getPricingHistory } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Trash2 } from "lucide-react"

export default function PrecificacaoPage() {
  const { toast } = useToast()

  const [selectedRecipeId, setSelectedRecipeId] = useState<string>("")
  const [yieldAmount, setYieldAmount] = useState<number>(0)
  const [costs, setCosts] = useState<Costs>({
    ingredients: 0,
    packaging: 0,
    label: 0,
    energy: 0,
    labor: 0,
    platformFee: 0,
    cardFee: 0,
    losses: 0,
  })
  const [method, setMethod] = useState<"margin" | "markup" | "profit">("margin")
  const [methodValue, setMethodValue] = useState<number>(0)
  const [roundingMode, setRoundingMode] = useState<RoundingMode>("none")
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState(getPricingHistory())

  const selectedRecipe = recipes.find((r) => r.id === selectedRecipeId)
  const selectedCategory = selectedRecipe ? categories.find((c) => c.id === selectedRecipe.categoryId) : null

  const totalCost = computeTotalCost(costs, yieldAmount)
  const costPerUnit = computeCostPerUnit(totalCost, yieldAmount)
  const rawPrice = computeSuggestedPrice(costPerUnit, method, methodValue)
  const suggestedPrice = applyRounding(rawPrice, roundingMode)
  const profitPerUnit = computeProfitPerUnit(suggestedPrice, costPerUnit)
  const marginPercent = computeMarginPercent(profitPerUnit, suggestedPrice)

  const handleRecipeChange = (recipeId: string) => {
    setSelectedRecipeId(recipeId)
    const recipe = recipes.find((r) => r.id === recipeId)
    if (recipe) {
      setYieldAmount(recipe.servings)
    }
  }

  const handleSave = () => {
    if (!selectedRecipe) return

    savePricingHistory({
      recipeId: selectedRecipe.id,
      recipeName: selectedRecipe.name,
      yield: yieldAmount,
      costs,
      method,
      methodValue,
      costPerUnit,
      suggestedPrice,
      profitPerUnit,
      marginPercent,
    })

    setHistory(getPricingHistory())

    toast({
      title: "Salvo com sucesso!",
      description: "Calculo salvo no historico",
    })
  }

  const handleDeleteHistory = (id: string) => {
    const { deletePricingHistory } = require("@/lib/storage")
    deletePricingHistory(id)
    setHistory(getPricingHistory())
    toast({
      title: "Removido",
      description: "Item removido do historico",
    })
  }

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
            <h1 className="text-3xl font-bold">Precificação</h1>
            <p className="text-sm text-muted-foreground">Calcule o preço ideal</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={!showHistory ? "default" : "outline"}
            onClick={() => setShowHistory(false)}
            className="flex-1"
          >
            Calculadora
          </Button>
          <Button variant={showHistory ? "default" : "outline"} onClick={() => setShowHistory(true)} className="flex-1">
            Historico ({history.length})
          </Button>
        </div>

        {!showHistory ? (
          <>
            {/* Recipe Selector */}
            <Card className="p-6 space-y-4 border-border/50">
              <div className="space-y-2">
                <Label>Receita</Label>
                <Select value={selectedRecipeId} onValueChange={handleRecipeChange}>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="Selecione uma receita" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <div key={category.id}>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{category.name}</div>
                        {recipes
                          .filter((r) => r.categoryId === category.id)
                          .map((recipe) => (
                            <SelectItem key={recipe.id} value={recipe.id}>
                              {recipe.name}
                            </SelectItem>
                          ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Rendimento (unidades)</Label>
                <Input
                  type="number"
                  min="1"
                  value={yieldAmount || ""}
                  onChange={(e) => setYieldAmount(Number.parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="bg-secondary/50"
                />
              </div>
            </Card>

            {/* Campos de Custos */}
            <Card className="p-6 space-y-4 border-border/50">
              <h3 className="font-semibold text-lg">Custos</h3>

              <MoneyInput
                label="Custo dos ingredientes"
                value={costs.ingredients}
                onChange={(v) => setCosts({ ...costs, ingredients: v })}
              />

              <MoneyInput
                label="Embalagem"
                value={costs.packaging}
                onChange={(v) => setCosts({ ...costs, packaging: v })}
              />

              <MoneyInput
                label="Etiqueta/Adesivo"
                value={costs.label}
                onChange={(v) => setCosts({ ...costs, label: v })}
              />

              <MoneyInput
                label="Energia/Gás (opcional)"
                value={costs.energy}
                onChange={(v) => setCosts({ ...costs, energy: v })}
              />

              <MoneyInput label="Mão de obra" value={costs.labor} onChange={(v) => setCosts({ ...costs, labor: v })} />

              <PercentInput
                label="Taxa plataforma (opcional)"
                value={costs.platformFee}
                onChange={(v) => setCosts({ ...costs, platformFee: v })}
              />

              <PercentInput
                label="Taxa maquininha (opcional)"
                value={costs.cardFee}
                onChange={(v) => setCosts({ ...costs, cardFee: v })}
              />

              <PercentInput
                label="Perdas/Quebras (opcional)"
                value={costs.losses}
                onChange={(v) => setCosts({ ...costs, losses: v })}
              />
            </Card>

            {/* Metodo de Precificacao */}
            <Card className="p-6 space-y-4 border-border/50">
              <h3 className="font-semibold text-lg">Metodo de precificacao</h3>

              <Tabs value={method} onValueChange={(v) => setMethod(v as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="margin">Margem %</TabsTrigger>
                  <TabsTrigger value="markup">Markup</TabsTrigger>
                  <TabsTrigger value="profit">Lucro R$</TabsTrigger>
                </TabsList>

                <TabsContent value="margin" className="space-y-2">
                  <PercentInput
                    label="Margem de lucro desejada"
                    value={methodValue}
                    onChange={setMethodValue}
                    placeholder="Ex: 40"
                  />
                  <p className="text-xs text-muted-foreground">Recomendado: 30% a 50% para sobremesas</p>
                </TabsContent>

                <TabsContent value="markup" className="space-y-2">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Multiplicador (markup)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="1"
                      value={methodValue || ""}
                      onChange={(e) => setMethodValue(Number.parseFloat(e.target.value) || 0)}
                      placeholder="Ex: 2.5"
                      className="bg-secondary/50"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Recomendado: 2x a 3x o custo</p>
                </TabsContent>

                <TabsContent value="profit" className="space-y-2">
                  <MoneyInput
                    label="Lucro desejado por unidade"
                    value={methodValue}
                    onChange={setMethodValue}
                    placeholder="Ex: 5,00"
                  />
                  <p className="text-xs text-muted-foreground">Valor fixo de lucro por unidade</p>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Arredondamento */}
            <Card className="p-6 space-y-4 border-border/50">
              <h3 className="font-semibold text-lg">Arredondamento</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ninety" className="text-sm">
                    Arredondar para .90
                  </Label>
                  <Switch
                    id="ninety"
                    checked={roundingMode === "ninety"}
                    onCheckedChange={(checked) => setRoundingMode(checked ? "ninety" : "none")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="ninetynine" className="text-sm">
                    Arredondar para .99
                  </Label>
                  <Switch
                    id="ninetynine"
                    checked={roundingMode === "ninetynine"}
                    onCheckedChange={(checked) => setRoundingMode(checked ? "ninetynine" : "none")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="integer" className="text-sm">
                    Arredondar para inteiro
                  </Label>
                  <Switch
                    id="integer"
                    checked={roundingMode === "integer"}
                    onCheckedChange={(checked) => setRoundingMode(checked ? "integer" : "none")}
                  />
                </div>
              </div>
            </Card>

            {/* Resumo */}
            {selectedRecipe && yieldAmount > 0 && costPerUnit > 0 && (
              <SummaryCard
                recipeName={selectedRecipe.name}
                categoryName={selectedCategory?.name || ""}
                costPerUnit={costPerUnit}
                suggestedPrice={suggestedPrice}
                profitPerUnit={profitPerUnit}
                marginPercent={marginPercent}
                onSave={handleSave}
              />
            )}
          </>
        ) : (
          <div className="space-y-4">
            {history.length === 0 ? (
              <Card className="p-12 text-center space-y-2 border-border/50">
                <p className="text-muted-foreground">Nenhum calculo salvo ainda</p>
                <Button onClick={() => setShowHistory(false)} variant="outline">
                  Fazer primeiro calculo
                </Button>
              </Card>
            ) : (
              history.map((item) => {
                const recipe = recipes.find((r) => r.id === item.recipeId)
                const category = recipe ? categories.find((c) => c.id === recipe.categoryId) : null

                return (
                  <Card key={item.id} className="p-5 space-y-3 border-border/50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{item.recipeName}</h3>
                        <p className="text-xs text-muted-foreground">
                          {category?.name} • {new Date(item.date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteHistory(item.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Custo/unidade</p>
                        <p className="font-semibold">R$ {item.costPerUnit.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Preço sugerido</p>
                        <p className="font-semibold text-primary">R$ {item.suggestedPrice.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Lucro/unidade</p>
                        <p className="font-semibold text-green-500">R$ {item.profitPerUnit.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Margem</p>
                        <p className="font-semibold text-green-500">{item.marginPercent.toFixed(1)}%</p>
                      </div>
                    </div>
                  </Card>
                )
              })
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
