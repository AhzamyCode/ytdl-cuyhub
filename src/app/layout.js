import './globals.css'
export const metadata = {
  title: 'CuyHub YTDL - YouTube Video Downloader',
  description: 'Download video YouTube gratis dengan kualitas HD',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}