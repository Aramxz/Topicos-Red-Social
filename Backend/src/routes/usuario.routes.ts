import { Router } from "express";
import { driver } from "../config/neo4j.js";

export const usuarioRouter = Router();

usuarioRouter.get("/:id/feed", async (req, res) => {
	const session = driver.session();
	const { id } = req.params;

	try {
		const result = await session.run(
			`
			MATCH (:Usuario {id: $id})-[:SIGUE]->(seguido:Usuario)-[:PUBLICA]->(p:Publicacion)
			OPTIONAL MATCH (p)-[:TIENE]->(h:Hashtag)

			WITH p, collect(h.nombre) AS hashtags

			RETURN p {
				.id,
				.contenido,
				.tipo_contenido,
				.visibilidad,
				.status,
				hashtags: hashtags
			} AS publicacion
			LIMIT 20
			`,
			{ id },
		);

		res.json({
			data: result.records.map((record) => record.get("publicacion")),
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "Error obteniendo feed del usuario",
		});
	} finally {
		await session.close();
	}
});
