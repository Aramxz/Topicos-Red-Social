export const groupTypeDefs = /* GraphQL */ `
	type Grupo @node {
		id: ID! @id
		nombre: String!
		descripcion: String
		privacidad: String
		fecha_creacion: DateTime
		status: String

		miembros: [Usuario!]!
			@relationship(type: "PERTENECE_A", direction: IN, properties: "Timestamped")
		admins: [Usuario!]! @relationship(type: "ADMINISTRA", direction: IN)
	}
`;
