/**
 * Representa una tarea dentro del gestor.
 * - id: identificador único generado por el servicio.
 * - title: título descriptivo de la tarea (no puede estar vacío).
 * - completed: estado de cumplimiento de la tarea.
 * - createdAt: fecha de creación de la tarea.
 */
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

/**
 * Datos necesarios para registrar una nueva tarea.
 * Se separa del tipo Task porque el id, el estado y la fecha
 * los asigna el propio servicio, no quien crea la tarea.
 */
export type NewTaskInput = Pick<Task, "title">;
