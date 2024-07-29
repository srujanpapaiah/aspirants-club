// pages/api/get-subscribed-exams-details.ts

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
    const exams = db.collection('exams');

    // Get user's subscriptions
    const userSubscriptions = await subscriptions.find({ userId }).toArray();

    // Fetch full exam details for each subscription
    const subscribedExamsDetails = await Promise.all(
      userSubscriptions.map(async (sub) => {
        try {
          const examObjectId = new ObjectId(sub.examId);
          const exam = await exams.findOne({ _id: examObjectId });
          
          if (exam) {
            return {
              _id: exam._id.toString(),
              examName: exam.examName,
              examDate: exam.examDate,
              examDetails: exam.examDetails,
              source: exam.source,
              // Include any other relevant fields from the exam document
            };
          } else {
            console.error(`Exam not found for ID: ${sub.examId}`);
            return null;
          }
        } catch (error) {
          console.error(`Error processing exam ID ${sub.examId}:`, error);
          return null;
        }
      })
    );

    // Filter out any null results (exams that weren't found)
    const validExamsDetails = subscribedExamsDetails.filter(exam => exam !== null);

    return NextResponse.json({ subscribedExams: validExamsDetails });
  } catch (error) {
    console.error('Error fetching subscribed exams details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}