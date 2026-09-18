import Link from "next/link";
import { t, Lang, normalizeLang } from '@/lib/global';
import { Children } from "react";
import Footer from '@/components/auth/footer';
import Header from '@/components/auth/header';

export default function Layout({
  children,
  translate,
  hideSearchbar,
}: Readonly<{
  children: React.ReactNode;
  translate: Lang;
  hideSearchbar: boolean;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header translate={translate} hideSearchbar={hideSearchbar} />

      <main className="prose prose-slate flex-1 mx-auto grid grid-cols-12 max-w-[100rem] gap-8 p-4 w-full">
        {children}
      </main>

      <Footer translate={translate} />
    </div>
  );
}
