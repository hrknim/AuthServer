import Link from "next/link"
import { redirect, RedirectType } from 'next/navigation';
import { cn } from "@/lib/utils"
import { User, Lock, Bell, ShieldCheck, Eye } from "lucide-react"

import { GetSessionUser } from '@/lib/auth';
import { LANG_GROUPS } from '@/lib/global'
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

export default async function SettingsLayout({ searchParams }: Props) {
  const { t: type = 'profile' } = await searchParams;
  // 1. 서버 세션 가져오기
  const session = await GetSessionUser();

  // 2. 세션이 없으면 로그인 페이지로 리다이렉트하거나 에러 처리
  if (!session) {
    redirect(`/login`);
  }

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
          {(type == 'profile') ? (<ProfileSettings userdata={session.user} LANG_GROUPS={LANG_GROUPS}/>) : 
            (type == 'security') ? (<SecuritySettings/>) :
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
