import { Button, GlobalModal } from "@/components"

export function AddProduct() {

  return (
    <GlobalModal
      id="add-product"
      title="Tem certeza que deseja apagar o produto?"
      description="Lembre-se que esta ação não pode ser desfeita."
      warning
      canClose
      footer={
              <div className="flex justify-end gap-4">
                <Button variant={"outline"}>
                  Próximo
                </Button>
              </div>
            }
    />
  )
}
