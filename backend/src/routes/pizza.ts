import express from 'express';
import AppDataSource from '../data-source';
import { Pizza } from "../entities/Pizza";

const pizzaRouter = express.Router();
const pizzaRepository = AppDataSource.getRepository(Pizza);

pizzaRouter.post("/", async (req, res) => {
    const { name } = req.body;
    try{
        const pizza = pizzaRepository.create({ name });
        await pizzaRepository.save(pizza);
        res.status(201).send(pizza);
    } catch (err) {
        res.status(400).send({ error: "Could not create topping." });
    }
});

export { pizzaRouter };