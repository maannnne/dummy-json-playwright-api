import { test } from '../../src/fixtures/fixtures';
import { faker } from '@faker-js/faker';
import { expect } from '@playwright/test';
import { allProductCategories } from '../../src/test-data/productCategories';

const randomExistingCategory = faker.helpers.arrayElement(allProductCategories);

test.describe('Get product category list tests', () => {
    test('Get product category list', async ({ baseValidator, productsApi }) => {
        // Get product category list
        const response = await productsApi.getProductsCategoryList();

        // Validate the status code - should be 200 OK
        await baseValidator.validateStatusCode(response, 200, 'Status code should be 200');

        // Make sure the array of categories is not empty
        expect(response.responseJson.length, 'Category list should not be empty').toBeGreaterThanOrEqual(1);

        // Validate the list contains a random expected category from expected categories list
        expect(response.responseJson, 'Response should contain the expected category').toContain(
            randomExistingCategory,
        );
    });
});
