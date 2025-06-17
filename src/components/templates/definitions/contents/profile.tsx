"use client"

import { CircleUserRoundIcon, XIcon } from "lucide-react"
import { useFileUpload } from "@/hooks/use-file-upload"
import { Input, Button, Switch, Label, Separator, Avatar, AvatarFallback, AvatarImage, Icon  } from "@/components"
import { useRef, useState } from "react"
export function Profile() {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] = useFileUpload({
    accept: "image/*",
  })

  const previewUrl = files[0]?.preview || null
  const fileName = files[0]?.file.name || null
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="p-6 space-y-6 ">
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl text-center md:text-start">Meu Perfil</h2>
          <p className="text-center text-muted-foreground md:text-start">Personalize o seu perfil MindGest quando quiser.</p>
        </div>
        <span className="font-medium text-primary">Proprietário</span>
      </div>
        <Separator className="-mt-4" />


      <div className="flex flex-col justify-between w-full gap-8 md:flex-row md:items-start">
        
        <div className="flex gap-6">
      <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
        <Avatar className="w-24 h-24 transition ring-2 ring-primary/40 hover:ring-primary/80">
          <AvatarImage src={preview || "/user.jpg"} alt="Avatar" />
          <AvatarFallback>CC</AvatarFallback>
        </Avatar>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => fileInputRef.current?.click()}>
            <Icon name="Camera" />
          </Button>
          <Button type="button" variant="outline" onClick={handleRemove} disabled={!preview}>
            <Icon name="Trash2" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Apenas ficheiros .JPEG, .PNG e menores que 2MB são suportados
        </p>
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageChange}
      />
    </div>

        
        <div className="flex flex-col items-center gap-2">
          <div className="relative inline-flex">
            <Button
              variant="outline"
              className="relative p-0 overflow-hidden shadow-none size-16"
              onClick={openFileDialog}
              aria-label={previewUrl ? "Change image" : "Upload image"}
            >
              {previewUrl ? (
                <img
                  className="object-cover size-full"
                  src={previewUrl}
                  alt="Preview"
                  width={64}
                  height={64}
                />
              ) : (
                <div aria-hidden="true">
                  <CircleUserRoundIcon className="size-4 opacity-60" />
                </div>
              )}
            </Button>
            {previewUrl && (
              <Button
                onClick={() => removeFile(files[0]?.id)}
                size="icon"
                className="absolute border-2 rounded-full shadow-none border-background focus-visible:border-background -top-2 -right-2 size-6"
                aria-label="Remove image"
              >
                <XIcon className="size-3.5" />
              </Button>
            )}
            <input
              {...getInputProps()}
              className="sr-only"
              aria-label="Upload image file"
              tabIndex={-1}
            />
          </div>
          {fileName && <p className="text-xs text-muted-foreground">{fileName}</p>}
          <p className="mt-2 text-xs text-muted-foreground">Logo da Empresa</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>Nome</Label>
          <Input defaultValue="Ceara" />
        </div>
        <div>
          <Label>Sobrenome</Label>
          <Input defaultValue="Coveney" />
        </div>
        <div>
          <Label>Nome da Empresa</Label>
          <Input defaultValue="Amazon" />
        </div>
        <div>
          <Label>NIF</Label>
          <Input placeholder="Ex: 598364343" />
        </div>
      </div>


      <div>
        <h3 className="text-2xl text-center md:text-start">Segurança da Conta</h3>
        <p className="text-center text-muted-foreground md:text-start">Altere as suas configurações de segurança.</p>
      <Separator className="mt-4"/>
        <div className="mt-4 space-y-4">
          <div>
            <Label>Email</Label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Input
                disabled
                defaultValue="cea.co@gmail.com"
                className="w-155"
            />
            <Button className="whitespace-nowrap">Alterar Email</Button>
            </div>

          </div>
          <div>
            <Label>Senha</Label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Input type="password" value="************" disabled className="w-155"/>
              <Button>Alterar Senha</Button>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <Label>Autenticação de 2 passos</Label>
              <p className="text-xs text-muted-foreground">Implemente uma camada adicional de segurança à sua conta durante o login</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl text-center md:text-start">Suporte de Acesso</h3>
        <p className="text-center text-muted-foreground md:text-start">Altere as suas configurações de suporte de acesso.</p>
        <Separator className="mt-4"/>
        <div className="mt-4 space-y-4">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <Label>Suporte de Acesso</Label>
              <p className="text-xs text-muted-foreground">
                Concede-nos acesso à sua conta para efeitos de suporte até 19 de junho de 2025, 11h43.
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <p className="text-sm text-muted-foreground">Log out em todos os dispositivos</p>
            <Button variant="outline">Log out</Button>
          </div>
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-destructive">Eliminar minha conta</p>
              <p className="text-xs text-muted-foreground">
                Eliminar definitivamente a conta e remover o acesso de todos os espaços de trabalho
              </p>
            </div>
            <Button variant="destructive">Eliminar Conta</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
