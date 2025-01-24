import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';
import DataApi from './services/Data';
import EditPizza from './components/EditPizzas';
import CreatePizza from './components/CreatePizzas';
import ManageTopping from './components/ManageToppings';

jest.mock('./services/Data', () => ({
  getPizzas: jest.fn(),
  deletePizza: jest.fn(),
  getToppings: jest.fn(),
  updatePizza: jest.fn(),
  createPizza: jest.fn(),
  deleteTopping: jest.fn(),
  createTopping: jest.fn(),
  updateTopping: jest.fn()
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

    test('Open and Close "Create Pizzas" modal', async () => {
        render(<App/>);

        const PizzaButton = await screen.findByText(/Create Pizza/);
        fireEvent.click(PizzaButton);

        expect(screen.getByText(/Create Pizzas/)).toBeInTheDocument();

        const closeButton = await screen.findByText(/Close/);
        fireEvent.click(closeButton);

        expect(screen.queryByText(/Create Pizzas/)).not.toBeInTheDocument();
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

/*

*/

describe('CreatePizza Modal', () => {

  const testPizzas = 
   [
    { id: 1, name: 'testingPizza1', toppings: [ {id: 1, name: 'Topping1'}, {id: 2, name: 'Topping2'} ]}
   ]
  ;

  const testToppings = [
    {id: 1, name: 'Topping1'},
    {id: 2, name: 'Topping2'},
    {id: 3, name: 'Topping3'}
  ];

  beforeEach(() => {
    jest.resetAllMocks();
    mockOnPizzaCreated = jest.fn();
    DataApi.getPizzas.mockResolvedValue(testPizzas);
    DataApi.getToppings.mockResolvedValue(testToppings);
    DataApi.createPizza.mockResolvedValue({
        name: 'testingPizza2',
        toppings: [
          {id: 1, name: 'Topping1'},
          {id: 3, name: 'Topping3'}
        ]
    });
  });

  test('Should allow users to see a list of pizzas and toppings', async () => {
    render(<CreatePizza onPizzaCreated={mockOnPizzaCreated}/>);

    await waitFor(() => expect(screen.getByText(/testingPizza1/)).toBeInTheDocument());

    expect(screen.getByText(/Topping1, Topping2/)).toBeInTheDocument();

  });

  test('Should allow users to create new pizzas and add toppings', async () => {
    render(<CreatePizza onPizzaCreated={mockOnPizzaCreated}/>);

    const input = screen.getByPlaceholderText("Enter pizza name");
    fireEvent.change(input, { target: { value: 'testingPizza2' } });

    await waitFor(() => expect(screen.getAllByRole('checkbox')).toHaveLength(testToppings.length));
    const toppingsCheckbox = screen.getAllByRole('checkbox');
    fireEvent.click(toppingsCheckbox[0]);
    fireEvent.click(toppingsCheckbox[2]);

    const createButton = screen.getByText('Create Pizza');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(DataApi.createPizza).toHaveBeenCalledWith(
        'testingPizza2',
        [testToppings[0].id, testToppings[2].id]
      );
      expect(mockOnPizzaCreated).toHaveBeenCalledWith(expect.objectContaining({
        name: 'testingPizza2',
        toppings: [
          { id: testToppings[0].id, name: testToppings[0].name },
          { id: testToppings[2].id, name: testToppings[2].name }
        ]
      }));
    });

  });

  test('Should prevent duplicate pizza names', async () => {
    DataApi.createPizza.mockRejectedValueOnce({
      response: { data: { message: 'Pizza with this name already exists' } }
    });

    render(<CreatePizza onPizzaCreated={mockOnPizzaCreated}/>);

    const input = screen.getByPlaceholderText("Enter pizza name");
    fireEvent.change(input, { target: { value: 'testingPizza1' } });

    await waitFor(() => expect(screen.getAllByRole('checkbox')).toHaveLength(testToppings.length));
    const toppingsCheckbox = screen.getAllByRole('checkbox');
    fireEvent.click(toppingsCheckbox[0]);
    fireEvent.click(toppingsCheckbox[2]);

    const createButton = screen.getByText('Create Pizza');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Pizza with this name already exists')).toBeInTheDocument();
      expect(mockOnPizzaCreated).not.toHaveBeenCalled();
    });
  });

  test('Should prevent duplicate pizza toppings', async () => {
    DataApi.createPizza.mockRejectedValueOnce({
      response: { data: { message: 'A pizza like this already exists' } }
    });

    render(<CreatePizza onPizzaCreated={mockOnPizzaCreated}/>);

    const input = screen.getByPlaceholderText("Enter pizza name");
    fireEvent.change(input, { target: { value: 'testingPizza2' } });

    await waitFor(() => expect(screen.getAllByRole('checkbox')).toHaveLength(testToppings.length));
    const toppingsCheckbox = screen.getAllByRole('checkbox');
    fireEvent.click(toppingsCheckbox[0]);
    fireEvent.click(toppingsCheckbox[1]);

    const createButton = screen.getByText('Create Pizza');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('A pizza like this already exists')).toBeInTheDocument();
      expect(mockOnPizzaCreated).not.toHaveBeenCalled();
    });
  });

});

describe('ManageToppings Modal', () => {

  const testToppings = [
    {id: 1, name: 'Topping1'},
    {id: 2, name: 'Topping2'},
    {id: 3, name: 'Topping3'}
  ];

  beforeEach(() => {
    jest.resetAllMocks();
    DataApi.getToppings.mockResolvedValue(testToppings);
    DataApi.createTopping.mockResolvedValue({ name: 'Topping4' });
    DataApi.updateTopping.mockResolvedValue({
      ...testToppings, 
      id:3, name: "NewTopping3" });
  });

  test('Should allow users to see a list of toppings', async () => {
    render(<ManageTopping/>);

    await waitFor(() => expect(screen.getByText(/Topping1/)).toBeInTheDocument());

    expect(screen.getByText(/Topping1/)).toBeInTheDocument();
    expect(screen.getByText(/Topping2/)).toBeInTheDocument();
    expect(screen.getByText(/Topping3/)).toBeInTheDocument();
  });

  test('Should allow users to add a new topping', async () => {
    render(<ManageTopping/>);

    const input = screen.getByPlaceholderText('Enter topping name');
    fireEvent.change(input, { target: { value: 'Topping4'} });

    const addButton = screen.getByText('Add Topping');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(DataApi.createTopping).toHaveBeenCalledWith(
        'Topping4'
      );
      expect(screen.getByText(/Topping4/)).toBeInTheDocument();
    });
  });

  test('Should allow users to delete a topping', async () => {
    DataApi.deleteTopping.mockResolvedValue({});
    render(<ManageTopping/>);

    await waitFor(() => expect(screen.getByText(/Topping1/)).toBeInTheDocument());

    const deleteButton = await screen.getAllByText(/Delete/);
    fireEvent.click(deleteButton[0]);

    await waitFor(() => {
      expect(DataApi.deleteTopping).toHaveBeenCalledWith(1);
      expect(screen.queryByText(/Topping1/)).not.toBeInTheDocument();
    });

  });

  test('Should allow users to update a topping', async () => {
    render(<ManageTopping/>);

    await waitFor(() => expect(screen.getByText(/Topping3/)).toBeInTheDocument());

    const editButtons = screen.getAllByText(/Edit/);
    fireEvent.click(editButtons[2]);

    const input = screen.getByPlaceholderText('Enter topping name');
    fireEvent.change(input, { target: { value: 'NewTopping3' } });

    const updateButton = screen.getByText(/Update Topping/);
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(DataApi.updateTopping).toHaveBeenCalledWith(
        3,
        'NewTopping3'
      );
      expect(screen.queryByText(/NewTopping3/)).toBeInTheDocument();
    });
  });

  test('Should prevent duplicate topping names (Add Topping)', async () => {
    DataApi.createTopping.mockRejectedValueOnce({
      response: { data: { message: 'Topping already exists' } }
    });
    render(<ManageTopping/>);

    const input = screen.getByPlaceholderText('Enter topping name');
    fireEvent.change(input, { target: { value: 'Topping1' } });

    const addButton = screen.getByText(/Add Topping/);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Topping already exists')).toBeInTheDocument();
    });
  });

  test('Should prevent duplicate topping names (Update Topping)', async () => {
    DataApi.updateTopping.mockRejectedValueOnce({
      response: { data: { message: 'Topping already exists' } }
    });
    render(<ManageTopping/>);

    await waitFor(() => expect(screen.getByText(/Topping1/)).toBeInTheDocument());

    const editButtons = screen.getAllByText(/Edit/);
    fireEvent.click(editButtons[0]);

    const input = screen.getByPlaceholderText('Enter topping name');
    fireEvent.change(input, { target: { value: 'Topping3' } });

    const updateButton = screen.getByText(/Update Topping/);
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText('Topping already exists')).toBeInTheDocument();
    });
  });

});