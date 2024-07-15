import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  console.log('Save User API: Received request');
  try {
    const { userId } = auth();
    if (!userId) {
      console.log('Save User API: Unauthorized - no userId');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Save User API: Fetching user data from Clerk');
    const user = await clerkClient.users.getUser(userId);

    console.log('Save User API: Determining login method and password status');
    const emailAddresses = user.emailAddresses;
    const primaryEmailId = user.primaryEmailAddressId;
    const primaryEmail = emailAddresses.find(email => email.id === primaryEmailId);
    
    const loginMethod = primaryEmail?.verification?.strategy || 'unknown';
    const hasPassword = user.passwordEnabled;

    console.log('Save User API: Connecting to MongoDB');
    const client = await clientPromise;
    const database = client.db('examPrep');
    const users = database.collection('users');

    const userData = {
      clerkUserId: userId,
      email: primaryEmail?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      loginMethod,
      hasPassword,
      lastLogin: new Date(),
      updatedAt: new Date()
    };

    console.log('Save User API: Updating or inserting user data in MongoDB');
    const result = await users.findOneAndUpdate(
      { clerkUserId: userId },
      { 
        $set: userData,
        $setOnInsert: { createdAt: new Date() }
      },
      { 
        upsert: true, 
        returnDocument: 'after' 
      }
    );

    console.log('Save User API: User information saved successfully');
    return NextResponse.json({ 
      message: 'User information saved successfully', 
      user: result?.value 
    });
  } catch (error) {
    console.error('Save User API: Error saving user information:', error);
    return NextResponse.json({ error: 'Failed to save user information' }, { status: 500 });
  }
}