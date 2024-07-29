// File: src/app/api/extract-and-recommend/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Import only the default function from pdf-parse
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const pdfFile = formData.get('pdf') as File;

  if (!pdfFile) {
    return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
  }

  try {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const data = await pdfParse(buffer);
    const text = data.text;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(
      `Based on the following text extracted from a user's CV or educational documents, provide a list of 5 suitable Indian government exams they could consider, given their qualifications and background. For each exam, briefly explain why it's recommended. Here's the extracted text:

      ${text.substring(0, 2000)}...
      
      Please format your response as a list of exam names followed by brief explanations.`
    );

    const recommendationText = result.response.text();
    const recommendations = recommendationText.split('\n').filter(line => line.trim() !== '');

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json({ error: 'Error processing PDF' }, { status: 500 });
  }
}