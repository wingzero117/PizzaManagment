"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pizzaRouter = void 0;
const express_1 = __importDefault(require("express"));
const data_source_1 = __importDefault(require("../data-source"));
const Pizza_1 = __importDefault(require("../entities/Pizza"));
const Topping_1 = __importDefault(require("../entities/Topping"));
const pizzaRouter = express_1.default.Router();
exports.pizzaRouter = pizzaRouter;
const pizzaRepository = data_source_1.default.getRepository(Pizza_1.default);
const toppingRepository = data_source_1.default.getRepository(Topping_1.default);
pizzaRouter.get("/", async (req, res) => {
    try {
        const pizzas = await pizzaRepository.find({ relations: ["toppings"] });
        res.status(200).json(pizzas);
    }
    catch (error) {
        console.error("Error fetching pizzas", error);
        res.status(500).json({ message: "Error fetching pizzas" });
    }
});
pizzaRouter.post("/", async (req, res) => {
    const { name, toppingIds } = req.body;
    try {
        const existingPizza = await pizzaRepository.findOneBy({ name });
        if (existingPizza) {
            res.status(400).json({ message: "Pizza with this name already exists" });
            return;
        }
        const existingPizzas = await pizzaRepository.find({ relations: ["toppings"] });
        const duplicatePizza = existingPizzas.find((pizza) => pizza.toppings.every((topping) => toppingIds.includes(topping.id)));
        if (duplicatePizza) {
            res.status(400).json({ message: "A pizza like this already exists" });
            return;
        }
        const toppings = await toppingRepository.findByIds(toppingIds);
        const newPizza = pizzaRepository.create({ name, toppings });
        await pizzaRepository.save(newPizza);
        res.status(201).json(newPizza);
    }
    catch (error) {
        console.error("Error creating pizza", error);
        res.status(500).send({ message: "Error creating pizza" });
    }
});
pizzaRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, toppingIds } = req.body;
    try {
        const pizza = await pizzaRepository.findOne({ where: { id: parseInt(id) }, relations: ["toppings"] });
        if (!pizza) {
            res.status(404).json({ message: "Pizza not found" });
            return;
        }
        if (name) {
            const existingPizza = await pizzaRepository.findOne({ where: { name } });
            if (existingPizza && existingPizza.id !== pizza.id) {
                res.status(400).json({ message: "Pizza with this name already exists" });
                return;
            }
            pizza.name = name;
        }
        if (toppingIds) {
            const existingPizzas = await pizzaRepository.find({ relations: ["toppings"] });
            const duplicatePizza = existingPizzas.find((pizza) => pizza.toppings.every((topping) => toppingIds.includes(topping.id)));
            if (duplicatePizza) {
                res.status(400).json({ message: "A pizza like this already exists" });
                return;
            }
            const toppings = await toppingRepository.findByIds(toppingIds);
            pizza.toppings = toppings;
        }
        const updatedPizza = await pizzaRepository.save(pizza);
        res.status(200).json(updatedPizza);
    }
    catch (error) {
        console.error("Error updating pizza:", error);
        res.status(500).json({ message: "Error updating piza" });
    }
});
pizzaRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const pizza = await pizzaRepository.findOneBy({ id: parseInt(id) });
        if (!pizza) {
            res.status(404).json({ message: "Pizza not found" });
            return;
        }
        await pizzaRepository.remove(pizza);
        res.status(200).json({ message: "Pizza deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting pizza:", error);
        res.status(500).json({ message: "Error deleting pizza" });
    }
});
