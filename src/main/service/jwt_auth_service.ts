import { NextFunction, Request, Response } from "express";
import { config } from "../config/configuration";
import { AuthService } from "./auth_service";
import * as jwt from "jsonwebtoken";

export class JwtService implements AuthService {

    async generateToken(userId: string): Promise<any> { 
        const expiration = Number(config.EXPIRATION_SECONDS || 1);
        console.log("Expiration is this ", expiration);

        const token = jwt.sign(
            {userId},
            config.JWT_SECRET,
            {expiresIn: expiration}
        );

        return token;
    }

    async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        const authHeader = <string>req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }
        const token = authHeader.split(" ")[1];
        console.log("Token is this ", token);
		try {
			let jwtPayload = <any>jwt.verify(token, config.JWT_SECRET);
			res.locals.jwtPayload = jwtPayload;
			res.locals.username = jwtPayload["userId"];
            console.log("Locals is this ", res.locals);
		} catch (error) {
			res.status(401).send(error);
			return;
		}
		next();
    }

}