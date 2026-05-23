export const hashtagTypeDefs = /* GraphQL */ `
	type Hashtag @node {
		id: ID! @id
		nombre: String!
		descripcion: String
		fecha_creacion: DateTime

		publicaciones: [Publicacion!]! @relationship(type: "TIENE", direction: IN)
		categorias: [Categoria!]! @relationship(type: "PERTENECE_A", direction: OUT)
	}
`;
