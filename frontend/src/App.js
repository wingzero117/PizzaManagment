import { useState, useEffect } from 'react';
import './App.css';
import Modal from "./components/Modal";
import ToppingsModal from "./components/ManageToppings";
import PizzasModal from "./components/CreatePizzas";
import EditPizzaModal from "./components/EditPizzas";
import DataApi from "./services/Data";

function App() {

  const [pizzas, setPizzas] = useState([]);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const pizzaData = await DataApi.getPizzas();
        setPizzas(pizzaData);
      } catch (error) {
        console.error("Error fetching pizzas", error);
      }
    }

    fetchPizzas();
  }, [])

  const handleEditPizza = (pizza) => {
    setSelectedPizza(pizza);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedPizza(null);
    setIsEditModalOpen(false);
  };

  const handlePizzaCreated = (newPizza) => {
    setPizzas((prev) => [...prev, newPizza]);
  };

  const handlePizzaUpdated = (updatedPizza) => {
    setPizzas((prev) => 
      prev.map((pizza) => (pizza.id === updatedPizza.id ? updatedPizza : pizza))
    );
  };

  const handlePizzaDelete = async (id) => {
    try {
      await DataApi.deletePizza(id);
      setPizzas((prev) => prev.filter((pizza) => pizza.id !== id));
    } catch (error) {
      console.error("Error deleting pizza", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>PIZZA MANAGER</p>

        <ul>
          {pizzas.map((pizza) => (
            <li key={pizza.id}>
              {pizza.name} - Toppings: {pizza.toppings.map((t) => t.name).join(", ")}
              <button onClick={() => handleEditPizza(pizza)}>Edit</button>
              <button onClick={() => handlePizzaDelete(pizza.id)}>Delete</button>
            </li>
          ))}
        </ul>

        <ButtonGroup onPizzaCreated={handlePizzaCreated}/>
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          title="Edit Pizza"
        >
          {selectedPizza && (<EditPizzaModal
            pizza={selectedPizza}
            onPizzaUpdated={(updatedPizza) => {
              handlePizzaUpdated(updatedPizza);
              handleCloseEditModal();
            }}
          />
        )}
          
        </Modal>

      </header>
    </div>
  );
}

function ButtonGroup({ onPizzaCreated }) {

  const [isToppingsModalOpen, setIsToppingsModalOpen] = useState(false);
  const [isPizzasModalOpen, setIsPizzasModalOpen] = useState(false);

  const handleOpenToppingsModal = () => {
    setIsToppingsModalOpen(true);
  };

  const handleOpenPizzasModal = () => {
    setIsPizzasModalOpen(true);
  };

  const handleCloseToppingsModal = () => {
    setIsToppingsModalOpen(false);
  };

  const handleClosePizzasModal = () => {
    setIsPizzasModalOpen(false);
  };

  return (
    <div className="a">
      <button onClick={handleOpenToppingsModal}>Toppings</button>
      <Modal
        isOpen={isToppingsModalOpen}
        onClose={handleCloseToppingsModal}
        title="Manage Toppings"
      >
        <ToppingsModal/>
      </Modal>
      <button onClick={handleOpenPizzasModal}>Create Pizza</button>
      <Modal
        isOpen={isPizzasModalOpen}
        onClose={handleClosePizzasModal}
        title="Manage Pizzas"
      >
        <PizzasModal onPizzaCreated={onPizzaCreated}/>
      </Modal>
    </div>
  );
}

export default App;
