import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";

import { cn } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  title: "Marafon · Admin",
  description: "Админ-панель трансформационного марафона Теоны",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={cn("dark", GeistSans.variable, GeistMono.variable)}>
      <body className="font-sans">
        {children}
        <Toaster
          position="top-right"
          theme="dark"
          richColors
          toastOptions={{ classNames: { toast: "rounded-xl border border-white/10" } }}
        />
      </body>
    </html>
  );
}
