import {expect, test} from '@playwright/test';
import {newMarker, singleMarker} from './data/markerMetadata';

test.describe('marker tests', () => {
  test.beforeEach(async ({page}) => {
    await page.route('**/marker', async (route) => {
      console.log("request type", route.request().method())
      console.log("i am here", route.request().url())
      const json = singleMarker;
      await route.fulfill({json});
    });
  });

  test('it should show markers on the map', async ({page}) => {
    await page.goto('http://localhost:4200');
    const marker = page.getByTestId('test-icon');
    await expect(marker).toBeVisible();
  });

  test('it should add a marker on click', async ({page}) => {
    await page.unroute('**/marker');
    await page.route('**/marker', async (route) => {
      console.log(route.request().method());
      if (route.request().method() === 'GET') {
        await route.fulfill({json: newMarker});
      }
      if (route.request().method() === 'POST') {
        await route.fulfill({
          json: {
            "lat": 52.8823912222619,
            "lon": -5.229492187500001
          }
        })
      }
    });
    await page.goto('http://localhost:4200');
    const map = page.getByTestId('map');
    await page.unroute('**/marker');
    await page.route('**/marker', async (route) => {
      console.log(route.request().method());
      if (route.request().method() === 'POST') {
        await route.fulfill({
          json: {
            "lat": 52.8823912222619,
            "lon": -5.229492187500001
          }
        })
      }

      if (route.request().method() === 'GET') {
        await route.fulfill({json: singleMarker});
      }
    });
    await map.click({position: {x: 200, y: 200}})
  })
});
