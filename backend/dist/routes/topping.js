"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toppingRouter = void 0;
const express_1 = __importDefault(require("express"));
const data_source_1 = __importDefault(require("../data-source"));
const Topping_1 = __importDefault(require("../entities/Topping"));
const toppingRouter = express_1.default.Router();
exports.toppingRouter = toppingRouter;
const toppingRepository = data_source_1.default.getRepository(Topping_1.default);
toppingRouter.get("/", async (req, res) => {
    try {
        const toppings = await toppingRepository.find(); // Fetch all toppings
        res.status(200).json(toppings);
    }
    catch (error) {
        console.error("Error fetching toppings:", error);
        res.status(500).json({ message: "Error fetching toppings" });
    }
});
toppingRouter.post("/", async (req, res) => {
    const { name } = req.body;
    try {
        const existingTopping = await toppingRepository.findOneBy({ name });
        if (existingTopping) {
            res.status(400).json({ message: "Topping already exists" });
            return;
        }
        const newTopping = toppingRepository.create({ name });
        await toppingRepository.save(newTopping);
        res.status(201).json(newTopping);
    }
    catch (error) {
        console.error("Error adding topping", error);
        res.status(500).json({ message: "Error adding topping" });
    }
});
toppingRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const topping = await toppingRepository.findOneBy({ id: parseInt(id) });
        if (!topping) {
            res.status(404).json({ message: "Topping not found" });
            return;
        }
        topping.name = name;
        await toppingRepository.save(topping);
        res.status(200).json(topping);
    }
    catch (error) {
        console.error("Error updating topping:", error);
        res.status(500).json({ message: "Error updating topping" });
    }
});
toppingRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const topping = await toppingRepository.findOneBy({ id: parseInt(id) });
        if (!topping) {
            res.status(404).json({ message: "Topping not found" });
            return;
        }
        await toppingRepository.remove(topping);
        res.status(200).json({ message: "Topping deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting topping:", error);
        res.status(500).json({ message: "Error deleting topping" });
    }
});
