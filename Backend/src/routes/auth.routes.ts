import { Router } from "express";
import { loginUser, registerUser } from "../services/auth.service.js";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
	try {
		const user = await registerUser(req.body);

		res.status(201).json({
			message: "Usuario registrado correctamente",
			user,
		});
	} catch (error) {
		if (error instanceof Error && error.message === "USER_ALREADY_EXISTS") {
			return res.status(409).json({
				error: "El correo o username ya está registrado",
			});
		}

		console.error(error);
		res.status(500).json({ error: "Error registrando usuario" });
	}
});

authRouter.post("/login", async (req, res) => {
	try {
		const { correo, password } = req.body;

		const data = await loginUser(correo, password);

		res.json(data);
	} catch (error) {
		if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
			return res.status(401).json({
				error: "Credenciales inválidas",
			});
		}

		console.error(error);
		res.status(500).json({ error: "Error iniciando sesión" });
	}
});
