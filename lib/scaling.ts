// Utility functions for scaling recipe ingredients based on production quantity

export interface ScaledIngredient {
  original: string
  scaled: string
  quantity: number
  unit: string
  item: string
}

export function parseIngredient(ingredient: string): { quantity: number; unit: string; item: string } | null {
  // Match patterns like "1 xícara de açúcar", "200g de chocolate", "3 colheres (sopa) de leite"
  const patterns = [
    /^(\d+(?:[.,]\d+)?)\s*(g|kg|ml|l|xícara|xícaras|colher|colheres|lata|latas|unidade|unidades|pacote|pacotes)(?:\s*$$[^)]+$$)?\s+(?:de\s+)?(.+)$/i,
    /^(\d+(?:[.,]\d+)?)\s*(?:de\s+)?(.+)$/i, // Fallback for simple patterns
  ]

  for (const pattern of patterns) {
    const match = ingredient.match(pattern)
    if (match) {
      const quantity = Number.parseFloat(match[1].replace(",", "."))
      const unit = match[2]?.toLowerCase() || "unidade"
      const item = match[3] || match[2]
      return { quantity, unit, item }
    }
  }

  return null
}

export function scaleIngredients(
  ingredients: string[],
  originalServings: number,
  targetUnits: number,
): ScaledIngredient[] {
  const scaleFactor = targetUnits / originalServings

  return ingredients.map((ingredient) => {
    const parsed = parseIngredient(ingredient)

    if (!parsed) {
      return {
        original: ingredient,
        scaled: ingredient,
        quantity: 0,
        unit: "",
        item: ingredient,
      }
    }

    const scaledQuantity = parsed.quantity * scaleFactor
    const formatted = scaledQuantity % 1 === 0 ? scaledQuantity.toString() : scaledQuantity.toFixed(1)

    return {
      original: ingredient,
      scaled: `${formatted} ${parsed.unit} de ${parsed.item}`,
      quantity: scaledQuantity,
      unit: parsed.unit,
      item: parsed.item,
    }
  })
}
