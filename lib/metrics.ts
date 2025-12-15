// Utility functions for tracking and calculating recipe metrics

export function getFavoriteCount(recipeId: string): number {
  if (typeof window === "undefined") return 0
  const favorites = localStorage.getItem("favorite-recipes")
  if (!favorites) return 0
  const list: string[] = JSON.parse(favorites)
  return list.filter((id) => id === recipeId).length
}

export function getAllFavoriteCounts(): Record<string, number> {
  if (typeof window === "undefined") return {}
  const favorites = localStorage.getItem("favorite-recipes")
  if (!favorites) return {}

  const list: string[] = JSON.parse(favorites)
  const counts: Record<string, number> = {}

  list.forEach((id) => {
    counts[id] = (counts[id] || 0) + 1
  })

  return counts
}

export function getTrendingRecipes(limit = 5): string[] {
  const counts = getAllFavoriteCounts()
  const sorted = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([id]) => id)

  return sorted.slice(0, limit)
}
