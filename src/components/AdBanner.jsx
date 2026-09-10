export default function AdBanner({ code = '', label = 'Iklan' }) {
  if (!code || !code.trim()) return null;
  return (
    <div className="my-4">
      <p className="text-[10px] text-muted uppercase tracking-wider mb-1 px-1">
        {label}
      </p>
      <div
        className="rounded-xl overflow-hidden bg-card/50 border border-white/5 p-2 flex items-center justify-center min-h-[60px]"
        dangerouslySetInnerHTML={{ __html: code }}
      />
    </div>
  );
}