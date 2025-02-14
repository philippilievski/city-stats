import {expect, test} from '@playwright/test';

test.describe('city list tests', () => {
  test.beforeEach(async ({page}) => {
    await page.route('**/city', async (route) => {
      if(route.request().method() === 'GET') {
        await route.fulfill({ json: [{"id":23,"title":"Wien","population":100,"marker":{"id":101,"lat":"48.18366880131799","lon":"16.39230159015741","cityId":23}}]})
      }
    })
    await page.goto('http://localhost:4200');
  });

  test('it should display city in datatable', ({ page }) => {
    const tableRow = page.getByTestId('tablerow-city-list');
    expect(tableRow).toBeVisible();
  })

  test('it should display delete button in tablerow', ({ page }) => {
    const deleteButton = page.getByTestId('delete-button-city-list');
    expect(deleteButton).toBeVisible();
  })

})
