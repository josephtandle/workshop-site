import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { firstName, email } = await request.json();

    if (!firstName || !email) {
      return NextResponse.json(
        { error: 'First name and email are required' },
        { status: 400 }
      );
    }

    // Demo mode: Supabase and Resend are wired in each participant's own project
    // This route exists as a reference implementation on the workshop site
    console.log('Demo subscribe:', { firstName, email });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
