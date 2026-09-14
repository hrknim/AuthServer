import Link from "next/link";
import { t, Lang, normalizeLang } from '@/lib/global';
import { Children } from "react";
import Footer from '@/components/auth/footer';
import Header from '@/components/auth/header';

interface Props {
  language: Lang;
  translate: Lang;
}

export default function Layout({
  children,
  language,
  translate,
  hideSearchbar,
}: Readonly<{
  children: React.ReactNode;
  language: Lang;
  translate: Lang;
  hideSearchbar: boolean;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header language={language} translate={translate} hideSearchbar={hideSearchbar} />

      <main className="prose prose-slate flex-1 mx-auto grid max-w-[1200px] gap-8 p-4 w-full">
        {children}
      </main>

      <Footer language={language} translate={translate} />
    </div>
  );
}
