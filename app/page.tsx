// Archivo: app/page.tsx
import { TrendingUp, DollarSign, Activity } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Impacto del Sistema SNE-RG</h1>
        <p className="text-slate-500 text-sm mt-2">Métricas de rendimiento operativo y ahorro en soporte de Nivel 1.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Tickets TI Prevenidos</p>
              <h3 className="text-3xl font-bold text-slate-800">142</h3>
            </div>
            <div className="bg-green-100 p-2 rounded-lg text-green-600"><TrendingUp className="w-5 h-5" /></div>
          </div>
          <p className="text-xs text-green-600 mt-4 font-medium">+12% respecto al mes anterior</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Tasa de Recuperación</p>
              <h3 className="text-3xl font-bold text-slate-800">98.5%</h3>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Activity className="w-5 h-5" /></div>
          </div>
          <p className="text-xs text-slate-500 mt-4">Usuarios que reintentan sin abandonar</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Ahorro Estimado Mensual</p>
              <h3 className="text-3xl font-bold text-slate-800">$450.000</h3>
            </div>
            <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><DollarSign className="w-5 h-5" /></div>
          </div>
          <p className="text-xs text-slate-500 mt-4">Calculado en horas de ingenieros de soporte</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <h3 className="text-xl font-bold mb-2 relative z-10">Arquitectura Tolerante a Fallos</h3>
        <p className="text-slate-400 max-w-2xl text-sm relative z-10">
          El sistema SNE-RG V2 aísla los dominios de falla aislando la vista del usuario final del error del servidor, protegiendo los datos en caché local antes de su transmisión.
        </p>
        <div className="mt-6 flex gap-4 relative z-10">
          <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-sm font-mono text-green-400">Status: En Línea</div>
          <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-sm font-mono text-blue-400">Ping: 14ms</div>
        </div>
      </div>
    </div>
  );
}