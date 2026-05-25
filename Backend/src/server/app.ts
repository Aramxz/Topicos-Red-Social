import express from "express";
import cors from "cors";
import { expressMiddleware } from "@as-integrations/express5";
import { createApolloServer } from "./apollo.js";
import { apiRouter } from "../routes/index";

export async function createApp() {
	const app = express();

	app.use(cors());
	app.use(express.json());

	const apolloServer = await createApolloServer();

	app.use("/graphql", expressMiddleware(apolloServer));

	app.use("/api", apiRouter);

	return app;
}
