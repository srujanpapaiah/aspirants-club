// File: src/app/api/update-exam-info/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';
import admin from 'firebase-admin';
import { sendEmail, sendSMS } from '@/lib/notifications';
import { Exam, EditHistoryEntry, Subscription, PushOperator } from '@/types/mongodb';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse the request body
    const body = await req.json();
    const { examId, examName, examDate, examDetails, source, username } = body;

    if (!examName || !examDate || !examDetails || !source || !username) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('examPrep');
    const exams = db.collection<Exam>('exams');
    const examUpdates = db.collection('examUpdates');
    const subscriptions = db.collection<Subscription>('subscriptions');

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
      username,
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

    if (result.modifiedCount > 0 || result.upsertedCount > 0) {
      const examSubscriptions = await subscriptions.find({ examId }).toArray();
      
      // Send FCM notifications
      const fcmTokens = examSubscriptions
        .map(sub => sub.fcmToken)
        .filter((token): token is string => !!token);
      if (fcmTokens.length > 0) {
        await admin.messaging().sendMulticast({
          tokens: fcmTokens,
          notification: {
            title: `Update for ${examName}`,
            body: 'Exam details have been updated.',
          },
          data: {
            examId: examId,
          },
        });
      }

      // Send email notifications
      for (const sub of examSubscriptions) {
        if (sub.email) {
          await sendEmail(
            sub.email,
            `Update for ${examName}`,
            `Exam details for ${examName} have been updated. Please check the app for more information.`
          );
        }
      }

      // Send SMS notifications
      for (const sub of examSubscriptions) {
        if (sub.phoneNumber) {
          await sendSMS(
            sub.phoneNumber,
            `Update for ${examName}: Exam details have been updated. Please check the app for more information.`
          );
        }
      }
    }

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