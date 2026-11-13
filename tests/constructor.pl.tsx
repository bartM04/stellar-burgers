import { test, expect } from '@playwright/test';

test.describe('Тестирование конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
    });

    await page.routeFromHAR('tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false,
    });

    await page.routeFromHAR('tests/hars/order.har', {
      url: '**/api/orders',
      update: false,
    });

    await page.context().addCookies([
      { name: 'accessToken', value: 'fake-jwt-token', domain: 'localhost', path: '/' },
    ]);

    await page.addInitScript(() => {
      window.localStorage.setItem('refreshToken', 'fake-refresh-token');
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async ({ page }) => {
    const closeButton = page.getByRole('button', { name: 'Закрыть' });
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
  });

  test('Добавление ингредиентов и работа модального окна', async ({ page }) => {
    const bunCard = page.getByRole('listitem').filter({ hasText: 'Краторная булка N-200i' });
    const fillingCard = page.getByRole('listitem').filter({ hasText: 'Биокотлета из марсианской Магнолии' });

    await expect(bunCard.first()).toBeVisible();

    await bunCard.getByRole('button').first().click();
    await fillingCard.getByRole('button').first().click();

    await expect(page.getByText('Краторная булка N-200i')).toHaveCount(3);

    await fillingCard.first().click();

    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Биокотлета из марсианской Магнолии' })).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).not.toBeVisible();

    await fillingCard.first().click();
    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeVisible();

    await page.locator('[class*="modal-overlay__overlay"]').click({ position: { x: 10, y: 10 } });
    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).not.toBeVisible();
  });

  test('Процесс создания заказа', async ({ page }) => {
    const bunCard = page.getByRole('listitem').filter({ hasText: 'Краторная булка N-200i' });
    const fillingCard = page.getByRole('listitem').filter({ hasText: 'Биокотлета из марсианской Магнолии' });

    await bunCard.getByRole('button').first().click();
    await fillingCard.getByRole('button').first().click();

    await expect(page.getByText('Краторная булка N-200i')).toHaveCount(3);

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByText('536')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Ваш заказ начали готовить')).toBeVisible();

    await expect(page.locator('.burger-constructor__list').locator('li')).toHaveCount(0);

    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(page.getByText('Ваш заказ начали готовить')).not.toBeVisible();
    await expect(page).toHaveURL('http://localhost:4000/');
  });
});