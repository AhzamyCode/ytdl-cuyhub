import { NextResponse } from 'next/server';
import { ddownr } from '@/lib/downr';

export async function POST(request) {
  try {
    const { url, quality } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL tidak boleh kosong' },
        { status: 400 }
      );
    }

    const result = await ddownr(url, quality || '720');
    return NextResponse.json(result);

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal mendownload video' },
      { status: 500 }
    );
  }
}
