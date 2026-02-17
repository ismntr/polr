import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Polr — Modern URL Shortener",
  description: "A modern, open-source URL shortener.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
