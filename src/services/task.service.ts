import { randomUUID } from "node:crypto";
import { Task, NewTaskInput } from "../models/task";
import { delay } from "../utils/delay";

/**
 * Error específico para cuando una tarea no existe.
 * Extiende Error para conservar stack trace y poder
 * distinguirlo de otros errores con "instanceof".
 */
export class TaskNotFoundError extends Error {
  constructor(id: string) {
    super(`No existe ninguna tarea con el identificador "${id}".`);
    this.name = "TaskNotFoundError";
  }
}

/**
 * Error específico para datos de entrada inválidos (por ejemplo,
 * un título vacío al registrar una tarea).
 */
export class InvalidTaskDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidTaskDataError";
  }
}

// Tiempo simulado (ms) que "tarda" cada operación, como si accediera a una base de datos.
const SIMULATED_LATENCY_MS = 150;

/**
 * Servicio encargado de gestionar las tareas en memoria.
 * Toda la lógica de negocio (validaciones, búsquedas, cambios de estado)
 * vive aquí, separada de la interfaz de consola en index.ts.
 */
export class TaskService {
  private tasks: Task[] = [];

  /**
   * Registra una nueva tarea. Lanza InvalidTaskDataError si el título
   * está vacío o compuesto únicamente por espacios en blanco.
   */
  async addTask(input: NewTaskInput): Promise<Task> {
    await delay(SIMULATED_LATENCY_MS);

    const title = input.title.trim();
    if (title.length === 0) {
      throw new InvalidTaskDataError(
        "El título de la tarea no puede estar vacío."
      );
    }

    const newTask: Task = {
      id: randomUUID(),
      title,
      completed: false,
      createdAt: new Date(),
    };

    this.tasks.push(newTask);
    return newTask;
  }

  /**
   * Devuelve todas las tareas registradas, en el orden en que se crearon.
   */
  async getAllTasks(): Promise<Task[]> {
    await delay(SIMULATED_LATENCY_MS);
    return [...this.tasks];
  }

  /**
   * Busca una tarea por su identificador.
   * Lanza TaskNotFoundError si no existe ninguna tarea con ese id.
   */
  async getTaskById(id: string): Promise<Task> {
    await delay(SIMULATED_LATENCY_MS);

    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new TaskNotFoundError(id);
    }
    return task;
  }

  /**
   * Marca una tarea como completada.
   * Lanza TaskNotFoundError si el identificador no corresponde a ninguna tarea.
   */
  async completeTask(id: string): Promise<Task> {
    await delay(SIMULATED_LATENCY_MS);

    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new TaskNotFoundError(id);
    }

    task.completed = true;
    return task;
  }
}
