import { NextResponse } from 'next/server';
import yts from 'yt-search';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q) {
      return NextResponse.json(
        { status: false, error: 'Query is required' },
        { status: 400 }
      );
    }

    const ytResults = await yts.search(q);
    const ytTracks = ytResults.videos.map(video => ({
      title: video.title,
      channel: video.author.name,
      duration: video.duration.timestamp,
      imageUrl: video.thumbnail,
      link: video.url
    }));

    return NextResponse.json({
      status: true,
      result: ytTracks
    });

  } catch (error) {
  console.error('Search API error:', error);
  return NextResponse.json(
    { status: false, error: error.message },
    { status: 500 }
  );
  }
}