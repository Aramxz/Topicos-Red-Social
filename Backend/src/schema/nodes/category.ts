export const categoryTypeDefs = /* GraphQL */ `
	type Categoria @node {
		id: ID! @id
		nombre: String!
		descripcion: String

		categoriaPadre: Categoria @relationship(type: "SUBCATEGORIA_DE", direction: OUT)
		subcategorias: [Categoria!]! @relationship(type: "SUBCATEGORIA_DE", direction: IN)
	}
`;
