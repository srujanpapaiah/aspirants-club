import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('examPrep');
    const subscriptions = db.collection('subscriptions');

    const subscription = await subscriptions.findOne({ userId, examId: params.id });

    return NextResponse.json({ isSubscribed: !!subscription });
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { token } = await request.json();

    const client = await clientPromise;
    const db = client.db('examPrep');
    const subscriptions = db.collection('subscriptions');

    await subscriptions.updateOne(
      { userId, examId: params.id },
      { $set: { userId, examId: params.id, fcmToken: token } },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Subscription successful' });
  } catch (error) {
    console.error('Error subscribing to exam:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}