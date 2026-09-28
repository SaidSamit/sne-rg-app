"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, LayoutDashboard, FileText, Users, Settings, Search, ChevronRight, Bell } from "lucide-react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Cambia el título final de la ruta según dónde estemos
  const getTitle = () => {
    if (pathname === '/nueva-solicitud') return 'Nueva Solicitud';
    if (pathname === '/directorio') return 'Directorio Corporativo';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-(family-name:--font-geist-sans)">
      
      {/* SIDEBAR LATERAL */}
      <aside className="w-64 bg-[#0f172a] text-slate-400 hidden md:flex flex-col">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/50 bg-[#0b1120]">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-white tracking-tight">CorpNet.</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1">
          <Link href="/" className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === '/' ? 'text-white bg-blue-600/10 border border-blue-500/20' : 'hover:text-white hover:bg-slate-800'}`}>
            <LayoutDashboard className={`w-4 h-4 ${pathname === '/' ? 'text-blue-500' : ''}`} /> 
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link href="/nueva-solicitud" className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === '/nueva-solicitud' ? 'text-white bg-blue-600/10 border border-blue-500/20' : 'hover:text-white hover:bg-slate-800'}`}>
            <FileText className={`w-4 h-4 ${pathname === '/nueva-solicitud' ? 'text-blue-500' : ''}`} /> 
            <span className="text-sm font-medium">Nueva Solicitud</span>
          </Link>
          <Link href="/directorio" className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === '/directorio' ? 'text-white bg-blue-600/10 border border-blue-500/20' : 'hover:text-white hover:bg-slate-800'}`}>
            <Users className={`w-4 h-4 ${pathname === '/directorio' ? 'text-blue-500' : ''}`} /> 
            <span className="text-sm font-medium">Directorio</span>
          </Link>
        </nav>

        {/* Botón de Configuración abajo */}
        <div className="p-4 border-t border-slate-800/50">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors outline-none">
            <Settings className="w-4 h-4" /> <span className="text-sm font-medium">Configuración</span>
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Inicio</span> <ChevronRight className="w-4 h-4 text-slate-400" />
            <span>Recursos Humanos</span> <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-medium text-slate-900">{getTitle()}</span>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center gap-2 text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
              <Search className="w-4 h-4" /> <span className="text-xs">Buscar...</span>
            </div>
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="w-px h-6 bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-700 leading-none">Camila Soto</p>
                <p className="text-xs text-slate-500 mt-1">Administrativa RRHH</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 font-bold text-sm flex items-center justify-center border border-blue-100">CS</div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}