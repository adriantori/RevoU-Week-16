import jwt from 'jsonwebtoken';
import { JWT_SIGN } from '../configs/constants';
import { Request, Response, NextFunction } from 'express';

const auth = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    try {
      if (!authHeader) {
        res.status(401).json({
          message: 'Unauthorized',
          error: 'No authentication header provided'
        });
        return;
      }

      const token = authHeader.split(' ')[1];

      const decodedToken: any = jwt.verify(token, JWT_SIGN!);

      const userRole = decodedToken.role; 
      if (allowedRoles.includes(userRole)) {
        res.locals.userId = decodedToken.userId;
        res.locals.username = decodedToken.username
        next(); 
      } else {
        res.status(403).json({
          message: 'Forbidden',
          error: 'User does not have the required role'
        });
      }
    } catch (error: any) {
      res.status(400).json({
        message: 'Bad Request',
        error: error.message
      });
    }
  };
};

export {auth};
