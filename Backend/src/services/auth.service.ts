import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { driver } from "../config/neo4j.js";
import { env } from "../config/env.js";

type RegisterInput = {
	username: string;
	nombre: string;
	apellido: string;
	correo: string;
	password: string;
	bio?: string;
	fecha_nacimiento?: string;
	foto_perfil_url?: string;
};

export async function registerUser(input: RegisterInput) {
	const session = driver.session();

	try {
		const passwordHash = await bcrypt.hash(input.password, 10);

		const result = await session.run(
			`
			MATCH (existing:Usuario)
			WHERE existing.correo = $correo OR existing.username = $username
			WITH count(existing) AS existingCount
			CALL {
				WITH existingCount
				WITH existingCount WHERE existingCount = 0
				CREATE (u:Usuario {
					id: randomUUID(),
					username: $username,
					nombre: $nombre,
					apellido: $apellido,
					correo: $correo,
					password_hash: $passwordHash,
					bio: $bio,
					fecha_registro: datetime(),
					fecha_nacimiento: CASE
						WHEN $fecha_nacimiento IS NULL THEN NULL
						ELSE datetime($fecha_nacimiento + "T00:00:00")
					END,
					foto_perfil_url: $foto_perfil_url,
					status: "activo"
				})
				RETURN u
			}
			RETURN existingCount, u
			`,
			{
				...input,
				passwordHash,
				bio: input.bio ?? null,
				fecha_nacimiento: input.fecha_nacimiento ?? null,
				foto_perfil_url: input.foto_perfil_url ?? null,
			},
		);

		const record = result.records[0];

		if (!record || record.get("existingCount").toNumber() > 0) {
			throw new Error("USER_ALREADY_EXISTS");
		}

		const user = record.get("u").properties;

		return {
			id: user.id,
			username: user.username,
			correo: user.correo,
		};
	} finally {
		await session.close();
	}
}

export async function loginUser(correo: string, password: string) {
	const session = driver.session();

	try {
		const result = await session.run(
			`
			MATCH (u:Usuario {correo: $correo})
			RETURN u
			LIMIT 1
			`,
			{ correo },
		);

		const userNode = result.records[0]?.get("u");

		if (!userNode) {
			throw new Error("INVALID_CREDENTIALS");
		}

		const user = userNode.properties;
		const isValid = await bcrypt.compare(password, user.password_hash);

		if (!isValid) {
			throw new Error("INVALID_CREDENTIALS");
		}

		const token = jwt.sign(
			{
				sub: user.id,
				username: user.username,
				correo: user.correo,
			},
			env.JWT_SECRET as string,
			{ expiresIn: env.JWT_EXPIRES_IN ?? "7d" } as any,
		);

		return {
			token,
			user: {
				id: user.id,
				username: user.username,
				nombre: user.nombre,
				apellido: user.apellido,
				correo: user.correo,
			},
		};
	} finally {
		await session.close();
	}
}

export async function getCurrentUser(userId: string) {
	const session = driver.session();

	try {
		const result = await session.run(
			`
			MATCH (u:Usuario {id: $userId})
			RETURN u
			LIMIT 1
			`,
			{ userId },
		);

		const userNode = result.records[0]?.get("u");

		if (!userNode) {
			throw new Error("USER_NOT_FOUND");
		}

		const user = userNode.properties;

		return {
			id: user.id,
			username: user.username,
			nombre: user.nombre,
			apellido: user.apellido,
			correo: user.correo,
			bio: user.bio,
			foto_perfil_url: user.foto_perfil_url,
			status: user.status,
		};
	} finally {
		await session.close();
	}
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
	const session = driver.session();

	try {
		const result = await session.run(
			`
			MATCH (u:Usuario {id: $userId})
			RETURN u
			LIMIT 1
			`,
			{ userId },
		);

		const userNode = result.records[0]?.get("u");

		if (!userNode) {
			throw new Error("USER_NOT_FOUND");
		}

		const user = userNode.properties;

		const isValid = await bcrypt.compare(currentPassword, user.password_hash);

		if (!isValid) {
			throw new Error("INVALID_PASSWORD");
		}

		const newPasswordHash = await bcrypt.hash(newPassword, 10);

		await session.run(
			`
			MATCH (u:Usuario {id: $userId})
			SET u.password_hash = $newPasswordHash
			RETURN u
			`,
			{ userId, newPasswordHash },
		);

		return true;
	} finally {
		await session.close();
	}
}
