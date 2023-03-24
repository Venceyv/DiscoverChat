import { Request, Response } from 'express';
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

const errorHandler = (err: unknown, req: Request, res: Response) => {
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

  res.status(500).send({ error: 'Internal Server Error' });
};

export default errorHandler;
