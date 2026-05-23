export const cityTypeDefs = /* GraphQL */ `
	type Ciudad @node {
		id: ID! @id
		nombre: String!
		estado: String
		pais: String

		residentes: [Usuario!]! @relationship(type: "VIVE_EN", direction: IN)
		nacidos: [Usuario!]! @relationship(type: "NACIO_EN", direction: IN)
		publicaciones: [Publicacion!]! @relationship(type: "UBICADO_EN", direction: IN)
		eventos: [Evento!]! @relationship(type: "OCURRE_EN", direction: IN)
	}
`;
