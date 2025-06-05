// Exemplo de uso do QuizSelect
import { useState } from "react"
import { QuizSelect } from "@/components"
import { Coffee, ShoppingCart, Store, Monitor } from "lucide-react" // Usa os ícones que quiser

export function SecondStep() {
  const [selected, setSelected] = useState<string | undefined>(undefined)

  const options = [
    { value: "cafe", label: "Café", icon: Coffee },
    { value: "ecommerce", label: "E-commerce", icon: ShoppingCart },
    { value: "loja", label: "Loja", icon: Store },
    { value: "tecnologia", label: "Tecnologia", icon: Monitor },
  ]

  return (
    <div className="top-0 max-w-md mx-auto">
      <div className="flex flex-col items-center gap-2 mb-10 text-center">
        <h1 className="text-2xl font-bold">Tipo de Negócio</h1>
      </div>
      <QuizSelect options={options} value={selected} onChange={setSelected} />
    </div>
  )
}
