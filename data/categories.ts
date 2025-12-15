export interface Category {
  id: string
  name: string
  description: string
  totalRecipes: number
}

export const categories: Category[] = [
  {
    id: "doces-de-colher",
    name: "Doces de Colher",
    description: "Cremosos e irresistíveis",
    totalRecipes: 8,
  },
  {
    id: "sobremesas-no-pote",
    name: "Sobremesas no Pote",
    description: "Perfeitas para vender",
    totalRecipes: 8,
  },
  {
    id: "mousses",
    name: "Mousses",
    description: "Leves e aeradas",
    totalRecipes: 8,
  },
  {
    id: "gelados",
    name: "Gelados",
    description: "Refrescantes e cremosos",
    totalRecipes: 8,
  },
]
