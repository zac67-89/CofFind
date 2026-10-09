"use client";

import React, { useEffect } from "react";
import { SolarCloseCircle } from "@/components/icons/SolarIcons";

interface ToastProps {
  message: string;
  onDismiss: () => void;
  durationMs?: number;
}

export function Toast({ message, onDismiss, durationMs = 6000 }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(timer);
  }, [onDismiss, durationMs, message]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-md"
    >
      <div className="flex items-start gap-3 rounded-2xl border border-cafe-border bg-white px-4 py-3 shadow-cafe-modal text-sm text-cafe-espresso">
        <p className="flex-1 leading-relaxed pt-0.5">{message}</p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="emil-press shrink-0 p-0.5 text-cafe-muted hover:text-cafe-espresso"
        >
          <SolarCloseCircle size={18} />
        </button>
      </div>
    </div>
  );
}
