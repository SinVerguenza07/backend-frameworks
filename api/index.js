// Punto de entrada serverless para Vercel.
// Vercel no ejecuta src/server.ts (app.listen); reutiliza la app Express compilada en dist/.
import { app } from "../dist/app.js";
import { connectDatabase } from "../dist/config/database.js";

let connection;

function ensureDatabase() {
  // La conexión se reutiliza mientras la instancia de la función siga activa.
  connection ??= connectDatabase().catch((error) => {
    connection = undefined; // permite reintentar en la siguiente solicitud
    throw error;
  });
  return connection;
}

export default async function handler(req, res) {
  try {
    await ensureDatabase();
  } catch {
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: {
          code: "DATABASE_UNAVAILABLE",
          message: "No fue posible conectar con la base de datos.",
        },
      }),
    );
    return;
  }
  return app(req, res);
}