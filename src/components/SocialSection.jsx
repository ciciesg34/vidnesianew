export default function SocialSection() {
  // GANTI nilai-nilai ini dengan akun sosmed Anda
  const socials = {
    whatsapp: 'https://whatsapp.com/channel/XXXXXXXXX',
    telegram: 'https://t.me/vidnesia',
    instagram: 'https://instagram.com/vidnesia',
    tiktok: 'https://tiktok.com/@vidnesia',
    facebook: 'https://facebook.com/vidnesia'
  };

  const items = [
    { name: 'WhatsApp', url: socials.whatsapp, icon: '📱', color: 'bg-[#25D366]' },
    { name: 'Telegram', url: socials.telegram, icon: '✈️', color: 'bg-[#0088cc]' },
    { name: 'Instagram', url: socials.instagram, icon: '📸', color: 'bg-gradient-to-r from-pink-500 to-purple-500' },
    { name: 'TikTok', url: socials.tiktok, icon: '🎵', color: 'bg-black' },
    { name: 'Facebook', url: socials.facebook, icon: '👍', color: 'bg-[#1877F2]' }
  ];

  return (
    <div className="bg-card border border-white/5 rounded-2xl p-4">
      <h3 className="font-bold text-sm mb-3">
        🔔 Ikuti <span className="text-accent">Vidnesia</span>
      </h3>
      <p className="text-xs text-muted mb-3">
        Dapatkan update video baru setiap hari!
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 text-white text-xs font-semibold px-3 py-2 rounded-lg btn-tap ${item.color}`}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}