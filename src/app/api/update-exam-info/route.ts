import { NextResponse } from 'next/server';
import { NextApiRequest } from 'next';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '../../../lib/mongodb';

export async function POST(req: NextApiRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('examPrep');
    const examInfo = db.collection('exams');
    const examUpdates = db.collection('examUpdates');

    const { examName, examDate, examDetails, source } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastUpdate = await examUpdates.findOne({
      userId,
      updatedAt: { $gte: today }
    });

    if (lastUpdate) {
      return NextResponse.json({ error: 'You can only update exam information once per day' }, { status: 403 });
    }

    const result = await examInfo.updateOne(
      { examName },
      {
        $set: {
          examDate,
          examDetails,
          source,
          lastUpdatedBy: userId,
          lastUpdatedAt: new Date()
        },
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