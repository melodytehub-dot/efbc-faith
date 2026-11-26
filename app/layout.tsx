import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { SiteFooter, SiteHeader, TabBar } from "@/components/SiteChrome";
import { church } from "@/lib/church";
import Template from "./template";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://efbcusa.com"),
  title: {
    default: `${church.name} | Star City, Arkansas`,
    template: `%s | ${church.name}`,
  },
  description:
    "Emmanuel Farm Baptist Church, a bilingual English and Chin congregation in Star City, Arkansas. Worship, Hakha Chin Bible, hymns, live services, and ministries.",
  icons: { icon: "/images/logo-seal.png" },
  openGraph: {
    title: church.name,
    description: church.motto,
    images: ["/images/hero-sunrise.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#07090c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={figtree.variable}>
      <body>
        <a href="#main" className="skip">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">
          <Template>{children}</Template>
        </main>
        <SiteFooter />
        <TabBar />
      </body>
    </html>
  );
}
