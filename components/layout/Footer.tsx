import React from "react";
import { SolarCup } from "@/components/icons/SolarIcons";

export function Footer() {
  return (
    <footer className="pt-10 pb-8 mt-12 border-t border-cafe-border text-xs text-cafe-hazelnut flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-2">
        <SolarCup size={16} className="text-cafe-caramel" />
        <span className="font-medium text-cafe-espresso">CofFind Yangon</span>
        <span>·</span>
        <span>Curated Directory & Community Reviews</span>
      </div>
      <div className="flex items-center gap-4 text-[11px] text-cafe-muted">
        <span>OpenStreetMap & Google Maps Data</span>
        <span>·</span>
        <span>Yangon Coffee Culture</span>
      </div>
    </footer>
  );
}
