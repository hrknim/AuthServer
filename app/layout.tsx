import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

import Footer from '@/components/auth/footer';
import Header from '@/components/auth/header';
import { GetCurrentLanguage } from '@/lib/global'

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Auth",
  description: "Account Auth Server",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const translate = await GetCurrentLanguage();

  return (
    <html
      lang={translate}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head />
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          enableColorScheme={true}
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Header language={translate} translate={translate} hideSearchbar={false}/>
            
            <main className="flex-1 mx-auto grid max-w-[100rem] grid-cols-12 gap-8 px-6 py-6 w-full">
              {children}
            </main>

            <Footer language={translate} translate={translate}/>
          </div>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
