"use client";

import { useState, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Trash2,
  Edit3,
  FileCheck,
  PlusCircle,
  Undo2,
  Building2,
  Filter,
} from "lucide-react";
import { Funcionario } from "@/types/funcionario";
import { storage, subscribeToDB, getDBSnapshot, getDBServerSnapshot } from "@/lib/storage";
import { FuncionarioEdicionSchemaType } from "@/lib/validations";
import ModalEdicion from "@/components/ModalEdicion";
import ModalConfirmacion from "@/components/ModalConfirmacion";

export default function Directorio() {
  const registros = useSyncExternalStore(subscribeToDB, getDBSnapshot, getDBServerSnapshot);
  const [busqueda, setBusqueda] = useState("");
  const [departamentoFiltro, setDepartamentoFiltro] = useState<string>("todos");

  // Estado para el modal de edición (Update)
  const [funcionarioEditar, setFuncionarioEditar] = useState<Funcionario | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Estado para el modal de confirmación de eliminación (Delete)
  const [funcionarioEliminar, setFuncionarioEliminar] = useState<Funcionario | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Estado para el Toast de Deshacer eliminación
  const [ultimoEliminado, setUltimoEliminado] = useState<Funcionario | null>(null);
  const [showUndoToast, setShowUndoToast] = useState(false);

  // Manejo de Edición (UPDATE)
  const handleOpenEdit = (funcionario: Funcionario) => {
    setFuncionarioEditar(funcionario);
    setIsEditOpen(true);
  };

  const handleSaveEdit = (id: string, updatedData: FuncionarioEdicionSchemaType) => {
    storage.updateFuncionario(id, updatedData);
  };

  // Manejo de Eliminación (DELETE con confirmación modal)
  const handleOpenDelete = (funcionario: Funcionario) => {
    setFuncionarioEliminar(funcionario);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!funcionarioEliminar) return;

    const eliminado = storage.deleteFuncionario(funcionarioEliminar.id);
    setIsDeleteOpen(false);
    setFuncionarioEliminar(null);

    if (eliminado) {
      setUltimoEliminado(eliminado);
      setShowUndoToast(true);
      setTimeout(() => setShowUndoToast(false), 6000);
    }
  };

  // Deshacer eliminación (Reducción de ansiedad de usuario)
  const handleUndoDelete = () => {
    if (!ultimoEliminado) return;

    storage.createFuncionario({
      rut: ultimoEliminado.rut,
      nombre: ultimoEliminado.nombre,
      departamento: ultimoEliminado.departamento,
      nombreArchivo: ultimoEliminado.nombreArchivo,
      tamanoArchivoMB: ultimoEliminado.tamanoArchivoMB,
    });
    setShowUndoToast(false);
    setUltimoEliminado(null);
  };

  // Filtrado reactivo de funcionarios
  const registrosFiltrados = useMemo(() => {
    return registros.filter((reg) => {
      const matchTexto =
        reg.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        reg.rut.toLowerCase().includes(busqueda.toLowerCase()) ||
        reg.departamento.toLowerCase().includes(busqueda.toLowerCase());

      const matchDepto =
        departamentoFiltro === "todos" || reg.departamento === departamentoFiltro;

      return matchTexto && matchDepto;
    });
  }, [registros, busqueda, departamentoFiltro]);

  // Departamentos únicos
  const departamentos = useMemo(() => {
    const list = Array.from(new Set(registros.map((r) => r.departamento)));
    return ["todos", ...list];
  }, [registros]);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="w-7 h-7 text-blue-600" />
            Directorio Corporativo de Funcionarios
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gestión completa de personal registrado (CRUD tolerante a fallos SNE-RG V2).
          </p>
        </div>

        <Link
          href="/nueva-solicitud"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-blue-200 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Nueva Solicitud
        </Link>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por RUT, Nombre o Cargo..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          <span className="text-xs text-slate-500 font-medium shrink-0 hidden sm:block">Departamento:</span>
          {departamentos.map((dep) => (
            <button
              key={dep}
              onClick={() => setDepartamentoFiltro(dep)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                departamentoFiltro === dep
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {dep === "todos" ? "Todos los departamentos" : dep}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla del Directorio */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 font-semibold">Funcionario</th>
                <th className="p-4 font-semibold">RUT</th>
                <th className="p-4 font-semibold">Departamento</th>
                <th className="p-4 font-semibold">Respaldo PDF</th>
                <th className="p-4 font-semibold">Fecha Registro</th>
                <th className="p-4 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registrosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500 text-sm">
                    <p className="font-medium text-slate-700">No se encontraron registros de funcionarios.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {busqueda || departamentoFiltro !== "todos"
                        ? "Intente cambiando los términos de búsqueda o filtros."
                        : "Use el botón 'Nueva Solicitud' para ingresar un funcionario."}
                    </p>
                  </td>
                </tr>
              ) : (
                registrosFiltrados.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-sm text-slate-800">{reg.nombre}</div>
                      {reg.fechaActualizacion && (
                        <div className="text-[11px] text-slate-400">Modificado: {reg.fechaActualizacion}</div>
                      )}
                    </td>
                    <td className="p-4 text-sm font-mono font-medium text-slate-600">{reg.rut}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        <Building2 className="w-3 h-3" />
                        {reg.departamento}
                      </span>
                    </td>
                    <td className="p-4 text-xs">
                      {reg.nombreArchivo ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                          <FileCheck className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[120px]">{reg.nombreArchivo}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Sin adjunto</span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-slate-500">{reg.fechaRegistro}</td>
                    <td className="p-4 text-right space-x-1 whitespace-nowrap">
                      {/* Botón Editar (UPDATE) */}
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(reg)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar funcionario"
                        aria-label={`Editar a ${reg.nombre}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Botón Eliminar (DELETE) */}
                      <button
                        type="button"
                        onClick={() => handleOpenDelete(reg)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Eliminar registro"
                        aria-label={`Eliminar a ${reg.nombre}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Resumen inferior */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <span>Mostrando {registrosFiltrados.length} de {registros.length} funcionarios activos</span>
          <span>SNE-RG V2 • Local Data Safe</span>
        </div>
      </div>

      {/* Toast no intrusivo de Deshacer Eliminación */}
      {showUndoToast && ultimoEliminado && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white p-4 rounded-xl shadow-xl flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-300">
          <div className="text-xs">
            <p className="font-semibold">Funcionario eliminado</p>
            <p className="text-slate-400">{ultimoEliminado.nombre} fue removido del directorio.</p>
          </div>
          <button
            type="button"
            onClick={handleUndoDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
            Deshacer
          </button>
        </div>
      )}

      {/* Modales Accesibles de Edición y Eliminación */}
      <ModalEdicion
        isOpen={isEditOpen}
        funcionario={funcionarioEditar}
        onClose={() => {
          setIsEditOpen(false);
          setFuncionarioEditar(null);
        }}
        onSave={handleSaveEdit}
      />

      <ModalConfirmacion
        isOpen={isDeleteOpen}
        funcionario={funcionarioEliminar}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteOpen(false);
          setFuncionarioEliminar(null);
        }}
      />
    </div>
  );
}