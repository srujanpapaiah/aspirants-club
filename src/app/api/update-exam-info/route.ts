import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';
import { Exam, EditHistoryEntry, PushOperator } from '@/types/mongodb';


export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {examName, examDate, examDetails, source, username } = body;

    if (!examName || !examDate || !examDetails || !source || !username) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const exams = db.collection<Exam>('exams');
    const examUpdates = db.collection('examUpdates');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastUpdate = await examUpdates.findOne({
      userId,
      updatedAt: { $gte: today }
    });

    if (lastUpdate) {
      return NextResponse.json({ error: 'You can only update exam information once per day' }, { status: 403 });
    }

    const editHistoryEntry: EditHistoryEntry = {
      userId,
      updatedAt: new Date(),
      changes: {
        examDate: new Date(examDate),
        examDetails,
        source,
      }
    };

    const pushOperation: PushOperator<Exam> = {
      editHistory: editHistoryEntry
    };

    const result = await exams.updateOne(
      { examName },
      {
        $set: {
          examDate: new Date(examDate),
          examDetails,
          source,
          lastUpdatedBy: userId,
          lastUpdatedAt: new Date()
        },
        $push: pushOperation,
        $inc: { updateCount: 1 },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );

    await examUpdates.insertOne({
      userId,
      examName,
      updatedAt: new Date()
    });

    return NextResponse.json({ message: 'Exam information updated successfully', result }, { status: 200 });
  } catch (error) {
    console.error('Error updating exam information:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}