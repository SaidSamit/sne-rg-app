"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  Activity,
  Users,
  PlusCircle,
  ShieldCheck,
  ArrowRight,
  Database,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Clock,
} from "lucide-react";
import { subscribeToDB, getDBSnapshot, getDBServerSnapshot } from "@/lib/storage";

export default function Dashboard() {
  const registros = useSyncExternalStore(subscribeToDB, getDBSnapshot, getDBServerSnapshot);
  const totalRegistros = registros.length;
  const totalActivos = registros.filter((f) => f.estado === "activo").length;
  const totalSuspendidos = registros.filter((f) => f.estado === "suspendido").length;
  const totalConPDF = registros.filter((f) => Boolean(f.nombreArchivo)).length;

  // Conteo por departamentos para distribución visual
  const conteoDeptos = {
    rrhh: registros.filter((f) => f.departamento === "Recursos Humanos").length,
    finanzas: registros.filter((f) => f.departamento === "Finanzas").length,
    soporte: registros.filter((f) => f.departamento === "Soporte TI").length,
    operaciones: registros.filter((f) => f.departamento === "Operaciones").length,
    logistica: registros.filter((f) => f.departamento === "Logística").length,
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-300 space-y-8 pb-10">
      {/* Encabezado Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold mb-2">
            <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            Monitoreo en Tiempo Real • Intranet CorpNet
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Panel de Control y Rendimiento SNE-RG V2
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Sistema de Mensajería de Error Asistida y Recuperación Guiada. Métricas de resiliencia y ahorro corporativo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/nueva-solicitud"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            Nueva Solicitud (SNE-RG)
          </Link>
          <Link
            href="/directorio"
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors border border-slate-200"
          >
            <Users className="w-4 h-4" />
            Directorio ({totalRegistros})
          </Link>
        </div>
      </div>

      {/* Tarjetas de Métricas de Negocio y Soporte TI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Tickets TI Prevenidos</p>
              <h3 className="text-2xl font-bold text-slate-800">142</h3>
            </div>
            <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 mt-3 font-semibold">+12% respecto al mes anterior</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Tasa de Recuperación</p>
              <h3 className="text-2xl font-bold text-slate-800">98.5%</h3>
            </div>
            <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">Reintentos exitosos sin abandono</p>
        </div>

        <Link
          href="/ahorro-ti"
          className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 hover:border-amber-300 hover:shadow-md transition-all group block"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1 group-hover:text-amber-600 transition-colors">
                Ahorro Estimado Mensual
              </p>
              <h3 className="text-2xl font-bold text-slate-800">$450.000</h3>
            </div>
            <div className="bg-amber-100 p-2.5 rounded-xl text-amber-600 group-hover:scale-105 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-amber-700 font-semibold mt-3 flex items-center gap-1">
            Ver desglose por severidad TI →
          </p>
        </Link>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Registros en Directorio</p>
              <h3 className="text-2xl font-bold text-slate-800">{totalRegistros}</h3>
            </div>
            <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-medium">
            <span className="text-emerald-600 font-semibold">{totalActivos} activos</span> •{" "}
            <span className="text-amber-600 font-semibold">{totalSuspendidos} suspendidos</span>
          </p>
        </div>
      </div>

      {/* Indicadores de Confiabilidad y Calidad ISO/IEC 25010 */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-800 text-sm md:text-base">
              Métricas de Resiliencia del Software (Norma ISO/IEC 25010)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Evaluación Experimental V2</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <span className="text-xs text-slate-500 block">Tolerancia a Fallos 504</span>
            <span className="text-xl font-bold text-emerald-600 font-mono mt-1 block">100%</span>
            <span className="text-[11px] text-slate-400 mt-1 block">Aislamiento de caídas de red</span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <span className="text-xs text-slate-500 block">Protección de Datos</span>
            <span className="text-xl font-bold text-emerald-600 font-mono mt-1 block">100%</span>
            <span className="text-[11px] text-slate-400 mt-1 block">0 pérdidas en LocalStorage</span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <span className="text-xs text-slate-500 block">Tiempo de Recuperación</span>
            <span className="text-xl font-bold text-blue-600 font-mono mt-1 block">4.2 seg</span>
            <span className="text-[11px] text-slate-400 mt-1 block">Meta cumplida: &lt; 5s (Slide 5)</span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
            <span className="text-xs text-slate-500 block">Satisfacción Usuaria</span>
            <span className="text-xl font-bold text-purple-600 font-mono mt-1 block">4.5 / 5.0</span>
            <span className="text-[11px] text-slate-400 mt-1 block">Pruebas empíricas (Slide 8)</span>
          </div>
        </div>
      </div>

      {/* Grid de 2 Columnas: Distribución de Personal y Live Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Distribución Departamental (5 columnas) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-800 text-sm">Distribución de Funcionarios</h3>
              <span className="text-xs text-slate-400 font-mono">{totalRegistros} personas</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Personal registrado en los departamentos corporativos.</p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-700">Recursos Humanos</span>
                  <span className="text-slate-500">{conteoDeptos.rrhh}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${totalRegistros > 0 ? (conteoDeptos.rrhh / totalRegistros) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-700">Finanzas</span>
                  <span className="text-slate-500">{conteoDeptos.finanzas}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${totalRegistros > 0 ? (conteoDeptos.finanzas / totalRegistros) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-700">Soporte TI</span>
                  <span className="text-slate-500">{conteoDeptos.soporte}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${totalRegistros > 0 ? (conteoDeptos.soporte / totalRegistros) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-700">Operaciones / Logística</span>
                  <span className="text-slate-500">{conteoDeptos.operaciones + conteoDeptos.logistica}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        totalRegistros > 0
                          ? ((conteoDeptos.operaciones + conteoDeptos.logistica) / totalRegistros) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Expedientes con PDF digital:</span>
            <span className="font-semibold text-slate-800">{totalConPDF} de {totalRegistros}</span>
          </div>
        </div>

        {/* Live Audit Log: Actividad Reciente de Tolerancia a Fallos (7 columnas) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                Registro Operativo SNE-RG (Audit Log)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Eventos recientes de auto-recuperación y protección de estado.</p>
            </div>
            <span className="text-[11px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-md border border-emerald-200">
              Live Safe
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 mt-0.5 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 text-xs">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-800 font-semibold">Micro-corte 504 Mitigado</strong>
                  <span className="text-[10px] text-slate-400 font-mono">Hace 2m</span>
                </div>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Camila Soto reintentó envío. Datos resguardados en LocalStorage sin pérdida de campos.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600 mt-0.5 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 text-xs">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-800 font-semibold">Validación Preventiva de PDF</strong>
                  <span className="text-[10px] text-slate-400 font-mono">Hace 14m</span>
                </div>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Detección en cliente de archivo de 12.0 MB superando cuota de 5.0 MB. Se orientó compresión guiada.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600 mt-0.5 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 text-xs">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-800 font-semibold">Borrador Reactivo Guardado</strong>
                  <span className="text-[10px] text-slate-400 font-mono">Hace 28m</span>
                </div>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Formulario administrativo sincronizado en tiempo real. 0 riesgo de pérdida por recarga del navegador.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Arquitectura de Vistas Separadas (Slide 10) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Módulo Solicitud Asistida</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Ingreso de personal protegido con Módulo 11 real, selector de PDF con límite de 5MB y auto-scroll perimetral ámbar.
          </p>
          <Link
            href="/nueva-solicitud"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline pt-1"
          >
            Abrir formulario protegido <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Directorio CRUD Completo</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Consulta en vivo, actualización de cargos, suspensión/activación inmediata y eliminación segura con opción de deshacer.
          </p>
          <Link
            href="/directorio"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline pt-1"
          >
            Gestionar directorio corporativo <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Auditoría Financiera TI</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Estructura de tarifas horarias ($15K a $65K CLP) y calculadora dinámica de retorno de inversión corporativo.
          </p>
          <Link
            href="/ahorro-ti"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline pt-1"
          >
            Ver simulador y tickets evitados <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Banner Informativo ISO/IEC 25010 */}
      <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-25 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-mono border border-blue-400/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Norma ISO/IEC 25010 • Usabilidad y Tolerancia a Fallos
            </div>
            <h3 className="text-xl font-bold tracking-tight">Arquitectura Tolerante a Fallos SNE-RG V2</h3>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              El sistema aísla los dominios de falla desacoplando la experiencia del usuario operativo de los códigos crípticos del servidor. Respalda borradores automáticamente en almacenamiento local y provee trazabilidad para el equipo de soporte TI.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <div className="px-4 py-2.5 bg-slate-800/90 rounded-xl border border-slate-700/80 text-xs font-mono text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Status: Intranet Activa
            </div>
            <div className="px-4 py-2.5 bg-slate-800/90 rounded-xl border border-slate-700/80 text-xs font-mono text-blue-300 flex items-center gap-2">
              <FileCheck className="w-3.5 h-3.5" />
              Expedientes PDF: {totalConPDF}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}