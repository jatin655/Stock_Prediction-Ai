"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"

export default function DebugAuthPage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Authentication Debug</CardTitle>
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
            
            <div>
              <h3 className="text-white font-semibold">Environment Variables:</h3>
              <div className="text-gray-300 text-sm space-y-1">
                <p>NEXTAUTH_URL: {process.env.NEXTAUTH_URL || 'NOT SET'}</p>
                <p>NEXTAUTH_SECRET: {process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET'}</p>
                <p>MONGODB_URI: {process.env.MONGODB_URI ? 'SET' : 'NOT SET'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 