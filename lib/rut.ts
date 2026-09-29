/**
 * Utilidades para formateo y validación de RUT chileno (Módulo 11)
 */

export function limpiarRut(rut: string): string {
  return rut.replace(/[^0-9kK]/g, "").toUpperCase();
}

export function formatearRut(valor: string): string {
  const limpio = limpiarRut(valor);
  if (limpio.length === 0) return "";
  if (limpio.length <= 1) return limpio;

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);

  // Formatear cuerpo con separador de miles '.'
  const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${cuerpoFormateado}-${dv}`;
}

export function validarRutChileno(rutCompleto: string): boolean {
  const limpio = limpiarRut(rutCompleto);
  if (limpio.length < 8 || limpio.length > 9) return false;

  const cuerpo = limpio.slice(0, -1);
  const dvIngresado = limpio.slice(-1);

  // Validar que el cuerpo sea puramente numérico
  if (!/^\d+$/.test(cuerpo)) return false;

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const resto = suma % 11;
  const dvCalculadoNum = 11 - resto;

  let dvEsperado = "";
  if (dvCalculadoNum === 11) dvEsperado = "0";
  else if (dvCalculadoNum === 10) dvEsperado = "K";
  else dvEsperado = dvCalculadoNum.toString();

  return dvIngresado === dvEsperado;
}
