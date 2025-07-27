import { authOptions } from '@/lib/auth'
import { AuditLog } from '@/lib/models/AuditLog'
import clientPromise from '@/lib/mongodb'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

// GET - Get audit logs (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const action = searchParams.get('action')
    const userId = searchParams.get('userId')

    const client = await clientPromise
    const db = client.db()
    const auditLogs = db.collection<AuditLog>('auditLogs')

    // Build filter
    const filter: any = {}
    if (action) filter.action = action
    if (userId) filter.userId = userId

    // Get total count
    const total = await auditLogs.countDocuments(filter)

    // Get paginated results
    const logs = await auditLogs
      .find(filter)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 