"use client"

import AnimatedCard from "@/components/AnimatedCard"
import Aurora from "@/components/Aurora"
import Footer from "@/components/footer"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import UnifiedNavbar from "@/components/UnifiedNavbar"
import { Clock, Crown, Eye, Users } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface User {
  _id: string
  name: string
  email: string
  role: string
  createdAt: string
  image?: string
}

interface AuditLog {
  _id: string
  action: 'role_change' | 'login' | 'logout' | 'admin_access'
  userId?: string
  userEmail?: string
  adminId?: string
  adminEmail?: string
  details: {
    targetUserId?: string
    targetUserEmail?: string
    oldRole?: string
    newRole?: string
    ipAddress?: string
    userAgent?: string
  }
  timestamp: string
  ipAddress?: string
  userAgent?: string
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingRole, setUpdatingRole] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    if (session.user.role !== 'admin') {
      router.push('/dashboard')
      return
    }
    
    fetchUsers()
    fetchAuditLogs()
  }, [session, status, router])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      } else {
        setError('Failed to fetch users')
      }
    } catch (error) {
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch('/api/admin/audit-logs')
      if (response.ok) {
        const data = await response.json()
        setAuditLogs(data.logs)
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error)
    }
  }

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    setUpdatingRole(userId)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, newRole }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`User role updated successfully from ${data.oldRole} to ${data.newRole}`)
        fetchUsers() // Refresh the user list
        fetchAuditLogs() // Refresh audit logs
      } else {
        setError(data.error || 'Failed to update user role')
      }
    } catch (error) {
      setError('Failed to update user role')
    } finally {
      setUpdatingRole(null)
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'role_change':
        return <Crown className="h-5 w-5 text-purple-400" />
      case 'login':
        return <Users className="h-5 w-5 text-emerald-400" />
      case 'logout':
        return <Users className="h-5 w-5 text-sky-400" />
      default:
        return <Eye className="h-5 w-5 text-sky-400" />
    }
  }

  const getActionDescription = (log: AuditLog) => {
    switch (log.action) {
      case 'role_change':
        return `Admin ${log.adminEmail} changed ${log.details.targetUserEmail}'s role from ${log.details.oldRole} to ${log.details.newRole}`
      case 'login':
        return `User ${log.userEmail} logged in`
      case 'logout':
        return `User ${log.userEmail} logged out`
      default:
        return `Action: ${log.action}`
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen relative bg-black">
        <div className="fixed inset-0 z-0">
          <Aurora colorStops={["#0ea5e9", "#3b82f6", "#8b5cf6"]} amplitude={1.0} blend={0.5} />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-sky-400/30 border-t-sky-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Loading admin panel...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen relative bg-black">
      <div className="fixed inset-0 z-0">
        <Aurora colorStops={["#0ea5e9", "#3b82f6", "#8b5cf6"]} amplitude={1.0} blend={0.5} />
      </div>
      <div className="relative z-10">
        <UnifiedNavbar />
        
        {/* Main Content Section */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="container mx-auto px-4">
            {/* Large Central Card - STATIC */}
            <Card className="main-card-dark animate-ethereal-glow-dark max-w-7xl mx-auto">
              <CardContent className="p-16">
                {/* Header */}
                <div className="text-center mb-12">
                  <h1 className="text-heading mb-6">
                    Admin Panel
                  </h1>
                  <p className="text-subheading">
                    Welcome back, {session.user.name || 'Admin'}
                  </p>
                </div>

                {/* Alerts */}
                {error && (
                  <Alert variant="destructive" className="mb-6 animate-shake glass-ethereal-dark border-red-400/50 text-red-300">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert className="mb-6 glass-ethereal-dark border-emerald-400/50 text-emerald-300">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                {/* Admin Content */}
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Admin Info Card */}
                  <div className="lg:col-span-1">
                    <AnimatedCard
                      className="ethereal-card-dark animate-ethereal-glow-dark"
                      enableStars={true}
                      enableTilt={false}
                      enableMagnetism={true}
                      clickEffect={true}
                      particleCount={6}
                    >
                      <CardHeader className="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-t-lg">
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-10 h-10 glass-frost-dark rounded-xl flex items-center justify-center">
                            <Crown className="h-5 w-5" />
                          </div>
                          Admin Information
                        </CardTitle>
                        <CardDescription className="text-sky-100">Your admin account details</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 glass-frost-dark">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            {session.user.image ? (
                              <img src={session.user.image} alt="Admin" className="w-12 h-12 rounded-full" />
                            ) : (
                              <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold">
                                  {session.user.name?.charAt(0) || 'A'}
                                </span>
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold text-white">{session.user.name}</h3>
                              <p className="text-sm text-gray-300">{session.user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                              <Crown className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                              Active
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm text-gray-300">
                            <p>Role: Administrator</p>
                            <p>Permissions: Full access</p>
                            <p>Last login: {new Date().toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </AnimatedCard>
                  </div>

                  {/* User Management Card */}
                  <div className="lg:col-span-2 space-y-8">
                    <AnimatedCard
                      className="ethereal-card-dark animate-ethereal-glow-dark"
                      enableStars={true}
                      enableTilt={false}
                      enableMagnetism={true}
                      clickEffect={true}
                      particleCount={8}
                    >
                      <CardHeader className="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-t-lg">
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-10 h-10 glass-frost-dark rounded-xl flex items-center justify-center">
                            <Users className="h-5 w-5" />
                          </div>
                          User Management
                        </CardTitle>
                        <CardDescription className="text-sky-100">Manage user accounts and roles</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 glass-frost-dark">
                        {loading ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="w-8 h-8 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin mr-3"></div>
                            <span className="text-white">Loading users...</span>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-white">User</TableHead>
                                  <TableHead className="text-white">Email</TableHead>
                                  <TableHead className="text-white">Role</TableHead>
                                  <TableHead className="text-white">Joined</TableHead>
                                  <TableHead className="text-white">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {users.map((user) => (
                                  <TableRow key={user._id}>
                                    <TableCell>
                                      <div className="flex items-center gap-3">
                                        {user.image ? (
                                          <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full" />
                                        ) : (
                                          <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-semibold">
                                              {user.name.charAt(0)}
                                            </span>
                                          </div>
                                        )}
                                        <span className="font-medium text-white">{user.name}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-white">{user.email}</TableCell>
                                    <TableCell>
                                      <Badge 
                                        variant={user.role === 'admin' ? 'default' : 'secondary'} 
                                        className={user.role === 'admin' ? 'bg-purple-500' : 'bg-sky-100 text-sky-700'}
                                      >
                                        {user.role === 'admin' ? (
                                          <>
                                            <Crown className="h-3 w-3 mr-1" />
                                            Admin
                                          </>
                                        ) : (
                                          <>
                                            <Users className="h-3 w-3 mr-1" />
                                            User
                                          </>
                                        )}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-white">
                                      {new Date(user.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                      {user._id !== session.user.id ? (
                                        <Select
                                          value={user.role}
                                          onValueChange={(value: 'user' | 'admin') => updateUserRole(user._id, value)}
                                          disabled={updatingRole === user._id}
                                        >
                                          <SelectTrigger className="w-32 bg-black/40 border-white/20 text-white">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent className="bg-black/90 border-white/20">
                                            <SelectItem value="user" className="text-white hover:bg-white/10">
                                              <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                User
                                              </div>
                                            </SelectItem>
                                            <SelectItem value="admin" className="text-white hover:bg-white/10">
                                              <div className="flex items-center gap-2">
                                                <Crown className="h-4 w-4" />
                                                Admin
                                              </div>
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      ) : (
                                        <span className="text-sm text-gray-400">Current user</span>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </AnimatedCard>

                    {/* Audit Logs Card */}
                    <AnimatedCard
                      className="ethereal-card-dark animate-ethereal-glow-dark"
                      enableStars={true}
                      enableTilt={false}
                      enableMagnetism={true}
                      clickEffect={true}
                      particleCount={6}
                    >
                      <CardHeader className="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-t-lg">
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-10 h-10 glass-frost-dark rounded-xl flex items-center justify-center">
                            <Eye className="h-5 w-5" />
                          </div>
                          Audit Logs
                        </CardTitle>
                        <CardDescription className="text-sky-100">Recent system activity and user actions</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 glass-frost-dark">
                        <div className="space-y-4">
                          {auditLogs.map((log) => (
                            <div key={log._id} className="flex items-center gap-4 p-4 glass-ethereal-dark rounded-lg border border-white/20">
                              <div className="flex-shrink-0">
                                {getActionIcon(log.action)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white">
                                  {getActionDescription(log)}
                                </p>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatTimestamp(log.timestamp)}
                                  </span>
                                  {log.ipAddress && (
                                    <span className="text-xs text-gray-400">IP: {log.ipAddress}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          {auditLogs.length === 0 && (
                            <div className="text-center py-8">
                              <Clock className="h-8 w-8 text-sky-400 mx-auto mb-2" />
                              <p className="text-white">No audit logs found</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </AnimatedCard>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <Footer />
      </div>
    </div>
  )
} 