import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv"

dotenv.config();

const AppDataSource = new DataSource({
    type: "mysql",
    synchronize: true, // Set to false in production
    logging: false,
    entities: ["src/entities/*.ts"],
    migrations: ["src/migrations/*.ts"],
    subscribers: ["src/subscribers/*.ts"],
    url: process.env.DATABASE_URL
});

export default AppDataSource;
