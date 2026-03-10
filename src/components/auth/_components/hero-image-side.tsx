import Image from "next/image";

interface HeroImageSideProps {
  source: string;
  title?: string;
  subtitle?: string;
  badge?: string;
}

export function HeroImageSide({
  source,
  title = "MindGest - O futuro da gestão empresarial.",
  subtitle = "Um ERP inovador para gestão da sua empresa de forma simples e robusta.",
  badge = "MINDWARE - Comércio & Serviços",
}: HeroImageSideProps) {
  return (
    <div className="relative hidden w-full h-screen lg:flex flex-col justify-between overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Image
          fill
          src={"/login2.jpg"}
          alt="Hero Background"
          className="object-cover opacity-60"
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5 z-10 pointer-events-none" />
      </div>

      <div className="relative z-20 w-full p-10 md:p-14">
        <div className="relative h-12 w-40">
          <Image
            src={"/logo.png"}
            fill
            alt="Mindware Logo"
            className="object-contain object-left"
            priority
          />
        </div>
      </div>

      <div className="relative z-20 w-full p-10 md:p-14 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-6">
          {title}
        </h1>
        <p className="text-lg text-white/80 font-medium leading-relaxed mb-8 max-w-xl">
          {subtitle}
        </p>

        {badge && (
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-primary/80" />
            <span className="text-sm font-semibold text-white/70 tracking-widest uppercase">
              {badge}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
