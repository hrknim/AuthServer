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
    <div>
      비밀번호 찾기 페이지
    </div>
  )
}
