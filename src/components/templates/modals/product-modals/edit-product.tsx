"use client"
import { Button, GlobalModal, Icon, Textarea, Label, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components"
import { useState } from "react"
import Image from "next/image"
import DatePickerInput from "@/components/custom/date-picker-input"

export function EditProduct() {
  const [productImage, setProductImage] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedMeasurement, setSelectedMeasurement] = useState<string>("")
  const [stockInitial, setStockInitial] = useState<number>(0)
  const [stockMinimum, setStockMinimum] = useState<number>(0)
  const [warranty, setWarranty] = useState<number>(0)
  const [restockTime, setRestockTime] = useState<number>(0)
  const [dailySales, setDailySales] = useState<number>(0)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProductImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setProductImage(null)
  }

  return (
    <GlobalModal
      id="edit-product"
      title="Editar Produto"
      canClose
      className="lg:!max-w-7xl md:!max-w-3xl"
      custom={
          <div className="max-h-[80vh] overflow-auto">
        {/* Left Column - Product Image */}
        <div className="grid gap-6 mt-5 md:grid-cols-1 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-lg bg-sidebar">
            <div className="lg:p-6">
              <h3 className="mb-4 font-semibold">Imagem do Produto</h3>
              
              <div className="p-6 space-y-4">
                <div>
                  <Label htmlFor="image-tag">Tag</Label>
                  <Input 
                    id="image-tag"
                    placeholder="Escreva algo que representa a imagem..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Imagem</Label>
                  <div className="mt-2">
                    {productImage ? (
                      <div>
                        <Image 
                          src={productImage} 
                          alt="Product" 
                          width={300}
                          height={192}
                          className="object-cover w-full h-48 rounded-lg"
                        />
                        <div className="absolute flex gap-2 bottom-2 left-2 right-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => document.getElementById('image-upload')?.click()}
                          >
                            Substituir
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={removeImage}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg border-muted-foreground md:w-full bg-sidebar sm:w-25">
                        <div className="text-center">
                          <Icon name='Upload' className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-500">Clique para carregar imagem</p>
                        </div>
                      </div>
                    )}
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <Icon name='Upload' className="w-4 h-4 mr-2" />
                    Adicionar Imagem
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-sidebar">
            <div className="p-6">
              <h3 className="mb-4 font-semibold">Código de Barras</h3>
              
              <div className="flex justify-center mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-16 bg-black"></div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Adicionar Novo
                </Button>
                <Button variant="secondary" className="flex-1">
                  Selecionar código existente
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - General Information */}
        <div>
          <div>
            <div className="p-6 rounded-lg bg-sidebar">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Informação Geral</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="product-name">Nome do Produto</Label>
                    <Input id="product-name" placeholder="Escreva aqui..." className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="product-sku">SKU ou ID do Produto</Label>
                    <Input id="product-sku" placeholder="Escreva aqui..." className="mt-1" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bebidas">Bebidas</SelectItem>
                        <SelectItem value="alimentos">Alimentos</SelectItem>
                        <SelectItem value="limpeza">Limpeza</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="measurement">Tipo de Medida</Label>
                    <Select value={selectedMeasurement} onValueChange={setSelectedMeasurement}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unidade">Unidade</SelectItem>
                        <SelectItem value="kg">Quilograma</SelectItem>
                        <SelectItem value="litro">Litro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="supplier">Fornecedor Padrão</Label>
                    <Input id="supplier" placeholder="Escreva aqui..." className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="location">Armazém ou Localização Física</Label>
                    <Input id="location" placeholder="Escreva aqui..." className="mt-1" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="price">Preço de Venda</Label>
                    <div className="relative mt-1">
                      <Input id="price" placeholder="0" />
                      <span className="absolute text-sm text-gray-500 transform -translate-y-1/2 right-3 top-1/2">Kz</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="stock-initial">Stock Inicial</Label>
                    <div className="flex items-center mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStockInitial(Math.max(0, stockInitial - 1))}
                      >
                        <Icon name='Minus' className="w-4 h-4" />
                      </Button>
                      <Input
                        value={stockInitial}
                        onChange={(e) => setStockInitial(parseInt(e.target.value) || 0)}
                        className="mx-2 text-center"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStockInitial(stockInitial + 1)}
                      >
                        <Icon name='Plus' className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="stock-minimum">Stock Mínimo</Label>
                    <div className="flex items-center mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStockMinimum(Math.max(0, stockMinimum - 1))}
                      >
                        <Icon name='Minus' className="w-4 h-4" />
                      </Button>
                      <Input
                        value={stockMinimum}
                        onChange={(e) => setStockMinimum(parseInt(e.target.value) || 0)}
                        className="mx-2 text-center"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStockMinimum(stockMinimum + 1)}
                      >
                        <Icon name='Plus' className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="expiry-date">Data de Expiração</Label>
                    <div className="relative mt-1">
                      <DatePickerInput id="expiry-date" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="tax">Imposto (IVA)</Label>
                    <div className="relative mt-1">
                      <Input id="tax" placeholder="0" />
                      <span className="absolute text-sm text-gray-500 transform -translate-y-1/2 right-3 top-1/2">%</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="warranty">Garantia</Label>
                    <div className="flex items-center mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setWarranty(Math.max(0, warranty - 1))}
                      >
                        <Icon name='Minus' className="w-4 h-4" />
                      </Button>
                      <Input
                        value={warranty}
                        onChange={(e) => setWarranty(parseInt(e.target.value) || 0)}
                        className="mx-2 text-center"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setWarranty(warranty + 1)}
                      >
                        <Icon name='Plus' className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="restock-time">Tempo Médio de Reposição</Label>
                    <div className="flex items-center mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRestockTime(Math.max(0, restockTime - 1))}
                      >
                        <Icon name='Minus' className="w-4 h-4" />
                      </Button>
                      <Input
                        value={restockTime}
                        onChange={(e) => setRestockTime(parseInt(e.target.value) || 0)}
                        className="mx-2 text-center"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRestockTime(restockTime + 1)}
                      >
                        <Icon name='Plus' className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="daily-sales">Venda Por Dia</Label>
                    <div className="flex items-center mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDailySales(Math.max(0, dailySales - 1))}
                      >
                        <Icon name='Minus' className="w-4 h-4" />
                      </Button>
                      <Input
                        value={dailySales}
                        onChange={(e) => setDailySales(parseInt(e.target.value) || 0)}
                        className="mx-2 text-center"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDailySales(dailySales + 1)}
                      >
                        <Icon name='Plus' className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Text"
                    className="mt-1 min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-4 p-6 mt-4">
          <Button>
            Salvar
          </Button>
        </div>
        </div>
      </div>
      </div>
      }
    />
  )
}