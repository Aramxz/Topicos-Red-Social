import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

type JwtPayload = {
	sub: string;
	username: string;
	correo: string;
};

declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload;
		}
	}
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.status(401).json({
			error: "Token requerido",
		});
	}

	const [scheme, token] = authHeader.split(" ");

	if (scheme !== "Bearer" || !token) {
		return res.status(401).json({
			error: "Formato de token inválido",
		});
	}

	try {
		const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

		req.user = payload;

		next();
	} catch {
		return res.status(401).json({
			error: "Token inválido o expirado",
		});
	}
}
