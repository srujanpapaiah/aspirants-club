import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const subscriptions = db.collection('subscriptions');

    const subscription = await subscriptions.findOne({ userId, examId: params.id });

    return NextResponse.json({ isSubscribed: !!subscription });
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { token, phoneNumber } = await request.json();

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const subscriptions = db.collection('subscriptions');

    const existingSubscription = await subscriptions.findOne({ userId, examId: params.id });

    if (existingSubscription) {
      // If already subscribed, unsubscribe
      await subscriptions.deleteOne({ userId, examId: params.id });
      return NextResponse.json({ message: 'Unsubscribed successfully', isSubscribed: false });
    } else {
      // If not subscribed, subscribe
      await subscriptions.insertOne({ 
        userId, 
        examId: params.id, 
        fcmToken: token,
        phoneNumber
      });
      return NextResponse.json({ message: 'Subscribed successfully', isSubscribed: true });
    }
  } catch (error) {
    console.error('Error toggling subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const subscriptions = db.collection('subscriptions');

    const result = await subscriptions.deleteOne({ userId, examId: params.id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Not subscribed', isSubscribed: false });
    }

    return NextResponse.json({ message: 'Unsubscribed successfully', isSubscribed: false });
  } catch (error) {
    console.error('Error unsubscribing from exam:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}