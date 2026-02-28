"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Icon,
} from "@/components";
import { useRef, useState } from "react";

interface ProfileAvatarProps {
  currentImage?: string;
  userName?: string;
  onImageChange?: (file: File) => void;
}

export function ProfileAvatar({
  currentImage,
  userName = "User",
  onImageChange,
}: ProfileAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setSelectedFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(currentImage || null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedFile) {
      setIsUploading(true);
      try {
        // Simulating an upload delay if real upload isn't fast enough,
        // but you can adjust this if onImageChange returns a Promise
        await onImageChange?.(selectedFile);
        setSelectedFile(null);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="relative group cursor-pointer"
      >
        <Avatar className="w-32 h-32 transition-all duration-300 ring-4 ring-primary/10 group-hover:ring-primary/40">
          <AvatarImage
            src={preview || currentImage || "/user.jpg"}
            alt="Avatar"
            className="object-cover"
          />
          <AvatarFallback className="text-2xl bg-primary/5 text-primary font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
          <Icon name="Camera" className="w-8 h-8" />
        </div>

        {/* Edit Button Badge */}
        <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-lg border-4 border-background transform translate-x-1 translate-y-1 transition-transform group-hover:scale-110">
          <Icon name="Pencil" className="w-4 h-4" />
        </div>

        {preview && preview !== currentImage && !selectedFile && (
          <button
            onClick={handleRemove}
            className="absolute top-0 right-0 bg-destructive/90 text-destructive-foreground p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive translate-x-1 -translate-y-1"
            title="Remover foto"
          >
            <Icon name="X" className="h-3 w-3" />
          </button>
        )}
      </div>

      {selectedFile && (
        <div className="flex gap-2 mt-2 animate-in fade-in zoom-in duration-300">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRemove}
            disabled={isUploading}
            className="h-8 rounded-full px-4 text-xs"
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isUploading}
            className="h-8 rounded-full px-4 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isUploading ? (
              <>
                <Icon name="Loader" className="mr-1.5 h-3 w-3 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Foto"
            )}
          </Button>
        </div>
      )}

      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-foreground">Foto de Perfil</p>
        <p className="text-xs text-muted-foreground max-w-[200px]">
          Recomendado: .jpg ou .png, max 2MB
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
  );
}
