import { useState, useEffect } from "react";
import DataApi from "../services/Data";

const EditPizza = ({pizza, onPizzaUpdated}) => {
    const [pizzaName, setPizzaName] = useState(pizza.name);
    const [selectedToppings, setSelectedToppings] = useState(pizza.toppings.map((t) => t.id));
    const [availableToppings, setAvailableToppings] = useState([]);

    useEffect(() => {
      
    }, []);

    handleToggleTopping = (toppingId) => {
      setSelectedToppings((prev) =>
        prev.includes(toppingId) ? prev.filter((id) => id !== toppingId) : [...prev, toppingId]
      );
    };

    const handleUpdatePizza = async () => {
      try {
        const updatedPizza = await DataApi.updatePizza(pizza.id, pizzaName, selectedToppings);
        onPizzaUpdated(updatedPizza);
      } catch (error) {
        console.error("Error updating pizza", error);
      }
    };

    const handleInputChange = (e) => {
      setPizzaName(e.target.value);
    };

    return (
        <div>
            <h2>Edit Pizza</h2>
            <input
                type="text"
                value={pizzaName}
                onChange={handleInputChange}
                placeholder="Pizza name"
            />
            <div>
              <h3>Select Toppings</h3>
              {}

            </div>

            <button>Update Pizza</button>
        </div>
    )
};

export default EditPizza;