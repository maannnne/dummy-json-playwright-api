import { test } from '../../src/fixtures/fixtures';
import { CategoryDTO } from '../../src/interfaces-and-dtos/categories.dto';
import { faker } from '@faker-js/faker';
import { expect } from '@playwright/test';
import { allProductCategories } from '../../src/test-data/productCategories';

const randomExistingCategory = faker.helpers.arrayElement(allProductCategories);

test.describe('Get product category list tests', () => {
    test('Get product category list', async ({ baseValidator, productsApi }) => {
        // Get all product categories
        const response = await productsApi.getProductsCategoryList();

        // Validate the status code - should be 200 OK
        await baseValidator.validateStatusCode(response, 200, 'Status code should be 200');

        // Get the response json
        const resJson = (await response.json()) as string[];

        // Make sure the array of categories is not empty
        expect(resJson.length).toBeGreaterThanOrEqual(1);

        // Validate the list contains a random expected category from expected categories list
        expect(resJson).toContain(randomExistingCategory);
    });
});
