# Backend - API REST + GraphQL para Red Social (Neo4j)

Backend construido con Node.js, TypeScript, Express, Apollo Server, GraphQL y Neo4j como base de datos de grafos.

---

## 🚀 Tecnologías

- Node.js
- TypeScript
- Express
- Apollo Server
- GraphQL
- Neo4j
- JWT
- bcrypt
- pnpm

---

## 📁 Estructura del proyecto

```txt
.
├── doc
│   └── db.cypher
├── src
│   ├── config
│   │   ├── env.ts
│   │   └── neo4j.ts
│   ├── middlewares
│   │   └── auth.middleware.ts
│   ├── routes
│   │   ├── auth.routes.ts
│   │   ├── health.routes.ts
│   │   ├── usuario.routes.ts
│   │   └── index.ts
│   ├── schema
│   │   ├── index.ts
│   │   ├── nodes
│   │   └── relationships
│   ├── server
│   │   ├── app.ts
│   │   └── apollo.ts
│   ├── services
│   │   └── auth.service.ts
│   └── index.ts
├── package.json
└── README.md
```

---

## ⚙️ Requisitos

- Node.js >= 18
- pnpm
- Neo4j Desktop o Neo4j Server

---

## ▶️ Instalación

```bash
pnpm install
```

---

## 🔐 Variables de entorno

Crear archivo `.env`:

```env
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=tu_password
PORT=4000
JWT_SECRET=tu_clave_super_secreta
JWT_EXPIRES_IN=7d
```

---

# Base de datos Neo4j

## Poblar base de datos

El proyecto incluye:

- `doc/db.cypher` → script completo de importación
- carpeta con archivos CSV → datos de prueba

Los CSV deben colocarse en la carpeta `import` de Neo4j.

---

## Linux

Ubicación típica:

```bash
/var/lib/neo4j/import
```

Copiar archivos:

```bash
sudo cp ./csv/* /var/lib/neo4j/import/
```

Dar permisos:

```bash
sudo chown neo4j:neo4j /var/lib/neo4j/import/*.csv
```

Entrar al shell:

```bash
cypher-shell -u neo4j -p TU_PASSWORD
```

Ejecutar script:

```bash
cat doc/db.cypher | cypher-shell -u neo4j -p TU_PASSWORD
```

---

## Windows (Neo4j Desktop)

Abrir Neo4j Desktop.

Ir a:

```txt
Database → Open Folder → Import
```

Copiar todos los CSV ahí.

Luego abrir:

```txt
Open → Neo4j Browser
```

Ejecutar:

```cypher
:source doc/db.cypher
```

Si `:source` no funciona:

copiar y pegar manualmente el contenido de `db.cypher`.

---

## Verificar importación

```cypher
MATCH (n)
RETURN count(n);
```

---

# Ejecutar proyecto

## Desarrollo

```bash
pnpm dev
```

Servidor disponible en:

REST API:

```txt
http://localhost:4000/api
```

GraphQL:

```txt
http://localhost:4000/graphql
```

---

# Endpoints REST

## Health Check

### GET

```http
/api/health
```

Respuesta:

```json
{
	"status": "ok",
	"neo4j": "connected"
}
```

---

## Registro

### POST

```http
/api/auth/register
```

Body:

```json
{
	"username": "Vegetta777",
	"nombre": "Samuel",
	"apellido": "De Luque",
	"correo": "vegetta777@test.com",
	"password": "12345678"
}
```

Respuesta:

```json
{
	"message": "Usuario registrado correctamente",
	"user": {
		"id": "uuid",
		"username": "Vegetta777",
		"correo": "vegetta777@test.com"
	}
}
```

---

## Login

### POST

```http
/api/auth/login
```

Body:

```json
{
	"correo": "vegetta777@test.com",
	"password": "12345678"
}
```

Respuesta:

```json
{
	"token": "jwt_token",
	"user": {
		"id": "uuid",
		"username": "Vegetta777"
	}
}
```

---

## Usuario autenticado

### GET

```http
/api/auth/me
```

Headers:

```txt
Authorization: Bearer TU_TOKEN
```

---

## Cambiar contraseña

### PATCH

```http
/api/auth/password
```

Headers:

```txt
Authorization: Bearer TU_TOKEN
Content-Type: application/json
```

Body:

```json
{
	"currentPassword": "12345678",
	"newPassword": "nuevaPassword123"
}
```

---

## Feed de usuario

### GET

```http
/api/usuarios/:id/feed
```

Ejemplo:

```http
/api/usuarios/1234/feed
```

---

# GraphQL

## Endpoint

```http
POST /graphql
```

URL completa:

```txt
http://localhost:4000/graphql
```

---

## Headers requeridos

```txt
Content-Type: application/json
apollo-require-preflight: true
```

## Nota Importante

El backend genera automáticamente CRUD para los nodos definidos en el schema mediante Neo4j GraphQL.

Actualmente se exponen operaciones para:

- usuarios
- comentarios
- publicacions
- eventos
- grupos
- hashtags
- categorias
- ciudads

aunque existen operaciones CRUD para usuarios, el flujo recomendado para autenticación y gestión sensible de cuentas es mediante los endpoints REST.

## Ejemplo básico

Obtener usuarios:

```json
{
	"query": "query { usuarios(limit: 5) { id username nombre apellido } }"
}
```

---

Usuario por ID:

```json
{
	"query": "query { usuarios(where: { id: { eq: \"1234\" } }) { id username nombre apellido correo } }"
}
```

---

Usuario con relaciones:

```json
{
	"query": "query {usuarios(where: { id: { eq: \"1754\" } }) {username sigue {username} publicaciones {contenido hashtags { nombre}}}}"
}
```

---

Obtener publicaciones con filtros:

```json
{
	"query": "query {
		publicacions(limit: 10) {
			id
			contenido
			tipo_contenido
			visibilidad
			autor {
				username
			}
			hashtags {
				nombre
			}
			ciudad {
				nombre
			}
		}
	}"
}
```

---

Inspeccionar schema

```json
{
	"query": "{ __schema { queryType { fields { name } } }"
}
```

---

# Formato de código

Proyecto usa Prettier.

Formatear:

```bash
pnpm format
```

Verificar:

```bash
pnpm check-format
```

---

# Convención de commits

Prefijos:

- `feat:` nueva funcionalidad
- `fix:` corrección
- `refactor:` refactor interno
- `docs:` documentación
- `chore:` tareas generales
- `test:` pruebas

Ejemplos:

```txt
feat: add auth login endpoint
fix: correct neo4j relationship direction
docs: update backend setup guide
```

---

# Buenas prácticas

- Auth sensible en REST
- Consultas flexibles en GraphQL
- No exponer `password_hash` en GraphQL
- Mantener schema alineado con Neo4j
- Pensar el modelo como grafo, no como SQL
