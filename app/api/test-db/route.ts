import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(); // Use default DB from URI
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((col) => col.name);
    return NextResponse.json({ collections: collectionNames });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 