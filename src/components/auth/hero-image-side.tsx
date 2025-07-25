import Image from "next/image";

export function HeroImageSide({ source }: { source: string }) {
  return (
    <div className="relative hidden w-full h-screen md:flex items-center justify-center">
      <Image
        src={source}
        alt="Image"
        fill
        className="object-contain" 
        sizes="(min-width: 1024px) 50vw, 100vw"
        priority
      />
    </div>
  );
}
