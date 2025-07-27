import { ObjectId } from 'mongodb'

export interface AuditLog {
  _id?: ObjectId
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
  timestamp: Date
  ipAddress?: string
  userAgent?: string
} 