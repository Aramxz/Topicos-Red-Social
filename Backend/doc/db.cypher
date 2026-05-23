// ============================================
// LIMPIEZA (SOLO SI ES ENTORNO DE PRUEBAS)
// ============================================

MATCH (n)
DETACH DELETE n;


// ============================================
// CONSTRAINTS
// ============================================

CREATE CONSTRAINT usuario_id IF NOT EXISTS FOR (u:Usuario) REQUIRE u.id IS UNIQUE;
CREATE CONSTRAINT publicacion_id IF NOT EXISTS FOR (p:Publicacion) REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT comentario_id IF NOT EXISTS FOR (c:Comentario) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT ciudad_id IF NOT EXISTS FOR (c:Ciudad) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT evento_id IF NOT EXISTS FOR (e:Evento) REQUIRE e.id IS UNIQUE;
CREATE CONSTRAINT grupo_id IF NOT EXISTS FOR (g:Grupo) REQUIRE g.id IS UNIQUE;
CREATE CONSTRAINT hashtag_id IF NOT EXISTS FOR (h:Hashtag) REQUIRE h.id IS UNIQUE;
CREATE CONSTRAINT categoria_id IF NOT EXISTS FOR (c:Categoria) REQUIRE c.id IS UNIQUE;


// ============================================
// NODOS
// ============================================

LOAD CSV WITH HEADERS FROM 'file:///usuarios.csv' AS row
MERGE (u:Usuario {id: row["internal_id:ID(Usuario)"]})
SET
	u.username = row.username,
	u.nombre = row.nombre,
	u.apellido = row.apellido,
	u.correo = row.correo,
	u.password_hash = row.password_hash,
	u.bio = row.bio,
	u.fecha_registro = datetime(row.fecha_registro + "T00:00:00"),
	u.fecha_nacimiento = datetime(row.fecha_nacimiento + "T00:00:00"),
	u.foto_perfil_url = row.foto_perfil_url,
	u.status = row.status;


LOAD CSV WITH HEADERS FROM 'file:///publicaciones.csv' AS row
MERGE (p:Publicacion {id: row["internal_id:ID(Publicacion)"]})
SET
	p.contenido = row.contenido,
	p.tipo_contenido = row.tipo_contenido,
	p.visibilidad = row.visibilidad,
	p.status = row.estatus;


LOAD CSV WITH HEADERS FROM 'file:///comments.csv' AS row
MERGE (c:Comentario {id: row["internal_id:ID(Comentario)"]})
SET
	c.contenido = row.contenido,
	c.status = row.status;


LOAD CSV WITH HEADERS FROM 'file:///cities.csv' AS row
MERGE (c:Ciudad {id: row["internal_id:ID(Ciudad)"]})
SET
	c.nombre = row.nombre,
	c.estado = row.estado,
	c.pais = row.pais;


LOAD CSV WITH HEADERS FROM 'file:///categorias.csv' AS row
MERGE (c:Categoria {id: row["internal_id:ID(Categoria)"]})
SET
	c.nombre = row.nombre,
	c.descripcion = row.descripcion;


LOAD CSV WITH HEADERS FROM 'file:///hashtags.csv' AS row
MERGE (h:Hashtag {id: row["id_hashtag:ID(Hashtag)"]})
SET
	h.nombre = row.nombre,
	h.descripcion = row.descripcion,
	h.fecha_creacion = datetime(row.fecha_creacion + "T00:00:00");


LOAD CSV WITH HEADERS FROM 'file:///eventos.csv' AS row
MERGE (e:Evento {id: row["internal_id:ID(Evento)"]})
SET
	e.titulo = row.titulo,
	e.descripcion = row.descripcion,
	e.fecha_inicio = datetime(replace(row.fecha_inicio, " ", "T")),
	e.fecha_fin = datetime(replace(row.fecha_fin, " ", "T")),
	e.modalidad = row.modalidad,
	e.lugar = row.lugar,
	e.capacidad = toInteger(row.capacidad),
	e.status = row.estatus;


LOAD CSV WITH HEADERS FROM 'file:///groups.csv' AS row
MERGE (g:Grupo {id: row["id_grupo:ID(Grupo)"]})
SET
	g.nombre = row.nombre,
	g.descripcion = row.descripcion,
	g.privacidad = row.privacidad,
	g.fecha_creacion = datetime(row.fecha_creacion + "T00:00:00"),
	g.status = row.estatus;


// ============================================
// RELACIONES
// ============================================

LOAD CSV WITH HEADERS FROM 'file:///usuario_sigue_usuario.csv' AS row
MATCH (a:Usuario {id: row[":START_ID(Usuario)"]})
MATCH (b:Usuario {id: row[":END_ID(Usuario)"]})
MERGE (a)-[r:SIGUE]->(b)
SET r.fecha_relacion = datetime(row.fecha_relacion);


LOAD CSV WITH HEADERS FROM 'file:///usuario_bloquea_usuario.csv' AS row
MATCH (a:Usuario {id: row[":START_ID(Usuario)"]})
MATCH (b:Usuario {id: row[":END_ID(Usuario)"]})
MERGE (a)-[r:BLOQUEA]->(b)
SET r.fecha_relacion = datetime(row.fecha_relacion);


LOAD CSV WITH HEADERS FROM 'file:///usuario_publica_publicacion.csv' AS row
MATCH (u:Usuario {id: row[":START_ID(Usuario)"]})
MATCH (p:Publicacion {id: row[":END_ID(Publicacion)"]})
MERGE (u)-[r:PUBLICA]->(p)
SET r.fecha_relacion = datetime(row.fecha_relacion);


LOAD CSV WITH HEADERS FROM 'file:///usuario_comenta_comentario.csv' AS row
MATCH (u:Usuario {id: row[":START_ID(Usuario)"]})
MATCH (c:Comentario {id: row[":END_ID(Comentario)"]})
MERGE (u)-[r:COMENTA]->(c)
SET r.fecha_relacion = datetime(row.fecha_relacion);


LOAD CSV WITH HEADERS FROM 'file:///comentario_respuesta_publicacion.csv' AS row
MATCH (c:Comentario {id: row[":START_ID(Comentario)"]})
MATCH (p:Publicacion {id: row[":END_ID(Publicacion)"]})
MERGE (c)-[r:RESPUESTA_A]->(p)
SET r.fecha_relacion = datetime(row.fecha_relacion);


LOAD CSV WITH HEADERS FROM 'file:///comentario_respuesta_comentario.csv' AS row
MATCH (c1:Comentario {id: row[":START_ID(Comentario)"]})
MATCH (c2:Comentario {id: row[":END_ID(Comentario)"]})
MERGE (c1)-[r:RESPUESTA_A]->(c2)
SET r.fecha_relacion = datetime(row.fecha_relacion);


LOAD CSV WITH HEADERS FROM 'file:///usuario_reacciona_publicacion.csv' AS row
MATCH (u:Usuario {id: row[":START_ID(Usuario)"]})
MATCH (p:Publicacion {id: row[":END_ID(Publicacion)"]})
MERGE (u)-[r:REACCIONA]->(p)
SET r.tipo = row.tipo;


LOAD CSV WITH HEADERS FROM 'file:///usuario_reacciona_comentario.csv' AS row
MATCH (u:Usuario {id: row[":START_ID(Usuario)"]})
MATCH (c:Comentario {id: row[":END_ID(Comentario)"]})
MERGE (u)-[r:REACCIONA]->(c)
SET r.fecha_relacion = datetime(row.fecha_relacion);


LOAD CSV WITH HEADERS FROM 'file:///usuario_comparte_publicacion.csv' AS row
MATCH (u:Usuario {id: row[":START_ID(Usuario)"]})
MATCH (p:Publicacion {id: row[":END_ID(Publicacion)"]})
MERGE (u)-[r:COMPARTE]->(p)
SET r.tipo = row.tipo;


LOAD CSV WITH HEADERS FROM 'file:///usuario_guarda_publicacion.csv' AS row
MATCH (u:Usuario {id: row[":START_ID(Usuario)"]})
MATCH (p:Publicacion {id: row[":END_ID(Publicacion)"]})
MERGE (u)-[r:GUARDA]->(p)
SET r.tipo = row.tipo;


LOAD CSV WITH HEADERS FROM 'file:///usuario_pertenece_grupo.csv' AS row
MATCH (u:Usuario {id: row[":START_ID(Usuario)"]})
MATCH (g:Grupo {id: row[":END_ID(Grupo)"]})
MERGE (u)-[r:PERTENECE_A]->(g)
SET r.fecha_relacion = datetime(row.fecha_relacion);


LOAD CSV WITH HEADERS FROM 'file:///usuario_vive_ciudad.csv' AS row
MATCH (u:Usuario {id: row[":START_ID(Usuario)"]})
MATCH (c:Ciudad {id: row[":END_ID(Ciudad)"]})
MERGE (u)-[:VIVE_EN]->(c);


LOAD CSV WITH HEADERS FROM 'file:///usuario_nacio_ciudad.csv' AS row
MATCH (u:Usuario {id: row[":START_ID(Usuario)"]})
MATCH (c:Ciudad {id: row[":END_ID(Ciudad)"]})
MERGE (u)-[:NACIO_EN]->(c);


LOAD CSV WITH HEADERS FROM 'file:///publicacion_ocurre_ciudad.csv' AS row
MATCH (p:Publicacion {id: row[":START_ID(Publicacion)"]})
MATCH (c:Ciudad {id: row[":END_ID(Ciudad)"]})
MERGE (p)-[:UBICADO_EN]->(c);


LOAD CSV WITH HEADERS FROM 'file:///publicacion_tiene_hashtag.csv' AS row
MATCH (p:Publicacion {id: row[":START_ID(Publicacion)"]})
MATCH (h:Hashtag {id: row[":END_ID(Hashtag)"]})
MERGE (p)-[:TIENE]->(h);


LOAD CSV WITH HEADERS FROM 'file:///hashtag_pertenece_categoria.csv' AS row
MATCH (h:Hashtag {id: row[":START_ID(Hashtag)"]})
MATCH (c:Categoria {id: row[":END_ID(Categoria)"]})
MERGE (h)-[:PERTENECE_A]->(c);


LOAD CSV WITH HEADERS FROM 'file:///subcategoria.csv' AS row
MATCH (child:Categoria {id: row[":START_ID(Categoria)"]})
MATCH (parent:Categoria {id: row[":END_ID(Categoria)"]})
MERGE (child)-[:SUBCATEGORIA_DE]->(parent);


LOAD CSV WITH HEADERS FROM 'file:///evento_ocurre_ciudad.csv' AS row
MATCH (e:Evento {id: row[":START_ID(Evento)"]})
MATCH (c:Ciudad {id: row[":END_ID(Ciudad)"]})
MERGE (e)-[:OCURRE_EN]->(c);


LOAD CSV WITH HEADERS FROM 'file:///asiste_evento.csv' AS row
MATCH (u:Usuario {id: row[":START_ID(Usuario)"]})
MATCH (e:Evento {id: row[":END_ID(Evento)"]})
MERGE (u)-[r:ASISTE]->(e)
SET r.tipo = row.tipo;


LOAD CSV WITH HEADERS FROM 'file:///guarda_evento.csv' AS row
MATCH (u:Usuario {id: row[":START_ID(Usuario)"]})
MATCH (e:Evento {id: row[":END_ID(Evento)"]})
MERGE (u)-[r:GUARDA]->(e)
SET r.tipo = row.tipo;


LOAD CSV WITH HEADERS FROM 'file:///organiza_evento.csv' AS row
MATCH (u:Usuario {id: row[":START_ID(Usuario)"]})
MATCH (e:Evento {id: row[":END_ID(Evento)"]})
MERGE (u)-[r:ORGANIZA]->(e)
SET r.tipo = row.tipo;


// ============================================
// VALIDACION
// ============================================

MATCH (n)
RETURN labels(n), count(*);

MATCH ()-[r]->()
RETURN type(r), count(*);