'use client';
import React, { useState } from 'react';
import { Download, Youtube, Loader2, AlertCircle, CheckCircle, ExternalLink, Film, Music } from 'lucide-react';

export default function CuyHubYTDL() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoData, setVideoData] = useState(null);
  const [activeTab, setActiveTab] = useState('video');

  const isVideoOnly = (v) =>
    /video only|DASH/i.test(v.formatNote || '') || (v.height && v.height > 720);

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!url.trim()) return setError('Masukin URL YouTube dulu dong!');
    const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!ytRegex.test(url)) return setError('URL nya gak valid nih, pastiin dari YouTube ya!');

    setLoading(true); setError(''); setVideoData(null);
    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengambil data');
      setVideoData(data);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan, coba lagi ya!');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => { setUrl(''); setVideoData(null); setError(''); setActiveTab('video'); };

  const videos = (videoData?.medias || []).filter(m => m.type === 'video').sort((a, b) => (b.height || 0) - (a.height || 0));
  const audios = (videoData?.medias || []).filter(m => m.type === 'audio').sort((a, b) => (b.height || 0) - (a.height || 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <header className="bg-white shadow-sm border-b border-red-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 p-2 rounded-lg"><Youtube className="w-8 h-8 text-white" /></div>
            <div><h1 className="text-2xl font-bold text-gray-900">YTDL BY CUYHUB</h1><p className="text-sm text-gray-500">ytdl.cuyhub.my.id</p></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Download Video & Audio YouTube Gratis</h2>
          <p className="text-lg text-gray-600">Unduh video/audio YouTube dengan kualitas terbaik, cepat dan mudah!</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <form onSubmit={handleDownload} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
              <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none" disabled={loading} />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Processing...</> : <><Download className="w-5 h-5" />Download</>}
            </button>
          </form>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div><h3 className="font-semibold text-red-900 mb-1">Error</h3><p className="text-red-700 text-sm">{error}</p></div>
            </div>
          )}

          {videoData && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg overflow-hidden">
              <div className="p-4 flex items-start gap-3 border-b border-green-200 bg-green-100">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div><h3 className="font-semibold text-green-900">Berhasil!</h3><p className="text-green-700 text-sm">Pilih format di bawah untuk mengunduh</p></div>
              </div>
              <div className="p-6">
                <div className="flex gap-4 mb-4">
                  {videoData.thumbnail && <img src={videoData.thumbnail} alt="" className="w-32 h-24 object-cover rounded-lg" />}
                  <div className="flex-1"><h4 className="font-semibold text-gray-900 line-clamp-2">{videoData.title}</h4><p className="text-sm text-gray-500">by {videoData.author}</p></div>
                </div>

                <div className="flex gap-2 mb-4 border-b">
                  <button onClick={() => setActiveTab('video')} className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition ${activeTab === 'video' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}><Film className="w-4 h-4" />Video</button>
                  <button onClick={() => setActiveTab('audio')} className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition ${activeTab === 'audio' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}><Music className="w-4 h-4" />Audio</button>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {activeTab === 'video'
                    ? videos.map((v) => {
                        const noSound = isVideoOnly(v);
                        return (
                          <a key={v.formatId} href={v.url} target="_blank" rel="noopener noreferrer"
                            className={`flex items-center justify-between font-medium py-3 px-4 rounded-lg transition border ${
                              noSound ? 'bg-yellow-50 border-yellow-300 text-yellow-800 hover:bg-yellow-100' : 'bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-200'
                            }`}>
                            <span className="flex items-center gap-2">
                              {v.height}p <span className="text-xs opacity-75">({v.ext})</span>
                              {noSound && <span className="text-[11px] px-2 py-0.5 rounded-full bg-yellow-200 text-yellow-900 font-semibold">NO AUDIO</span>}
                            </span>
                            <ExternalLink className="w-4 h-4 shrink-0" />
                          </a>
                        );
                      })
                    : audios.map((a) => (
                        <a key={a.formatId} href={a.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition border border-gray-200">
                          <span>{a.quality || a.height} <span className="text-xs opacity-75">({a.ext})</span></span>
                          <ExternalLink className="w-4 h-4 shrink-0" />
                        </a>
                      ))}
                </div>

                <button onClick={resetForm} className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition">Download lainnya</button>
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100"><div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4"><Download className="w-6 h-6 text-red-500" /></div><h3 className="font-semibold text-gray-900 mb-2">Gratis 100%</h3><p className="text-gray-600 text-sm">Tanpa batasan & selamanya gratis</p></div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100"><div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4"><CheckCircle className="w-6 h-6 text-red-500" /></div><h3 className="font-semibold text-gray-900 mb-2">Kualitas HD</h3><p className="text-gray-600 text-sm">360p-1080p & bitrate audio terbaik</p></div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100"><div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4"><Youtube className="w-6 h-6 text-red-500" /></div><h3 className="font-semibold text-gray-900 mb-2">Mudah & Cepat</h3><p className="text-gray-600 text-sm">Paste URL → pilih format → unduh</p></div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Made by Ahzamycode</p>
          <p className="mt-1">Gunakan dengan bijak dan hormati hak cipta creator</p>
        </div>
      </main>
    </div>
  );
}