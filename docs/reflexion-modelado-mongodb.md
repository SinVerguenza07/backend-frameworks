1. ¿Qué diferencia existe entre un documento, un esquema y un modelo?
Un documento es el registro real guardado en MongoDB. En mi proyecto, una tarea en la colección tasks con _id, title, status, createdAt y updatedAt.

Un esquema (taskSchema) es la descripción de cómo debe ser ese documento: tipos de datos, campos obligatorios, longitud máxima, valores permitidos y valores por defecto. Por ejemplo, title es obligatorio, se recorta y admite hasta 120 caracteres.

Un modelo (TaskModel) es la herramienta que construye Mongoose a partir del esquema para trabajar con la colección: TaskModel.create(...), TaskModel.find(), TaskModel.findById(...). El esquema define las reglas y el modelo las aplica al leer y escribir.

2. ¿Por qué la API devuelve id en lugar de _id?
_id es un detalle interno de MongoDB y de su tipo ObjectId. Si lo devuelvo tal cual, el cliente queda acoplado a la estructura de la base de datos. La función toTask convierte _id en id de tipo string, así la respuesta es más clara y, si algún día cambio de base de datos, el contrato de la API no cambia.

3. ¿Qué problema evita migrar todas las operaciones a una sola fuente de datos?
Evita tener dos fuentes de verdad. Si POST y GET usaran Atlas, pero PATCH y DELETE siguieran usando el arreglo en memoria, una tarea creada no se podría completar ni eliminar, porque no existiría en el arreglo. Los datos quedarían inconsistentes y los resultados dependerían de qué almacenamiento tocara cada ruta.

4. ¿Qué reglas aplica el middleware y cuáles repite el esquema?
El middleware protege la entrada HTTP antes de llegar al servicio:

title debe ser texto, no estar vacío y no superar 120 caracteres.
description, si viene, debe ser texto y no superar 300 caracteres.
El id de la URL debe tener formato ObjectId válido.
El cuerpo debe ser application/json.

El esquema repite las reglas que protegen los datos aunque otro código use TaskModel sin pasar por HTTP: title obligatorio, recortado y de máximo 120 caracteres, y status limitado a pending o completed. Con description, el esquema repite el límite de 300 caracteres.

El middleware da una respuesta rápida y clara al cliente; el esquema es la última defensa antes de la base de datos.

5. ¿Qué diferencia existe entre INVALID_ID y TASK_NOT_FOUND?
INVALID_ID (400) significa que el texto de la URL ni siquiera tiene formato de ObjectId, por ejemplo /api/tasks/1. Lo detecta el middleware, antes de consultar la base.

TASK_NOT_FOUND (404) significa que el id sí tiene formato válido de 24 caracteres hexadecimales, pero no hay ninguna tarea con ese identificador. Lo decide el servicio después de consultar la base.

La primera es un error de formato en la entrada; la segunda, una regla del negocio.

6. ¿Qué hacen timestamps y versionKey false?
timestamps: true hace que Mongoose agregue y mantenga automáticamente createdAt (al crear) y updatedAt (en cada modificación). Por eso el cliente no los envía y, al completar una tarea, updatedAt cambia solo.

versionKey: false evita que Mongoose agregue el campo interno __v, que sirve para control de versiones de documentos. Mi API todavía no lo usa y así no aparece ruido en los documentos ni en las respuestas.

7. ¿Por qué los controladores deben usar async y await?
Las operaciones de Mongoose (find, create, findByIdAndUpdate...) devuelven promesas porque acceder a Atlas toma tiempo. Sin await, el controlador respondería con una Promise pendiente en lugar de los datos, o respondería antes de que la operación termine. Con async/await, el controlador espera el resultado y luego envía el código correcto (200, 201 o 204).

8. ¿Cómo llega un AppError asíncrono al errorHandler de Express 5?
Cuando el servicio lanza un AppError dentro de una función async, la promesa del controlador se rechaza. Express 5 detecta automáticamente ese rechazo y llama a next(error) por mí, sin necesidad de try/catch ni de next manual en el controlador. El error recorre el resto de la cadena hasta el errorHandler, que está registrado al final de app.ts y lo convierte en la respuesta uniforme con message, code, details y requestId.

9. ¿Qué prueba demuestra realmente que una tarea es persistente?
Crear una tarea con POST, detener la API, iniciarla de nuevo con pnpm dev y consultar la misma tarea con GET /api/tasks/<id>. Si sigue ahí, los datos no dependen de la memoria del proceso de Node.js. Confirmarlo además en Atlas (Data Explorer, base task_api, colección tasks) muestra que el documento existe fuera de la aplicación.

10. ¿Qué información de Mongoose o Atlas nunca debe aparecer en la respuesta HTTP?
La URI de conexión, el usuario, la contraseña y el nombre del clúster o servidor.
Los stack traces y los objetos de error completos de Mongoose.
El error.message crudo de errores desconocidos, que puede revelar nombres internos o datos de diagnóstico.
Campos internos como _id sin transformar y __v.

Por eso mapPersistenceError convierte las fallas en mensajes seguros como DATABASE_UNAVAILABLE.