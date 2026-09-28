// Archivo: app/directorio/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

export default function Directorio() {
  const [registros, setRegistros] = useState<any[]>([]);

  // Al cargar la página, lee la base de datos simulada
  useEffect(() => {
    const db = JSON.parse(localStorage.getItem("sne-rg-db") || "[]");
    setRegistros(db);
  }, []);

  const eliminarRegistro = (id: number) => {
    if(confirm("¿Está seguro de eliminar este registro?")) {
      const nuevaDB = registros.filter(r => r.id !== id);
      localStorage.setItem("sne-rg-db", JSON.stringify(nuevaDB));
      setRegistros(nuevaDB);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Directorio Corporativo</h1>
        <p className="text-slate-500 text-sm mt-2">Registros de funcionarios guardados.</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
              <th className="p-4 font-medium">RUT</th>
              <th className="p-4 font-medium">Nombre Completo</th>
              <th className="p-4 font-medium">Departamento</th>
              <th className="p-4 text-right font-medium">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {registros.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500 text-sm">No hay registros.</td></tr>
            ) : (
              registros.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-700">{reg.rut}</td>
                  <td className="p-4 text-sm text-slate-600">{reg.nombre}</td>
                  <td className="p-4 text-sm text-slate-600">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">{reg.departamento}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => eliminarRegistro(reg.id)} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}