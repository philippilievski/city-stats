import {expect, test} from '@playwright/test';
import {MarkerMetadata} from '../src/app/data/marker-metadata';

test.describe('map tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/marker', async (route) => {
      const json: MarkerMetadata[] = [];
      await route.fulfill({ json });
    });

    await page.goto('http://localhost:4200');
  });

  test('map container should be visible',async ({ page }) => {
    const mapContainer = page.getByTestId('map-container');
    await expect(mapContainer).toBeVisible();
  });

  test('map should be visible', async ({ page }) => {
    const map = page.getByTestId('map');
    await expect(map).toBeVisible();
  });

  test('map options should be visible', async ({ page }) => {
    const mapOptionsContainer = page.getByTestId('map-options-container');
    const mapOptionsFlyButton = page.getByTestId('map-options-fly-button');
    await expect(mapOptionsContainer).toBeVisible();
    await expect(mapOptionsFlyButton).toBeVisible();
  });
})
