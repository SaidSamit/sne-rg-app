import FormularioAdministrativo from "./FormularioAdministrativo";
import { ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-(family-name:--font-geist-sans)">
      {/* Barra de navegación superior simulada */}
      <nav className="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <ShieldCheck className="text-white w-5 h-5" />
        </div>
        <span className="font-semibold text-slate-800 tracking-tight">
          Intranet Corporativa
        </span>
      </nav>

      {/* Contenedor central ajustado */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
          {/* Acento de color superior */}
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 to-indigo-600"></div>
          
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Ingreso de Solicitud
            </h1>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              Complete los datos del funcionario. El sistema cuenta con guardado automático para prevenir pérdida de información.
            </p>
          </header>

          <FormularioAdministrativo />
        </div>
      </div>
    </main>
  );
}