export interface Costs {
  ingredients: number
  packaging: number
  label: number
  energy: number
  labor: number
  platformFee: number
  cardFee: number
  losses: number
}

export function computeTotalCost(costs: Costs, yieldAmount: number): number {
  const { ingredients, packaging, label, energy, labor, platformFee, cardFee, losses } = costs

  const directCosts = ingredients + packaging + label + energy + labor
  const platformFeeAmount = directCosts * (platformFee / 100)
  const cardFeeAmount = directCosts * (cardFee / 100)
  const lossesAmount = directCosts * (losses / 100)

  return directCosts + platformFeeAmount + cardFeeAmount + lossesAmount
}

export function computeCostPerUnit(totalCost: number, yieldAmount: number): number {
  if (yieldAmount === 0) return 0
  return totalCost / yieldAmount
}

export function computeSuggestedPrice(
  costPerUnit: number,
  method: "margin" | "markup" | "profit",
  value: number,
): number {
  switch (method) {
    case "margin":
      // Preço = Custo / (1 - Margem/100)
      if (value >= 100) return costPerUnit * 10
      return costPerUnit / (1 - value / 100)
    case "markup":
      // Preço = Custo * Markup
      return costPerUnit * value
    case "profit":
      // Preço = Custo + Lucro desejado
      return costPerUnit + value
    default:
      return costPerUnit
  }
}

export function computeProfitPerUnit(suggestedPrice: number, costPerUnit: number): number {
  return suggestedPrice - costPerUnit
}

export function computeMarginPercent(profitPerUnit: number, suggestedPrice: number): number {
  if (suggestedPrice === 0) return 0
  return (profitPerUnit / suggestedPrice) * 100
}

export type RoundingMode = "none" | "ninety" | "ninetynine" | "integer"

export function applyRounding(price: number, mode: RoundingMode): number {
  switch (mode) {
    case "ninety":
      return Math.ceil(price) - 0.1
    case "ninetynine":
      return Math.ceil(price) - 0.01
    case "integer":
      return Math.round(price)
    case "none":
    default:
      return price
  }
}
