"use client";

import { ShieldCheck, RotateCcw } from "lucide-react";

interface IndicadorBorradorProps {
  timestamp: string | null;
  hasDraftData: boolean;
  onClearDraft: () => void;
}

export default function IndicadorBorrador({
  timestamp,
  hasDraftData,
  onClearDraft,
}: IndicadorBorradorProps) {
  if (!hasDraftData) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-xs text-emerald-800 animate-in fade-in duration-300">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
        <span>
          <strong className="font-semibold">Respaldo SNE-RG activo:</strong> Borrador guardado localmente{" "}
          {timestamp ? `a las ${timestamp}` : "recientemente"}. Tus datos están protegidos contra caídas de red.
        </span>
      </div>

      <button
        type="button"
        onClick={onClearDraft}
        className="flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-900 hover:underline px-2 py-1 rounded transition-colors"
      >
        <RotateCcw className="h-3 w-3" />
        Limpiar borrador
      </button>
    </div>
  );
}
