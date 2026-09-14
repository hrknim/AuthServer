import { cn } from "@/lib/utils"
import Link from "next/link"
import { Metadata } from "next";
import { notFound } from 'next/navigation';

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquareDiff, EyeOff, Zap, ShieldAlert, KeyRound, User, Lock, LayoutDashboard, History, Flag, Settings } from "lucide-react";

import PageList from '@/components/auth/PageList';
import PageNav from '@/components/auth/PageNav';
import { GetSessionUser, GetUserProfile, GetUserProfiles, GetUserSessions, GetAuditLogs, GetBanList, CheckSystemLock } from '@/lib/auth';
import { t, GetCurrentLanguage } from '@/lib/global';
import { 
  AdminDashboard, 
  UserManagementPage, 
  UserDetailPage, 
  SanctionsPage,
  AuditLogPage,
  ReportManagementPage,
  SystemSettingsPage
} from './section'

type Props = {
  searchParams: Promise<{
    t?: string;
    p?: string;
    u?: string;
  }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const translate = await GetCurrentLanguage();

  return {
    title: `Admin`,
  };
}

export default async function AdminPage({ searchParams }: Props) {
  const { t: type = 'dashboard', p: page = '1', u: uuid = '' } = await searchParams;
  const language = 'en';
  const translate = await GetCurrentLanguage(language);
  const session = await GetSessionUser();

  if (session?.user.role != 'ADMIN') return notFound();

  const sidebarNavItems = [
    { title: "대시보드", href: "dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { title: "유저 관리", href: "users", icon: <User className="w-4 h-4" /> },
    { title: "유저 상세 내역", href: "userdetails", icon: <User className="w-4 h-4" /> },
    { title: "변경 로그", href: "logs", icon: <History className="w-4 h-4" /> },   // 테러 추적 핵심
    //{ title: "제재 현황", href: "bans", icon: <ShieldAlert className="w-4 h-4" /> }, // 테러 대응 핵심
    //{ title: "신고 내역", href: "reports", icon: <Flag className="w-4 h-4" /> },
    { title: "시스템 설정", href: "settings", icon: <Settings className="w-4 h-4" /> },
  ]

  // 1. 현재 상태 파악 (URL 파라미터 기준)
  const currentPage = parseInt(page, 10) || 1;

  let data = null;
  let usersession = null;
  switch (type) {
    case 'dashboard':
      
      break;
    case 'users':
    {
      data = await GetUserProfiles(currentPage);
      break;
    }
    case 'userdetails':
    {
      data = await GetUserProfile(uuid);
      usersession = await GetUserSessions(uuid);
      break;
    }
    case 'logs':
    {
      data = await GetAuditLogs(currentPage);
      break;
    }
    case 'bans':
    {  
      data = await GetBanList(currentPage);
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
        (type == 'users') ? (<UserManagementPage data={data} currentPage={currentPage}/>) :
        (type == 'userdetails') ? (<UserDetailPage data={data} usersession={usersession}/>) :
        (type == 'logs') ? (<AuditLogPage data={data} currentPage={currentPage}/>) :
        //(type == 'bans') ? (<SanctionsPage data={data} currentPage={currentPage}/>) :
        //(type == 'reports') ? (<ReportManagementPage />) :
        (type == 'settings') ? (<SystemSettingsPage data={data}/>) : (<></>)
      }
    </div>

    <aside className="sticky top-20 space-y-4 col-span-2 hidden xl:block">
    </aside>
    </>
  );
}
