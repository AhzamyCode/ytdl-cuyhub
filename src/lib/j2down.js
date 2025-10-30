import axios from 'axios';

const UA = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36';

export async function j2down(url) {
  if (!url) throw new Error('URL wajib diisi');

  const baseHeaders = {
    authority: 'j2download.com',
    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"',
    'user-agent': UA,
  };

  const home = await axios.get('https://j2download.com', {
    headers: { ...baseHeaders, accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', 'upgrade-insecure-requests': '1' },
  });

  const setCookies = home.headers['set-cookie'] || [];
  const cookies = setCookies.map((c) => c.split(';')[0]).join('; ');
  const csrfToken = setCookies.find((c) => c.includes('csrf_token='))?.split('csrf_token=')[1]?.split(';')[0] || '';

  const { data: body } = await axios.post(
    'https://j2download.com/api/autolink',
    { data: { url: url.trim(), unlock: true } },
    {
      headers: {
        ...baseHeaders,
        accept: 'application/json, text/plain, */*',
        'content-type': 'application/json',
        cookie: cookies,
        origin: 'https://j2download.com',
        referer: 'https://j2download.com/id',
        'x-csrf-token': csrfToken,
      },
    }
  );

  const payload = body.data?.data; 
  const info = payload?.info;
  const medias = payload?.medias || [];

  return {
  title: info?.title || 'Unknown',
  thumbnail: info?.thumb || '',
  duration: info?.duration || null,
  medias: medias.map(m => ({
    quality: m.height ? `${m.height}p` : m.quality,
    type: m.type,
    url: m.url,
    ext: m.ext,
    size: Math.round((m.bitrate || 0) * (m.duration || 0) / 8 / 1024) + ' KB', // perkiraan
  })),
};
}