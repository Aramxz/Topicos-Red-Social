import "dotenv/config";

export const env = {
	NEO4J_URI: process.env.NEO4J_URI!,
	NEO4J_USER: process.env.NEO4J_USER!,
	NEO4J_PASSWORD: process.env.NEO4J_PASSWORD!,
	PORT: Number(process.env.PORT) || 4000,
	JWT_SECRET: process.env.JWT_SECRET!,
	JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
};
