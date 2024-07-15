import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('examPrep');
    
    // Aggregate to count documents per exam name and sort
    const examNames = await db.collection('resources').aggregate([
      { $group: { _id: { $ifNull: ["$examName", "Unknown"] }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, name: "$_id", count: 1 } }
    ]).toArray();

    console.log('Fetched Exam Names:', examNames);

    return NextResponse.json({ examNames });
  } catch (error) {
    console.error('Error fetching exam names:', error);
    return NextResponse.json({ error: 'Failed to fetch exam names' }, { status: 500 });
  }
}