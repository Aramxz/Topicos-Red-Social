export const commentTypeDefs = /* GraphQL */ `
	type Comentario @node {
		id: ID! @id
		contenido: String!
		status: String

		autor: Usuario @relationship(type: "COMENTA", direction: IN)
		publicacion: Publicacion @relationship(type: "RESPUESTA_A", direction: OUT)
		comentarioPadre: Comentario @relationship(type: "RESPUESTA_A", direction: OUT)
	}
`;
