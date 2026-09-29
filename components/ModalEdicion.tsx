"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Save, Edit3, Building2, User, CreditCard } from "lucide-react";
import { Funcionario } from "@/types/funcionario";
import { funcionarioEdicionSchema, FuncionarioEdicionSchemaType } from "@/lib/validations";

interface ModalEdicionProps {
  isOpen: boolean;
  funcionario: Funcionario | null;
  onClose: () => void;
  onSave: (id: string, updated: FuncionarioEdicionSchemaType) => void;
}

export default function ModalEdicion({
  isOpen,
  funcionario,
  onClose,
  onSave,
}: ModalEdicionProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FuncionarioEdicionSchemaType>({
    resolver: zodResolver(funcionarioEdicionSchema),
    defaultValues: {
      nombre: "",
      departamento: "",
    },
  });

  useEffect(() => {
    if (funcionario) {
      reset({
        nombre: funcionario.nombre,
        departamento: funcionario.departamento,
      });
    }
  }, [funcionario, reset]);

  if (!isOpen || !funcionario) return null;

  const onSubmit = (data: FuncionarioEdicionSchemaType) => {
    onSave(funcionario.id, data);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-editar-titulo"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Edit3 className="h-5 w-5" />
          </div>
          <div>
            <h3 id="modal-editar-titulo" className="text-lg font-bold text-slate-900 leading-tight">
              Actualizar Datos del Funcionario
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Operación de actualización (Update) del sistema SNE-RG</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* RUT de solo lectura */}
          <div>
            <label htmlFor="edit-rut" className="block text-xs font-semibold text-slate-600 mb-1">
              RUT (Identificador no modificable)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <CreditCard className="h-4 w-4" />
              </div>
              <input
                id="edit-rut"
                type="text"
                value={funcionario.rut}
                disabled
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm font-mono text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Nombre completo */}
          <div>
            <label htmlFor="edit-nombre" className="block text-xs font-semibold text-slate-700 mb-1">
              Nombre Completo *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <input
                id="edit-nombre"
                {...register("nombre")}
                className={`w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                  errors.nombre
                    ? "border-amber-500 bg-amber-50/50 focus:ring-2 focus:ring-amber-400/20"
                    : "border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                }`}
              />
            </div>
            {errors.nombre && (
              <p className="text-amber-600 text-xs mt-1 font-medium">{errors.nombre.message}</p>
            )}
          </div>

          {/* Departamento */}
          <div>
            <label htmlFor="edit-departamento" className="block text-xs font-semibold text-slate-700 mb-1">
              Departamento de Asignación *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Building2 className="h-4 w-4" />
              </div>
              <select
                id="edit-departamento"
                {...register("departamento")}
                className={`w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                  errors.departamento
                    ? "border-amber-500 bg-amber-50/50 focus:ring-2 focus:ring-amber-400/20"
                    : "border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                }`}
              >
                <option value="">Seleccione un área...</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
                <option value="Finanzas">Finanzas</option>
                <option value="Soporte TI">Soporte TI</option>
                <option value="Operaciones">Operaciones</option>
                <option value="Logística">Logística</option>
              </select>
            </div>
            {errors.departamento && (
              <p className="text-amber-600 text-xs mt-1 font-medium">{errors.departamento.message}</p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-2 shadow-sm shadow-blue-200 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
