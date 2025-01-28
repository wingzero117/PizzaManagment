"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const topping_1 = require("./routes/topping");
const pizza_1 = require("./routes/pizza");
require("reflect-metadata");
const data_source_1 = __importDefault(require("./data-source"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express_1.default.json());
data_source_1.default.initialize().then(() => {
    console.log("Data Source initialized");
    app.use("/api/toppings", topping_1.toppingRouter);
    app.use("/api/pizzas", pizza_1.pizzaRouter);
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
