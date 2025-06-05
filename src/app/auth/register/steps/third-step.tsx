import { useState } from "react"
import { MultiQuizSelect } from "@/components"
import { ReceiptText, ShoppingCart, Brain, Monitor, Users } from "lucide-react"

export function ThirdStep() {
  const [selected, setSelected] = useState<string[]>([])

  const options = [
    { value: "fatura", label: "Faturação", icon: ReceiptText },
    { value: "produtos", label: "Gestão de Stock", icon: ShoppingCart },
    { value: "relatorios", label: "Relatórios Inteligentes", icon: Brain },
    { value: "tecnologia", label: "POS", icon: Monitor },
    { value: "entidades", label: "Multiplas Entidades", icon: Users },
  ]

  return (
    <div className="max-w-md mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-center">Escolha os Recursos</h1>
      <MultiQuizSelect options={options} value={selected} onChange={setSelected} />
    </div>
  )
}
