const { test, expect } = require('@playwright/test');

test('create a new pizza', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.fill('input[name="pizzaName"]', 'Hawaiian');
    await page.check('input[name="topping"][value="1"]');
    await page.check('input[name="topping"][value="2"]');
    await page.click('button[type="submit"]');

    const successMessage = await page.textContent('.success');
    expect(successMessage).toBe('Pizza created successfully!');
});
