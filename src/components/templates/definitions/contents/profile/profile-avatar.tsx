"use client";

import { Avatar, AvatarFallback, AvatarImage, Button, Icon } from "@/components";
import { useRef, useState } from "react";

interface ProfileAvatarProps {
    currentImage?: string;
    userName?: string;
    onImageChange?: (file: File) => void;
}

export function ProfileAvatar({ currentImage, userName = "User", onImageChange }: ProfileAvatarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(currentImage || null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            onImageChange?.(file);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const initials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="flex gap-6">
            <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                <Avatar className="w-24 h-24 transition ring-2 ring-primary/40 hover:ring-primary/80">
                    <AvatarImage src={preview || currentImage || "/user.jpg"} alt="Avatar" />
                    <AvatarFallback>{initials}</AvatarFallback>
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
    );
}
