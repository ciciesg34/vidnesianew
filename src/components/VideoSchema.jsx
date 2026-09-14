export default function VideoSchema({ video }) {
  if (!video) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: `Tonton ${video.title} di Vidnesia - Katalog video streaming modern.`,
    thumbnailUrl: video.thumbnailUrl || 'https://www.vidnesia.web.id/fallback-thumb.jpg',
    uploadDate: new Date().toISOString(),
    contentUrl: video.videoUrl,
    embedUrl: video.embedUrl || video.videoUrl,
    publisher: {
      '@type': 'Organization',
      name: 'Vidnesia',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.vidnesia.web.id/logo.png'
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}