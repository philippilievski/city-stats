import {expect, test} from '@playwright/test';

test.describe('home page', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:4200');
  });

  test('it should redirect on default url', async ({page}) => {
    await expect(page).toHaveURL('http://localhost:4200/home')
  });

  test('header container should be visible', async ({page}) => {
    const headerContainer = page.getByTestId('header-container');

    await expect(headerContainer).toBeVisible();
  })
})
