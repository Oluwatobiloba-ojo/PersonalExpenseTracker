
import { Request, Response, NextFunction } from 'express';

export interface AuthService {

    generateToken(userId: string): Promise<any>;
    verifyToken(req: Request, res: Response, next: NextFunction): Promise<void>;

}