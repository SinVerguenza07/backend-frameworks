import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./app";
const root = document.getElementById("root");
if (!root) throw new Error("No se encontró el elemento raíz de React.");
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
