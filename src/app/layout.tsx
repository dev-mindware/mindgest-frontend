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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={["light", "dark", "system"]}
          storageKey="mindware-theme"
        >
          <ReactQueryProvider>{children}</ReactQueryProvider>
          <CustomToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
