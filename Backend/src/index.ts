import { env } from "./config/env.js";
import { driver } from "./config/neo4j.js";
import { createApp } from "./server/app.js";

async function main() {
	const session = driver.session();

	try {
		await session.run("RETURN 1");
		console.log("✅ Conectado a Neo4j");
	} finally {
		await session.close();
	}

	const app = await createApp();

	app.listen(env.PORT, () => {
		console.log(`🚀 REST API ready at http://localhost:${env.PORT}/api`);
		console.log(`🚀 GraphQL ready at http://localhost:${env.PORT}/graphql`);
	});
}

main().catch((error) => {
	console.error("❌ Error iniciando servidor:", error);
	process.exit(1);
});
