import type { Metadata } from "next";
import { Fraunces, Manrope, Noto_Sans_TC } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { I18nProvider } from "@/lib/i18n/provider";
import { CurrencyProvider } from "@/lib/i18n/currency-provider";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const zh = Noto_Sans_TC({
  variable: "--font-zh",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NourishAI — Healthy recipes & nutrition chat",
  description:
    "Practical nutrition guidance with healthy recipes, meal planning, food analysis, and BMI tools—built for real life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${zh.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <I18nProvider>
          <CurrencyProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </CurrencyProvider>
        </I18nProvider>
      </body>
    </html>
  );
}