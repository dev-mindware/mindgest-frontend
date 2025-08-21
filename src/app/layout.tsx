import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/lib";
import { ThemeProvider } from "@/components/layout/theme-provider";
import {
  Inter,
  Poppins,
  Roboto,
  Outfit,
  Plus_Jakarta_Sans,
} from "next/font/google";
import { CustomToaster } from "@/utils";
import { SessionProvider } from "@/providers/session-provider";
import { getSession } from "@/lib/auth";
import { User } from "@/types";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-outfit",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-jakarta",
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
      className={`${inter.variable} ${poppins.variable} ${roboto.variable} ${outfit.variable} ${jakarta.variable}`}
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
              {children}
            </SessionProvider>
            <CustomToaster />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
