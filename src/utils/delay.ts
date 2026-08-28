/**
 * Devuelve una promesa que se resuelve luego de "ms" milisegundos.
 * Se usa para simular operaciones asíncronas (por ejemplo, como si
 * las tareas se guardaran en una base de datos o una API remota),
 * lo que permite practicar async/await y el manejo de errores
 * en operaciones que no son instantáneas.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
