import axios from "axios";

const API_URL = "http:////localhost:5000/api/toppings";

export default class {
    static getToppings = async () => {
        const response = await axios.get(API_URL);
        return response.data;
    };

    static createTopping = async (name) => {
        const response = await axios.post(API_URL, { name });
        return response.data;
    };

    static updateTopping = async (id, name) => {
        const response = await axios.put(`${API_URL}/${id}`, { name });
        return response.data;
    };

    static deleteTopping = async (id) => {
        await axios.delete(`${API_URL}/${id}`);
    };
}

