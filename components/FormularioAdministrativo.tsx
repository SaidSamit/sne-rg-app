"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  CreditCard,
  Building2,
  FileText,
  Loader2,
  WifiOff,
  AlertCircle,
  CheckCircle2,
  ArrowDown,
  UploadCloud,
  FileCheck,
  XCircle,
  Sparkles,
} from "lucide-react";
import { funcionarioSchema, FuncionarioSchemaType, LIMITE_ARCHIVO_MB } from "@/lib/validations";
import { formatearRut } from "@/lib/rut";
import { storage } from "@/lib/storage";
import { ErrorContextSNE } from "@/types/funcionario";
import AcordeonSoporteTI from "./AcordeonSoporteTI";
import IndicadorBorrador from "./IndicadorBorrador";

interface FormularioAdministrativoProps {
  onSuccess?: () => void;
}

export default function FormularioAdministrativo({ onSuccess }: FormularioAdministrativoProps) {
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasFailedOnce, setHasFailedOnce] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorContext, setErrorContext] = useState<ErrorContextSNE | null>(null);
  const [draftTimestamp, setDraftTimestamp] = useState<string | null>(null);
  const [hasDraftData, setHasDraftData] = useState(false);

  // Estado del archivo adjunto simulado/cargado
  const [archivoAdjunto, setArchivoAdjunto] = useState<{ nombre: string; tamanoMB: number } | null>(null);
  const [errorArchivo, setErrorArchivo] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isClearingRef = useRef(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FuncionarioSchemaType>({
    resolver: zodResolver(funcionarioSchema),
    defaultValues: {
      rut: "",
      nombre: "",
      departamento: "",
      archivo: null,
    },
  });

  // Carga inicial y lectura de borrador existente
  useEffect(() => {
    setIsClient(true);
    const draft = storage.getDraft();
    const timestamp = storage.getDraftTimestamp();
    if (draft) {
      if (draft.rut) setValue("rut", formatearRut(draft.rut));
      if (draft.nombre) setValue("nombre", draft.nombre);
      if (draft.departamento) setValue("departamento", draft.departamento);
      if (draft.archivo) {
        setArchivoAdjunto(draft.archivo);
        setValue("archivo", draft.archivo);
      }
      setDraftTimestamp(timestamp);
      setHasDraftData(true);
    }
  }, [setValue]);

  // Persistencia reactiva del borrador en LocalStorage usando suscripción (SNE-RG)
  useEffect(() => {
    const subscription = watch((value) => {
      if (!isClient || isSuccess || isClearingRef.current) return;

      const rutVal = (value.rut || "").trim();
      const nombreVal = (value.nombre || "").trim();
      const deptoVal = (value.departamento || "").trim();
      const archivoVal =
        value.archivo && value.archivo.nombre && typeof value.archivo.tamanoMB === "number"
          ? { nombre: value.archivo.nombre, tamanoMB: value.archivo.tamanoMB }
          : null;

      const tieneContenido = Boolean(
        rutVal.length > 0 ||
        nombreVal.length > 0 ||
        deptoVal.length > 0 ||
        archivoVal
      );

      if (tieneContenido) {
        storage.saveDraft({
          rut: rutVal,
          nombre: nombreVal,
          departamento: deptoVal,
          archivo: archivoVal,
        });
        setDraftTimestamp(storage.getDraftTimestamp());
        setHasDraftData(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, isClient, isSuccess]);

  // Limpiar borrador manualmente
  const handleClearDraft = () => {
    isClearingRef.current = true;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setArchivoAdjunto(null);
    setErrorArchivo(null);
    setErrorContext(null);
    setHasDraftData(false);
    setDraftTimestamp(null);
    storage.clearDraft();
    reset({
      rut: "",
      nombre: "",
      departamento: "",
      archivo: null,
    });
    setTimeout(() => {
      isClearingRef.current = false;
    }, 150);
  };

  // Manejo de carga de archivos (Test 2 de la diapositiva: detección de 12MB vs 5MB máximo)
  const procesarArchivo = (nombre: string, tamanoMB: number) => {
    setErrorArchivo(null);

    if (tamanoMB > LIMITE_ARCHIVO_MB) {
      setErrorArchivo(
        `El archivo (${tamanoMB.toFixed(1)} MB) excede el tamaño máximo permitido (${LIMITE_ARCHIVO_MB} MB).`
      );
      setErrorContext({
        type: "file_size",
        title: "Archivo excede límite corporativo",
        message: `El documento "${nombre}" pesa ${tamanoMB.toFixed(1)} MB. Para evitar congestión en el enlace de la intranet, el límite es de ${LIMITE_ARCHIVO_MB} MB por solicitud.`,
        sugerencia: "Comprima el documento PDF o seleccione una versión optimizada antes de continuar.",
        fieldTarget: "archivo",
        stackTrace: `[VALIDATION_ERROR] 413 Payload Too Large\nTimestamp: ${new Date().toISOString()}\nFilename: ${nombre}\nSize: ${tamanoMB}MB (Max: ${LIMITE_ARCHIVO_MB}MB)\nRule: SNE_FILE_SIZE_QUOTA_CHECK`,
      });
      return false;
    }

    const archivoValido = { nombre, tamanoMB };
    setArchivoAdjunto(archivoValido);
    setValue("archivo", archivoValido);
    if (errorContext?.type === "file_size") {
      setErrorContext(null);
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const tamanoMB = Number((file.size / (1024 * 1024)).toFixed(2));
    procesarArchivo(file.name, tamanoMB);
  };

  const handleAutoFillDemo = () => {
    setValue("rut", "15.423.891-2", { shouldValidate: true, shouldDirty: true });
    setValue("nombre", "Camila Soto González", { shouldValidate: true, shouldDirty: true });
    setValue("departamento", "Recursos Humanos", { shouldValidate: true, shouldDirty: true });
    procesarArchivo("Contrato_CamilaSoto.pdf", 2.1);
  };

  // Auto-scroll contextual directo al campo con conflicto (Slide 3 y 4)
  const irAlCampo = (fieldName: string) => {
    const element = document.getElementsByName(fieldName)[0] || document.getElementById(fieldName);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.focus();
      // Efecto perimetral interactivo
      element.classList.add("ring-4", "ring-amber-400", "ring-offset-2");
      setTimeout(() => {
        element.classList.remove("ring-4", "ring-amber-400", "ring-offset-2");
      }, 2000);
    }
  };

  const onError = (formErrors: FieldErrors<FuncionarioSchemaType>) => {
    const firstErrorField = Object.keys(formErrors)[0];
    if (firstErrorField) {
      irAlCampo(firstErrorField);
      setErrorContext({
        type: "validation",
        title: "Campos pendientes de corrección",
        message: "Por favor complete o corrija las casillas marcadas para garantizar la integridad del registro.",
        fieldTarget: firstErrorField,
        stackTrace: `[CLIENT_VALIDATION] HTTP 422 Unprocessable Content\nTimestamp: ${new Date().toISOString()}\nTarget: ${firstErrorField}\nError: ${formErrors[firstErrorField as keyof FuncionarioSchemaType]?.message || "Valor inválido"}`,
      });
    }
  };

  // Envío controlado con simulación pedagógica SNE-RG V2
  const onSubmit = async (data: FuncionarioSchemaType) => {
    setIsSubmitting(true);
    setErrorContext(null);
    setIsSuccess(false);

    // 1. Verificación de duplicados (Error 409)
    const existingRecord = storage.getFuncionarioByRut(data.rut);
    if (existingRecord) {
      setIsSubmitting(false);
      setErrorContext({
        type: "duplicate",
        title: "Registro Duplicado (Conflicto de Datos)",
        message: `El RUT ${data.rut} ya se encuentra registrado en el sistema bajo el nombre de ${existingRecord.nombre} (${existingRecord.departamento}).`,
        sugerencia: "Verifique el número ingresado o actualice los datos del funcionario en el Directorio.",
        fieldTarget: "rut",
        stackTrace: `[ERROR] 409 Conflict\nTimestamp: ${new Date().toISOString()}\nEndpoint: /api/v1/usuarios/check\nDetalle: Unique constraint violation en columna 'RUT' (Valor: ${data.rut}).`,
      });
      irAlCampo("rut");
      return;
    }

    // Simulación de latencia de red corporativa
    await new Promise((resolve) => setTimeout(resolve, 1400));

    // 2. Falla de conexión simulada (504 Gateway Timeout) para probar auto-recuperación
    if (!hasFailedOnce) {
      setIsSubmitting(false);
      setHasFailedOnce(true);
      setErrorContext({
        type: "network",
        title: "Micro-corte de conexión detectado",
        message: "No fue posible conectar con el servidor central de la intranet. Sus datos han sido resguardados localmente para evitar pérdidas.",
        sugerencia: "Haga clic en 'Reintentar envío' para reanudar la operación sin tener que reescribir nada.",
        stackTrace: `[ERROR] 504 Gateway Timeout\nTimestamp: ${new Date().toISOString()}\nEndpoint: /api/v1/solicitudes\nPayload_Hash: ${btoa(data.rut).substring(0, 8)}...\nDetalle: Microservicio de base de datos no respondió dentro del timeout configurado (1500ms).`,
      });
      return;
    }

    // 3. Envío exitoso (Recuperación y persistencia final)
    storage.createFuncionario({
      rut: data.rut,
      nombre: data.nombre,
      departamento: data.departamento,
      nombreArchivo: archivoAdjunto?.nombre,
      tamanoArchivoMB: archivoAdjunto?.tamanoMB,
      estado: "activo",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    storage.clearDraft();
    setIsSubmitting(false);
    setIsSuccess(true);
    setHasFailedOnce(false);
    setArchivoAdjunto(null);
    setHasDraftData(false);
    setDraftTimestamp(null);
    reset({
      rut: "",
      nombre: "",
      departamento: "",
      archivo: null,
    });

    if (onSuccess) onSuccess();
  };

  if (!isClient) {
    return (
      <div className="py-12 flex justify-center items-center text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span className="text-sm">Cargando formulario protegido SNE-RG...</span>
      </div>
    );
  }

  // Vista de Éxito
  if (isSuccess) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center animate-in zoom-in-95 duration-400">
        <div className="mx-auto bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="text-emerald-900 font-bold text-xl mb-1">¡Funcionario Registrado con Éxito!</h3>
        <p className="text-emerald-700 text-sm mb-6 max-w-md mx-auto">
          El registro se ha consolidado en el Directorio Corporativo. No se perdieron datos durante el proceso.
        </p>
        <button
          type="button"
          onClick={() => setIsSuccess(false)}
          className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200"
        >
          Ingresar otro funcionario
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Indicador de Respaldo de Borrador */}
      <IndicadorBorrador
        timestamp={draftTimestamp}
        hasDraftData={hasDraftData}
        onClearDraft={handleClearDraft}
      />

      {/* Banner SNE-RG de Error Asistido y Recuperación Guiada */}
      {errorContext && (
        <div
          role="alert"
          className={`border p-5 rounded-2xl animate-in fade-in slide-in-from-top-3 duration-300 shadow-sm ${
            errorContext.type === "network"
              ? "bg-amber-50 border-amber-200 text-amber-900"
              : errorContext.type === "duplicate"
              ? "bg-rose-50 border-rose-200 text-rose-900"
              : "bg-blue-50 border-blue-200 text-blue-900"
          }`}
        >
          <div className="flex gap-4">
            <div
              className={`p-2.5 rounded-xl h-fit shrink-0 ${
                errorContext.type === "network"
                  ? "bg-amber-100 text-amber-700"
                  : errorContext.type === "duplicate"
                  ? "bg-rose-100 text-rose-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {errorContext.type === "network" ? (
                <WifiOff className="h-6 w-6" />
              ) : (
                <AlertCircle className="h-6 w-6" />
              )}
            </div>

            <div className="flex-1 w-full overflow-hidden">
              <h3 className="font-bold text-sm leading-tight">{errorContext.title}</h3>
              <p className="text-sm mt-1 leading-relaxed opacity-90">{errorContext.message}</p>

              {errorContext.sugerencia && (
                <p className="text-xs mt-2 font-medium bg-white/70 p-2 rounded-lg border border-black/5">
                  💡 <strong>Acción guiada:</strong> {errorContext.sugerencia}
                </p>
              )}

              {/* Acciones principales de recuperación */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {errorContext.type === "network" && (
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit, onError)}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-700 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Reintentar envío (Tus datos están seguros)
                  </button>
                )}

                {errorContext.type === "duplicate" && (
                  <button
                    type="button"
                    onClick={() => irAlCampo("rut")}
                    className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-rose-700 transition-colors shadow-sm"
                  >
                    <ArrowDown className="h-4 w-4" />
                    Modificar RUT ingresado
                  </button>
                )}

                {errorContext.fieldTarget && errorContext.type === "validation" && (
                  <button
                    type="button"
                    onClick={() => irAlCampo(errorContext.fieldTarget!)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <ArrowDown className="h-4 w-4" />
                    Corregir casilla con error
                  </button>
                )}
              </div>

              {/* Módulo Desacoplado para Soporte TI */}
              <AcordeonSoporteTI stackTrace={errorContext.stackTrace} tipo={errorContext.type} />
            </div>
          </div>
        </div>
      )}

      {/* Barra de Demostración Rápida para el Pitch */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-200/80 rounded-xl text-xs">
        <span className="text-slate-700 font-medium flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span><strong>Modo Pitch / Demostración:</strong> Caso Camila Soto (RRHH)</span>
        </span>
        <button
          type="button"
          onClick={handleAutoFillDemo}
          className="px-2.5 py-1 bg-white hover:bg-blue-600 hover:text-white border border-blue-200 text-blue-700 font-semibold rounded-lg transition-all shadow-2xs"
        >
          Auto-rellenar datos de prueba
        </button>
      </div>

      {/* Formulario Principal */}
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5" noValidate>
        {/* RUT */}
        <div>
          <label htmlFor="campo-rut" className="block text-sm font-medium text-slate-700 mb-1.5">
            RUT del Funcionario *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <CreditCard className="h-4 w-4" />
            </div>
            <input
              id="campo-rut"
              {...register("rut")}
              onChange={(e) => {
                const formateado = formatearRut(e.target.value);
                setValue("rut", formateado, { shouldValidate: true });
              }}
              disabled={isSubmitting}
              placeholder="Ej: 12.345.678-9"
              maxLength={12}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all outline-none disabled:opacity-50 ${
                errors.rut
                  ? "border-amber-500 bg-amber-50/50 focus:ring-2 focus:ring-amber-500/20"
                  : "border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              }`}
            />
          </div>
          {errors.rut && (
            <p className="text-amber-600 text-xs mt-1.5 font-medium flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5 inline" />
              {errors.rut.message}
            </p>
          )}
        </div>

        {/* Nombre Completo */}
        <div>
          <label htmlFor="campo-nombre" className="block text-sm font-medium text-slate-700 mb-1.5">
            Nombre Completo *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="h-4 w-4" />
            </div>
            <input
              id="campo-nombre"
              {...register("nombre")}
              disabled={isSubmitting}
              placeholder="Ej: Camila Soto González"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all outline-none disabled:opacity-50 ${
                errors.nombre
                  ? "border-amber-500 bg-amber-50/50 focus:ring-2 focus:ring-amber-500/20"
                  : "border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              }`}
            />
          </div>
          {errors.nombre && (
            <p className="text-amber-600 text-xs mt-1.5 font-medium flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5 inline" />
              {errors.nombre.message}
            </p>
          )}
        </div>

        {/* Departamento */}
        <div>
          <label htmlFor="campo-departamento" className="block text-sm font-medium text-slate-700 mb-1.5">
            Departamento de Destino *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Building2 className="h-4 w-4" />
            </div>
            <select
              id="campo-departamento"
              {...register("departamento")}
              disabled={isSubmitting}
              className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all outline-none disabled:opacity-50 ${
                errors.departamento
                  ? "border-amber-500 bg-amber-50/50 focus:ring-2 focus:ring-amber-500/20"
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
            <p className="text-amber-600 text-xs mt-1.5 font-medium flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5 inline" />
              {errors.departamento.message}
            </p>
          )}
        </div>

        {/* Documento de Respaldo (PDF) - Soporta Prueba de límite de archivo (Slide 7) */}
        <div id="campo-archivo" className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <label htmlFor="file-input" className="block text-sm font-medium text-slate-700">
                Documento de Respaldo (PDF opcional)
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                Copia de cédula o contrato. Tamaño máximo permitido: <strong>5.0 MB</strong>.
              </p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
              SNE-RG Quota
            </span>
          </div>

          <input
            id="file-input"
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {archivoAdjunto ? (
            <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center gap-2.5">
                <FileCheck className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">{archivoAdjunto.nombre}</p>
                  <p className="text-[11px] text-slate-500">{archivoAdjunto.tamanoMB.toFixed(1)} MB - Documento validado</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                  setArchivoAdjunto(null);
                  setValue("archivo", null, { shouldValidate: true, shouldDirty: true });
                }}
                className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors"
                title="Quitar archivo"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <UploadCloud className="h-4 w-4 text-slate-500" />
                Seleccionar PDF del equipo
              </button>

              {/* Botones de simulación pedagógica para evaluar la hipótesis de la Diapositiva 7 */}
              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  type="button"
                  onClick={() => procesarArchivo("Contrato_Laboral_2026.pdf", 2.1)}
                  className="px-2 py-1 text-[11px] bg-slate-200/80 text-slate-700 hover:bg-slate-300 rounded transition-colors"
                  title="Simula un archivo que cumple el límite"
                >
                  Simular PDF 2.1 MB
                </button>
                <button
                  type="button"
                  onClick={() => procesarArchivo("Anexo_Expediente_Pesado.pdf", 12.0)}
                  className="px-2 py-1 text-[11px] bg-amber-100 text-amber-800 hover:bg-amber-200 rounded transition-colors"
                  title="Simula la prueba del Grupo 2 en la presentación (12MB vs 5MB)"
                >
                  Simular PDF 12 MB (Test 2)
                </button>
              </div>
            </div>
          )}

          {errorArchivo && (
            <p className="text-amber-600 text-xs font-medium flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5 inline" />
              {errorArchivo}
            </p>
          )}
        </div>

        {/* Botón de Enviar */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-3 bg-blue-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-all flex justify-center items-center gap-2 shadow-sm shadow-blue-200"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Procesando solicitud de ingreso...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" />
              Procesar Solicitud
            </>
          )}
        </button>
      </form>
    </div>
  );
}
