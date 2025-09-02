import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/lib";
import { Inter, Outfit } from "next/font/google";
import { CustomToaster } from "@/utils";
import { ThemeProvider, SessionProvider } from "@/providers";
import { getSession } from "@/lib/auth";
import { SidebarProvider } from "@/components";
import { User } from "@/types";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "MINDGEST",
  description: "Software de Gestão e Faturação",
  icons: {
    icon: "/mindware.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const user = (session?.user as User) || null;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable}  ${outfit.variable}`}
    >
      <body
        className="antialiased"
        style={{ fontFamily: "var(--font-family)" }}
      >
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          themes={["light", "dark", "system"]}
          storageKey="mindware-theme"
        >
          <ReactQueryProvider>
            <SessionProvider user={user}>
              <SidebarProvider>{children}</SidebarProvider>
            </SessionProvider>
            <CustomToaster />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
