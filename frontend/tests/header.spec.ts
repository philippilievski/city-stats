import {expect, test} from '@playwright/test';

test.describe('header navigation tests', () => {
  test('it should navigate to stats on click', async ({page}) => {
    await page.goto('http://localhost:4200');
    const statsButton = page.getByTestId('navigationmenu-stats-button');
    await statsButton.click();
    await expect(page).toHaveURL('http://localhost:4200/stats');
  })

  test('it should navigate to home on click', async ({page}) => {
    await page.goto('http://localhost:4200/stats');
    const homeButton = page.getByTestId('navigationmenu-home-button');
    await homeButton.click();
    await expect(page).toHaveURL('http://localhost:4200/home');
  })
})
