export function getCompletedRecipes(): string[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("completed-recipes")
  return stored ? JSON.parse(stored) : []
}

export function toggleRecipeCompleted(recipeId: string): void {
  const completed = getCompletedRecipes()
  const index = completed.indexOf(recipeId)

  if (index > -1) {
    completed.splice(index, 1)
  } else {
    completed.push(recipeId)
  }

  localStorage.setItem("completed-recipes", JSON.stringify(completed))
}

export function getFavoriteRecipes(): string[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("favorite-recipes")
  return stored ? JSON.parse(stored) : []
}

export function toggleRecipeFavorite(recipeId: string): void {
  const favorites = getFavoriteRecipes()
  const index = favorites.indexOf(recipeId)

  if (index > -1) {
    favorites.splice(index, 1)
  } else {
    favorites.push(recipeId)
  }

  localStorage.setItem("favorite-recipes", JSON.stringify(favorites))
}

export interface StepProgress {
  recipeId: string
  completedSteps: number[]
}

export function getStepProgress(recipeId: string): number[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("step-progress")
  const allProgress: StepProgress[] = stored ? JSON.parse(stored) : []
  const recipeProgress = allProgress.find((p) => p.recipeId === recipeId)
  return recipeProgress?.completedSteps || []
}

export function toggleStepCompletion(recipeId: string, stepIndex: number): void {
  const stored = localStorage.getItem("step-progress")
  const allProgress: StepProgress[] = stored ? JSON.parse(stored) : []

  let recipeProgress = allProgress.find((p) => p.recipeId === recipeId)

  if (!recipeProgress) {
    recipeProgress = { recipeId, completedSteps: [] }
    allProgress.push(recipeProgress)
  }

  const index = recipeProgress.completedSteps.indexOf(stepIndex)
  if (index > -1) {
    recipeProgress.completedSteps.splice(index, 1)
  } else {
    recipeProgress.completedSteps.push(stepIndex)
  }

  localStorage.setItem("step-progress", JSON.stringify(allProgress))
}

export function clearStepProgress(recipeId: string): void {
  const stored = localStorage.getItem("step-progress")
  const allProgress: StepProgress[] = stored ? JSON.parse(stored) : []
  const filtered = allProgress.filter((p) => p.recipeId !== recipeId)
  localStorage.setItem("step-progress", JSON.stringify(filtered))
}

export interface PricingHistory {
  id: string
  date: string
  recipeId: string
  recipeName: string
  yield: number
  costs: {
    ingredients: number
    packaging: number
    label: number
    energy: number
    labor: number
    platformFee: number
    cardFee: number
    losses: number
  }
  method: "margin" | "markup" | "profit"
  methodValue: number
  costPerUnit: number
  suggestedPrice: number
  profitPerUnit: number
  marginPercent: number
}

export function getPricingHistory(): PricingHistory[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("pricing-history")
  return stored ? JSON.parse(stored) : []
}

export function savePricingHistory(entry: Omit<PricingHistory, "id" | "date">): void {
  const history = getPricingHistory()
  const newEntry: PricingHistory = {
    ...entry,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  }
  history.unshift(newEntry)
  // Keep only last 50 entries
  if (history.length > 50) {
    history.pop()
  }
  localStorage.setItem("pricing-history", JSON.stringify(history))
}

export function deletePricingHistory(id: string): void {
  const history = getPricingHistory()
  const filtered = history.filter((h) => h.id !== id)
  localStorage.setItem("pricing-history", JSON.stringify(filtered))
}
