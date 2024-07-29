import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const subscriptions = db.collection('subscriptions');

    const userSubscriptions = await subscriptions.find({ userId }).toArray();

    const exams = db.collection('exams');
    const subscribedExams = await Promise.all(
      userSubscriptions.map(async (sub) => {
        try {
          const examObjectId = new ObjectId(sub.examId);
          const exam = await exams.findOne({ _id: examObjectId });
          return {
            examId: sub.examId,
            examName: exam ? exam.examName : 'Unknown Exam',
          };
        } catch (error) {
          console.error(`Error processing exam ID ${sub.examId}:`, error);
          return {
            examId: sub.examId,
            examName: 'Error: Unable to fetch exam',
          };
        }
      })
    );

    return NextResponse.json({ subscribedExams });
  } catch (error) {
    console.error('Error fetching subscribed exams:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}