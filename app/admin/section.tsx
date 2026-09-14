"use client"
import { usePathname } from "next/navigation"
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
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, ShieldCheck, Copy, AlertOctagon, AlertTriangle, 
  Download, ShieldAlert, UserX, BookOpen, Plus, ChevronRight, GoalIcon, UserCircle, ShieldBan, MoreHorizontal, Search } from "lucide-react";

import { toast } from "sonner"

import PageNav from '@/components/auth/PageNav';

export function AdminDashboard(data: any) {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">통합 계정 관리</h1>
        <p className="text-muted-foreground">
          연동된 모든 서비스의 유저 계정 상태 및 보안 현황을 모니터링합니다.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. 핵심 계정 지표 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase">
                전체 활성 계정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{data?.total || 0}</div>
              <div className="text-[10px] text-green-600 mt-1">▲ 12% (지난달 대비)</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase">
                오늘 신규 가입
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{data?.newToday || 0}</div>
              <p className="text-[10px] text-muted-foreground mt-2">24시간 내 가입한 유저</p>
            </CardContent>
          </Card>

          <Card className="border-red-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold text-red-500 uppercase">
                차단/탈퇴 계정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-red-600">{data?.banned || 0} / {data?.deleted || 0}</div>
              <p className="text-[10px] text-muted-foreground mt-2">관리자 제재 및 자진 탈퇴</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase">
                최근 1시간 로그인
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{data?.activeHour || 0}</div>
              <p className="text-[10px] text-muted-foreground mt-2">현재 활동 중인 세션</p>
            </CardContent>
          </Card>
        </div>

        {/* 2. 확장성: 서비스별 유입 현황 (이게 핵심!) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold">서비스별 가입 비중</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 나중에 서비스가 추가될 때마다 리스트가 늘어남 */}
                <div className="flex items-center justify-between">
                  <span className="text-xs">서비스</span>
                  <span className="text-xs font-bold">85%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: '85%' }} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs">신규 서비스 (준비중)</span>
                  <span className="text-xs font-bold">15%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-400 h-full" style={{ width: '15%' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. 보안 모니터링: 비정상 로그인 시도 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-orange-600 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> 보안 경보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs space-y-3">
                <li className="flex justify-between border-b pb-2">
                  <span>동일 IP 중복 가입 시도</span>
                  <span className="text-red-500 font-medium">3건 감지</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span>비밀번호 5회 이상 실패</span>
                  <span className="text-orange-500 font-medium">12건 감지</span>
                </li>
                <li className="flex justify-between">
                  <span>해외 IP 로그인 시도</span>
                  <span className="text-muted-foreground">0건</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export function UserManagementPage({data, currentPage}: {data: any, currentPage: number}) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  console.log(data)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleBan = async (data: any) => {
    const res = await fetch(`/api/admin/user/ban`, { 
      method: 'POST' ,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetId: data.targetId, 
        targetIp: data.targetIp, 
        type: data.type, 
        reason: data.reason, 
        endAt: data.endAt, 
      }),
    })
    if (res.ok) {
      toast.success("유저가 밴 처리되었습니다.")
    }
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">유저 리스트</h1>
          <p className="text-sm text-muted-foreground">가입된 모든 서비스의 유저 계정을 관리하고 제재합니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="ID, 이메일, IP 검색..." className="pl-8 w-[250px]" />
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* 리스트 영역 */}
        <div className="flex-1 border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>유저 정보</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>가입 서비스</TableHead>
                <TableHead>마지막 로그인</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.results.map((user: any) => (
                <TableRow 
                  key={user.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedUser({ 
                    id: user.id, 
                    handle: user.handle, 
                    displayName: user.displayName,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt,
                    lastIp: user.lastIp,
                  })}
                >
                  <TableCell>
                    <div className="font-medium">@{user.handle}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${(user.status == 'BANNED') ? 'text-red-600 border-red-200 bg-red-50' : 'text-green-600 border-green-200 bg-green-50'}`}>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs">Service</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{isMounted ? `${new Date(user.updatedAt).toLocaleDateString()} ${new Date(user.updatedAt).toLocaleTimeString()}` : ""}</TableCell>
                  <TableCell className="text-right">
                    <MoreHorizontal className="h-4 w-4" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 상세 정보 패널 (우측 사이드 슬라이드 느낌) */}
        {selectedUser && (
          <div className="w-[350px] border rounded-lg p-6 space-y-6 bg-card animate-in slide-in-from-right-4">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-bold">유저 상세 정보</h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>닫기</Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col items-center py-4 border-b">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold mb-2">
                  {selectedUser.handle[0]}
                </div>
                <span className="font-bold">{selectedUser.displayName}</span>
                <span className="text-xs text-muted-foreground">@{selectedUser.handle}</span>
              </div>

              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground" suppressHydrationWarning>가입일</span>
                  <span>{isMounted ? new Date(selectedUser.createdAt).toLocaleDateString() : ""}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">최근 접속 IP</span>
                  <span className="font-mono text-xs text-blue-600 underline">{selectedUser.lastIp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">보안 등급</span>
                  <span>{selectedUser.role}</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <h3 className="text-xs font-bold uppercase text-muted-foreground">위험 관리</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={async () => (handleBan({
                      targetId: selectedUser.id, 
                      targetIp: selectedUser.lastIp, 
                      type: 'BAN', 
                      reason: '긴급 차단', 
                      endAt: new Date().setMonth(new Date().getMonth() + 1), 
                    }))} 
                    variant="outline" 
                    className="text-orange-600 gap-2 h-8 text-xs"
                  >
                    <ShieldBan className="w-3 h-3" /> 활동 제한
                  </Button>
                  <Button 
                    onClick={async () => (handleBan({
                      targetId: selectedUser.id, 
                      targetIp: selectedUser.lastIp, 
                      type: 'PERMANENT_BAN', 
                      reason: '긴급 차단', 
                      endAt: new Date().setMonth(new Date().getMonth() + 1), 
                    }))} 
                    variant="destructive" 
                    className="gap-2 h-8 text-xs"
                  >
                    <ShieldBan className="w-3 h-3" /> 영구 차단
                  </Button>
                </div>
                <Button 
                  variant="secondary" 
                  className="w-full h-8 text-xs"
                  onClick={() => router.push(`/admin?t=userdetails&u=${selectedUser.id}`)}
                >
                  상세 관리 및 활동 내역 보기
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {data && data.totalPages > 1 && (<PageNav currentPage={currentPage} totalPages={data.totalPages} pages={data.pages} params={`&t=users`}/>)}
    </div>
  );
}

export function UserDetailPage({data, usersession}: {data: any, usersession: any}) {
  if (!data) return (<div>유저가 선택되지 않았습니다</div>)

  const [isMounted, setIsMounted] = useState(false);
  const [isPending, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: data.email,
    handle: data.handle,
    displayName: data.displayName,
    bio: data.bio ?? '',
    role: data.role,
    uuid: data.id
  })

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRevoke = async (sessionId: string) => {
    const res = await fetch(`/api/logout`, { 
      method: 'POST' ,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({sessionId}),
    })
    if (res.ok) {
      toast.success("기기 로그아웃 완료")
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      console.log(formData)
      const response = await fetch("/api/admin/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json();

      if (response.ok) {
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

  const handleBan = async (data: any) => {
    const res = await fetch(`/api/admin/user/ban`, { 
      method: 'POST' ,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetId: data.targetId, 
        targetIp: data.targetIp, 
        type: data.type, 
        reason: data.reason, 
        endAt: data.endAt, 
      }),
    })
    if (res.ok) {
      toast.success("유저가 밴 처리되었습니다.")
    }
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6">
      {/* 상단: 유저 기본 요약 정보 */}
      <div className="flex justify-between items-start">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold">J</div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">@{data.handle}</h1>
              <Badge className="bg-green-500">정상 계정</Badge>
            </div>
            <p className="text-muted-foreground font-mono text-sm">{data.email} · 가입일: {isMounted ? `${new Date(data.createdAt).toLocaleDateString()} ${new Date(data.createdAt).toLocaleTimeString()}` : ""}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={async () => (handleBan({
              targetId: data.id, 
              targetIp: data.lastIp, 
              type: 'BAN', 
              reason: '긴급 차단', 
              endAt: new Date().setMonth(new Date().getMonth() + 1), 
            }))} 
            variant="outline" 
            className="text-orange-600"
          >임시 제한</Button>
          <Button 
            onClick={async () => (handleBan({
              targetId: data.id, 
              targetIp: data.lastIp, 
              type: 'PERMANENT_BAN', 
              reason: '긴급 차단', 
              endAt: new Date().setMonth(new Date().getMonth() + 1), 
            }))} 
            variant="destructive"
          >영구 차단</Button>
        </div>
      </div>

      <Tabs defaultValue="main" className="space-y-4">
        <TabsList>
          <TabsTrigger value="main">유저 기본 정보</TabsTrigger>
          <TabsTrigger value="security">보안 및 세션</TabsTrigger>
          <TabsTrigger value="activity">통합 활동 내역</TabsTrigger>
          <TabsTrigger value="admin-notes">내부 메모</TabsTrigger>
        </TabsList>

        <TabsContent value="main" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <UserCircle className="w-4 h-4" /> 상세 인적 사항
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">이메일 주소</label>
                    <div className="flex gap-2">
                      <Input 
                        key={'email'}
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                      />
                      <Button variant="outline" size="sm">인증 발송</Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">사용자 핸들</label>
                    <Input 
                      key={'handle'}
                      value={formData.handle}
                      onChange={(e) => setFormData({...formData, handle: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">사용자 표시 닉네임</label>
                    <Input 
                      key={'displayName'}
                      value={formData.displayName}
                      onChange={(e) => setFormData({...formData, displayName: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">사용자 소개</label>
                    <Input 
                      key={'bio'}
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">시스템 권한 그룹</label>
                    <Select value={formData.role} onValueChange={(e) => setFormData({...formData, role: e})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem key={'USER'} value="USER">일반 유저</SelectItem>
                        <SelectItem key={'MODERATOR'} value="MODERATOR">중재자 (Moderator)</SelectItem>
                        <SelectItem key={'ADMIN'} value="ADMIN">관리자 (Admin)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleSave} disabled={isPending} className="w-fit">변경사항 저장</Button>
              </CardContent>
            </Card>

            {/* 오른쪽: 계정 상태 및 등급 */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> 계정 상태 및 권한
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">현재 계정 상태</label>
                  <div className="flex items-center gap-2">
                    <Badge className={`${(data.status == 'BANNED') ? 'bg-red-500' : 'bg-green-500'}`}>{data.status}</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">소셜 연동 현황</label>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="flex gap-1 items-center">
                      <GoalIcon className="w-3 h-3" /> 연동됨
                    </Badge>
                    <Badge variant="outline" className="opacity-40">Discord 미연동</Badge>
                  </div>
                </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">계정 고유 ID (UUID)</label>
                    <p className="text-sm p-2 bg-muted/50 rounded-md">{data.id}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">가입 일시</label>
                    <p className="text-sm p-2 bg-muted/50 rounded-md">{isMounted ? `${new Date(data.createdAt).toLocaleDateString()} ${new Date(data.createdAt).toLocaleTimeString()}` : ""}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">최근 접속</label>
                    <p className="text-sm p-2 bg-muted/50 rounded-md">{isMounted ? `${new Date(data.updatedAt).toLocaleDateString()} ${new Date(data.updatedAt).toLocaleTimeString()}` : ""}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">가입 IP</label>
                    <p className="text-sm p-2 bg-muted/50 rounded-md">{data.regIp}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">최근 접속 IP</label>
                    <p className="text-sm p-2 bg-muted/50 rounded-md">{data.lastIp}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">계정 국적</label>
                    <p className="text-sm p-2 bg-muted/50 rounded-md">{data.countryCode}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">이메일 인증 여부</label>
                    <p className="text-sm p-2 bg-muted/50 rounded-md">{data.isEmailVerified ? '예' : '아니오'}</p>
                  </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 2. 보안 및 세션 탭 (테러 대응 핵심) */}
        <TabsContent value="security" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">현재 활성 세션</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {usersession.map((s: any) => (
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
        </TabsContent>

        {/* 1. 통합 활동 내역 탭 */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">타임라인</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
  
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. 내부 메모 (관리자 전용) */}
        <TabsContent value="admin-notes">
          <Card>
            <CardContent>
              <textarea 
                className="w-full h-32 p-3 text-sm border rounded-md bg-muted/20" 
                placeholder="관리자들만 볼 수 있는 메모를 남기세요..."
              />
              <Button className="mt-2">메모 저장</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function AuditLogPage({data, currentPage}: {data: any, currentPage: number}) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">시스템 변경 로그</h1>
          <p className="text-sm text-muted-foreground">관리자 작업 및 주요 시스템 이벤트를 실시간으로 모니터링합니다.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> 로그 추출 (CSV)</Button>
        </div>
      </div>

      {/* 필터 섹션 */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input placeholder="수행자 또는 대상 유저 검색..." />
          <Select defaultValue="all-services">
             <SelectTrigger><SelectValue placeholder="서비스 선택" /></SelectTrigger>
             <SelectContent>
               <SelectItem value="all-services">모든 서비스</SelectItem>
               <SelectItem value="auth">서버</SelectItem>
             </SelectContent>
          </Select>
          <Select defaultValue="all-actions">
             <SelectTrigger><SelectValue placeholder="작업 유형" /></SelectTrigger>
             <SelectContent>
               <SelectItem value="all-actions">모든 작업</SelectItem>
               <SelectItem value="permission">권한 변경</SelectItem>
               <SelectItem value="sanction">제재 처리</SelectItem>
             </SelectContent>
          </Select>
          <Button variant="secondary">필터 적용</Button>
        </div>
      </Card>

      {/* 로그 테이블 */}
      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">일시</TableHead>
              <TableHead>작업</TableHead>
              <TableHead>대상</TableHead>
              <TableHead className="text-right">IP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.results.map((data: any) => (
              <TableRow key={data.id}>
                <TableCell className="text-xs font-mono">{isMounted ? `${new Date(data.createdAt).toLocaleDateString()} ${new Date(data.createdAt).toLocaleTimeString()}` : ''}</TableCell>
                <TableCell><Badge variant="outline">{data.action}</Badge></TableCell>
                <TableCell>{data.targetId}</TableCell>
                <TableCell className="text-right text-xs font-mono">{data.actorIp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {data && data.totalPages > 1 && (<PageNav currentPage={currentPage} totalPages={data.totalPages} pages={data.pages} params={`&t=logs`}/>)}
    </div>
  );
}

export function SanctionsPage({data, currentPage}: {data: any, currentPage: number}) {
  const handleBan = async (data: any) => {
    const res = await fetch(`/api/admin/user/unban`, { 
      method: 'POST' ,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetId: data.targetId, 
        targetIp: data.targetIp, 
      }),
    })
    if (res.ok) {
      toast.success("유저가 밴 해제되었습니다.")
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">제재 및 차단 관리</h1>
          <p className="text-sm text-muted-foreground">악성 유저의 활동을 제한하고 제재 이력을 관리합니다.</p>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <div className="text-xs font-bold text-muted-foreground uppercase">현재 차단 중</div>
            <div className="text-2xl font-black">{data.results.length}명</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active-bans">
        <TabsList>
          <TabsTrigger value="active-bans">진행 중인 제재</TabsTrigger>
          <TabsTrigger value="history">전체 이력</TabsTrigger>
        </TabsList>

        <TabsContent value="active-bans" className="border rounded-lg bg-card mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>대상 유저</TableHead>
                <TableHead>제재 유형</TableHead>
                <TableHead>사유</TableHead>
                <TableHead>만료 예정일</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.results.map((data: any) => (
                <TableRow key={data.id}>
                  <TableCell>
                    <div className="font-medium text-sm">{data.targetId}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{data.targetIp}</div>
                  </TableCell>
                  <TableCell><Badge variant="destructive">{data.type}</Badge></TableCell>
                  <TableCell className="text-xs">{data.reason}</TableCell>
                  <TableCell className="text-xs font-mono">{new Date(data.endAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      onClick={async () => (await handleBan({targetId: data.targetId, targetIp: data.targetIp}))}
                      variant="outline" 
                      size="sm"
                    >해제</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent>
              <div className="text-sm text-muted-foreground text-center py-10">
                대기 중인 이의 신청이 없습니다. 평화로운 상태입니다! 😊
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {data && data.totalPages > 1 && (<PageNav currentPage={currentPage} totalPages={data.totalPages} pages={data.pages} params={`&t=bans`}/>)}
    </div>
  );
}

export function ReportManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">신고 내역 관리</h1>
          <p className="text-sm text-muted-foreground">부적절한 활동을 검토하고 처리합니다.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="h-8">대기 중: 12건</Badge>
          <Badge variant="secondary" className="h-8">처리 완료: 450건</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 신고 목록 테이블 */}
        <Card className="lg:col-span-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>유형</TableHead>
                <TableHead>신고 대상</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">시간</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="cursor-pointer hover:bg-muted/50">
                <TableCell><Badge variant="outline" className="text-red-500">도배/반달</Badge></TableCell>
                <TableCell>
                  <div className="text-sm font-bold">문서: '비트코인'</div>
                  <div className="text-[10px] text-muted-foreground italic">"의미 없는 문자열 도배 중..."</div>
                </TableCell>
                <TableCell><Badge className="bg-orange-400">검토 대기</Badge></TableCell>
                <TableCell className="text-right text-xs">5분 전</TableCell>
              </TableRow>
              <TableRow className="cursor-pointer hover:bg-muted/50">
                <TableCell><Badge variant="outline" className="text-red-500">도배/반달</Badge></TableCell>
                <TableCell>
                  <div className="text-sm font-bold">문서: '이더리움'</div>
                  <div className="text-[10px] text-muted-foreground italic">"의미 없는 문자열 도배 중..."</div>
                </TableCell>
                <TableCell><Badge className="bg-orange-400">검토 대기</Badge></TableCell>
                <TableCell className="text-right text-xs">5분 전</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        {/* 오른쪽: 신고 상세 및 즉각 조치 패널 */}
        <Card className="lg:col-span-1 border-orange-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" /> 신고 상세 검토
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-3 rounded-md text-xs">
              <p className="font-bold mb-1">신고 유저: User_Alpha</p>
              <p>신고 사유: "같은 내용을 10번 넘게 반복해서 올리고 있습니다. 제재 부탁드립니다."</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-muted-foreground">빠른 조치</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="text-xs">내용 삭제</Button>
                <Button size="sm" variant="outline" className="text-xs">반려(무시)</Button>
              </div>
              <Button size="sm" variant="destructive" className="w-full">
                해당 유저 즉시 차단 페이지로 이동
              </Button>
            </div>

            <div className="pt-4 border-t">
               <h4 className="text-xs font-bold text-muted-foreground mb-2">관리자 답변 발송</h4>
               <textarea className="w-full h-20 text-xs p-2 border rounded" placeholder="신고 유저에게 보낼 처리 결과를 입력하세요..." />
               <Button size="sm" className="w-full mt-2">처리 완료 및 알림 발송</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function SystemSettingsPage({data}: any) {
  const handleToggle = async (key: string, value: boolean) => {
    const res = await fetch(`/api/admin/system`, { 
      method: 'POST' ,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key, 
        value, 
      }),
    })
    
    if (res.ok) {
      toast.success("설정 변경 완료", { description: `시스템 상태가 즉시 업데이트되었습니다.` });
    } else {
      toast.error("변경 실패", { description: "DB 연결 상태를 확인하세요." });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">시스템 설정</h1>
        <p className="text-sm text-muted-foreground">로그인 서버의 전역 정책과 서비스 연동 설정을 관리합니다.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* 섹션 1: 비상 대응 (가장 상단에 배치) */}
        <Card className="border-red-900 bg-red-50/10">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-red-600 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4" /> 비상 대응 (Panic Button)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">전체 서비스 읽기 전용 모드</p>
              <p className="text-xs text-muted-foreground">활성화 시 모든 서비스의 쓰기/수정 기능이 즉시 차단됩니다.</p>
            </div>
            <Switch 
              defaultChecked={data.isReadOnlyMode}
              onCheckedChange={(val) => handleToggle("isReadOnlyMode", val)}
            />
          </CardContent>
          <CardContent className="flex flex-col md:flex-row gap-4 pt-0">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">신규 회원가입 중단</p>
              <p className="text-xs text-muted-foreground">매크로 가입 테러 발생 시 즉시 가입을 막습니다.</p>
            </div>
            <Switch 
              defaultChecked={data.isRegistrationClosed}
              onCheckedChange={(val) => handleToggle("isRegistrationClosed", val)}
            />
          </CardContent>
        </Card>

        {/* 섹션 2: 보안 정책 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">인증 및 보안 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase">비밀번호 최소 길이</label>
                <Input type="number" defaultValue={8} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase">로그인 시도 제한 (회)</label>
                <Input type="number" defaultValue={5} />
              </div>
              <div className="space-y-2 flex items-center justify-between border p-3 rounded">
                <div>
                  <p className="text-sm font-medium">2단계 인증(2FA) 필수화</p>
                  <p className="text-[10px] text-muted-foreground">모든 관리자 계정에 OTP 인증을 강제합니다.</p>
                </div>
                <Switch checked />
              </div>
            </div>
            <Button size="sm" className="mt-2">보안 설정 저장</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
