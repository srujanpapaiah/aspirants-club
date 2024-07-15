import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' });
    }

    const client = await clientPromise;
    const db = client.db('examPrep');
    const examUpdates = db.collection('examUpdates');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastUpdate = await examUpdates.findOne({
      userId,
      updatedAt: { $gte: today }
    });

    return NextResponse.json({ canUpdate: !lastUpdate });
  } catch (error) {
    console.error('Error checking last update:', error);
    return NextResponse.json({ error: 'Internal server error' });
  }
}
