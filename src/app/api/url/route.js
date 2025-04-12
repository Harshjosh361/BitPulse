import { NextResponse } from 'next/server';
import Url from '@/models/Url';
import connectDB from '@/lib/db';
import { nanoid } from 'nanoid';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    await connectDB();
    const urls = await Url.find({});
    return NextResponse.json(urls);
  } catch (error) {
    console.error('Error fetching URLs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch URLs' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - User not authenticated' },
        { status: 401 }
      );
    }

    const { originalUrl, customAlias, expiresAt } = await request.json();
    
    if (!originalUrl) {
      return NextResponse.json(
        { error: 'Original URL is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Generate a unique short URL 
    let shortUrl;
    if (customAlias) {
      const existingUrl = await Url.findOne({ customAlias });
      if (existingUrl) {
        return NextResponse.json(
          { error: 'Custom alias is already taken' },
          { status: 400 }
        );
      }
      shortUrl = customAlias;
    } else {
      shortUrl = nanoid(8);
    }

    // URL document with required fields
    const url = await Url.create({
      originalUrl,
      shortUrl,
      customAlias: customAlias || undefined,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      createdBy: session.user.id,
      clicks: 0, 
      createdAt: new Date() 
    });

    return NextResponse.json(url);
  } catch (error) {
    console.error('Error creating short URL:', error);
    return NextResponse.json(
      { error: 'Failed to create short URL' },
      { status: 500 }
    );
  }
} 