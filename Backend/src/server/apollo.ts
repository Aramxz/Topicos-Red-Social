import { ApolloServer } from "@apollo/server";
import { neoSchema } from "../schema/index.js";

export async function createApolloServer() {
	const schema = await neoSchema.getSchema();

	const server = new ApolloServer({
		schema,
	});

	await server.start();

	return server;
}
