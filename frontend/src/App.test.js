import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';
import DataApi from './services/Data';
import EditPizza from './components/EditPizzas'

jest.mock('./services/Data', () => ({
  getPizzas: jest.fn(),
  deletePizza: jest.fn(),
  getToppings: jest.fn(),
  updatePizza: jest.fn(),
}));

describe('App Component', () => {
    const testPizzas = [
      {id: 1, name: 'testPizza1', toppings:[{ name: 'topping1'}, { name: 'topping2' }] },
      {id: 2, name: 'testPizza2', toppings:[{ name: 'topping3'}] }
    ];

    const testToppings = [
      {id: 1, name: 'topping1'},
      {id: 2, name: 'topping2'},
      {id: 3, name: 'topping3'}
    ];

    beforeEach(() => {
      jest.resetAllMocks();
      DataApi.getPizzas.mockResolvedValue(testPizzas);
      DataApi.getToppings.mockResolvedValue(testToppings);
    });

    test('Renders the pizza list', async () => {
      render(<App/>);

      const pizzaItems = await screen.findAllByText(/Toppings:/);
      expect(pizzaItems).toHaveLength(testPizzas.length);

      expect(screen.getByText(/testPizza1/)).toBeInTheDocument();
      expect(screen.getByText(/testPizza2/)).toBeInTheDocument();
      expect(screen.getByText(/topping1, topping2/)).toBeInTheDocument();
      expect(screen.getByText(/topping3/)).toBeInTheDocument();
    });

    test('Deletes pizza when delete button is clicked', async () => {
      DataApi.deletePizza.mockResolvedValue({});
      render(<App/>);

      const deleteButtons = await screen.findAllByText(/Delete/);
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(DataApi.deletePizza).toHaveBeenCalledWith(1);
        expect(screen.queryByText(/testPizza1/)).not.toBeInTheDocument();
      });
    });

    test('Open and Close "Edit Pizza" modal', async () => {
      render(<App/>);

      const editButtons = await screen.findAllByText(/Edit/);
      fireEvent.click(editButtons[0]);

      expect(screen.getByText(/Edit Pizza/)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/testPizza1/)).toBeInTheDocument();

      const closeButton = await screen.findByText(/Close/);
      fireEvent.click(closeButton);

      expect(screen.queryByText(/Edit Pizza/)).not.toBeInTheDocument();
      });

    test('Open and Close "Manage Toppings" modal', async () => {
        render(<App/>);

        const toppingsButton = await screen.findByText(/Toppings/);
        fireEvent.click(toppingsButton);

        expect(screen.getByText(/Manage Toppings/)).toBeInTheDocument();

        const closeButton = await screen.findByText(/Close/);
        fireEvent.click(closeButton);

        expect(screen.queryByText(/Manage Toppings/)).not.toBeInTheDocument();
    });

    test('Open and Close "Manage Pizzas" modal', async () => {
        render(<App/>);

        const PizzaButton = await screen.findByText(/Create Pizza/);
        fireEvent.click(PizzaButton);

        expect(screen.getByText(/Manage Pizzas/)).toBeInTheDocument();

        const closeButton = await screen.findByText(/Close/);
        fireEvent.click(closeButton);

        expect(screen.queryByText(/Manage Pizzas/)).not.toBeInTheDocument();
    });

});

describe('EditPizza Modal', () => {
    const testPizza = {
      id: 1,
      name: 'testingPizza1',
      toppings: [
        {id: 1, name: 'Topping1'},
        {id: 2, name: 'Topping2'}
      ]
    };

    const testToppings = [
      {id: 1, name: 'Topping1'},
      {id: 2, name: 'Topping2'},
      {id: 3, name: 'Topping3'}
    ];

    let mockOnPizzaUpdated;

    beforeEach(() => {
      jest.resetAllMocks();
      mockOnPizzaUpdated = jest.fn();
      DataApi.getToppings.mockResolvedValue(testToppings);
      DataApi.updatePizza.mockResolvedValue({
        ...testPizza,
        name: 'New testingPizza1',
        toppings: [
          {id: 1, name: 'Topping1'},
          {id: 3, name: 'Topping3'}
        ]
      }) 
    });

    test('Should allow changing pizza name', async () => {
        render(<EditPizza pizza={testPizza} onPizzaUpdated={mockOnPizzaUpdated}/>);
    
        const input = screen.getByPlaceholderText(/Pizza name/i);
        fireEvent.change(input, { target: { value: 'New testingPizza1' } });

        const updateButton = screen.getByText('Update Pizza');
        fireEvent.click(updateButton);

        await waitFor(() => {
          expect(DataApi.updatePizza).toHaveBeenCalledWith(
            testPizza.id,
            'New testingPizza1',
            testPizza.toppings.map((t) => t.id)
          );
          expect(mockOnPizzaUpdated).toHaveBeenCalledWith(expect.objectContaining({ name: 'New testingPizza1' }));
        });
    });

    test('Should Allow changing pizza toppings', async () =>{
        render(<EditPizza pizza={testPizza} onPizzaUpdated={mockOnPizzaUpdated} />);

        await waitFor(() => expect(screen.getAllByRole('checkbox')).toHaveLength(testToppings.length));

        const toppingCheckboxes = screen.getAllByRole('checkbox');

        expect(toppingCheckboxes[0].checked).toBe(true);

        expect(toppingCheckboxes[1].checked).toBe(true);
        fireEvent.click(toppingCheckboxes[1]);
        expect(toppingCheckboxes[1].checked).toBe(false);

        expect(toppingCheckboxes[2].checked).toBe(false);
        fireEvent.click(toppingCheckboxes[2]);
        expect(toppingCheckboxes[2].checked).toBe(true);

        const updateButton = screen.getByText('Update Pizza');
        fireEvent.click(updateButton);

        await waitFor(() => {
          expect(DataApi.updatePizza).toHaveBeenCalledWith(
            testPizza.id,
            testPizza.name,
            [testToppings[0].id, testToppings[2].id]
          );
          expect(mockOnPizzaUpdated).toHaveBeenCalledWith(expect.objectContaining({
            toppings: [
              { id: testToppings[0].id, name: testToppings[0].name },
              { id: testToppings[2].id, name: testToppings[2].name }
            ]
          }));
        });
        
    });

    test('Should prevent duplicate pizza names', async () => {
      DataApi.updatePizza.mockRejectedValueOnce({
        response: { data: { message: 'Pizza with this name already exists' } }
      });

      render(<EditPizza pizza={testPizza} onPizzaUpdated={mockOnPizzaUpdated}/>);

      const input = screen.getByPlaceholderText(/Pizza name/i);
      fireEvent.change(input, { target: { value: 'Duplicate' } });

      const updateButton = screen.getByText('Update Pizza');
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText('Pizza with this name already exists')).toBeInTheDocument();
        expect(mockOnPizzaUpdated).not.toHaveBeenCalled();
      });
    });

    test('Should prevent duplicate pizza toppings', async () => {
      DataApi.updatePizza.mockRejectedValueOnce({
        response: { data: { message: 'A pizza like this already exists' } }
      });

      render(<EditPizza pizza={testPizza} onPizzaUpdated={mockOnPizzaUpdated}/>);

      await waitFor(() => expect(screen.getAllByRole('checkbox')).toHaveLength(testToppings.length));

      const toppingCheckboxes = screen.getAllByRole('checkbox');

      fireEvent.click(toppingCheckboxes[0]);
      fireEvent.click(toppingCheckboxes[1]);
      
      const updateButton = screen.getByText('Update Pizza');
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText('A pizza like this already exists')).toBeInTheDocument();
        expect(mockOnPizzaUpdated).not.toHaveBeenCalled();
      });

    });

});

describe('Pizzas Modal', () => {

  beforeEach(() => {

  });

  test('', async () => {

  });

});