export const eventTypeDefs = /* GraphQL */ `
	type Evento @node {
		id: ID! @id
		titulo: String!
		descripcion: String
		fecha_inicio: DateTime
		fecha_fin: DateTime
		modalidad: String
		lugar: String
		capacidad: Int
		status: String

		asistentes: [Usuario!]!
			@relationship(type: "ASISTE", direction: IN, properties: "TypedRelation")
		guardadoPor: [Usuario!]!
			@relationship(type: "GUARDA", direction: IN, properties: "TypedRelation")
		organizadores: [Usuario!]!
			@relationship(type: "ORGANIZA", direction: IN, properties: "TypedRelation")

		ciudad: Ciudad @relationship(type: "OCURRE_EN", direction: OUT)
	}
`;
