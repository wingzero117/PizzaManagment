import express from "express";
import { toppingRouter }  from "./routes/topping";
import { pizzaRouter } from "./routes/pizza";
import "reflect-metadata";
import AppDataSource from "./data-source";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/toppings", toppingRouter);
app.use("/api/pizzas", pizzaRouter);

export const initializeDatabase = async () => {
    await AppDataSource.initialize();
    console.log("Data Source initialized");
};

export default app;