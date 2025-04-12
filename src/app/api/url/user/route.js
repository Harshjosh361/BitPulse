import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Url from '@/models/Url';

export async function GET() {
  try {
    console.log('Fetching session...');
    const session = await getServerSession(authOptions);
    console.log('Session:', session);
    
    if (!session) {
      console.log('No session found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Connecting to DB...');
    await connectDB();
    
    console.log('Fetching URLs for user:', session.user.id);
    const urls = await Url.find({ createdBy: session.user.id })
      .sort({ createdAt: -1 });
    
    console.log('Found URLs:', urls);
    return NextResponse.json(urls);
  } catch (error) {
    console.error('Error in /api/url/user:', error);
    
    if (error.name === 'MongoError') {
      return NextResponse.json(
        { error: 'Database error occurred' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch URLs' },
      { status: 500 }
    );
  }
} 