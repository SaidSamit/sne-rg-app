import { z } from "zod";
import { validarRutChileno } from "./rut";

export const LIMITE_ARCHIVO_MB = 5;

export const funcionarioSchema = z.object({
  rut: z
    .string()
    .min(1, "El RUT es obligatorio")
    .refine((val) => validarRutChileno(val), {
      message: "RUT inválido. Verifique el formato (ej. 12.345.678-9) y el dígito verificador.",
    }),
  nombre: z
    .string()
    .min(3, "El nombre completo debe tener al menos 3 caracteres")
    .max(80, "El nombre no puede superar los 80 caracteres"),
  departamento: z
    .string()
    .min(1, "Debe seleccionar un departamento de destino"),
  archivo: z
    .object({
      nombre: z.string(),
      tamanoMB: z.number(),
    })
    .nullable()
    .optional(),
});

export const funcionarioEdicionSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre completo debe tener al menos 3 caracteres")
    .max(80, "El nombre no puede superar los 80 caracteres"),
  departamento: z
    .string()
    .min(1, "Debe seleccionar un departamento de destino"),
});

export type FuncionarioSchemaType = z.infer<typeof funcionarioSchema>;
export type FuncionarioEdicionSchemaType = z.infer<typeof funcionarioEdicionSchema>;
