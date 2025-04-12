import { NextResponse } from 'next/server';
import Url from '@/models/Url';
import connectDB from '@/lib/db';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const shortUrl = url.pathname.slice(1);
    
    await connectDB();
    
    const urlDoc = await Url.findOne({ shortUrl });
    
    if (!urlDoc) {
      return NextResponse.json(
        { error: 'URL not found' },
        { status: 404 }
      );
    }

    // Check if URL has expired
    if (urlDoc.expiresAt && new Date() > urlDoc.expiresAt) {
      return NextResponse.json(
        { error: 'This URL has expired' },
        { status: 410 }
      );
    }

    // Increment click count
    urlDoc.clicks += 1;
    await urlDoc.save();

    let redirectUrl = urlDoc.originalUrl.trim();
    if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
      redirectUrl = 'https://' + redirectUrl;
    }

    const headers = new Headers();
    headers.set('Location', redirectUrl);

    // Return a 302 redirect response
    return new Response(null, {
      status: 302,
      headers: headers
    });
  } catch (error) {
    console.error('Error redirecting:', error);
    return NextResponse.json(
      { error: 'Failed to redirect' },
      { status: 500 }
    );
  }
} 