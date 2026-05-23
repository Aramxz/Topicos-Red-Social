import { Router } from "express";
import { healthRouter } from "./health.routes";
import { usuarioRouter } from "./usuario.routes";
import { authRouter } from "./auth.routes";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/usuarios", usuarioRouter);
apiRouter.use("/auth", authRouter);
