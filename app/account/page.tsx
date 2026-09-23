import Link from "next/link"
import { Metadata } from "next";
import { redirect } from 'next/navigation';
import { User, Lock, Bell, ShieldCheck } from "lucide-react"

import { GetSessionUserData } from '@/lib/auth';
import { LANG_GROUPS } from '@/lib/global'
import { cn } from "@/lib/utils"
import { ProfileSettings, SecuritySettings, NotificationSettings, PrivacySettings } from './section'

const sidebarNavItems = [
  { title: "개인정보", href: "profile", icon: <User className="w-4 h-4" /> },
  { title: "보안", href: "security", icon: <Lock className="w-4 h-4" /> },
  { title: "알림", href: "notifications", icon: <Bell className="w-4 h-4" /> },
  { title: "데이터 및 개인정보 보호", href: "privacy", icon: <ShieldCheck className="w-4 h-4" /> },
]

type Props = {
  searchParams: Promise<{
    t?: string;
  }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { t: type = 'profile' } = await searchParams;
  //const translate = await GetCurrentLanguage();

  const title = `계정 대시보드 - 
    ${(type == 'profile') ? ('프로필') :
      (type == 'security') ? ('보안') :
        (type == 'notifications') ? ('알림') :
          (type == 'privacy') ? ('개인정보') : ('')}`

  return {
    title: title,
  };
}

export default async function SettingsLayout({ searchParams }: Props) {
  const { t: type = 'profile' } = await searchParams;
  //const translate = await GetCurrentLanguage();
  const session = await GetSessionUserData();
  if (!session) { redirect(`/login`); }

  return (
    <>
      <aside className="sticky top-20 col-span-2 hidden lg:block space-y-1">
        {sidebarNavItems.map((item) => (
          <Link
            key={item.href}
            href={`/account?t=${item.href}`}
            className={cn(
              "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              type === item.href
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </aside>

      <div className="max-w-none col-span-12 lg:col-span-10 xl:col-span-8">
        <div className="flex flex-col space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">계정 설정</h1>
          <p className="text-muted-foreground">내 정보, 보안 설정 환경을 관리합니다.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-1">
            {(type == 'profile') ? (<ProfileSettings userdata={session.user} LANG_GROUPS={LANG_GROUPS} />) :
              (type == 'security') ? (<SecuritySettings />) :
                (type == 'notifications') ? (<NotificationSettings />) :
                  (type == 'privacy') ? (<PrivacySettings />) : (<></>)
            }
          </div>
        </div>
      </div>

      <aside className="sticky top-20 space-y-4 col-span-2 hidden xl:block">
      </aside>
    </>
  )
}
