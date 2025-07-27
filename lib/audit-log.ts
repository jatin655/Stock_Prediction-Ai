import { AuditLog } from './models/AuditLog'
import clientPromise from './mongodb'

export async function logAuditEvent(
  action: 'role_change' | 'login' | 'logout' | 'admin_access',
  userId?: string,
  userEmail?: string,
  adminId?: string,
  adminEmail?: string,
  details?: {
    targetUserId?: string
    targetUserEmail?: string
    oldRole?: string
    newRole?: string
    ipAddress?: string
    userAgent?: string
  },
  ipAddress?: string,
  userAgent?: string
) {
  try {
    const client = await clientPromise
    const db = client.db()
    const auditLogs = db.collection<AuditLog>('auditLogs')

    const auditLog: AuditLog = {
      action,
      userId,
      userEmail,
      adminId,
      adminEmail,
      details: details || {},
      timestamp: new Date(),
      ipAddress,
      userAgent,
    }

    await auditLogs.insertOne(auditLog)
  } catch (error) {
    console.error('Error logging audit event:', error)
  }
} 