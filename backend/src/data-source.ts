import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const isTestEnv = process.env.NODE_ENV === "test";

const dataSourceOptions: DataSourceOptions = isTestEnv
  ? {
      type: "sqlite",
      database: ":memory:",
      synchronize: true,
      logging: false,
      entities: ["src/entities/*.ts"],
      migrations: ["src/migrations/*.ts"],
      subscribers: ["src/subscribers/*.ts"],
    }
  : {
      type: "mysql",
      url: process.env.DATABASE_URL,
      synchronize: false,
      logging: true,
      entities: ["src/entities/*.ts"],
      migrations: ["src/migrations/*.ts"],
      subscribers: ["src/subscribers/*.ts"],
    };

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
