import { NextFunction, Request, Response } from "express";
import { config } from "../config/configuration";
import { AuthService } from "./auth_service";
import * as jwt from "jsonwebtoken";

export class JwtService implements AuthService {

    async generateToken(userId: string): Promise<any> { 
        const expiration = Number(process.env.EXPIRATION_SECONDS || 1);

        const token = jwt.sign(
            {userId},
            config.JWT_SECRET,
            {expiresIn: expiration}
        );

        return token;
    }

    async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        const token = <string>req.headers.authorization;
		try {
			let jwtPayload = <any>jwt.verify(token, config.JWT_SECRET);
			res.locals.jwtPayload = jwtPayload;
			res.locals.username = jwtPayload["username"];
		} catch (error) {
			res.status(401).send();
			return;
		}
		next();
    }

}