export const userTypeDefs = /* GraphQL */ `
	type Usuario @node {
		id: ID! @id
		username: String!
		nombre: String!
		apellido: String!
		correo: String!
		password_hash: String!
		bio: String
		fecha_registro: DateTime
		fecha_nacimiento: DateTime
		foto_perfil_url: String
		status: String

		sigue: [Usuario!]! @relationship(type: "SIGUE", direction: OUT, properties: "Timestamped")
		bloqueados: [Usuario!]!
			@relationship(type: "BLOQUEA", direction: OUT, properties: "Timestamped")

		publicaciones: [Publicacion!]!
			@relationship(type: "PUBLICA", direction: OUT, properties: "Timestamped")
		comentarios: [Comentario!]!
			@relationship(type: "COMENTA", direction: OUT, properties: "Timestamped")

		reaccionesPublicaciones: [Publicacion!]!
			@relationship(type: "REACCIONA", direction: OUT, properties: "TypedRelation")
		reaccionesComentarios: [Comentario!]!
			@relationship(type: "REACCIONA", direction: OUT, properties: "Timestamped")

		compartidos: [Publicacion!]!
			@relationship(type: "COMPARTE", direction: OUT, properties: "TypedRelation")
		publicacionesGuardadas: [Publicacion!]!
			@relationship(type: "GUARDA", direction: OUT, properties: "TypedRelation")

		grupos: [Grupo!]!
			@relationship(type: "PERTENECE_A", direction: OUT, properties: "Timestamped")

		ciudadActual: Ciudad @relationship(type: "VIVE_EN", direction: OUT)
		ciudadNacimiento: Ciudad @relationship(type: "NACIO_EN", direction: OUT)
	}
`;
