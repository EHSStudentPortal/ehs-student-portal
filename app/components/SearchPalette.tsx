'use client';
export default function SearchPalette({ isOpen, onClose, onNavigate }: { isOpen: boolean; onClose: () => void; onNavigate: (tab: string) => void }) {
  if (!isOpen) return null;
  return <div onClick={onClose} style={{ position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center' }}>
    <div onClick={e=>e.stopPropagation()} style={{ background:'var(--bg-card)',borderRadius:16,padding:24,width:560,maxWidth:'90vw' }}>
      <p style={{ color:'var(--text-muted)',fontSize:12,marginBottom:8 }}>Search — full version loading…</p>
      <button onClick={onClose} style={{ color:'var(--text-primary)' }}>Close</button>
    </div>
  </div>;
}
