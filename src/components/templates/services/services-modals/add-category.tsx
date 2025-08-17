"use client"
import { Button, GlobalModal, Input, Label, Icon, TsunamiOnly } from "@/components"
import { useState } from "react"
import Image from "next/image"

export function AddCategory() {
  const [categoryName, setCategoryName] = useState("")
  const [abbreviationCode, setAbbreviationCode] = useState("")
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)

  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("O arquivo deve ser inferior a 5MB")
        return
      }
      
      // Check file type
      if (!['image/jpeg', 'image/png', 'image/x-icon'].includes(file.type)) {
        alert("Apenas arquivos JPEG, PNG e ICO são permitidos")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedIcon(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeIcon = () => {
    setSelectedIcon(null)
  }

  const handleSave = () => {
    // Handle save logic here
    console.log({
      name: categoryName,
      abbreviation: abbreviationCode,
      icon: selectedIcon
    })
  }

  return (
    <GlobalModal
      id="category"
      title="Adicionar Categoria"
      canClose
      className="!max-w-md !w-[90vw] md:!w-full"
      custom={
        <div className="p-6 space-y-6 overflow-auto max-h-[80vh]">
          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="category-name" className="text-sm font-medium">
              Nome
            </Label>
            <Input
              id="category-name"
              placeholder="Ex: Plásticos, Cosméticos..."
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Abbreviation Code */}
          <div className="space-y-2">
            <Label htmlFor="abbreviation-code" className="text-sm font-medium">
              Código de Abreviação
            </Label>
            <Input
              id="abbreviation-code"
              placeholder="Ex: PLSTC, CMTC"
              value={abbreviationCode}
              onChange={(e) => setAbbreviationCode(e.target.value.toUpperCase())}
              className="w-full"
            />
          </div>

          {/* Icon Upload */}
          <TsunamiOnly>
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Ícone
            </Label>
            
            <div className="relative">
              <div className="p-8 text-center transition-colors border-2 border-dashed rounded-lg border-muted-foreground bg-muted">
                {selectedIcon ? (
                  <div className="relative inline-block">
                    <Image 
                      src={selectedIcon} 
                      alt="Category icon" 
                      width={64}
                      height={64}
                      className="object-contain mx-auto mb-4"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        removeIcon()
                      }}
                      className="absolute z-10 flex items-center justify-center w-6 h-6 text-white transition-colors bg-red-500 rounded-full -top-2 -right-2 hover:bg-red-600"
                    >
                      <Icon name='X' className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Icon name='Upload' className="w-12 h-12 mx-auto text-primary" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        Escolhe um ficheiro ou arraste & solte aqui
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JPEG, PNG, ICO, deve ser inferior a 5MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <input
                type="file"
                accept=".jpeg,.jpg,.png,.ico"
                onChange={handleIconUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                style={{ pointerEvents: selectedIcon ? 'none' : 'auto' }}
              />
            </div>

            {!selectedIcon && (
              <Button
                variant="outline"
                onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                className="w-full mt-2 "
              >
                Escolher
              </Button>
            )}
          </div>
          </TsunamiOnly>
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline"
              onClick={handleSave}
              disabled={!categoryName.trim() || !abbreviationCode.trim()}
              className="px-6"
            >
              Salvar
            </Button>
          </div>
        </div>
      }
    />
  )
}