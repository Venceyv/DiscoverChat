import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import logger from '../config/logger.config';

export class APIError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);

    this.name = Error.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);

  // Custom api error
  if (err instanceof APIError) {
    const response = {
      name: err.name,
      message: err.message,
      statusCode: err.statusCode,
    };

    res.status(err.statusCode).send(response);
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json(err.issues);
    return;
  }

  res.status(500).send({ error: 'Internal Server Error.' });
};

export default errorHandler;
