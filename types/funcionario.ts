export type EstadoFuncionario = "activo" | "suspendido";

export interface Funcionario {
  id: string;
  rut: string;
  nombre: string;
  departamento: string;
  estado: EstadoFuncionario;
  nombreArchivo?: string;
  tamanoArchivoMB?: number;
  fechaRegistro: string;
  fechaActualizacion?: string;
}

export type Departamento = 
  | "Recursos Humanos" 
  | "Finanzas" 
  | "Soporte TI" 
  | "Operaciones" 
  | "Logística";

export interface FormularioFuncionarioValues {
  rut: string;
  nombre: string;
  departamento: string;
  archivo?: {
    nombre: string;
    tamanoMB: number;
  } | null;
}

export interface ErrorContextSNE {
  type: "network" | "duplicate" | "file_size" | "validation";
  title: string;
  message: string;
  fieldTarget?: string;
  stackTrace: string;
  sugerencia?: string;
}
