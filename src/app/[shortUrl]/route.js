import { NextResponse } from 'next/server';
import Url from '@/models/Url';
import connectDB from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const shortUrl = params.shortUrl;
    
    if (!shortUrl) {
      return NextResponse.json(
        { error: 'Short URL is required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    const url = await Url.findOne({ shortUrl });
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL not found' },
        { status: 404 }
      );
    }

    // Check if URL is expired
    if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'This URL has expired' },
        { status: 410 }
      );
    }

    const userAgent = request.headers.get('user-agent') || '';
    console.log('User Agent:', userAgent);
    
    let deviceType = 'desktop';
    
    // Improved device detection
    if (/Mobile|Android|iPhone|iPad|iPod/i.test(userAgent)) {
      if (/iPad|Android(?!.*Mobile)|Tablet/i.test(userAgent)) {
        deviceType = 'tablet';
      } else {
        deviceType = 'mobile';
      }
    }
    // Increment click count and device stats
    url.clicks += 1;
    url.deviceStats[deviceType] = (url.deviceStats[deviceType] || 0) + 1;
    
    console.log('Updated Device Stats:', url.deviceStats);
    
    await url.save();

    let redirectUrl = url.originalUrl.trim();
    if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
      redirectUrl = 'https://' + redirectUrl;
    }

    // Return a 307 Temporary Redirect response
    return NextResponse.redirect(redirectUrl, 307);
  } catch (error) {
    console.error('Error redirecting URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 