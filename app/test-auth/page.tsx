"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn, signOut, useSession } from "next-auth/react"

export default function TestAuthPage() {
  const { data: session, status } = useSession()

  const handleTestLogin = async () => {
    const result = await signIn("credentials", {
      email: "test@example.com",
      password: "password123",
      redirect: false,
    })
    console.log("Sign in result:", result)
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Authentication Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-white font-semibold">Status:</h3>
              <p className="text-gray-300">{status}</p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold">Session:</h3>
              <pre className="text-gray-300 text-sm bg-black/40 p-4 rounded overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
            
            <div className="flex gap-4">
              <Button onClick={handleTestLogin} className="bg-sky-500 hover:bg-sky-600">
                Test Login
              </Button>
              <Button onClick={() => signOut()} className="bg-red-500 hover:bg-red-600">
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 