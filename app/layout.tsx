import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AccentColorProvider } from "./context/AccentColorContext";
import ClientLayout from "@/app/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tattoo Preview",
  description: "Transform your ideas into stunning tattoo designs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <AccentColorProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AccentColorProvider>
      </body>
    </html>
  );
}
