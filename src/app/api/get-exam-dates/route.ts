import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const monthOrder: { [key: string]: number } = {
  'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
  'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
};

function getMonthFromString(str: string) {
  const months = Object.keys(monthOrder);
  const regex = new RegExp(months.join('|'), 'gi');
  const matches = str.match(regex);
  return matches ? matches[0].toLowerCase() : null;
}

function getSortValue(examDate: any) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  if (examDate instanceof Date) {
    return examDate.getTime();
  }
  if (typeof examDate === 'string') {
    const [startMonth, endMonth, year] = examDate.toLowerCase().match(/(\w+)\s+to\s+(\w+)\s+(\d{4})/i)?.slice(1) || [];
    
    if (startMonth && endMonth && year) {
      const startMonthIndex = monthOrder[startMonth];
      const endMonthIndex = monthOrder[endMonth];
      const examYear = parseInt(year);

      // Calculate the midpoint of the date range
      const midMonthIndex = Math.floor((startMonthIndex + endMonthIndex) / 2);
      const isMidMonthPassed = (examYear === currentYear && midMonthIndex < currentMonth) || examYear < currentYear;

      if (isMidMonthPassed) {
        // If the midpoint has passed, use next year
        return new Date(currentYear + 1, startMonthIndex, 1).getTime();
      } else {
        // If the midpoint hasn't passed, use the current year
        return new Date(examYear, startMonthIndex, 1).getTime();
      }
    } else {
      const month = getMonthFromString(examDate);
      if (month) {
        const monthIndex = monthOrder[month];
        const isMonthPassed = monthIndex <= currentMonth;
        const examYear = isMonthPassed ? currentYear + 1 : currentYear;
        return new Date(examYear, monthIndex, 1).getTime();
      }
    }
  }
  // If no date or month is found, put it at the end
  return Infinity;
}

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const database = client.db(process.env.MONGODB_DB);
    const exams = database.collection('exams');

    const currentDate = new Date();

    // Parse query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') ?? '5');
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const skip = (page - 1) * limit;

    const allExams = await exams
      .find({
        $or: [
          { examDate: { $gte: currentDate } },
          { examDate: { $type: 'string' } }
        ]
      })
      .project({
        examName: 1,
        examDate: 1,
        examDetails: 1,
        source: 1,
        lastUpdatedBy: 1,
        lastUpdatedAt: 1,
        updateCount: 1,
        editHistory: 1
      })
      .toArray();

    // Sort the exams
    allExams.sort((a, b) => getSortValue(a.examDate) - getSortValue(b.examDate));

    // Apply pagination
    const paginatedExams = allExams.slice(skip, skip + limit);

    // Count total exams for pagination info
    const totalExams = allExams.length;
    const totalPages = Math.ceil(totalExams / limit);

    return NextResponse.json({
      exams: paginatedExams,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalExams: totalExams,
        examsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 });
  }
}