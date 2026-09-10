import VideoCard from './VideoCard';
import AdBanner from './AdBanner';

export default function VideoGrid({ videos = [], adCode = '', adAfter = 4 }) {
  const hasAd = !!adCode;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {videos.map((v, idx) => (
        <>
          <VideoCard key={v.id} video={v} />
          {hasAd && (idx + 1) === adAfter && (
            <div key={`ad-${idx}`} className="sm:col-span-2 md:col-span-3 lg:col-span-4">
              <AdBanner code={adCode} label="Iklan" />
            </div>
          )}
        </>
      ))}
    </div>
  );
}