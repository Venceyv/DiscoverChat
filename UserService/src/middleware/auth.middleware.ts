import { NextFunction, Request, Response } from 'express';
import jwtService from '../service/jwt.service';
import { APIError } from './error.middleware';

// check for jwt in cookies
async function JWTAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.DC_token;
    await jwtService.verifyToken(token);

    next();
  } catch (err) {
    const invalidTokenError = new APIError(401, 'Invalid token, user not authenticated');
    next(invalidTokenError);
  }
}

export default { JWTAuth };
