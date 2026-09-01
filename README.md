# Gestor de Tareas CLI

Aplicación de consola construida con **Node.js** y **TypeScript** para registrar, consultar, buscar y completar tareas de forma interactiva desde la terminal.

## Descripción

El proyecto implementa un gestor de tareas en memoria con una interfaz de menú en consola. Permite:

- Registrar una nueva tarea.
- Consultar todas las tareas registradas.
- Buscar una tarea por su identificador.
- Marcar una tarea como completada.
- Ver mensajes de error claros y comprensibles cuando algo sale mal (título vacío, tarea inexistente, etc.).

El proyecto está organizado de forma modular, separando el modelo de datos, la lógica de negocio (servicio), las utilidades y la interfaz de consola, y usa tipado estricto de TypeScript, `async/await`, manejo de errores con `try/catch` y variables de entorno para su configuración.

## Requisitos

- [Node.js](https://nodejs.org/) v18 o superior (probado con Node v22).
- [pnpm](https://pnpm.io/) como gestor de paquetes.

Para instalar pnpm si no lo tienes:

npm install -g pnpm

## Instalación

1. Clona el repositorio o descarga el proyecto.
2. Instala las dependencias:

   pnpm install

3. Crea tu archivo de variables de entorno a partir del ejemplo incluido:

   cp .env.example .env

   El archivo `.env` no se publica ni se sube al repositorio (está en `.gitignore`), ya que es el lugar donde irían configuraciones específicas de cada entorno.

## Variables de entorno

| Variable   | Descripción                                          | Valor por defecto     |
| ---------- | ----------------------------------------------------- | ---------------------- |
| `APP_NAME` | Nombre de la aplicación, mostrado en el menú principal | `Gestor de Tareas CLI` |
| `APP_ENV`  | Entorno de ejecución (`development`, `production`, `test`) | `development`     |

## Comandos disponibles

| Comando          | Descripción                                                   |
| ----------------- | -------------------------------------------------------------- |
| `pnpm dev`         | Ejecuta la aplicación directamente desde TypeScript (con `tsx`), ideal para desarrollo. |
| `pnpm build`       | Compila el proyecto TypeScript a JavaScript dentro de `dist/`. |
| `pnpm start`       | Ejecuta la versión ya compilada (`dist/index.js`). Requiere haber corrido `pnpm build` antes. |
| `pnpm typecheck`   | Verifica los tipos de todo el proyecto sin generar archivos de salida. |

## Uso

Para iniciar la aplicación en modo desarrollo:
pnpm dev

Se mostrará un menú interactivo en la terminal:
========================================
  Gestor de Tareas CLI (development)
========================================
1. Registrar una tarea
2. Consultar todas las tareas
3. Buscar una tarea por identificador
4. Marcar una tarea como completada
5. Salir
----------------------------------------

Elige una opción (1-5)

Escribe el número de la opción deseada y sigue las instrucciones en pantalla. Todas las tareas se almacenan en memoria mientras el programa está en ejecución; al cerrar la aplicación, los datos se pierden (no hay persistencia en disco ni en base de datos).

## Estructura del proyecto
backend-frameworks/
├── src/
│   ├── config/
│   │   └── env.ts               # Carga y validación de variables de entorno
│   ├── models/
│   │   └── task.ts              # Interfaz Task y tipo NewTaskInput
│   ├── services/
│   │   └── task.service.ts      # Lógica de negocio, validaciones y errores personalizados
│   ├── utils/
│   │   └── delay.ts             # Utilidad para simular operaciones asíncronas
│   └── index.ts                 # Punto de entrada: menú e interacción por consola
├── .env.example                 # Variables de entorno de ejemplo (sin datos sensibles)
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── preguntas-cierre.md          # Respuestas a las preguntas de cierre del ejercicio
├── README.md
└── tsconfig.jso

## Funcionalidades y validaciones

- **Registrar tarea**: valida que el título no esté vacío (ni compuesto solo por espacios); si lo está, lanza `InvalidTaskDataError`.
- **Buscar / completar tarea**: valida que el identificador exista; si no, lanza `TaskNotFoundError`.
- **Errores durante operaciones asíncronas**: cualquier error no controlado es capturado y mostrado de forma legible sin detener la aplicación.
- Uso estricto de tipos (`strict: true` en `tsconfig.json`), evitando el tipo `any`.

## Verificación

Antes de publicar cambios, se recomienda ejecutar:
pnpm typecheck   # sin errores de TypeScript
pnpm dev         # probar el flujo completo en la termina

## Historial de cambios

Consulta el historial de commits del repositorio para ver el avance del desarrollo.
