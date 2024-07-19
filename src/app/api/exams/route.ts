// app/api/exams/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Exam } from '@/types/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    const exams = await db.collection<Exam>('exams').find({}).toArray();
    
    return NextResponse.json(exams);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 });
  }
}