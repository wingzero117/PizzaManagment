import { useState, useEffect } from "react";
import DataApi from "../services/Data";

const EditPizza = ({pizza, onPizzaUpdated}) => {
    const [pizzaName, setPizzaName] = useState(pizza.name);
    const [selectedToppings, setSelectedToppings] = useState(pizza.toppings.map((t) => t.id));
    const [toppings, setToppings] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
      const fetchToppings = async () => {
        try {
          const toppings = await DataApi.getToppings();
          setToppings(toppings);
        } catch (error) {
          console.error("Error fetching toppings:", error);
        }
      };

      fetchToppings();
    }, []);

    const handleToggleTopping = (toppingId) => {
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
        setError(error.response.data.message);
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
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div>
              <h3>Select Toppings</h3>
              {toppings.map((topping) => (
                <div key={topping.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedToppings.includes(topping.id)}
                      onChange={() => handleToggleTopping(topping.id)}
                    />
                    {topping.name}
                  </label>
                </div>
              ))}

            </div>

            <button onClick={handleUpdatePizza}>Update Pizza</button>
        </div>
    )
};

export default EditPizza;