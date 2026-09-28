import FormularioAdministrativo from "../FormularioAdministrativo";

export default function NuevaSolicitud() {
  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-300 flex flex-col min-h-full">
      
      {/* Cabecera con título y Etiqueta Online */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Ingreso de Solicitud Operativa
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Complete los datos del funcionario. El sistema SNE-RG protege su información ante interrupciones de red.
          </p>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium whitespace-nowrap">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Sistema Online
        </div>
      </div>

      {/* CONTENEDOR DEL FORMULARIO */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden mb-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        <FormularioAdministrativo />
      </div>

      {/* FOOTER CORPORATIVO */}
      <div className="mt-auto text-center text-xs text-slate-400 pb-4">
        <p>SNE-RG V2.0 © 2026 CorpNet. Todos los derechos reservados.</p>
        <p className="mt-1">Normativa ISO/IEC 25010 de Usabilidad y Tolerancia a Fallos.</p>
      </div>

    </div>
  );
}