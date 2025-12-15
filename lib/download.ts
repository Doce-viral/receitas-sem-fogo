// Utilitario para baixar arquivos de texto em navegadores mobile e desktop

export function downloadTextFile(filename: string, content: string): void {
  // Criar um Blob com o tipo MIME apropriado para arquivos de texto
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" })

  // Criar uma URL temporaria para o blob
  const url = URL.createObjectURL(blob)

  // Criar um elemento ancora temporario e acionar o download
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.style.display = "none"

  // Adicionar ao body, clicar e limpar
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)

  // Liberar a URL do blob para liberar memoria
  URL.revokeObjectURL(url)
}

// Funcao auxiliar para formatar quantidades de ingredientes amigaveis para o mercado
function formatMarketFriendlyIngredient(scaledText: string): string {
  // Identificar padroes como "2.5 latas de leite condensado" ou "1.3 xicaras de acucar"
  const match = scaledText.match(/^([\d.]+)\s+(lata|latas|pacote|pacotes|unidade|unidades|caixa|caixas)\s+(.+)$/i)

  if (!match) {
    // Se nenhuma unidade de compra for encontrada, retornar como esta
    return scaledText
  }

  const quantity = Number.parseFloat(match[1])
  const unit = match[2]
  const item = match[3]

  // Sempre arredondar PARA CIMA as quantidades de compra
  const purchaseQuantity = Math.ceil(quantity)

  // Se ja for um numero inteiro, nao precisa de orientacao de uso
  if (quantity === purchaseQuantity) {
    return `${purchaseQuantity} ${purchaseQuantity === 1 ? unit.replace("s", "") : unit} ${item}`
  }

  // Formatar a quantidade de uso real como uma fracao
  const usageText = formatUsageGuidance(quantity)

  return `${purchaseQuantity} ${purchaseQuantity === 1 ? unit.replace("s", "") : unit} ${item} (usar aproximadamente ${usageText})`
}

function formatUsageGuidance(quantity: number): string {
  const wholePart = Math.floor(quantity)
  const fractionalPart = quantity - wholePart

  // Convert fractional part to common fractions
  if (fractionalPart < 0.01) {
    return wholePart.toString()
  } else if (fractionalPart > 0.9) {
    return (wholePart + 1).toString()
  } else if (Math.abs(fractionalPart - 0.5) < 0.1) {
    return wholePart > 0 ? `${wholePart} e 1/2` : "1/2"
  } else if (Math.abs(fractionalPart - 0.33) < 0.1) {
    return wholePart > 0 ? `${wholePart} e 1/3` : "1/3"
  } else if (Math.abs(fractionalPart - 0.67) < 0.1) {
    return wholePart > 0 ? `${wholePart} e 2/3` : "2/3"
  } else if (Math.abs(fractionalPart - 0.25) < 0.1) {
    return wholePart > 0 ? `${wholePart} e 1/4` : "1/4"
  } else if (Math.abs(fractionalPart - 0.75) < 0.1) {
    return wholePart > 0 ? `${wholePart} e 3/4` : "3/4"
  } else {
    // For other decimals, show with 1 decimal place
    return quantity.toFixed(1).replace(".", ",")
  }
}

export function generateShoppingList(
  recipeName: string,
  recipeId: string,
  productionUnits: number,
  scaledIngredients: { scaled: string }[],
): { filename: string; content: string } {
  // Format current date as dd/mm/yyyy
  const now = new Date()
  const day = String(now.getDate()).padStart(2, "0")
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const year = now.getFullYear()
  const formattedDate = `${day}/${month}/${year}`

  // Generate filename
  const filename = `lista-de-compras-${recipeId}-${productionUnits}unidades.txt`

  // Generate content
  const lines = [
    `Lista de Compras — ${recipeName}`,
    `Produção: ${productionUnits} ${productionUnits === 1 ? "unidade" : "unidades"}`,
    `Data: ${formattedDate}`,
    "",
    ...scaledIngredients.map((ing) => `- ${formatMarketFriendlyIngredient(ing.scaled)}`),
  ]

  const content = lines.join("\n")

  return { filename, content }
}
