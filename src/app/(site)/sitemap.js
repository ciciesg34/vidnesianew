import { getAllVideos, getAllCategories } from '@/lib/videos';

export default function sitemap() {
  const baseUrl = 'https://www.vidnesia.web.id';
  const videos = getAllVideos();
  const categories = getAllCategories();

  const videoUrls = videos.map((video) => ({
    url: `${baseUrl}/video/${video.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7
  }));

  const categoryUrls = categories.map((cat) => ({
    url: `${baseUrl}/kategori/${encodeURIComponent(cat.toLowerCase())}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8
  }));

  const totalPages = Math.max(1, Math.ceil(videos.length / 12));
  const pageUrls = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1) continue;
    pageUrls.push({
      url: `${baseUrl}/page/${i}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6
    });
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0
    },
    ...pageUrls,
    ...categoryUrls,
    ...videoUrls
  ];
}