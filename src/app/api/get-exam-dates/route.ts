import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';


export async function GET() {
    try {
      const client = await clientPromise;
      const database = client.db('examPrep');
      const exams = database.collection('exams');
  
      const currentDate = new Date();
      const examDates = await exams
        .find({ examDate: { $gte: currentDate } })
        .sort({ examDate: 1 })
        .limit(5)
        .toArray();
  
      return NextResponse.json({ examDates });
    } catch (error) {
      console.error('Error fetching exam dates:', error);
      return NextResponse.json({ error: 'Failed to fetch exam dates' }, { status: 500 });
    }
  }