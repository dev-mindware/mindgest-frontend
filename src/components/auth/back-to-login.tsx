import Link from "next/link";
import { Button } from "../ui";

export function BackToLogin() {
  return (
    <Link href="/auth/login">
      <Button className="w-full mt-4" variant="outline">
        Voltar para Login
      </Button>
    </Link>
  );
}
