/**
 * Devuelve el primer archivo elegido en un <input type="file">, o null si no
 * se eligió ninguno. Evita repetir `event.target.files[0]` con `event: any`.
 */
export function archivoSeleccionado(evento: Event): File | null {
  const input = evento.target as HTMLInputElement | null;
  return input?.files?.[0] ?? null;
}
