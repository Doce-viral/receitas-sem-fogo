// Utility functions for generating and managing shopping lists

export interface ShoppingListItem {
  id: string
  name: string
  quantity: number
  unit: string
  category: string
  checked: boolean
  recipeIds: string[]
}

export interface ShoppingList {
  id: string
  name: string
  createdAt: string
  items: ShoppingListItem[]
}

function categorizeIngredient(itemName: string): string {
  const lowerName = itemName.toLowerCase()

  if (
    lowerName.includes("leite") ||
    lowerName.includes("creme") ||
    lowerName.includes("queijo") ||
    lowerName.includes("iogurte") ||
    lowerName.includes("manteiga")
  ) {
    return "Laticínios"
  }
  if (
    lowerName.includes("açúcar") ||
    lowerName.includes("farinha") ||
    lowerName.includes("chocolate em pó") ||
    lowerName.includes("amido")
  ) {
    return "Secos"
  }
  if (
    lowerName.includes("morango") ||
    lowerName.includes("limão") ||
    lowerName.includes("abacaxi") ||
    lowerName.includes("manga") ||
    lowerName.includes("fruta")
  ) {
    return "Frutas"
  }

  return "Outros"
}

export function generateShoppingList(
  recipes: Array<{ id: string; name: string; ingredients: string[] }>,
  name?: string,
): ShoppingList {
  const itemsMap = new Map<string, ShoppingListItem>()

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      // Simple parsing - extract item name from ingredient string
      const parts = ingredient.split(" de ")
      const itemName = parts[parts.length - 1].trim()
      const key = itemName.toLowerCase()

      if (itemsMap.has(key)) {
        const existing = itemsMap.get(key)!
        existing.recipeIds.push(recipe.id)
      } else {
        itemsMap.set(key, {
          id: Math.random().toString(36).substr(2, 9),
          name: itemName,
          quantity: 1,
          unit: "unidade",
          category: categorizeIngredient(itemName),
          checked: false,
          recipeIds: [recipe.id],
        })
      }
    })
  })

  return {
    id: Date.now().toString(),
    name: name || `Lista ${new Date().toLocaleDateString("pt-BR")}`,
    createdAt: new Date().toISOString(),
    items: Array.from(itemsMap.values()).sort((a, b) => a.category.localeCompare(b.category)),
  }
}

export function getShoppingLists(): ShoppingList[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("shopping-lists")
  return stored ? JSON.parse(stored) : []
}

export function saveShoppingList(list: ShoppingList): void {
  const lists = getShoppingLists()
  const index = lists.findIndex((l) => l.id === list.id)

  if (index > -1) {
    lists[index] = list
  } else {
    lists.unshift(list)
  }

  localStorage.setItem("shopping-lists", JSON.stringify(lists))
}

export function deleteShoppingList(id: string): void {
  const lists = getShoppingLists()
  const filtered = lists.filter((l) => l.id !== id)
  localStorage.setItem("shopping-lists", JSON.stringify(filtered))
}

export function toggleShoppingListItem(listId: string, itemId: string): void {
  const lists = getShoppingLists()
  const list = lists.find((l) => l.id === listId)

  if (list) {
    const item = list.items.find((i) => i.id === itemId)
    if (item) {
      item.checked = !item.checked
      saveShoppingList(list)
    }
  }
}
