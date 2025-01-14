import React, { useState, useEffect } from "react";
import DataApi from "../services/Data";

const ManagePizzas = () => {
    const [pizzaName, setPizzaName] = useState("");
    const [toppings, setToppings] = useState([]);
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [error, setError] = useState("");
    const [pizzas, setPizzas] = useState([]);

    useEffect(() => {
        const fetchToppings = async () => {
            try {
                const toppingsData = await DataApi.getToppings();
                setToppings(toppingsData);
            } catch (error) {
                console.error("Error fetching toppings:", error);
            }
        };

        const fetchPizzas = async () => {
            try {
                const pizzasData = await DataApi.getPizzas();
                setPizzas(pizzasData);
                console.log(pizzasData);
            } catch (error) {
                console.error("Error fetching pizzas:", error);
            }
        };

        fetchPizzas();
        fetchToppings();
    }, []);

    const handleInputChange = (e) => {
        setPizzaName(e.target.value);
    };

    const handleToppingToggle = (toppingId) => {
        setSelectedToppings((prev) => 
            prev.includes(toppingId) ? prev.filter((id) => id !== toppingId) : [...prev, toppingId]
        );
    };

    const handleCreatePizza = async () => {
        if(!pizzaName.trim()) {
            setError("Pizza name cannot be empty.");
            return;
        }
        if (selectedToppings.length === 0) {
            setError("Select at least one topping.");
            return;
        }

        try {
            await DataApi.createPizza(pizzaName, selectedToppings);
            console.log(selectedToppings);
            setPizzaName("");
            setSelectedToppings([]);
            setError("");
        } catch (error) {
            console.error("Error creating pizza:", error);
            setError("Failed to create pizza. Please try again.")
        }
    }

    return (
        <div>
            <h2>Manage Pizzas</h2>
            <input
                type="text"
                onChange={handleInputChange}
                placeholder="Enter pizza name"
            />
            <h3>Pizzas</h3>
            <ul>
                {pizzas.map((pizzas) => (
                    <li key={pizzas.id}>
                        {pizzas.name} - Toppings: {pizzas.toppings.map((t) => t.name).join(", ")}
                    </li>
                ))}
            </ul>
            <h3>Select Toppings</h3>
            <ul>
                {toppings.map((topping) => (
                    <li key={topping.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedToppings.includes(topping.id)}
                                onChange={() => handleToppingToggle(topping.id)}
                            />
                            { topping.name }
                        </label>
                    </li>
                ))}
            </ul>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button onClick={handleCreatePizza}>Create Pizza</button>
        </div>
    );
};

export default ManagePizzas;