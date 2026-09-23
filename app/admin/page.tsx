import { cn } from "@/lib/utils"
import Link from "next/link"
import { Metadata } from "next";
import { redirect } from 'next/navigation';
import { User, LayoutDashboard, Settings } from "lucide-react";

import { main, GetSessionUserData, GetUserProfile, GetUserProfiles, GetUserSessions, CheckSystemLock } from '@/lib/auth';
import { t, GetCurrentLanguage } from '@/lib/global';
import { AdminDashboard, UserManagementPage, UserDetailPage, SystemSettingsPage } from './section'

type Props = {
  searchParams: Promise<{
    t?: string;
    p?: string;
    u?: string;
  }>;
};

const sidebarNavItems = [
  { title: "대시보드", href: "dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { title: "유저 관리", href: "users", icon: <User className="w-4 h-4" /> },
  { title: "유저 상세 내역", href: "userdetails", icon: <User className="w-4 h-4" /> },
  { title: "시스템 설정", href: "settings", icon: <Settings className="w-4 h-4" /> },
]

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { t: type = 'profile' } = await searchParams;
  //const translate = await GetCurrentLanguage();

  const title = `Admin - 
    ${(type == 'dashboard') ? ('대시보드') :
      (type == 'users') ? ('유저 관리') :
        (type == 'userdetails') ? ('유저 상세 내역') :
          (type == 'settings') ? ('시스템 설정') : ('')}`

  return {
    title: title,
  };
}

export default async function AdminPage({ searchParams }: Props) {
  const { t: type = 'dashboard', p: page = '1', u: uuid = '' } = await searchParams;
  //const translate = await GetCurrentLanguage();
  const session = await GetSessionUserData();

  await main();
  if (session?.user.role != 'ADMIN') {
    redirect(`/login`);
  }

  const currentPage = parseInt(page, 10) || 1;
  let data = null;
  let usersession = null;
  switch (type) {
    case 'dashboard':
      break;
    case 'users':
      {
        data = await GetUserProfiles(currentPage, 50);
        break;
      }
    case 'userdetails':
      {
        data = await GetUserProfile(uuid);
        usersession = await GetUserSessions(uuid);
        break;
      }
    case 'settings':
      {
        data = await CheckSystemLock();
        break;
      }
    default:
      break;
  }

  return (
    <>
      <aside className="sticky top-20 col-span-2 hidden lg:block space-y-1">
        {sidebarNavItems.map((item) => (
          <Link
            key={item.href}
            href={`/admin?t=${item.href}`}
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
        {
          (type == 'dashboard') ? (<AdminDashboard />) :
            (type == 'users') ? (<UserManagementPage data={data} currentPage={currentPage} />) :
              (type == 'userdetails') ? (<UserDetailPage data={data} usersession={usersession} />) :
                (type == 'settings') ? (<SystemSettingsPage data={data} />) : (<></>)
        }
      </div>

      <aside className="sticky top-20 space-y-4 col-span-2 hidden xl:block">
      </aside>
    </>
  );
}
