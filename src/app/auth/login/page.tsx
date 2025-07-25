import { LoginForm } from "@/components/auth";
import { HeroImageSide, SeparatorLine } from "@/components/auth";

export default function LoginPage() {
  return (
    <div className="relative grid min-h-svh lg:grid-cols-2">
      <HeroImageSide source="/login.svg" />
      <SeparatorLine />

      <div className="relative z-20 flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center justify-center flex-1">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
