// lib/clipto.js
import axios from "axios";

export async function fetchClipto(url) {
  const res = await axios.post("https://www.clipto.com/api/youtube", { url }, {
    headers: {
      "content-type": "application/json",
      "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36",
      "Referer": "https://www.clipto.com/id/media-downloader/youtube-audio-downloader"
    },
    responseType: "text"
  });

  const html = typeof res.data === "string" ? res.data : JSON.stringify(res.data);
  const title = html.match(/"title":"(.*?)"/)?.[1] || "No title";
  const author = html.match(/"author":"(.*?)"/)?.[1] || "Unknown";
  const thumbnail = html.match(/"thumbnail":"(https:[^"]+)"/)?.[1] || null;

  const medias = [];
  const mediaRegex = /(\{[^{}]*?"type":"(?:video|audio)"[^{}]*?\})/g;
  const matches = html.matchAll(mediaRegex);

  for (const m of matches) {
    const text = m[1];
    medias.push({
      formatId: text.match(/"formatId":(\d+)/)?.[1] || null,
      label: text.match(/"label":"(.*?)"/)?.[1] || null,
      type: text.match(/"type":"(.*?)"/)?.[1] || null,
      ext: text.match(/"ext":"(.*?)"/)?.[1] || null,
      quality: text.match(/"quality":"(.*?)"/)?.[1] || null,
      width: text.match(/"width":(\d+)/)?.[1] || null,
      height: text.match(/"height":(\d+)/)?.[1] || null,
      url: text.match(/"url":"(https:[^"]+)"/)?.[1]?.replace(/\\u0026/g, "&") || null
    });
  }

  return { title, author, thumbnail, medias };
}