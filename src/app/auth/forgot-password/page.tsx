"use client"
import Image from "next/image";
import ForgotPassIllustration from "@/assets/ForgotPassword.svg";
import { SentEmail } from "@/components";

export default function ForgotPassPage() {
  return (
    <div className="relative grid min-h-svh lg:grid-cols-2">
      <div className="items-center justify-center hidden h-screen md:flex lg:flex">
        <Image src={ForgotPassIllustration} alt="Image" width={800} />
      </div>

      <div className="absolute top-1/2 z-10 hidden w-px h-[75%] -translate-y-1/2 lg:block left-1/2 -translate-x-1/2 bg-border" />

      <div className="relative z-20 flex flex-col gap-4 p-6 md:p-10">
        <SentEmail />
      </div>
    </div>
  );
}
