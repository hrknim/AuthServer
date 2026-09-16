"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import {
  Bell, ShieldCheck, Copy, AlertOctagon, AlertTriangle,
  Download, ShieldAlert, UserX, BookOpen, Plus, ChevronRight, GoalIcon, UserCircle, ShieldBan, MoreHorizontal, Search
} from "lucide-react";
import { toast } from "sonner"

import PageNav from '@/components/auth/PageNav';

export function AdminDashboard(data: any) {

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

export function UserManagementPage({ data, currentPage }: { data: any, currentPage: number }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">유저 리스트</h1>
          <p className="text-sm text-muted-foreground">가입된 모든 유저 계정을 관리합니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="검색..." className="pl-8 w-[250px]" />
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>유저 정보</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>UUID</TableHead>
              <TableHead>마지막 로그인</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.results.map((user: any) => (
              <TableRow
                key={user.id}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell>
                  <div className="font-medium">@{user.handle}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </TableCell>
                <TableCell>{user.displayName}</TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{isMounted ? `${new Date(user.updatedAt).toLocaleDateString()} ${new Date(user.updatedAt).toLocaleTimeString()}` : ""}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${(user.status != 'ACTIVE') ? 'bg-red-500' : 'bg-green-500'}`}>{user.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="secondary"
                    className="h-8 text-xs"
                    onClick={() => router.push(`/admin?t=userdetails&u=${user.id}`)}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    상세 보기
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {data && data.totalPages > 1 && (<PageNav currentPage={currentPage} totalPages={data.totalPages} pages={data.pages} params={`&t=users`} />)}
    </div>
  );
}

export function UserDetailPage({ data, usersession }: { data: any, usersession: any }) {
  if (!data) return (<div>유저 관리에서 선택하세요.</div>)

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
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
    if (res.ok) {
      toast.success("기기 로그아웃 완료")
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      console.log(formData)
      const response = await fetch("/api/admin/profile", {
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

  return (
    <div className="mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold">J</div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">@{data.handle}</h1>
            </div>
            <p className="text-muted-foreground font-mono text-sm">{data.email} · 가입일: {isMounted ? `${new Date(data.createdAt).toLocaleDateString()} ${new Date(data.createdAt).toLocaleTimeString()}` : ""}</p>
          </div>
        </div>
        <div className="flex gap-2">

        </div>
      </div>

      <Tabs defaultValue="main" className="space-y-4">
        <TabsList className="gap-1">
          <TabsTrigger value="main">기본 정보</TabsTrigger>
          <TabsTrigger value="security">활성화된 세션</TabsTrigger>
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
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                      <Button variant="outline" size="sm">인증 발송</Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">사용자 핸들</label>
                    <Input
                      key={'handle'}
                      value={formData.handle}
                      onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">사용자 표시 닉네임</label>
                    <Input
                      key={'displayName'}
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">사용자 소개</label>
                    <Input
                      key={'bio'}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">시스템 권한 그룹</label>
                    <Select value={formData.role} onValueChange={(e) => setFormData({ ...formData, role: e })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem key={'USER'} value="USER">USER</SelectItem>
                        <SelectItem key={'ADMIN'} value="ADMIN">ADMIN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleSave} disabled={isPending} className="w-fit">변경사항 저장</Button>
              </CardContent>
            </Card>

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
                    <Badge className={`${(data.status != 'ACTIVE') ? 'bg-red-500' : 'bg-green-500'}`}>{data.status}</Badge>
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

        <TabsContent value="security" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">현재 활성 세션</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {usersession && usersession.map((s: any) => (
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
      </Tabs>
    </div>
  );
}

export function SystemSettingsPage({ data }: any) {
  const handleToggle = async (key: string, value: boolean) => {
    const res = await fetch(`/api/admin/system`, {
      method: 'POST',
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
        <p className="text-sm text-muted-foreground">로그인 서버의 전역 정책을 관리합니다.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-red-900 bg-red-50/10">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-red-600 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4" /> 비상 대응
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
              <p className="text-xs text-muted-foreground">DDOS 발생 시 즉시 가입을 막습니다.</p>
            </div>
            <Switch
              defaultChecked={data.isRegistrationClosed}
              onCheckedChange={(val) => handleToggle("isRegistrationClosed", val)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
