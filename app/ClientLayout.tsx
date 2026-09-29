"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, LayoutDashboard, FileText, Users, Settings, Search, ChevronRight, Bell, Menu, X, TrendingDown } from "lucide-react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  const getTitle = () => {
    if (pathname === '/nueva-solicitud') return 'Nueva Solicitud';
    if (pathname === '/directorio') return 'Directorio Corporativo';
    if (pathname === '/ahorro-ti') return 'Ahorro TI & ROI';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-[family-name:var(--font-geist-sans)]">
      
      {/* 1. OVERLAY MÓVIL (Fondo oscuro borroso cuando el menú está abierto) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 2. SIDEBAR LATERAL (Dinámico para Mobile y Desktop) */}
      <aside className={`fixed md:sticky top-0 h-screen w-64 bg-[#0f172a] text-slate-400 flex flex-col z-50 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/50 bg-[#0b1120] shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-white tracking-tight">CorpNet.</span>
          </div>
          {/* Botón para cerrar en móvil */}
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/" className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === '/' ? 'text-white bg-blue-600/10 border border-blue-500/20' : 'hover:text-white hover:bg-slate-800'}`}>
            <LayoutDashboard className={`w-4 h-4 ${pathname === '/' ? 'text-blue-500' : ''}`} /> 
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/nueva-solicitud" className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === '/nueva-solicitud' ? 'text-white bg-blue-600/10 border border-blue-500/20' : 'hover:text-white hover:bg-slate-800'}`}>
            <FileText className={`w-4 h-4 ${pathname === '/nueva-solicitud' ? 'text-blue-500' : ''}`} /> 
            <span className="text-sm font-medium">Nueva Solicitud</span>
          </Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/directorio" className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === '/directorio' ? 'text-white bg-blue-600/10 border border-blue-500/20' : 'hover:text-white hover:bg-slate-800'}`}>
            <Users className={`w-4 h-4 ${pathname === '/directorio' ? 'text-blue-500' : ''}`} /> 
            <span className="text-sm font-medium">Directorio</span>
          </Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/ahorro-ti" className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === '/ahorro-ti' ? 'text-white bg-blue-600/10 border border-blue-500/20' : 'hover:text-white hover:bg-slate-800'}`}>
            <TrendingDown className={`w-4 h-4 ${pathname === '/ahorro-ti' ? 'text-emerald-400' : ''}`} /> 
            <span className="text-sm font-medium">Ahorro TI & ROI</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800/50 shrink-0">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors outline-none">
            <Settings className="w-4 h-4" /> <span className="text-sm font-medium">Configuración</span>
          </button>
        </div>
      </aside>

      {/* 3. ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 shrink-0">
          
          {/* Lado Izquierdo (Botón de Menú y Migas de pan) */}
          <div className="flex items-center gap-3">
            {/* El famoso "Hamburger Button" que solo se ve en celulares */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1.5 -ml-1 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Ajustamos las migas de pan para que no se amontonen en el celular */}
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-500">
              <span className="hidden sm:inline">Inicio</span> 
              <ChevronRight className="hidden sm:inline w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Recursos Humanos</span> 
              <ChevronRight className="hidden sm:inline w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-900">{getTitle()}</span>
            </div>
          </div>

          {/* Lado Derecho (Perfil) */}
          <div className="flex items-center gap-4 sm:gap-5">
            <Link
              href="/directorio"
              className="hidden md:flex items-center gap-2 text-slate-400 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" /> <span className="text-xs">Buscar funcionario en directorio...</span>
            </Link>

            {/* Campana de Notificaciones Interactiva SNE-RG */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  if (!isNotificationsOpen) setUnreadNotifications(0);
                }}
                className="relative text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg"
                title="Notificaciones de Tolerancia a Fallos SNE-RG"
                aria-label="Abrir notificaciones"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                    <span className="text-xs font-bold text-slate-800">Alertas de Intranet SNE-RG</span>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                      En Línea
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                      <p className="font-semibold text-slate-800">Protección de Borrador Activa</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">Tus formularios están respaldados en LocalStorage en vivo.</p>
                    </div>
                    <div className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                      <p className="font-semibold text-slate-800">142 Tickets Evitados</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">La mesa de ayuda opera con 40% menos incidentes.</p>
                    </div>
                    <div className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                      <p className="font-semibold text-slate-800">Cuota de Archivos 5.0 MB</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">Filtro de optimización de PDFs enlazado a la intranet.</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsNotificationsOpen(false)}
                    className="w-full mt-3 text-center text-[11px] font-semibold text-blue-600 hover:text-blue-700 py-1"
                  >
                    Cerrar notificaciones
                  </button>
                </div>
              )}
            </div>

            <div className="hidden sm:block w-px h-6 bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-700 leading-none">Camila Soto</p>
                <p className="text-xs text-slate-500 mt-1">Administrativa RRHH</p>
              </div>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-50 text-blue-700 font-bold text-sm flex items-center justify-center border border-blue-100 shrink-0">CS</div>
            </div>
          </div>
        </header>
        
        {/* CONTENIDO DE LAS PÁGINAS */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}