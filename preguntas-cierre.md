# Preguntas de cierre

### ¿Cuál es la función de Node.js dentro de esta aplicación?

Node.js es el entorno de ejecución que permite correr JavaScript (y, en este caso, TypeScript compilado o transpilado) fuera del navegador. En este proyecto es quien ejecuta el programa en la terminal: lee la entrada del usuario mediante el módulo `node:readline/promises`, gestiona el bucle de eventos que hace posible usar `async/await`, da acceso a módulos nativos como `node:crypto` (para generar los identificadores de las tareas con `randomUUID`) y `node:process`, y finalmente interpreta el código JavaScript resultante de compilar los archivos `.ts`.

### ¿Qué ventajas ofrece TypeScript frente a JavaScript?

- **Tipado estático**: permite definir la forma exacta de los datos (como la interfaz `Task`) y detectar errores —por ejemplo, pasar un número donde se espera un `string`— antes de ejecutar el programa, en tiempo de compilación.
- **Autocompletado e inteligencia del editor**: al conocer los tipos, el editor puede sugerir propiedades, métodos y detectar errores mientras se escribe el código.
- **Documentación implícita**: las interfaces y tipos (`Task`, `NewTaskInput`, `AppConfig`) describen la forma de los datos sin necesidad de comentarios adicionales.
- **Refactorización más segura**: al cambiar una interfaz, el compilador señala automáticamente todos los lugares del código que quedan desactualizados.
- **Menos errores en producción**: muchos errores comunes de JavaScript (acceder a una propiedad inexistente, olvidar un `return`, mezclar tipos) se detectan antes de ejecutar la aplicación gracias a `strict: true` en `tsconfig.json`.

### ¿Para qué sirven las importaciones y exportaciones?

Las exportaciones (`export`) permiten que un módulo (un archivo `.ts`) declare qué partes de su código —funciones, clases, interfaces, constantes— pueden ser utilizadas desde otros archivos. Las importaciones (`import`) permiten que un archivo consuma ese código exportado por otro módulo. En este proyecto se usan para dividir responsabilidades en archivos independientes y luego conectarlos: por ejemplo, `src/index.ts` importa `TaskService` desde `src/services/task.service.ts`, que a su vez importa la interfaz `Task` desde `src/models/task.ts` y la función `delay` desde `src/utils/delay.ts`. Esto evita archivos gigantes con toda la lógica mezclada y facilita reutilizar, probar y mantener cada pieza por separado.

### ¿Qué responsabilidad tiene cada módulo del proyecto?

- **`src/config/env.ts`**: carga y valida las variables de entorno (nombre de la aplicación, entorno de ejecución) usando `dotenv`, y expone un objeto de configuración tipado (`AppConfig`) para el resto de la aplicación.
- **`src/models/task.ts`**: define la forma de los datos de una tarea mediante la interfaz `Task` y el tipo `NewTaskInput`, sin contener ninguna lógica.
- **`src/services/task.service.ts`**: contiene toda la lógica de negocio — registrar, listar, buscar y completar tareas —, las validaciones (título vacío, tarea inexistente) y las clases de error personalizadas (`TaskNotFoundError`, `InvalidTaskDataError`). Es la única parte del código que sabe "cómo" se almacenan y manipulan las tareas.
- **`src/utils/delay.ts`**: utilidad genérica y reutilizable que simula una espera asíncrona, usada por el servicio para imitar operaciones no instantáneas (como si se accediera a una base de datos).
- **`src/index.ts`**: es el punto de entrada de la aplicación. Se encarga únicamente de la interfaz de consola: mostrar el menú, leer la opción elegida, invocar al `TaskService` correspondiente y mostrar los resultados o errores de forma legible. No contiene lógica de negocio propia.

### ¿Cuál es la diferencia entre una operación síncrona y una asíncrona?

Una operación **síncrona** se ejecuta de forma inmediata y bloqueante: el programa espera a que termine antes de continuar con la siguiente línea de código, ocupando el hilo de ejecución mientras tanto. Una operación **asíncrona** se inicia, pero el resultado no está disponible de inmediato; el programa puede seguir haciendo otras cosas mientras esa operación se completa "en segundo plano" (por ejemplo, leer un archivo, esperar una respuesta de red o, como en este proyecto, la espera simulada por `delay()`), y el resultado se recibe más adelante mediante una `Promise`. En este proyecto, todos los métodos del `TaskService` (`addTask`, `getAllTasks`, `getTaskById`, `completeTask`) son asíncronos porque simulan una latencia con `delay()`, tal como ocurriría si en lugar de un arreglo en memoria se estuviera consultando una base de datos real.

### ¿Para qué se utilizan async y await?

`async` se usa para declarar que una función devuelve una `Promise` y que dentro de ella se pueden usar operaciones asíncronas con una sintaxis parecida a la del código síncrono. `await` se usa dentro de una función `async` para "pausar" la ejecución de esa función hasta que la `Promise` a su derecha se resuelva (o sea rechazada), sin bloquear el resto de la aplicación. En este proyecto, `async/await` se usa en cada método del `TaskService` para esperar el resultado de `delay()`, y en `src/index.ts` para esperar la respuesta del usuario (`rl.question`) y el resultado de cada operación del servicio, todo dentro de bloques `try/catch` que permiten capturar y manejar los errores de forma ordenada.

### ¿Por qué las variables sensibles no deben escribirse directamente en el código?

Escribir datos sensibles (contraseñas, claves de API, cadenas de conexión a bases de datos, tokens, etc.) directamente en el código fuente los expone a cualquier persona que tenga acceso al repositorio, incluyendo el historial de control de versiones, aunque luego se elimine la línea. Esto representa un riesgo de seguridad grave: si el repositorio es público (como en GitHub) o simplemente se comparte con más personas de las debidas, esos datos quedan comprometidos. Además, dificulta cambiar la configuración según el entorno (desarrollo, pruebas, producción) sin modificar el código. Por eso este proyecto usa variables de entorno cargadas desde un archivo `.env` (que se agrega a `.gitignore` y nunca se publica) y solo se versiona un archivo `.env.example` con nombres de variables y valores de ejemplo no sensibles, para que cualquier persona sepa qué configurar sin exponer datos reales.

### ¿Qué errores controla la aplicación y cómo responde ante ellos?

La aplicación controla, como mínimo, los siguientes casos:

- **Título vacío al registrar una tarea**: `TaskService.addTask` valida que el título, luego de quitar espacios en blanco, no esté vacío. Si lo está, lanza un `InvalidTaskDataError` con un mensaje explicativo.
- **Búsqueda de una tarea inexistente**: `TaskService.getTaskById` lanza un `TaskNotFoundError` cuando ningún identificador coincide con el proporcionado.
- **Intento de completar una tarea inexistente**: `TaskService.completeTask` también lanza `TaskNotFoundError` si el identificador no corresponde a ninguna tarea registrada.
- **Errores inesperados durante una operación asíncrona**: cualquier otro error no previsto (por ejemplo, uno que ocurra dentro de la promesa de `delay` o en el bucle principal) es capturado por los bloques `try/catch` en `src/index.ts` y por el `.catch()` que envuelve la función `main()`.

En todos los casos, la aplicación **no se detiene abruptamente ni muestra errores técnicos crudos**: cada operación de la interfaz de consola está envuelta en un `try/catch` que llama a la función `printError`, la cual distingue entre errores conocidos (`TaskNotFoundError`, `InvalidTaskDataError`) y errores inesperados, y muestra en todos los casos un mensaje claro y comprensible en la terminal antes de volver a mostrar el menú principal.
