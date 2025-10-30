import { NextResponse } from 'next/server';
import { fetchClipto } from '@/lib/clipto';

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL tidak boleh kosong' },
        { status: 400 }
      );
    }

    const result = await fetchClipto(url);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Scrape error:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal mengambil data dari YouTube' },
      { status: 500 }
    );
  }
}