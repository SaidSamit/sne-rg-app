import FormularioAdministrativo from "./FormularioAdministrativo";
import { 
  ShieldCheck, LayoutDashboard, FileText, History, 
  Settings, Bell, Search, ChevronRight 
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex font-(family-name:--font-geist-sans)">
      
      {/* 1. SIDEBAR LATERAL (Menú Corporativo) */}
      <aside className="w-64 bg-slate-900 text-slate-400 hidden md:flex flex-col border-r border-slate-800">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800 bg-slate-950/50">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-white tracking-tight">CorpNet.</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors">
            <LayoutDashboard className="w-4 h-4" /> <span className="text-sm font-medium">Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white bg-blue-600/10 border border-blue-500/20 transition-colors">
            <FileText className="w-4 h-4 text-blue-500" /> <span className="text-sm font-medium">Nueva Solicitud</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors">
            <History className="w-4 h-4" /> <span className="text-sm font-medium">Historial</span>
          </a>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:text-white hover:bg-slate-800 transition-colors">
            <Settings className="w-4 h-4" /> <span className="text-sm font-medium">Configuración</span>
          </a>
        </div>
      </aside>

      {/* 2. ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP BAR (Buscador y Perfil) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Inicio</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span>Recursos Humanos</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-medium text-slate-900">Nueva Solicitud</span>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center gap-2 text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
              <Search className="w-4 h-4" />
              <span className="text-xs">Buscar...</span>
            </div>
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-px h-6 bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-700 leading-none">Camila Soto</p>
                <p className="text-xs text-slate-500 mt-1">Administrativa RRHH</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm">
                CS
              </div>
            </div>
          </div>
        </header>
        
        {/* CONTENIDO DE LA PÁGINA */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                  Ingreso de Solicitud Operativa
                </h1>
                <p className="text-slate-500 text-sm mt-2">
                  Complete los datos del funcionario. El sistema SNE-RG protege su información ante interrupciones de red.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Sistema Online
              </div>
            </div>

            {/* CONTENEDOR DEL FORMULARIO */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 to-indigo-600"></div>
              
              <FormularioAdministrativo />
              
            </div>

            {/* FOOTER DEL SISTEMA */}
            <div className="mt-8 text-center text-xs text-slate-400">
              <p>SNE-RG V2.0 © 2026 CorpNet. Todos los derechos reservados.</p>
              <p className="mt-1">Normativa ISO/IEC 25010 de Usabilidad y Tolerancia a Fallos.</p>
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}