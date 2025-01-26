import request from 'supertest';
import AppDataSource from "../data-source";
import Topping from "../entities/Topping";
import app from "../app";

describe('Toppings Routes', () => {
    beforeEach(async () => {
        const topping1 = AppDataSource.getRepository(Topping).create({ id: 1, name: "Cheese" });
        const topping2 = AppDataSource.getRepository(Topping).create({ id: 2, name: "Pepperoni" });
        await AppDataSource.getRepository(Topping).save([topping1, topping2]);
    });

    test('Get list of toppings', async () => {
        const response = await request(app)
            .get("/api/toppings");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(2);
    })

    test('Create new topping', async () => {
        const response = await request(app)
            .post("/api/toppings")
            .send({ name: "Ham" });

        expect(response.statusCode).toBe(201);
    });

    test('Edit a topping', async () => {
        const response = await request(app)
            .put("/api/toppings/1")
            .send({ name: "Pepper" });

        expect(response.statusCode).toBe(200);
    });

    test('Delete a topping', async () => {
        const response = await request(app)
            .delete("/api/toppings/1");

        expect(response.statusCode).toBe(200);
    });

});