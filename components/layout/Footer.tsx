import React from "react";

export function Footer() {
  return (
    <footer className="pt-10 pb-6 dashed-divider-t text-xs text-driftwood flex flex-col sm:flex-row justify-between items-center gap-3">
      <div className="uppercase tracking-wider">
        © 2026 COFFIND YANGON · OPEN STREET MAP & GOOGLE MAPS HYBRID
      </div>
      <div className="flex items-center gap-4 uppercase text-[11px]">
        <span>NEXT.JS 16.4.0</span>
        <span>·</span>
        <span className="text-ember-accent">DESIGN.MD DARKROOM TOKENS</span>
      </div>
    </footer>
  );
}
