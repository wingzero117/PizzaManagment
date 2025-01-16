import axios from "axios";

const API_URL = "http://localhost:5000/api";

export default class {
    static getToppings = async () => {
        const response = await axios.get(`${API_URL}/toppings`);
        return response.data;
    };

    static createTopping = async (name) => {
        const response = await axios.post(`${API_URL}/toppings`, { name });
        return response.data;
    };

    static updateTopping = async (id, name) => {
        const response = await axios.put(`${API_URL}/toppings/${id}`, { name });
        return response.data;
    };

    static deleteTopping = async (id) => {
        await axios.delete(`${API_URL}/toppings/${id}`);
    };

    static createPizza = async (name, toppingIds) => {
        console.log("Data.js: ", toppingIds);
        const response = await axios.post(`${API_URL}/pizzas`, { name, toppingIds });
        return response.data;
    };

    static getPizzas = async () => {
        const response = await axios.get(`${API_URL}/pizzas`);
        return response.data;
    };

    static updatePizza = async (id, name, toppingIds) => {
        const response = await axios.put(`${API_URL}/pizzas/${id}`, { name, toppingIds });
        return response.data;
    };

    static deletePizza = async (id) => {
        await axios.delete(`${API_URL}/pizzas/${id}`);
    };
}

