"use client";

import { useState } from "react";
import { Terminal, ChevronDown, Copy, Check } from "lucide-react";

interface AcordeonSoporteTIProps {
  stackTrace: string;
  tipo?: "network" | "duplicate" | "file_size" | "validation";
}

export default function AcordeonSoporteTI({ stackTrace, tipo = "network" }: AcordeonSoporteTIProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const copiarAlPortapapeles = async () => {
    try {
      await navigator.clipboard.writeText(stackTrace);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      console.error("Error al copiar al portapapeles");
    }
  };

  const colorTexto = tipo === "network" ? "text-amber-700" : tipo === "duplicate" ? "text-red-700" : "text-slate-700";
  const borderClass = tipo === "network" ? "border-amber-200/60" : tipo === "duplicate" ? "border-red-200/60" : "border-slate-200";

  return (
    <div className={`mt-4 border-t pt-3 ${borderClass}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="panel-soporte-ti"
        className={`flex items-center gap-2 text-xs font-semibold hover:opacity-75 transition-opacity outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 rounded px-1 py-0.5 ${colorTexto}`}
      >
        <Terminal className="h-4 w-4" />
        <span>Ver diagnóstico técnico para Soporte TI</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div id="panel-soporte-ti" className="mt-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400">Terminal de Incidencia TI (Nivel 2)</span>
            <button
              type="button"
              onClick={copiarAlPortapapeles}
              className="flex items-center gap-1.5 text-[11px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              {copiado ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-400" />
                  <span className="text-green-400 font-sans font-medium">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copiar diagnóstico</span>
                </>
              )}
            </button>
          </div>
          <pre className="text-[11px] text-green-400 font-mono text-left block overflow-x-auto whitespace-pre leading-relaxed select-all">
            {stackTrace}
          </pre>
        </div>
      )}
    </div>
  );
}
