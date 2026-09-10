export default function EmptyState({ title = 'Video belum tersedia', subtitle = 'Silakan cek kembali nanti.', icon = '📭' }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <div className="w-20 h-20 rounded-2xl bg-card border border-white/5 flex items-center justify-center text-4xl mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-sm text-muted max-w-sm">{subtitle}</p>
    </div>
  );
}