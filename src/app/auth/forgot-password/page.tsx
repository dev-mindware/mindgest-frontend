import { HeroImageSide, RecoveryPassword } from "@/components";

export default function ForgotPassPage() {
  return (
    <div className="grid h-full min-h-0 w-full overflow-hidden lg:grid-cols-2">
      <div className="hidden lg:block">
        <HeroImageSide source="/login.png" />
      </div>

      <div className="flex min-h-0 items-center justify-center bg-background p-5 md:p-8">
        <div className="w-full max-w-sm">
          <RecoveryPassword />
        </div>
      </div>
    </div>
  );
}
