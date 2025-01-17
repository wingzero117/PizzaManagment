import express from "express";
import { toppingRouter }  from "./routes/topping";
import { pizzaRouter } from "./routes/pizza";
import "reflect-metadata";
import AppDataSource from "./data-source";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

AppDataSource.initialize().then(()=> {
    console.log("Data Source initialized");

    app.use("/api/toppings", toppingRouter);
    app.use("/api/pizzas", pizzaRouter);

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
