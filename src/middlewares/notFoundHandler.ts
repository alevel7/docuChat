import type { Request, Response } from "express";

export const notFoundHandler = (request: Request, response: Response): void => {
  response.status(404).json({
    error: `Route ${request.method} ${request.originalUrl} not found.`,
  });
};
