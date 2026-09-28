"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, CreditCard, Building2, Loader2, WifiOff, Terminal, ChevronDown, CheckCircle2 } from "lucide-react";

// Reglas de validación
const formSchema = z.object({
  rut: z.string().min(8, "El RUT es obligatorio y debe ser válido"),
  nombre: z.string().min(2, "El nombre completo es requerido"),
  departamento: z.string().min(1, "Seleccione un departamento"),
});

type FormData = z.infer<typeof formSchema>;

export default function FormularioAdministrativo() {
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados de control para la demostración
  const [hasFailedOnce, setHasFailedOnce] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorContext, setErrorContext] = useState<{ title: string; message: string; stackTrace: string } | null>(null);
  const [isITOpen, setIsITOpen] = useState(false);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { rut: "", nombre: "", departamento: "" },
  });

  const formValues = watch();

  useEffect(() => {
    setIsClient(true);
    const savedData = localStorage.getItem("sne-rg-draft");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.rut) setValue("rut", parsedData.rut);
        if (parsedData.nombre) setValue("nombre", parsedData.nombre);
        if (parsedData.departamento) setValue("departamento", parsedData.departamento);
      } catch (error) {
        console.error("Error leyendo el borrador:", error);
      }
    }
  }, [setValue]);

  useEffect(() => {
    if (isClient && !isSuccess) {
      localStorage.setItem("sne-rg-draft", JSON.stringify(formValues));
    }
  }, [formValues, isClient, isSuccess]);

  const onError = (formErrors: any) => {
    const firstErrorField = Object.keys(formErrors)[0];
    const element = document.getElementsByName(firstErrorField)[0];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.focus();
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setErrorContext(null);
    setIsITOpen(false);
    setIsSuccess(false);

    // Simulador de carga
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (!hasFailedOnce) {
      // 1. PRIMER INTENTO: Forzamos el fallo para demostrar el SNE-RG
      setIsSubmitting(false);
      setHasFailedOnce(true);
      setErrorContext({
        title: "Micro-corte de conexión detectado",
        message: "No pudimos conectar con el servidor principal. Verifica tu conexión a internet e inténtalo nuevamente.",
        stackTrace: `[ERROR] 504 Gateway Timeout\nTimestamp: ${new Date().toISOString()}\nEndpoint: /api/v1/solicitudes\nPayload_Hash: ${btoa(data.rut).substring(0, 8)}...\n---\nCaída en microservicio de base de datos. Se requiere revisión de logs de red.`
      });
    } else {
      // 2. SEGUNDO INTENTO (Reintentar): Simulación de éxito
      setIsSubmitting(false);
      setIsSuccess(true);
      setHasFailedOnce(false); // Reseteamos el ciclo
      localStorage.removeItem("sne-rg-draft"); // Limpiamos el caché local
      reset(); // Vaciamos el formulario
    }
  };

  if (!isClient) return null;

  // VISTA DE ÉXITO (Final Feliz)
  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 p-8 rounded-2xl text-center animate-in zoom-in-95 duration-500">
        <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-green-800 font-bold text-xl mb-2">¡Solicitud Procesada!</h3>
        <p className="text-green-700 text-sm mb-6">
          La conexión se ha restablecido y los datos de la solicitud fueron guardados correctamente en la base de datos central.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
        >
          Ingresar nueva solicitud
        </button>
      </div>
    );
  }

  // VISTA PRINCIPAL (Formulario + Error)
  return (
    <div className="space-y-6">
      {/* Alerta SNE-RG V2 */}
      {errorContext && (
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300 shadow-sm">
          <div className="flex gap-4">
            <div className="bg-amber-100 p-2 rounded-full h-fit shrink-0">
              <WifiOff className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-1 w-full overflow-hidden">
              <h3 className="text-amber-800 font-bold text-sm">
                {errorContext.title}
              </h3>
              <p className="text-amber-700 text-sm mt-1 leading-relaxed">
                {errorContext.message}
              </p>
              
              <button 
                onClick={handleSubmit(onSubmit, onError)}
                disabled={isSubmitting}
                className="mt-4 flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Reintentar envío (Tus datos están seguros)
              </button>

              <div className="mt-4 border-t border-amber-200/60 pt-3">
                <button 
                  type="button"
                  onClick={() => setIsITOpen(!isITOpen)}
                  className="flex items-center gap-2 text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors outline-none"
                >
                  <Terminal className="h-4 w-4" />
                  Ver detalle para soporte TI
                  <ChevronDown className={`h-4 w-4 transition-transform ${isITOpen ? "rotate-180" : ""}`} />
                </button>
                
                {isITOpen && (
                  <div className="mt-3 p-3 bg-slate-900 rounded-lg overflow-x-auto animate-in slide-in-from-top-2 duration-200">
                    <code className="text-[11px] text-green-400 font-mono text-left block whitespace-pre">
                      {errorContext.stackTrace}
                    </code>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">RUT del Funcionario</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CreditCard className="h-4 w-4 text-slate-400" />
            </div>
            <input
              {...register("rut")}
              disabled={isSubmitting}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all outline-none disabled:opacity-50 ${
                errors.rut 
                  ? "border-amber-500 bg-amber-50/50 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" 
                  : "border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              }`}
              placeholder="Ej: 12345678-9"
            />
          </div>
          {errors.rut && <p className="text-amber-600 text-xs mt-1.5 font-medium">{errors.rut.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre Completo</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-slate-400" />
            </div>
            <input
              {...register("nombre")}
              disabled={isSubmitting}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all outline-none disabled:opacity-50 ${
                errors.nombre 
                  ? "border-amber-500 bg-amber-50/50 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" 
                  : "border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              }`}
              placeholder="Ej: Camila Soto"
            />
          </div>
          {errors.nombre && <p className="text-amber-600 text-xs mt-1.5 font-medium">{errors.nombre.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Departamento</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-4 w-4 text-slate-400" />
            </div>
            <select
              {...register("departamento")}
              disabled={isSubmitting}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all outline-none appearance-none disabled:opacity-50 ${
                errors.departamento 
                  ? "border-amber-500 bg-amber-50/50 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" 
                  : "border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              }`}
            >
              <option value="">Seleccione un área...</option>
              <option value="rrhh">Recursos Humanos</option>
              <option value="finanzas">Finanzas</option>
              <option value="ti">Soporte TI</option>
            </select>
          </div>
          {errors.departamento && <p className="text-amber-600 text-xs mt-1.5 font-medium">{errors.departamento.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 bg-blue-600 text-white py-3 px-4 rounded-xl text-sm font-semibold shadow-sm hover:bg-blue-700 hover:shadow disabled:bg-blue-400 transform active:scale-[0.98] transition-all flex justify-center items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Procesando...
            </>
          ) : (
            "Procesar Solicitud"
          )}
        </button>
      </form>
    </div>
  );
}