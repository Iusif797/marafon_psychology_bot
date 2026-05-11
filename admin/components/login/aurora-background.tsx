export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -left-32 h-[460px] w-[460px] rounded-full bg-primary/30 blur-[120px] aurora-blob" />
      <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-fuchsia-500/25 blur-[120px] aurora-blob aurora-delay-1" />
      <div className="absolute -bottom-40 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[140px] aurora-blob aurora-delay-2" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,hsl(240_12%_4%/0.6)_80%)]" />
      <div className="absolute inset-0 opacity-[0.025] mix-blend-overlay [background-image:url('data:image/svg+xml,%3Csvg%20viewBox%3D%270%200%20200%20200%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cfilter%20id%3D%27n%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.9%27%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20filter%3D%27url(%23n)%27%2F%3E%3C%2Fsvg%3E')]" />
      <style>{`
        @keyframes aurora { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(40px,-30px,0) scale(1.15); } }
        .aurora-blob { animation: aurora 14s ease-in-out infinite; will-change: transform; }
        .aurora-delay-1 { animation-delay: -5s; }
        .aurora-delay-2 { animation-delay: -9s; animation-duration: 18s; }
      `}</style>
    </div>
  );
}
