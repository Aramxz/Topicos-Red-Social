export const postTypeDefs = /* GraphQL */ `
	type Publicacion @node {
		id: ID! @id
		contenido: String!
		tipo_contenido: String
		visibilidad: String
		status: String

		autor: Usuario @relationship(type: "PUBLICA", direction: IN)
		comentarios: [Comentario!]! @relationship(type: "RESPUESTA_A", direction: IN)
		hashtags: [Hashtag!]! @relationship(type: "TIENE", direction: OUT)
		ciudad: Ciudad @relationship(type: "UBICADO_EN", direction: OUT)
	}
`;
