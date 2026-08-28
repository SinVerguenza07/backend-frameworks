import dotenv from "dotenv";

// Carga las variables definidas en el archivo .env (si existe) hacia process.env
dotenv.config();

/**
 * Forma tipada de la configuración de la aplicación.
 * Nunca se guardan aquí datos sensibles: solo valores necesarios
 * para identificar el nombre y el entorno de ejecución.
 */
export interface AppConfig {
  appName: string;
  appEnv: "development" | "production" | "test";
}

/**
 * Lee una variable de entorno y aplica un valor por defecto si no existe,
 * evitando que la aplicación falle por falta de configuración.
 */
function readEnvVar(key: string, defaultValue: string): string {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value : defaultValue;
}

function resolveEnv(rawEnv: string): AppConfig["appEnv"] {
  if (rawEnv === "production" || rawEnv === "test") {
    return rawEnv;
  }
  return "development";
}

export const config: AppConfig = {
  appName: readEnvVar("APP_NAME", "Gestor de Tareas CLI"),
  appEnv: resolveEnv(readEnvVar("APP_ENV", "development")),
};
