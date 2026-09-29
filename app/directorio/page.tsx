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
  UserX,
  UserCheck,
  ShieldAlert,
} from "lucide-react";
import { Funcionario, EstadoFuncionario } from "@/types/funcionario";
import { storage, subscribeToDB, getDBSnapshot, getDBServerSnapshot } from "@/lib/storage";
import { FuncionarioEdicionSchemaType } from "@/lib/validations";
import ModalEdicion from "@/components/ModalEdicion";
import ModalConfirmacion from "@/components/ModalConfirmacion";

export default function Directorio() {
  const registros = useSyncExternalStore(subscribeToDB, getDBSnapshot, getDBServerSnapshot);
  const [busqueda, setBusqueda] = useState("");
  const [departamentoFiltro, setDepartamentoFiltro] = useState<string>("todos");
  const [estadoFiltro, setEstadoFiltro] = useState<"todos" | EstadoFuncionario>("todos");

  // Estado para el modal de edición (Update)
  const [funcionarioEditar, setFuncionarioEditar] = useState<Funcionario | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Estado para el modal de confirmación de eliminación (Delete)
  const [funcionarioEliminar, setFuncionarioEliminar] = useState<Funcionario | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Estado para el Toast de Deshacer eliminación
  const [ultimoEliminado, setUltimoEliminado] = useState<Funcionario | null>(null);
  const [showUndoToast, setShowUndoToast] = useState(false);

  // Estado para el Toast de cambio de estado (Activar / Suspender)
  const [statusToast, setStatusToast] = useState<{
    nombre: string;
    estado: EstadoFuncionario;
  } | null>(null);

  // Manejo de Edición (UPDATE)
  const handleOpenEdit = (funcionario: Funcionario) => {
    setFuncionarioEditar(funcionario);
    setIsEditOpen(true);
  };

  const handleSaveEdit = (id: string, updatedData: FuncionarioEdicionSchemaType) => {
    storage.updateFuncionario(id, updatedData);
  };

  // Manejo de Cambio de Estado (SUSPENDER / ACTIVAR)
  const handleToggleEstado = (funcionario: Funcionario) => {
    const actualizado = storage.toggleEstadoFuncionario(funcionario.id);
    if (actualizado) {
      setStatusToast({
        nombre: actualizado.nombre,
        estado: actualizado.estado,
      });
      setTimeout(() => setStatusToast(null), 4000);
    }
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
      estado: ultimoEliminado.estado,
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

      const matchEstado =
        estadoFiltro === "todos" || reg.estado === estadoFiltro;

      return matchTexto && matchDepto && matchEstado;
    });
  }, [registros, busqueda, departamentoFiltro, estadoFiltro]);

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
            Gestión de estados, edición y control de personal (CRUD tolerante a fallos SNE-RG V2).
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
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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

          {/* Filtro por Estado: Todos / Activos / Suspendidos */}
          <div className="flex items-center gap-1.5 self-start md:self-auto bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setEstadoFiltro("todos")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                estadoFiltro === "todos"
                  ? "bg-white text-slate-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Todos ({registros.length})
            </button>
            <button
              onClick={() => setEstadoFiltro("activo")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                estadoFiltro === "activo"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Activos ({registros.filter((r) => r.estado === "activo").length})
            </button>
            <button
              onClick={() => setEstadoFiltro("suspendido")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                estadoFiltro === "suspendido"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Suspendidos ({registros.filter((r) => r.estado === "suspendido").length})
            </button>
          </div>
        </div>

        {/* Filtro por Departamento */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 font-medium shrink-0">Departamento:</span>
          {departamentos.map((dep) => (
            <button
              key={dep}
              onClick={() => setDepartamentoFiltro(dep)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
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
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 font-semibold">Funcionario</th>
                <th className="p-4 font-semibold">RUT</th>
                <th className="p-4 font-semibold">Departamento</th>
                <th className="p-4 font-semibold">Estado</th>
                <th className="p-4 font-semibold">Respaldo PDF</th>
                <th className="p-4 font-semibold">Fecha Registro</th>
                <th className="p-4 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registrosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500 text-sm">
                    <p className="font-medium text-slate-700">No se encontraron registros de funcionarios.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {busqueda || departamentoFiltro !== "todos" || estadoFiltro !== "todos"
                        ? "Intente cambiando los términos de búsqueda o filtros."
                        : "Use el botón 'Nueva Solicitud' para ingresar un funcionario."}
                    </p>
                  </td>
                </tr>
              ) : (
                registrosFiltrados.map((reg) => (
                  <tr
                    key={reg.id}
                    className={`transition-colors ${
                      reg.estado === "suspendido"
                        ? "bg-slate-50/60 opacity-80 hover:bg-slate-100/60"
                        : "hover:bg-slate-50/70"
                    }`}
                  >
                    <td className="p-4">
                      <div className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                        {reg.nombre}
                        {reg.estado === "suspendido" && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                            Inactivo
                          </span>
                        )}
                      </div>
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
                    <td className="p-4">
                      {reg.estado === "activo" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Suspendido
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-xs">
                      {reg.nombreArchivo ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                          <FileCheck className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[110px]">{reg.nombreArchivo}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Sin adjunto</span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-slate-500">{reg.fechaRegistro}</td>
                    <td className="p-4 text-right space-x-1 whitespace-nowrap">
                      {/* Botón Suspender / Activar */}
                      <button
                        type="button"
                        onClick={() => handleToggleEstado(reg)}
                        className={`p-2 rounded-lg transition-colors ${
                          reg.estado === "activo"
                            ? "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                            : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                        }`}
                        title={reg.estado === "activo" ? "Suspender acceso del funcionario" : "Reactivar funcionario"}
                        aria-label={reg.estado === "activo" ? `Suspender a ${reg.nombre}` : `Activar a ${reg.nombre}`}
                      >
                        {reg.estado === "activo" ? (
                          <UserX className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4 text-emerald-600" />
                        )}
                      </button>

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
          <span>
            Mostrando {registrosFiltrados.length} de {registros.length} funcionarios (
            {registros.filter((r) => r.estado === "activo").length} activos,{" "}
            {registros.filter((r) => r.estado === "suspendido").length} suspendidos)
          </span>
          <span>SNE-RG V2 • Tolerancia a Fallos</span>
        </div>
      </div>

      {/* Toast no intrusivo de Cambio de Estado (Suspender / Activar) */}
      {statusToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white p-4 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className={`p-2 rounded-lg ${statusToast.estado === "activo" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
            {statusToast.estado === "activo" ? (
              <UserCheck className="w-4 h-4" />
            ) : (
              <ShieldAlert className="w-4 h-4" />
            )}
          </div>
          <div className="text-xs">
            <p className="font-semibold">
              {statusToast.estado === "activo" ? "Funcionario Reactivado" : "Funcionario Suspendido"}
            </p>
            <p className="text-slate-400">
              El estado de <strong>{statusToast.nombre}</strong> ahora es{" "}
              <span className={statusToast.estado === "activo" ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
                {statusToast.estado.toUpperCase()}
              </span>.
            </p>
          </div>
        </div>
      )}

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