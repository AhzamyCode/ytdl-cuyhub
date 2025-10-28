'use client'
import React, { useState } from 'react';
import { Download, Youtube, Loader2, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

export default function CuyHubYTDL() {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('720');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoData, setVideoData] = useState(null);

  const qualities = [
    { value: '360', label: '360p' },
    { value: '480', label: '480p' },
    { value: '720', label: '720p (Recommended)' },
    { value: '1080', label: '1080p (HD)' }
  ];

  const handleDownload = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Masukin URL YouTube dulu dong!');
      return;
    }

    // Validate YouTube URL
    const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!ytRegex.test(url)) {
      setError('URL nya gak valid nih, pastiin dari YouTube ya!');
      return;
    }

    setLoading(true);
    setError('');
    setVideoData(null);

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, quality }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal download video');
      }

      setVideoData(data);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan, coba lagi ya!');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUrl('');
    setVideoData(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-red-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 p-2 rounded-lg">
              <Youtube className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">YTDL BY CUYHUB</h1>
              <p className="text-sm text-gray-500">ytdl.cuyhub.my.id</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Download Video YouTube Gratis
          </h2>
          <p className="text-lg text-gray-600">
            Unduh video YouTube dengan kualitas terbaik, cepat dan mudah!
          </p>
        </div>

        {/* Download Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <form onSubmit={handleDownload} className="space-y-6">
            {/* URL Input */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                YouTube URL
              </label>
              <input
                type="text"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
            </div>

            {/* Quality Select */}
            <div>
              <label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Kualitas
              </label>
              <select
                id="quality"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                disabled={loading}
              >
                {qualities.map((q) => (
                  <option key={q.value} value={q.value}>
                    {q.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download Video
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success Result */}
          {videoData && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg overflow-hidden">
              <div className="p-4 flex items-start gap-3 border-b border-green-200 bg-green-100">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900">Berhasil!</h3>
                  <p className="text-green-700 text-sm">Video siap diunduh</p>
                </div>
              </div>
              
              <div className="p-6">
                {/* Video Info */}
                <div className="flex gap-4 mb-6">
                  {videoData.thumbnail && (
                    <img
                      src={videoData.thumbnail}
                      alt={videoData.title}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {videoData.title}
                    </h4>
                    <p className="text-sm text-gray-500">Kualitas: {quality}p</p>
                  </div>
                </div>

                {/* Download Buttons */}
                <div className="space-y-3">
                  <a
                    href={videoData.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" />
                      Download Video
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </a>

                  {videoData.alternative_urls && videoData.alternative_urls.length > 0 && (
                    <details className="group">
                      <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900 font-medium list-none">
                        <span className="group-open:hidden">+ Lihat link alternatif ({videoData.alternative_urls.length})</span>
                        <span className="hidden group-open:inline">- Sembunyikan link alternatif</span>
                      </summary>
                      <div className="mt-3 space-y-2">
                        {videoData.alternative_urls.map((altUrl, idx) => (
                          <a
                            key={idx}
                            href={altUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-center text-sm"
                          >
                            Mirror {idx + 1}
                          </a>
                        ))}
                      </div>
                    </details>
                  )}

                  <button
                    onClick={resetForm}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Download Video Lain
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Gratis 100%</h3>
            <p className="text-gray-600 text-sm">
              Download video YouTube tanpa batasan dan selamanya gratis
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Kualitas HD</h3>
            <p className="text-gray-600 text-sm">
              Pilih kualitas video dari 360p hingga 1080p sesuai kebutuhan
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Youtube className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Mudah & Cepat</h3>
            <p className="text-gray-600 text-sm">
              Cukup paste URL, pilih kualitas, dan langsung download
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-500">
          <p>Made by Ahzamycode</p>
          <p className="mt-1">Gunakan dengan bijak dan hormati hak cipta konten creator</p>
        </div>
      </main>
    </div>
  );
}