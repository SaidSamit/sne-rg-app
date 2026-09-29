"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import { Funcionario } from "@/types/funcionario";

interface ModalConfirmacionProps {
  isOpen: boolean;
  funcionario: Funcionario | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ModalConfirmacion({
  isOpen,
  funcionario,
  onConfirm,
  onCancel,
}: ModalConfirmacionProps) {
  if (!isOpen || !funcionario) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-eliminar-titulo"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div>
            <h3 id="modal-eliminar-titulo" className="text-lg font-bold text-slate-900 leading-tight">
              ¿Eliminar funcionario del Directorio?
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Está a punto de dar de baja el registro de{" "}
              <strong className="text-slate-800 font-semibold">{funcionario.nombre}</strong> (RUT:{" "}
              <span className="font-mono text-slate-700">{funcionario.rut}</span>).
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Esta acción actualizará la lista de funcionarios activos de {funcionario.departamento}.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancelar (Mantener registro)
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors flex items-center gap-2 shadow-sm shadow-red-200"
          >
            <Trash2 className="h-4 w-4" />
            Sí, eliminar registro
          </button>
        </div>
      </div>
    </div>
  );
}
