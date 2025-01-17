import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv"

dotenv.config();

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "pizza_management",
    synchronize: true, // Set to false in production
    logging: false,
    entities: ["src/entities/*.ts"],
    migrations: ["src/migrations/*.ts"],
    subscribers: ["src/subscribers/*.ts"],
    url: process.env.DATABASE_URL
});

export default AppDataSource;
