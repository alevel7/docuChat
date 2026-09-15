import type { NextFunction, Request, Response } from "express";

export const errorHandler = (
  error: Error & { statusCode?: number },
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  const statusCode = error.statusCode ?? 500;
  const message = statusCode === 500 ? "Internal server error." : error.message;

  response.status(statusCode).json({ error: message });
};
