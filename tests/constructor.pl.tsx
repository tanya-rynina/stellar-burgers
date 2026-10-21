import { test, expect } from '@playwright/test';

test.describe('Тестирование конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
   
    await page.routeFromHAR('./tests/hars/ingredients.har', { update: false });
    await page.routeFromHAR('./tests/hars/user.har', { update: false });
    await page.routeFromHAR('./tests/hars/order.har', { update: false });

   
    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'Bearer fake-access-token',
        domain: 'localhost',
        path: '/',
      },
    ]);
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'fake-refresh-token');
    });

     await page.goto('/');
    await expect(page.getByText('Мок Булка')).toBeVisible();
  });

  test('Добавление ингредиентов в конструктор', async ({ page }) => {
  
    const bunCard = page.locator('li', { hasText: 'Мок Булка' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();
    
      await expect(page.getByText('Мок Булка (верх)')).toBeVisible();
    await expect(page.getByText('Мок Булка (низ)')).toBeVisible();

   
    const mainCard = page.locator('li', { hasText: 'Мок Начинка' });
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

   
    await expect(page.locator('.constructor-element__text', { hasText: 'Мок Начинка' })).toBeVisible();
  });

  test('Работа модального окна ингредиента', async ({ page }) => {
    
    await page.getByRole('link', { name: 'Мок Булка' }).click();

   
    await expect(page.getByText('Детали ингредиента')).toBeVisible();
    await expect(page.locator('.text_type_main-medium', { hasText: 'Мок Булка' })).toBeVisible();

     await page.locator('button[aria-label="Закрыть"]').click();
    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();

     await page.getByRole('link', { name: 'Мок Булка' }).click();
    await expect(page.getByText('Детали ингредиента')).toBeVisible();
    
    await page.mouse.click(10, 10);
    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
  });

  test('Создание заказа', async ({ page }) => {
  
    await page.locator('li', { hasText: 'Мок Булка' }).getByRole('button', { name: 'Добавить' }).click();
    await page.locator('li', { hasText: 'Мок Начинка' }).getByRole('button', { name: 'Добавить' }).click();

   
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

   
         await expect(page.getByText('идентификатор заказа')).toBeVisible();

   
    await page.locator('button[aria-label="Закрыть"]').click();

    
    await expect(page.getByText('Выберите булки')).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();
  });
});