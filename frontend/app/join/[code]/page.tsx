"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { /* joinListByCode removed */ } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

export default function JoinPage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("���ڼ���Ȧ��...")

  useEffect(() => {
    if (!code) {
      setStatus("error")
      setMessage("��Ч����������")
      return
    }

    // Delay slightly to show UI
    const timer = setTimeout(() => {
        const result = joinListByCode(code.toUpperCase())
        if (result.success) {
            setStatus("success")
            setMessage(result.message)
            // Redirect after 2 seconds
            setTimeout(() => {
                router.push("/")
            }, 2000)
        } else {
            setStatus("error")
            setMessage(result.message)
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
            <CardTitle>{status === "loading" ? "���ڼ���..." : (status === "success" ? "����ɹ�" : "����ʧ��")}</CardTitle>
            <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
            {status !== "loading" && (
                <Button onClick={() => router.push("/")}>
                    ������ҳ
                </Button>
            )}
        </CardFooter>
      </Card>
    </div>
  )
}
