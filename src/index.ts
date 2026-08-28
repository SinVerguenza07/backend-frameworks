import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { config } from "./config/env";
import {
  TaskService,
  TaskNotFoundError,
  InvalidTaskDataError,
} from "./services/task.service";
import { Task } from "./models/task";

const rl = readline.createInterface({ input, output });
const taskService = new TaskService();

const MENU = `
========================================
  ${config.appName} (${config.appEnv})
========================================
1. Registrar una tarea
2. Consultar todas las tareas
3. Buscar una tarea por identificador
4. Marcar una tarea como completada
5. Salir
----------------------------------------
`;

/** Da un formato legible a una tarea para imprimirla en consola. */
function formatTask(task: Task): string {
  const estado = task.completed ? "Completada" : "Pendiente";
  return `- [${estado}] (${task.id}) "${task.title}" — creada: ${task.createdAt.toLocaleString()}`;
}

/** Imprime un mensaje de error de forma consistente y comprensible. */
function printError(error: unknown): void {
  if (error instanceof TaskNotFoundError || error instanceof InvalidTaskDataError) {
    console.error(`\n⚠️  ${error.name}: ${error.message}\n`);
  } else if (error instanceof Error) {
    console.error(`\n❌ Ocurrió un error inesperado: ${error.message}\n`);
  } else {
    console.error(`\n❌ Ocurrió un error inesperado desconocido.\n`);
  }
}

async function handleAddTask(): Promise<void> {
  const title = await rl.question("Título de la nueva tarea: ");
  try {
    const task = await taskService.addTask({ title });
    console.log(`\n✅ Tarea registrada correctamente:\n${formatTask(task)}\n`);
  } catch (error) {
    printError(error);
  }
}

async function handleListTasks(): Promise<void> {
  try {
    const tasks = await taskService.getAllTasks();
    if (tasks.length === 0) {
      console.log("\nℹ️  Todavía no hay tareas registradas.\n");
      return;
    }
    console.log(`\nTareas registradas (${tasks.length}):`);
    tasks.forEach((task) => console.log(formatTask(task)));
    console.log("");
  } catch (error) {
    printError(error);
  }
}

async function handleFindTask(): Promise<void> {
  const id = await rl.question("Identificador de la tarea a buscar: ");
  try {
    const task = await taskService.getTaskById(id.trim());
    console.log(`\n🔎 Tarea encontrada:\n${formatTask(task)}\n`);
  } catch (error) {
    printError(error);
  }
}

async function handleCompleteTask(): Promise<void> {
  const id = await rl.question("Identificador de la tarea a completar: ");
  try {
    const task = await taskService.completeTask(id.trim());
    console.log(`\n✅ Tarea marcada como completada:\n${formatTask(task)}\n`);
  } catch (error) {
    printError(error);
  }
}

/** Bucle principal de la aplicación: muestra el menú y despacha la opción elegida. */
async function main(): Promise<void> {
  let exit = false;

  while (!exit) {
    console.log(MENU);
    const option = (await rl.question("Elige una opción (1-5): ")).trim();

    switch (option) {
      case "1":
        await handleAddTask();
        break;
      case "2":
        await handleListTasks();
        break;
      case "3":
        await handleFindTask();
        break;
      case "4":
        await handleCompleteTask();
        break;
      case "5":
        exit = true;
        console.log("\n👋 ¡Hasta luego!\n");
        break;
      default:
        console.log("\n⚠️  Opción no válida. Elige un número del 1 al 5.\n");
    }
  }

  rl.close();
}

main()
  .catch((error) => {
    printError(error);
    process.exitCode = 1;
  })
  .finally(() => {
    rl.close();
  });
