"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea";
import { KeyRound, Smartphone, Globe } from "lucide-react"
import { toast } from "sonner"

export function ProfileSettings(data: any) {
  const router = useRouter();
  const [isPending, setLoading] = useState(false);
  const [imageData, setImageData] = useState(data.userdata.avatarUrl);

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    email: data.userdata.email,
    handle: data.userdata.handle,
    displayName: data.userdata.displayName,
    bio: data.userdata.bio ?? '',
    locale: data.userdata.locale ?? 'ko'
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json();

      if (response.ok) {
        router.refresh();
        toast.success(result.message);
      } else {
        toast.error(result.message || "오류가 발생했습니다.");
      }
    } catch (error) {
      toast.error("서버와 통신 중 에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">공개 프로필</CardTitle>
          <CardDescription>다른 사용자들에게 표시되는 정보입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6 p-4 bg-muted/20 rounded-xl">
            <Avatar className="h-20 w-20 border-2 border-background shadow-sm">
              <AvatarImage src={imageData || "/img/profile.png"} />
              <AvatarFallback>{formData.handle?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-medium">프로필 사진</h4>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary">사진 변경</Button>
                <Button size="sm" variant="ghost">제거</Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="handle">핸들 (@)</Label>
              <Input
                id="handle"
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">표시 닉네임</Label>
              <Input
                id="name"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">자기소개</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="자신에 대해 한마디 적어주세요."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="locale">선호 언어</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1 justify-start gap-2 h-9 px-3">
                    <Globe className="w-3.5 h-3.5 text-primary" />
                    <span className="font-medium">{formData.locale}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[22rem] p-4 shadow-xl rounded-2xl border-primary/10">
                  <div className="space-y-6 max-h-[30rem] overflow-y-auto pr-2 custom-scrollbar">
                    {data.LANG_GROUPS.map((group: any) => (
                      <div key={group.region} className="space-y-2.5 custom-scrollbar">
                        <div className="flex items-center gap-2">
                          <span className="text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground/60">
                            {group.region}
                          </span>
                          <div className="h-[1px] flex-1 bg-border/50" />
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {group.langs?.map((l: any) => {
                            return (
                              <Button
                                variant={'ghost'}
                                key={l.code}
                                className='flex items-center justify-center px-2 py-2 rounded-lg text-[0.8rem] transition-all'
                                onClick={() => setFormData({ ...formData, locale: l.code })}
                              >
                                {l.name}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button onClick={handleSave} disabled={isPending} className="w-full md:w-fit">
            {isPending ? "저장 중..." : "프로필 저장"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function SecuritySettings() {
  const [isPending, setIsPending] = useState(false)
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const handlePasswordUpdate = async () => {
    // 기본 유효성 검사
    if (!passwords.currentPassword || !passwords.newPassword) {
      return toast.error("모든 필드를 입력해주세요.")
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("새 비밀번호 확인이 일치하지 않습니다.")
    }
    if (passwords.newPassword.length < 8) {
      return toast.error("새 비밀번호는 최소 8자 이상이어야 합니다.")
    }

    setIsPending(true)
    try {
      const response = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(result.message)
        // 성공 시 폼 초기화
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        toast.error(result.message || "오류가 발생했습니다.")
      }
    } catch (error) {
      toast.error("서버와 통신 중 에러가 발생했습니다.")
    } finally {
      setIsPending(false)
    }
  }

  const [sessions, setSessions] = useState<any[]>([])

  const fetchSessions = async () => {
    const res = await fetch("/api/user/sessions")
    if (res.ok) setSessions(await res.json())
  }

  useEffect(() => { fetchSessions() }, [])

  const handleRevoke = async (sessionId: string) => {
    const res = await fetch(`/api/logout`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
    if (res.ok) {
      toast.success("기기 로그아웃 완료")
      setSessions(sessions.filter(s => s.id !== sessionId))
    }
  }

  return (
    <div className="space-y-6">
      {/* 비밀번호 변경 카드 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">비밀번호 변경</CardTitle>
          </div>
          <CardDescription>보안을 위해 비밀번호는 주기적으로 변경하는 것이 좋습니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 text-sm">
            <Label htmlFor="current-password">현재 비밀번호</Label>
            <Input
              id="current-password"
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            />
          </div>
          <div className="grid gap-2 text-sm">
            <Label htmlFor="new-password">새 비밀번호</Label>
            <Input
              id="new-password"
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              placeholder="최소 8자 이상"
            />
          </div>
          <div className="grid gap-2 text-sm">
            <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
            <Input
              id="confirm-password"
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            />
          </div>
          <Button
            className="w-fit mt-2"
            onClick={handlePasswordUpdate}
            disabled={isPending}
          >
            {isPending ? "업데이트 중..." : "비밀번호 업데이트"}
          </Button>
        </CardContent>
      </Card>

      {/* 활동 세션 관리 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">내 기기</CardTitle>
          </div>
          <CardDescription>현재 로그인되어 있는 기기 목록입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessions && sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
              <div className="flex flex-col">
                <span className="text-sm font-bold">
                  {s.userAgent?.includes("Windows") ? "Windows" : "Mobile / Other"} ·
                  {s.userAgent?.includes("Chrome") ? " Chrome" : " Browser"}
                  {s.isCurrent && <span className="ml-2 text-primary text-xs">(현재 기기)</span>}
                </span>
                <span className="text-xs text-muted-foreground">
                  IP: {s.ipAddress} · 마지막 활동: {new Date(s.lastActive).toLocaleString()}
                </span>
              </div>

              {!s.isCurrent && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRevoke(s.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  로그아웃
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">알림 설정</CardTitle>
        <CardDescription>언제 알림을 받을지 선택하세요.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5">
            <Label className="text-base">이메일 마케팅</Label>
            <p className="text-sm text-muted-foreground">새로운 기능이나 뉴스레터를 이메일로 받습니다.</p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  )
}

export function PrivacySettings() {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/withdraw", { method: "POST" });

      if (res.ok) {
        toast.success("그동안 이용해주셔서 감사합니다.");
        router.push("/");
        router.refresh();
      } else {
        toast.error("탈퇴 처리에 실패했습니다.");
      }
    } catch (error) {
      toast.error("서버 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-destructive">계정 삭제</CardTitle>
          <CardDescription>계정을 삭제하면 모든 기록이 삭제되며 되돌릴 수 없습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                계정 영구 삭제
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  계정을 영구적으로 삭제합니다
                </AlertDialogTitle>
                <AlertDialogDescription>
                  계정을 삭제하면 모든 기록이 삭제되며 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  확인
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

    </div>
  )
}
