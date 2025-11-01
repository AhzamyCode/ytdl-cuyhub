
'use client';
import React, { useState } from 'react';
import { Download, Youtube, Loader2, AlertCircle, CheckCircle, ExternalLink, Search, Clock, User } from 'lucide-react';

export default function CuyHubYTDL() {
  const [url, setUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [quality, setQuality] = useState('720');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [videoData, setVideoData] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState('url'); // 'url' atau 'search'

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return setError('Masukkan kata kunci pencarian!');

    setSearching(true);
    setError('');
    setSearchResults([]);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      
      if (!res.ok || !data.status) {
        throw new Error(data.error || 'Gagal mencari video');
      }

      setSearchResults(data.result);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mencari');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectVideo = (videoUrl) => {
    setUrl(videoUrl);
    setActiveTab('url');
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!url.trim()) return setError('Masukin URL YouTube dulu dong!');
    const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!ytRegex.test(url)) return setError('URL nya gak valid nih, pastiin dari YouTube ya!');

    setLoading(true);
    setError('');
    setVideoData(null);

    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, quality }),
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

  const resetForm = () => {
    setUrl('');
    setVideoData(null);
    setError('');
    setQuality('720');
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
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

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Download Video YouTube Gratis
          </h2>
          <p className="text-lg text-gray-600">
            Unduh video YouTube dengan kualitas terbaik, cepat dan mudah!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab('url')}
              className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition ${
                activeTab === 'url' 
                  ? 'border-red-500 text-red-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Download className="w-4 h-4" />
              Download URL
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition ${
                activeTab === 'search' 
                  ? 'border-red-500 text-red-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Search className="w-4 h-4" />
              Cari Video
            </button>
          </div>

          {/* Download Tab */}
          {activeTab === 'url' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Kualitas
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  disabled={loading}
                >
                  <option value="360">360p</option>
                  <option value="480">480p</option>
                  <option value="720">720p (HD)</option>
                  <option value="1080">1080p (Full HD)</option>
                </select>
              </div>

              <button
                onClick={handleDownload}
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download
                  </>
                )}
              </button>
            </div>
          )}

          {/* Search Tab */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari Video YouTube
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Masukkan judul video atau nama channel..."
                  className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  disabled={searching}
                />
              </div>

              <button
                onClick={handleSearch}
                disabled={searching}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
              >
                {searching ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Mencari...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Cari Video
                  </>
                )}
              </button>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-3">Hasil Pencarian:</h3>
                  {searchResults.map((video, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectVideo(video.link)}
                      className="flex gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                    >
                      <img
                        src={video.imageUrl}
                        alt={video.title}
                        className="w-32 h-20 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 line-clamp-2 text-sm mb-1">
                          {video.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {video.channel}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {video.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

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
                <div className="flex gap-4 mb-6">
                  {videoData.thumbnail && (
                    <img
                      src={videoData.thumbnail}
                      alt={videoData.title}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                      {videoData.title}
                    </h4>
                    <p className="text-sm text-gray-500">Quality: {quality}p</p>
                  </div>
                </div>

                <a
                  href={videoData.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Video ({quality}p)
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={resetForm}
                  className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition"
                >
                  Download Video Lainnya
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Gratis 100%</h3>
            <p className="text-gray-600 text-sm">Tanpa batasan & selamanya gratis</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Cari & Download</h3>
            <p className="text-gray-600 text-sm">Cari video langsung dari halaman ini</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Kualitas HD</h3>
            <p className="text-gray-600 text-sm">360p hingga 1080p tersedia</p>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Made by Ahzamycode</p>
          <p className="mt-1">Gunakan dengan bijak dan hormati hak cipta creator</p>
        </div>
      </main>
    </div>
  );
}