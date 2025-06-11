import { Button, GlobalModal, InputOTP } from "@/components";
import Link from "next/link";

export function OTPModal() {
    return (
        <GlobalModal
        id="otp"
        canClose
        >
        <div className="grid justify-center gap-6 px-4 py-6 text-center">
            <h1 className="text-2xl font-bold">Verificação OTP</h1>
        <p className="text-sm text-muted-foreground">
            A nossa equipa enviou um email com o código de verificação para <br />
            <span className="font-medium text-foreground">mauro@gmail.com</span>
            {" "}<Link
            href="/auth/forgot-password"
            className="text-primary hover:underline"
            >
            Mudar Email
            </Link>
        </p>
        <div className="flex items-center justify-center w-full">
        <InputOTP/>
        </div>
        <Button className="w-full">Verificar Conta</Button>

        <Link
            href="#"
            className="text-sm font-medium text-primary hover:underline"
        >
            Reenviar o código
        </Link>
        </div>

        </GlobalModal>
    )
}