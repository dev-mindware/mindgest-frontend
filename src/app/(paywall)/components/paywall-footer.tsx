import Link from "next/link";
import { paywallFooterLinks } from "@/constants";

export function PaywallFooter() {
  return (
    <footer className="w-full bg-[#f3f3f3] dark:bg-muted/20 border-t border-border mt-auto py-8">
      <div className="container mx-auto px-4 md:px-12 max-w-6xl">
        <div className="mb-8">
          <span className="text-muted-foreground text-base">
            Dúvidas? <Link href="/help" className="hover:underline">Contacte-nos.</Link>
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-2 text-[13px] text-muted-foreground w-full sm:w-3/4">
          {paywallFooterLinks.map((link) => (
            <Link key={link.name} href={link.href} className="hover:underline">
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
