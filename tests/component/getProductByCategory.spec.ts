import { test } from '../../src/fixtures/fixtures';
import { faker } from '@faker-js/faker';
import { expect } from '@playwright/test';
import { allProductCategories } from '../../src/test-data/productCategories';
import { ProductsListResponseDTO, GetProductResponseDTO } from '../../src/interfaces-and-dtos/products.dto';

const randomExistingCategory = faker.helpers.arrayElement(allProductCategories);
const randomNonExistingCategory = faker.string.alphanumeric({ length: 8 });

/* for validating the most important keys that should be visible in the json
   this is just random subset, this will depend on real requirements */
const productKeysToValidate: (keyof GetProductResponseDTO)[] = ['id', 'title', 'description', 'category', 'price'];
const allProductsKeysToValidate: (keyof ProductsListResponseDTO)[] = ['limit', 'products', 'skip', 'total'];

test.describe('Get prodyct by category tests', () => {
    test('Get product by existing category and validate the response', async ({ baseValidator, productsApi }) => {
        // Get product by category
        const response = await productsApi.getProductByCategory(randomExistingCategory);

        // Validate the status code - should be 200 OK
        await baseValidator.validateStatusCode(response, 200, 'Status code should be 200');

        // Check that the response contains all neccessary keys
        await baseValidator.validateResponseKeys(response.responseJson, allProductsKeysToValidate);

        // Validate the products is not an empty array
        expect(response.responseJson.products.length, 'Products array should not be empty').toBeGreaterThanOrEqual(1);

        // Validate a random product, check that response contains the all important keys (random subset of keys, but should be based on requirements)
        await baseValidator.validateResponseKeys(
            response.responseJson.products[response.responseJson.products.length - 1],
            productKeysToValidate,
        );

        // Validate the category is correct for all products
        await baseValidator.validateKeyValuePairsInObjectsArray(
            response.responseJson.products,
            'category',
            randomExistingCategory,
            `All categories in the list of products should be ${randomExistingCategory}`,
        );
    });

    test('Negative case - Get product by non-existing category and validate the response', async ({
        baseValidator,
        productsApi,
    }) => {
        // Get produuct by category
        const response = await productsApi.getProductByCategory(randomNonExistingCategory);

        // Validate the status code - should be 200 OK
        await baseValidator.validateStatusCode(response, 200, 'Status code should be 200');

        // Check that the response contains all neccessary keys
        await baseValidator.validateResponseKeys(response.responseJson, allProductsKeysToValidate);

        // Validate the products an empty array
        expect(response.responseJson.products.length, 'Products array should be empty').toBe(0);

        // Check total, skip and limit - should also be 0
        expect(response.responseJson.limit, 'Response limit should be 0').toBe(0);
        expect(response.responseJson.skip, 'Response skip should be 0').toBe(0);
        expect(response.responseJson.total, 'Response total should be 0').toBe(0);
    });
});
