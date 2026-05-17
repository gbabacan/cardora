import { NextRequest, NextResponse } from 'next/server';
import { addContributors } from '@/lib/boards';

export async function POST(request: NextRequest) {
  try {
    const { boardId, emails } = await request.json();

    if (!boardId || !emails || !Array.isArray(emails)) {
      return NextResponse.json(
        { error: 'Board ID and emails array are required' },
        { status: 400 }
      );
    }

    if (emails.length === 0) {
      return NextResponse.json(
        { error: 'At least one email is required' },
        { status: 400 }
      );
    }

    // Add contributors to database
    const { contributors, error } = await addContributors(boardId, emails);

    if (error) {
      return NextResponse.json(
        { error: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      contributors: contributors,
      message: `${emails.length} contributor(s) added successfully`
    });

  } catch (error: any) {
    console.error('Error in add contributors API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}