"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, CreditCard, Building2, Loader2, WifiOff, Terminal, ChevronDown, CheckCircle2, AlertCircle } from "lucide-react";

const formSchema = z.object({
  rut: z.string().min(11, "El RUT debe estar completo"), // Mínimo 11 caracteres por los puntos y guion
  nombre: z.string().min(2, "El nombre completo es requerido"),
  departamento: z.string().min(1, "Seleccione un departamento"),
});

type FormData = z.infer<typeof formSchema>;

// Función experta para formatear el RUT chileno en vivo
const formatearRUT = (valor: string) => {
  // Limpiar todo excepto números y la letra K
  const valorLimpio = valor.replace(/[^0-9kK]/g, '').toUpperCase();
  if (valorLimpio.length === 0) return '';
  if (valorLimpio.length <= 1) return valorLimpio;

  const cuerpo = valorLimpio.slice(0, -1);
  const dv = valorLimpio.slice(-1);
  
  // Agregar los puntos al cuerpo
  const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${cuerpoFormateado}-${dv}`;
};

export default function FormularioAdministrativo({ onSuccess }: { onSuccess?: () => void }) {
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [hasFailedOnce, setHasFailedOnce] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorContext, setErrorContext] = useState<{ type: 'network' | 'duplicate', title: string; message: string; stackTrace: string } | null>(null);
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
        const parsed = JSON.parse(savedData);
        if (parsed.rut) setValue("rut", formatearRUT(parsed.rut));
        if (parsed.nombre) setValue("nombre", parsed.nombre);
        if (parsed.departamento) setValue("departamento", parsed.departamento);
      } catch (e) {}
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

    const db = JSON.parse(localStorage.getItem("sne-rg-db") || "[]");
    const existingRecord = db.find((record: any) => record.rut === data.rut);

    if (existingRecord) {
      setIsSubmitting(false);
      setErrorContext({
        type: 'duplicate',
        title: "Registro Duplicado (Conflicto de Datos)",
        message: `El RUT ${data.rut} ya se encuentra registrado en el sistema bajo el nombre de ${existingRecord.nombre} (${existingRecord.departamento}).`,
        stackTrace: `[ERROR] 409 Conflict\nTimestamp: ${new Date().toISOString()}\nEndpoint: /api/v1/usuarios/check\nDetalle: Unique constraint violation en columna 'RUT'.`
      });
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (!hasFailedOnce) {
      setIsSubmitting(false);
      setHasFailedOnce(true);
      setErrorContext({
        type: 'network',
        title: "Micro-corte de conexión detectado",
        message: "No pudimos conectar con el servidor principal. Verifica tu conexión a internet e inténtalo nuevamente.",
        stackTrace: `[ERROR] 504 Gateway Timeout\nTimestamp: ${new Date().toISOString()}\nEndpoint: /api/v1/solicitudes\nPayload_Hash: ${btoa(data.rut).substring(0, 8)}...\n---\nCaída en microservicio de base de datos.`
      });
    } else {
      const newRecord = { ...data, id: Date.now(), fecha: new Date().toLocaleDateString() };
      db.push(newRecord);
      localStorage.setItem("sne-rg-db", JSON.stringify(db));

      setIsSubmitting(false);
      setIsSuccess(true);
      setHasFailedOnce(false);
      localStorage.removeItem("sne-rg-draft"); 
      reset(); 
      if (onSuccess) onSuccess(); 
    }
  };

  if (!isClient) return null;

  // Extraemos el onChange nativo de React Hook Form para poder inyectar nuestra función de formateo
  const { onChange: rutOnChange, onBlur: rutOnBlur, name: rutName, ref: rutRef } = register("rut");

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 p-8 rounded-2xl text-center animate-in zoom-in-95 duration-500">
        <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-green-800 font-bold text-xl mb-2">¡Funcionario Registrado!</h3>
        <p className="text-green-700 text-sm mb-6">El registro fue guardado exitosamente en el directorio central.</p>
        <button onClick={() => setIsSuccess(false)} className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
          Ingresar nuevo registro
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {errorContext && (
        <div className={`border p-5 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300 shadow-sm ${errorContext.type === 'network' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex gap-4">
            <div className={`p-2 rounded-full h-fit shrink-0 ${errorContext.type === 'network' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
              {errorContext.type === 'network' ? <WifiOff className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
            </div>
            <div className="flex-1 w-full overflow-hidden">
              <h3 className={`font-bold text-sm ${errorContext.type === 'network' ? 'text-amber-800' : 'text-red-800'}`}>
                {errorContext.title}
              </h3>
              <p className={`text-sm mt-1 leading-relaxed ${errorContext.type === 'network' ? 'text-amber-700' : 'text-red-700'}`}>
                {errorContext.message}
              </p>
              
              {errorContext.type === 'network' ? (
                <button onClick={handleSubmit(onSubmit, onError)} disabled={isSubmitting} className="mt-4 flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Reintentar envío (Tus datos están seguros)
                </button>
              ) : (
                <button onClick={() => setErrorContext(null)} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
                  Modificar RUT ingresado
                </button>
              )}

              <div className={`mt-4 border-t pt-3 ${errorContext.type === 'network' ? 'border-amber-200/60' : 'border-red-200/60'}`}>
                <button type="button" onClick={() => setIsITOpen(!isITOpen)} className={`flex items-center gap-2 text-xs font-semibold hover:opacity-70 transition-opacity outline-none ${errorContext.type === 'network' ? 'text-amber-700' : 'text-red-700'}`}>
                  <Terminal className="h-4 w-4" /> Ver detalle para soporte TI <ChevronDown className={`h-4 w-4 transition-transform ${isITOpen ? "rotate-180" : ""}`} />
                </button>
                {isITOpen && (
                  <div className="mt-3 p-3 bg-slate-900 rounded-lg overflow-x-auto animate-in slide-in-from-top-2 duration-200">
                    <code className="text-[11px] text-green-400 font-mono text-left block whitespace-pre">{errorContext.stackTrace}</code>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">RUT del Funcionario</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CreditCard className="h-4 w-4 text-slate-400" />
            </div>
            {/* INYECTAMOS EL FORMATEADOR AL INPUT */}
            <input 
              onChange={(e) => {
                e.target.value = formatearRUT(e.target.value);
                rutOnChange(e);
              }}
              onBlur={rutOnBlur}
              name={rutName}
              ref={rutRef}
              disabled={isSubmitting} 
              placeholder="Ej: 12.345.678-9" 
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all outline-none disabled:opacity-50 ${errors.rut ? "border-amber-500 bg-amber-50/50 focus:ring-amber-500/20" : "border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-blue-500/20"}`} 
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
            <input {...register("nombre")} disabled={isSubmitting} placeholder="Ej: Camila Soto" className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all outline-none disabled:opacity-50 ${errors.nombre ? "border-amber-500 bg-amber-50/50 focus:ring-amber-500/20" : "border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-blue-500/20"}`} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Departamento</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-4 w-4 text-slate-400" />
            </div>
            <select {...register("departamento")} disabled={isSubmitting} className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all outline-none appearance-none disabled:opacity-50 ${errors.departamento ? "border-amber-500 bg-amber-50/50 focus:ring-amber-500/20" : "border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-blue-500/20"}`}>
              <option value="">Seleccione un área...</option>
              <option value="Recursos Humanos">Recursos Humanos</option>
              <option value="Finanzas">Finanzas</option>
              <option value="Soporte TI">Soporte TI</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full mt-2 bg-blue-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-all flex justify-center items-center gap-2">
          {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin" /> Procesando...</> : "Procesar Solicitud"}
        </button>
      </form>
    </div>
  );
}