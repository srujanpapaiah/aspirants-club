import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  console.log('Search query:', query);

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    console.log('Connecting to MongoDB...');
    const client = await clientPromise;
    const db = client.db();
    console.log('Connected to MongoDB');

    const resourcesCollection = db.collection('resources');
    const examsCollection = db.collection('exams');

    console.log('Searching resources...');
    const resources = await resourcesCollection.find({
      $or: [
        { examTitle: { $regex: query, $options: 'i' } },
        { examName: { $regex: query, $options: 'i' } }
      ]
    }).limit(5).toArray();
    console.log('Resources found:', resources.length);

    console.log('Searching exams...');
    const exams = await examsCollection.find({
      examName: { $regex: query, $options: 'i' }
    }).limit(5).toArray();
    console.log('Exams found:', exams.length);

    const results = [
      ...resources.map(resource => ({ ...resource, type: 'resource' })),
      ...exams.map(exam => ({ ...exam, type: 'exam' }))
    ];

    console.log('Total results:', results.length);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}