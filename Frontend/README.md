# Jerobook Frontend

Frontend de Jerobook construido con React, TypeScript, Vite, GSAP y la API REST del backend en Neo4j.

## Requisitos

- Node.js compatible con el backend
- pnpm mediante Corepack
- Backend corriendo en `http://localhost:4000`
- Neo4j levantado y conectado desde el backend

## Variables de entorno

Crear un archivo `.env` en `Frontend/`:

```env
VITE_API_URL=http://localhost:4000
```

Para produccion, cambiar `VITE_API_URL` por la URL publica del backend desplegado.

## Comandos

```bash
corepack pnpm install
corepack pnpm dev
corepack pnpm build
corepack pnpm preview
```

## Estructura

```txt
src/
  app/          Layout principal de Jerobook
  components/   UI por dominio: auth, feed, entidades, layout
  config/       Navegacion y temas visibles
  hooks/        Estado y flujos de datos del frontend
  services/     Cliente REST hacia el backend
  styles/       Estilos globales y layout responsive
  types/        Tipos compartidos del dominio social
  utils/        Helpers de formato y busqueda
```

## Flujo de datos

- `Inicio` usa el feed personal cuando hay sesion.
- `Explorar` consulta `/api/publicaciones` para busqueda global por texto, ciudad y hashtag.
- `Perfil` escribe datos de usuario, ciudad actual, ciudad de nacimiento, ciudades y hashtags usando las rutas REST.
- `Grupos` y `Eventos` usan las entidades y relaciones ya modeladas en Neo4j.

## Checklist antes de entregar

```bash
corepack pnpm build
curl http://localhost:4000/api/health
curl "http://localhost:4000/api/publicaciones?search=texto"
```

Si `Explorar` no encuentra una publicacion, validar primero en Neo4j que tenga:

- `(Usuario)-[:PUBLICA]->(Publicacion)`
- `(Publicacion)-[:UBICADO_EN]->(Ciudad)` cuando se filtre por ciudad
- `(Publicacion)-[:TIENE]->(Hashtag)` cuando se filtre por hashtag
- `status: "activo"`
- `visibilidad: "publica"` o `"publico"`
