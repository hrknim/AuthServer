"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AtSign, Mail, Lock, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function SignUpPage() {
  const router = useRouter();
  //const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    handle: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    // 1. 기본 유효성 검사
    if (formData.password !== formData.confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          handle: formData.handle,
          password: formData.password
        }),
      })

      const data = await response.json();

      if (response.ok) {
        toast.success("회원가입이 완료되었습니다!")
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 1000);
      } else {
        toast.error(data.message || "오류가 발생했습니다.")
        setLoading(false)
      }
    } catch (error) {
      toast.error("서버와 통신 중 오류가 발생했습니다.")
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
              <CardTitle className="text-2xl font-bold tracking-tight">계정 생성</CardTitle>
              <CardDescription>
                새로운 계정을 생성합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit}>
                {/* 고유 핸들 (@) */}
                <div className="space-y-2 my-4">
                  <Label htmlFor="handle">고유 핸들</Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      id="handle"
                      placeholder="unique_handle"
                      className="pl-9 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input w-full min-w-0 rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-9 text-sm transition-all focus-visible:outline-none"
                      value={formData.handle}
                      onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                      required
                    />
                  </div>
                  <p className="text-[0.65rem] text-muted-foreground">URL 주소에 사용될 고유 식별자입니다.</p>
                </div>

                {/* 이메일 */}
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

                {/* 비밀번호 */}
                <div className="space-y-2 my-4">
                  <Label htmlFor="password">비밀번호</Label>
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

                {/* 비밀번호 확인 */}
                <div className="space-y-2 my-4">
                  <Label htmlFor="confirm-password">비밀번호 확인</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      id="confirm-password"
                      type="password"
                      className="pl-9 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input w-full min-w-0 rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-9 text-sm transition-all focus-visible:outline-none"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button className="w-full font-bold h-11" type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  가입하기
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="text-center text-sm text-muted-foreground">
                이미 계정이 있으신가요?{" "}
                <a href="/login" className="text-primary font-medium hover:underline">
                  로그인
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
