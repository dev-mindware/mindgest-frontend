import type { Metadata } from "next";
import "driver.js/dist/driver.css";
import "./globals.css";
import { ReactQueryProvider } from "@/lib";
import {
  Inter,
  Outfit,
  Roboto,
  Poppins,
  Plus_Jakarta_Sans,
} from "next/font/google";
import { ThemeProvider } from "@/providers";
import { CustomToaster } from "@/utils";
import { SidebarProvider } from "@/components";
import { AuthProvider } from "@/contexts";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PwaServiceWorkerRegister } from "@/components/shared/pwa-service-worker-register";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: {
    default: "Mindgest | Software de gestão e facturação",
    template: "%s | Mindgest",
  },

  description:
    "Mindgest é um software de gestão e facturação para empresas e profissionais em nome individual, com controlo de vendas, clientes, produtos, stock, relatórios e documentos comerciais.",

  applicationName: "Mindgest",

  keywords: [
    "Mindgest",
    "software de gestão",
    "software de facturação",
    "facturação Angola",
    "gestão empresarial",
    "gestão de stock",
    "POS",
    "SaaS Angola",
    "software para empresas",
    "software para profissionais",
    "software para pessoas singulares",
  ],

  authors: [
    {
      name: "Mindware",
      url: "https://mindware.co.ao",
    },
  ],

  creator: "Mindware",
  publisher: "Mindware",

  manifest: "/manifest.webmanifest",

  icons: {
    icon: [
      {
        url: "/mindgest.png",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/mindgest.png",
        type: "image/png",
      },
    ],
  },

  openGraph: {
    title: "Mindgest | Software de gestão e facturação",
    description:
      "Empresas e profissionais podem gerir vendas, clientes, produtos, stock, relatórios e documentos comerciais num único software.",
    url: "https://mindgest.mindware.ao",
    siteName: "Mindgest",
    images: [
      {
        url: "/mindgest.png",
        width: 1200,
        height: 630,
        alt: "Mindgest: software de gestão e facturação",
      },
    ],
    locale: "pt_AO",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Mindgest | Software de gestão e facturação",
    description:
      "Software de gestão e facturação para empresas e profissionais em nome individual.",
    images: ["/mindgest.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  category: "Software",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-AO"
      suppressHydrationWarning
      className={`${inter.variable} ${outfit.variable} ${roboto.variable} ${poppins.variable} ${plusJakartaSans.variable}`}
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
          <Analytics />
          <SpeedInsights />
          <ReactQueryProvider>
            <AuthProvider>
              <NuqsAdapter>
                <PwaServiceWorkerRegister />
                <SidebarProvider>{children}</SidebarProvider>
                <CustomToaster />
              </NuqsAdapter>
            </AuthProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
