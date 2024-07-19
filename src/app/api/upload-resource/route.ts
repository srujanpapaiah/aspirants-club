import { NextRequest, NextResponse } from 'next/server';
import { S3 } from 'aws-sdk';
import clientPromise from '@/lib/mongodb';
import { auth } from '@clerk/nextjs/server';

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const examName = formData.get('examName') as string;
    const examTitle = formData.get('examTitle') as string;
    const examCategory = formData.get('examCategory') as string;
    const userName = formData.get('userName') as string;

    if (!file || !examName || !examTitle || !examCategory || !userName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upload file to S3
    const fileBuffer = await file.arrayBuffer();
    const fileName = `${Date.now()}-${file.name}`;
    const uploadResult = await s3.upload({
      Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      Key: fileName,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
    }).promise();

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const result = await db.collection('resources').insertOne({
      userId,
      userName,
      examName,
      examTitle,
      examCategory,
      fileName,
      s3Url: uploadResult.Location,
      uploadDate: new Date(),
    });

    console.log('Resource saved to database:', result);

    return NextResponse.json({
      message: 'Resource uploaded successfully',
      s3Url: uploadResult.Location,
      resourceId: result.insertedId,
    });
  } catch (error) {
    console.error('Error uploading resource:', error);
    return NextResponse.json({ error: 'Failed to upload resource' }, { status: 500 });
  }
}