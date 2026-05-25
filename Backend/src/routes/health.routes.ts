import { Router } from "express";
import { driver } from "../config/neo4j.js";

export const healthRouter = Router();

healthRouter.get("/", async (_req, res) => {
	const session = driver.session();

	try {
		await session.run("RETURN 1");
		res.json({
			status: "ok",
			neo4j: "connected",
		});
	} catch {
		res.status(500).json({
			status: "error",
			neo4j: "disconnected",
		});
	} finally {
		await session.close();
	}
});
