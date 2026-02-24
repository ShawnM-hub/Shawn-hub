"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
// API implementation instead of local storage for joining
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

export default function JoinPage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("正在加入协作房间...")

  useEffect(() => {
    if (!code) {
      setStatus("error")
      setMessage("无效的邀请链接")
      return
    }

    // Delay slightly to show UI
    const timer = setTimeout(async () => {
      try {
        // Generate or get a guest ID to simulate a user
        const userId = localStorage.getItem("guest_id") || "user_" + Math.random().toString(36).substring(2, 9);
        localStorage.setItem("guest_id", userId);

        const res = await fetch(`/api/lists/${code.toUpperCase()}/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, userName: "神秘饭友" })
        });

        if (res.ok) {
          const data = await res.json();
          setStatus("success")
          setMessage("成功加入列表协作")
          // Redirect after 2 seconds
          setTimeout(() => {
            router.push(`/?listId=${data.id}&action=join`)
          }, 2000)
        } else {
          const err = await res.json().catch(() => ({ error: "未知错误" }));
          setStatus("error")
          setMessage("加入失败: " + (err.error || "未知原因"))
        }
      } catch (e) {
        setStatus("error")
        setMessage("网络连接失败，请重试")
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [code, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-sm shadow-lg border-none bg-background/95 backdrop-blur">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            {status === "loading" && <Loader2 className="w-6 h-6 animate-spin text-primary" />}
            {status === "success" && <CheckCircle2 className="w-6 h-6 text-green-500" />}
            {status === "error" && <XCircle className="w-6 h-6 text-destructive" />}
          </div>
          <CardTitle>{status === "loading" ? "正在加入房间..." : (status === "success" ? "加入成功" : "加入失败")}</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          {status !== "loading" && (
            <Button onClick={() => router.push("/")}>
              返回首页
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
