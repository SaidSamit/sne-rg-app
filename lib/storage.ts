import { Funcionario, FormularioFuncionarioValues } from "@/types/funcionario";

const DB_KEY = "sne-rg-db";
const DRAFT_KEY = "sne-rg-draft";
const DRAFT_TIMESTAMP_KEY = "sne-rg-draft-timestamp";

export const SEED_DATA: Funcionario[] = [
  {
    id: "1",
    rut: "15.423.891-2",
    nombre: "Camila Soto González",
    departamento: "Recursos Humanos",
    estado: "activo",
    nombreArchivo: "Contrato_CamilaSoto.pdf",
    tamanoArchivoMB: 2.1,
    fechaRegistro: "15/03/2026",
  },
  {
    id: "2",
    rut: "18.912.443-K",
    nombre: "Rodrigo Morales Pinto",
    departamento: "Finanzas",
    estado: "activo",
    nombreArchivo: "Certificado_Morales.pdf",
    tamanoArchivoMB: 1.4,
    fechaRegistro: "20/03/2026",
  },
  {
    id: "3",
    rut: "12.876.543-7",
    nombre: "Lorena Valenzuela Ortiz",
    departamento: "Soporte TI",
    estado: "suspendido",
    fechaRegistro: "22/03/2026",
  },
];

class StorageService {
  private cache: Funcionario[] | null = null;

  private isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  // --- CRUD FUNCIONARIOS ---

  public getFuncionarios(): Funcionario[] {
    if (!this.isBrowser()) return SEED_DATA;
    if (this.cache !== null) return this.cache;

    try {
      const raw = localStorage.getItem(DB_KEY);
      if (!raw) {
        this.cache = [...SEED_DATA];
        this.saveFuncionarios(SEED_DATA);
        return this.cache;
      }
      const parsed = JSON.parse(raw) as Funcionario[];
      this.cache = parsed.map((item) => ({
        ...item,
        estado: item.estado || "activo",
      }));
      return this.cache;
    } catch {
      this.cache = [...SEED_DATA];
      return this.cache;
    }
  }

  public saveFuncionarios(items: Funcionario[]): void {
    if (!this.isBrowser()) return;
    try {
      this.cache = items;
      localStorage.setItem(DB_KEY, JSON.stringify(items));
      window.dispatchEvent(new Event("sne-rg-db-change"));
    } catch {
      console.warn("No fue posible guardar en localStorage");
    }
  }

  public getFuncionarioById(id: string): Funcionario | undefined {
    return this.getFuncionarios().find((f) => f.id === id);
  }

  public getFuncionarioByRut(rut: string): Funcionario | undefined {
    return this.getFuncionarios().find((f) => f.rut.trim() === rut.trim());
  }

  public createFuncionario(
    data: Omit<Funcionario, "id" | "fechaRegistro" | "estado"> & { estado?: "activo" | "suspendido" }
  ): Funcionario {
    const list = [...this.getFuncionarios()];
    const nuevo: Funcionario = {
      ...data,
      estado: data.estado || "activo",
      id: Date.now().toString(),
      fechaRegistro: new Date().toLocaleDateString("es-CL"),
    };
    list.unshift(nuevo);
    this.saveFuncionarios(list);
    return nuevo;
  }

  public updateFuncionario(
    id: string,
    cambios: Partial<Omit<Funcionario, "id" | "fechaRegistro">>
  ): Funcionario | null {
    const list = [...this.getFuncionarios()];
    const index = list.findIndex((f) => f.id === id);
    if (index === -1) return null;

    const actualizado: Funcionario = {
      ...list[index],
      ...cambios,
      fechaActualizacion: new Date().toLocaleDateString("es-CL"),
    };
    list[index] = actualizado;
    this.saveFuncionarios(list);
    return actualizado;
  }

  public toggleEstadoFuncionario(id: string): Funcionario | null {
    const list = [...this.getFuncionarios()];
    const index = list.findIndex((f) => f.id === id);
    if (index === -1) return null;

    const actual = list[index];
    const nuevoEstado = actual.estado === "suspendido" ? "activo" : "suspendido";
    const actualizado: Funcionario = {
      ...actual,
      estado: nuevoEstado,
      fechaActualizacion: new Date().toLocaleDateString("es-CL"),
    };
    list[index] = actualizado;
    this.saveFuncionarios(list);
    return actualizado;
  }

  public deleteFuncionario(id: string): Funcionario | null {
    const list = [...this.getFuncionarios()];
    const target = list.find((f) => f.id === id);
    if (!target) return null;

    const filtrados = list.filter((f) => f.id !== id);
    this.saveFuncionarios(filtrados);
    return target;
  }

  // --- MANEJO DE BORRADORES (SNE-RG) ---

  public getDraft(): Partial<FormularioFuncionarioValues> | null {
    if (!this.isBrowser()) return null;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  public saveDraft(draft: Partial<FormularioFuncionarioValues>): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      localStorage.setItem(DRAFT_TIMESTAMP_KEY, new Date().toLocaleTimeString("es-CL"));
      window.dispatchEvent(new Event("sne-rg-draft-change"));
    } catch {
      console.warn("No fue posible guardar el borrador");
    }
  }

  public getDraftTimestamp(): string | null {
    if (!this.isBrowser()) return null;
    try {
      return localStorage.getItem(DRAFT_TIMESTAMP_KEY);
    } catch {
      return null;
    }
  }

  public clearDraft(): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(DRAFT_TIMESTAMP_KEY);
      window.dispatchEvent(new Event("sne-rg-draft-change"));
    } catch {
      // Ignorar
    }
  }
}

export const storage = new StorageService();

export function subscribeToDB(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("sne-rg-db-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("sne-rg-db-change", callback);
    window.removeEventListener("storage", callback);
  };
}

export function getDBSnapshot(): Funcionario[] {
  return storage.getFuncionarios();
}

export function getDBServerSnapshot(): Funcionario[] {
  return SEED_DATA;
}
