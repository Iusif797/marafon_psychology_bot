"use client";

import { useEffect, useState } from "react";

export function LiveStatus() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  return (
    <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5">
      <span className="relative flex h-2 w-2">
        {online && <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />}
        <span className={`relative h-2 w-2 rounded-full ${online ? "bg-emerald-400" : "bg-amber-400"}`} />
      </span>
      <span className="text-[11px] font-medium text-muted-foreground tracking-wide">
        {online ? "Live · Neon" : "Offline"}
      </span>
    </div>
  );
}
