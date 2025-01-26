const { test, expect } = require('@playwright/test');

test('Should create a new pizza and display it', async ({ page }) => {
  await page.goto('/'); // Base URL defined in config

  // Open "Create Pizza" modal
  await page.click('text=Create Pizza');
  await expect(page).toHaveText('Manage Pizzas');

  // Fill in the pizza details
  await page.fill('input[placeholder="Pizza name"]', 'Test Pizza');
  await page.check('text=Topping1'); // Select topping

  // Save the pizza
  await page.click('text=Save');
  await page.waitForSelector('text=Test Pizza'); // Ensure pizza is displayed
});
