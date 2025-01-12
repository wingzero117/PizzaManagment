import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Modal from "./components/Modal";
import ToppingsModal from "./components/ManageToppings";
import PizzasModal from "./components/ManagePizzas"

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <p>
        hello
      </p>
      <ButtonGroup/>
    </div>
  );
}

function ButtonGroup() {

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
      <button onClick={handleOpenToppingsModal}>Button 1</button>
      <Modal
        isOpen={isToppingsModalOpen}
        onClose={handleCloseToppingsModal}
        title="Manage Toppings"
      >
        <ToppingsModal/>
      </Modal>
      <button onClick={handleOpenPizzasModal}>Button 2</button>
      <Modal
        isOpen={isPizzasModalOpen}
        onClose={handleClosePizzasModal}
        title="Manage Pizzas"
      >
        <PizzasModal/>
      </Modal>
    </div>
  );
}

export default App;
