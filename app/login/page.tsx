"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // ✅ NextAuth 전용 로그인 함수 호출
      const response = await fetch('/api/login', {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      })

      if (response.ok) {
        // 로그인 성공
        router.push('/');
        router.refresh();
      } else {
        // authorize에서 null을 리턴하거나 에러가 나면 여기로 들어옵니다.
        toast.error("이메일 또는 비밀번호가 올바르지 않습니다.")
      }
    } catch (error) {
      toast.error("로그인 중 서버 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <aside className="sticky top-20 col-span-2 hidden lg:block space-y-1">
      </aside>

      <div className="max-w-none col-span-12 lg:col-span-10 xl:col-span-8">
        <div className="flex items-center justify-center px-4 py-12 font-sans">
          <Card className="w-full max-w-md shadow-lg gap-2">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">로그인</CardTitle>
              <CardDescription>
                계정에 로그인하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleLogin}>
                {/* 이메일 입력 */}
                <div className="space-y-2 my-4">
                  <Label htmlFor="email">이메일</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-9 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input w-full min-w-0 rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-9 text-sm transition-all focus-visible:outline-none"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* 비밀번호 입력 */}
                <div className="space-y-2 my-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">비밀번호</Label>
                    <a href="/forgot-password" className="text-[0.7rem] text-primary hover:underline">
                      비밀번호를 잊으셨나요?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      id="password"
                      type="password"
                      className="pl-9 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input w-full min-w-0 rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-9 text-sm transition-all focus-visible:outline-none"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button className="w-full font-bold h-11" type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "로그인"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="text-center text-sm text-muted-foreground">
                아직 계정이 없으신가요?{" "}
                <a href="/signup" className="text-primary font-medium hover:underline">
                  회원가입
                </a>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      <aside className="sticky top-20 space-y-4 col-span-2 hidden xl:block">
      </aside>
    </>
  )
}
