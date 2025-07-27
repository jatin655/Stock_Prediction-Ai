import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const auditLogs = db.collection('audit_logs');
    const logs = await auditLogs.find({}).sort({ timestamp: -1 }).limit(50).toArray();
    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Audit log fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
} 