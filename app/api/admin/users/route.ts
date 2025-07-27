import { authOptions } from '@/lib/auth'
import { AuditLog } from '@/lib/models/AuditLog'
import { User } from '@/lib/models/User'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

// GET - Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const client = await clientPromise
    const db = client.db()
    const users = db.collection<User>('users')

    const allUsers = await users.find({}, { projection: { password: 0 } }).toArray()

    return NextResponse.json({ users: allUsers })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Update user role (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const { userId, newRole } = await request.json()

    if (!userId || !newRole || !['user', 'admin'].includes(newRole)) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()
    const users = db.collection<User>('users')
    const auditLogs = db.collection<AuditLog>('auditLogs')

    // Get the target user
    const targetUser = await users.findOne({ _id: new ObjectId(userId) })
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent admin from changing their own role
    if (targetUser._id?.toString() === session.user.id) {
      return NextResponse.json({ error: 'Cannot change your own role' }, { status: 400 })
    }

    const oldRole = targetUser.role

    // Update user role
    await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role: newRole } }
    )

    // Create audit log
    const auditLog: AuditLog = {
      action: 'role_change',
      adminId: session.user.id,
      adminEmail: session.user.email || '',
      userId: targetUser._id?.toString(),
      userEmail: targetUser.email,
      details: {
        targetUserId: targetUser._id?.toString(),
        targetUserEmail: targetUser.email,
        oldRole,
        newRole,
      },
      timestamp: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    }

    await auditLogs.insertOne(auditLog)

    return NextResponse.json({ 
      message: 'User role updated successfully',
      oldRole,
      newRole 
    })
  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 