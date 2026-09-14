"use client" // 세션 훅을 사용하므로 클라이언트 컴포넌트여야 합니다.

import { useState, useEffect } from "react"
import Link from "next/link"

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator";
import { LogIn, UserPlus, LogOut, User, History, HelpCircle, Settings } from "lucide-react";

import { usePathname } from "next/navigation"

// 헬퍼 컴포넌트 (아이템 반복 줄이기)
function ActionItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} target='_blank' className="flex items-center gap-2 px-2 py-2 rounded-md text-[0.8rem] text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
      {icon}
      <span>{label}</span>
    </Link>
  );
}

interface AuthUser {
  id: string
  handle: string
  displayName: string
  email: string
  avatarUrl?: string
  role: string
}

interface Props {
  ut: any;
  authServer: any;
}

export default function Userbar({ ut, authServer }: Props) {
  const [session, setUser] = useState<AuthUser | null>(null)
  const pathname = usePathname();

  const fetchUser = async () => {
    try {
      const res = await fetch(`${authServer}/api/user`, {
        // 이 옵션이 없으면 브라우저가 쿠키를 서버로 보내지 않습니다.
        credentials: 'include', 
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data.result)
      } else {
        setUser(null)
      }
    } catch (error) {
    }
  }

  const signOut = async () => {
    try {
      const res = await fetch(`${authServer}/api/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
        credentials: 'include', 
      })
      if (res.ok) {
        const data = await res.json()
        setUser(null)
      } 
    } catch (error) {
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <Popover>
      <PopoverTrigger className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors border overflow-hidden">
        {session?.avatarUrl ? (
          <img src={session.avatarUrl} alt="profile" className="h-full w-full object-cover" />
        ) : (
          <User className="h-5 w-5 text-muted-foreground" />
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-2 shadow-xl border-muted-foreground/10">
        {session ? (
          <>
            <div className="flex items-center gap-3 p-2 mb-2 bg-muted/30 rounded-lg">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border text-primary font-bold">
                {session.handle?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold truncate">{session.displayName}</span>
                <span className="text-[0.65rem] text-muted-foreground truncate">@{session.handle}</span>
              </div>
            </div>
                  
            <div className="space-y-0.5">
              <ActionItem href={`/account`} icon={<User className="w-4 h-4" />} label={ut.account_setting} />
            </div>

            <Separator className="my-2" />
                  
            <button 
              onClick={() => signOut()}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-[0.8rem] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>{ut.logout}</span>
            </button>
          </>
        ) : (
          <>
            <div className="p-3 mb-1">
              <h3 className="text-sm font-bold text-foreground">{ut.notuser_title}</h3>
              <p className="text-[0.7rem] text-muted-foreground leading-tight mt-1">
                {ut.notuser_desc}
              </p>
            </div>

            <div className="space-y-0.5">
              <ActionItem href={`/login?url=${encodeURIComponent(pathname)}`} icon={<User className="w-4 h-4" />} label={ut.login} />
              <ActionItem href={`/signup?url=${encodeURIComponent(pathname)}`} icon={<History className="w-4 h-4" />} label={ut.create_new_account} />
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
