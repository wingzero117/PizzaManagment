const { test, expect } = require('@playwright/test');

test.describe('Pizza Management', () => {
  test('Should create topping and display it', async ({ page }) => {
    await page.goto('/');

    await page.click('text=Toppings');
    await expect(page.locator('h2')).toHaveText('Manage Toppings');

    await page.fill('input[placeholder="Enter topping name"]', 'Test Topping');
    await page.click('div[role="dialog"] button:has-text("Add Topping")');

    await expect(page.locator('text=Test Topping')).toBeVisible();

  });

  test('Should change a topping', async ({ page }) => {
    await page.goto('/');

    await page.click('text=Toppings');
    await expect(page.locator('h2')).toHaveText('Manage Toppings');

    const toppingItem = page.locator('li', { hasText: 'Test Topping' });
    await toppingItem.locator('button:has-text("Edit")').click();

    await page.fill('input[placeholder="Enter topping name"]', 'New Test Topping');
    await page.click('div[role="dialog"] button:has-text("Update Topping")');

    await expect(page.locator('text=New Test Topping')).toBeVisible();
  });

  test('Should prevent duplicate toppings', async ({ page }) => {
    await page.goto('/');

    await page.click('text=Toppings');
    await expect(page.locator('h2')).toHaveText('Manage Toppings');
    
    await page.fill('input[placeholder="Enter topping name"]', 'New Test Topping');
    await page.click('div[role="dialog"] button:has-text("Add Topping")');

    await expect(page.locator('text=Topping already exists')).toBeVisible();
  });

  test('Should create a new pizza and display it', async ({ page }) => {
    await page.goto('/');

    await page.click('text=Create Pizza');
    await expect(page.locator('h2')).toHaveText('Create Pizzas');

    await page.fill('input[placeholder="Enter pizza name"]', 'Test Pizza');
    await page.click('label:text("New Test Topping")'); 

    await page.click('div[role="dialog"] button:has-text("Create Pizza")');

    await page.click('text=Close');

    await expect(page.locator('text=Test Pizza')).toBeVisible();
  });

  test('Should prevent duplicate pizzas (name)', async ({ page }) => {
    await page.goto('/');

    await page.click('text=Create Pizza');
    await expect(page.locator('h2')).toHaveText('Create Pizzas');

    await page.fill('input[placeholder="Enter pizza name"]', 'Test Pizza');
    await page.click('label:text("New Test Topping")'); 

    await page.click('div[role="dialog"] button:has-text("Create Pizza")');

    await expect(page.locator('text=Pizza with this name already exists')).toBeVisible();
  });

  test('Should prevent duplicate pizzas (toppings)', async ({ page }) => {
    await page.goto('/');

    await page.click('text=Create Pizza');
    await expect(page.locator('h2')).toHaveText('Create Pizzas');

    await page.fill('input[placeholder="Enter pizza name"]', 'Test Pizza 2');
    await page.click('Label:text("New Test Topping")');

    await page.click('div[role="dialog"] button:has-text("Create Pizza")');

    await expect(page.locator('text=A pizza like this already exists')).toBeVisible();
  });

  test('Should change a pizza name', async ({ page }) => {
    await page.goto('/');

    const pizzaItem = page.locator('li', { hasText: 'Test Pizza' });
    await pizzaItem.locator('button:has-text("Edit")').click();

    await expect(page.locator('h2')).toHaveText('Edit Pizza');

    await page.fill('input[placeholder="Pizza name"]', 'New Test Pizza');

    await page.click('div[role="dialog"] button:has-text("Update Pizza")');

    await expect(page.locator('text=New Test Pizza')).toBeVisible();
  });

  test('Should change a pizza toppings', async ({ page }) => {
    await page.goto('/');

    await page.click('text=Toppings');

    await page.fill('input[placeholder="Enter topping name"]', 'Test Topping 2');
    await page.click('div[role="dialog"] button:has-text("Add Topping")');

    await expect(page.locator('text=Test Topping 2')).toBeVisible(); 

    await page.click('text=Close');

    const pizzaItem = page.locator('li', { hasText: 'New Test Pizza' });
    await pizzaItem.locator('button:has-text("Edit")').click();

    await expect(page.locator('h2')).toHaveText('Edit Pizza');

    await page.click('label:text("Test Topping 2")'); 

    await page.click('div[role="dialog"] button:has-text("Update Pizza")');

    await expect(page.locator('text=New Test Pizza - Toppings: New Test Topping, Test Topping 2')).toBeVisible();
  });

  test('Should delete a pizza and have it removed', async ({ page }) => {
    await page.goto('/');

    const pizzaItem = page.locator('li', { hasText: 'New Test Pizza' });
    await pizzaItem.locator('button:has-text("Delete")').click();

    await expect(page.locator('text=New Test Pizza')).not.toBeVisible();
  });

  test('Should delete a topping and have it removed', async ({ page }) => {
    await page.goto('/');
  
    await page.click('text=Toppings');
    await expect(page.locator('h2')).toHaveText('Manage Toppings');
  
    const toppingItem1 = page.locator('li', { hasText: 'New Test Topping' });
    await toppingItem1.locator('button:has-text("Delete")').click();

    const toppingItem2 = page.locator('li', { hasText: 'Test Topping 2' });
    await toppingItem2.locator('button:has-text("Delete")').click();
  
    await expect(page.locator('li', { hasText: 'New Test Topping' })).not.toBeVisible();
  });

});



