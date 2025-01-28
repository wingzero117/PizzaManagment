import request from 'supertest';
import express from "express";
import AppDataSource from "../data-source";
import Pizza from "../entities/Pizza";
import Topping from "../entities/Topping";
import app from "../app";

describe('Pizza Routes', () => {
    beforeEach(async () => {
        const topping1 = AppDataSource.getRepository(Topping).create({ id: 1, name: "Cheese" });
        const topping2 = AppDataSource.getRepository(Topping).create({ id: 2, name: "Pepperoni" });
        await AppDataSource.getRepository(Topping).save([topping1, topping2]);
        const pizza1 = AppDataSource.getRepository(Pizza).create({ id: 1, name: "pizza1", toppings: [ topping1 ] });
        await AppDataSource.getRepository(Pizza).save(pizza1);
    });
    
    test('Gets list of pizzas', async () => {
        const response = await request(app)
            .get("/api/pizzas")

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0]).toEqual(expect.objectContaining({
            name: "pizza1",
            toppings: [
                expect.objectContaining({ name: "Cheese" })
            ]
        }));
    });

    test("Creates a new pizza", async () => {
        const response = await request(app)
            .post("/api/pizzas")
            .send({ name: "Hawaiian", toppingIds: [1, 2] });
    
        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe("Hawaiian");
        expect(response.body.toppings).toHaveLength(2);
    });

    test('Edit a pizza', async () => {
        const response = await request(app)
            .put("/api/pizzas/1")
            .send({ name: "Cheese", toppingIds: [ 2 ] });

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe("Cheese");
        expect(response.body.toppings).toHaveLength(1);

    });

    test('Deletes a pizza', async () => {
        const response = await request(app)
            .delete("/api/pizzas/1");

        expect(response.statusCode).toBe(200);
    });


});
