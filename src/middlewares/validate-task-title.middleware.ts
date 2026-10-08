import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error.js";

const TITLE_MAX = 120;
const DESCRIPTION_MAX = 300;

export const validateTaskTitle = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const title: unknown = req.body?.title;
  const description: unknown = req.body?.description;
  const details: { field: string; message: string }[] = [];

  if (typeof title !== "string" || !title.trim()) {
    details.push({ field: "title", message: "Debe ser texto no vacío." });
  } else if (title.trim().length > TITLE_MAX) {
    details.push({
      field: "title",
      message: `No debe superar ${TITLE_MAX} caracteres.`,
    });
  }

  let cleanDescription: string | undefined;
  if (description !== undefined) {
    if (typeof description !== "string") {
      details.push({ field: "description", message: "Debe ser texto." });
    } else if (description.trim().length > DESCRIPTION_MAX) {
      details.push({
        field: "description",
        message: `No debe superar ${DESCRIPTION_MAX} caracteres.`,
      });
    } else if (description.trim().length > 0) {
      cleanDescription = description.trim();
    }
  }

  if (details.length > 0) {
    next(
      new AppError(
        "La solicitud contiene datos inválidos.",
        422,
        "VALIDATION_ERROR",
        details,
      ),
    );
    return;
  }

  res.locals.taskTitle = (title as string).trim();
  res.locals.taskDescription = cleanDescription;
  next();
};