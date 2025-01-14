import React, { useState, useEffect } from "react";
import DataApi from "../services/Data";

const ManageToppings = () => {
    const [toppings, setToppings] = useState([]);
    const [toppingName, setToppingName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchToppings = async () => {
            try {
                const data = await DataApi.getToppings();
                setToppings(data);
            } catch (error) {
                console.error("Error fetching toppings:", error);
                setError("Failed to fetch toppings");
            }
        };
        fetchToppings();
    }, []);

    const handleInputChange = (e) => {
        setToppingName(e.target.value);
    };

    const handleAddOrEditTopping = async () => {
        if (!toppingName.trim()) {
            setError("Topping name cannot be empty.");
            return;
        }

        setError("");

        try {
            if (editingId !== null) {
                const updatedTopping = await DataApi.updateTopping(editingId, toppingName);
                setToppings((prev) => 
                    prev.map((topping) => 
                        topping.id === editingId ? updatedTopping : topping
                    )
                );
            } else {
                const newTopping = await DataApi.createTopping(toppingName);
                setToppings((prev) => [...prev, newTopping]);
            }
            setToppingName("");
            setEditingId(null);
        } catch (error) {
            console.error("Error adding/updating topping:", error);
            setError(error.response.data.message);
        }
    };

    const handleEditTopping = (id, name) => {
        setEditingId(id);
        setToppingName(name);
    };

    const handleDeleteTopping = async (id) => {
        try {
            await DataApi.deleteTopping(id);
            setToppings((prev) => prev.filter((topping) => topping.id !== id));
        } catch (error) {
            console.error("Error deleting topping:", error);
            setError("An error occurred.");
        }
    };

    return (
        <div>
            <h2>Manage Toppings</h2>
            <input
                type="text"
                onChange={handleInputChange}
                placeholder="Enter topping name"
            />
            <button onClick={handleAddOrEditTopping}>
                {editingId !== null ? "Update Topping" : "Add Topping"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul>
                {toppings.map((topping) => 
                    <li key={topping.id}>
                        {topping.name}
                        <button onClick={() => handleEditTopping(topping.id, topping.name)}>Edit</button>
                        <button onClick={() => handleDeleteTopping(topping.id)}>Delete</button>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default ManageToppings;