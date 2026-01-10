import { test } from '../../src/fixtures/fixtures';
import { GetProductResponseDTO, ProductsListResponseDTO } from '../../src/interfaces-and-dtos/products.dto';
import { faker } from '@faker-js/faker';
import { expect } from '@playwright/test';

// ------------ TEST DATA ------------
const existingQueriesForSearch = ['book', 'mascara', 'phone', 'shirt'];
const randomQuery = faker.helpers.arrayElement(existingQueriesForSearch);
const nonExistingQueryForSearch = faker.string.alphanumeric({ length: 8 });

/* for validating the most important keys that should be visible in the json
   this is just random subset, this will depend on real requirements */
const keysToValidate: (keyof GetProductResponseDTO)[] = ['id', 'title', 'description', 'category', 'price'];
const allProductsKeysToValidate: (keyof ProductsListResponseDTO)[] = ['limit', 'products', 'skip', 'total'];

test.describe('Search products with query tests', () => {
    test('Search products with existing query, validate product details and the search word', async ({
        productsApi,
        baseValidator,
    }) => {
        // Search product with random query
        const res = await productsApi.searchProduct(randomQuery);

        // Check the status code - should be 200OK
        await baseValidator.validateStatusCode(res, 200, 'Status code should be 200');

        const randomProductDetails = res.responseJson.products[res.responseJson.products.length - 1];

        // Check that first product contains all important keys (random subset of keys, but should be based on requirements)
        await baseValidator.validateResponseKeys(randomProductDetails, keysToValidate);

        // Validate the values of title and description keys of the 1st product, because that is where the search word is looked for
        expect(
            `${randomProductDetails.title} ${randomProductDetails.description}`.toLowerCase(),
            'Response description should contain the query word',
        ).toContain(randomQuery);
    });

    test('Negative - Search products with non-existing query, validate the returned response', async ({
        productsApi,
        baseValidator,
    }) => {
        // Search product with random query
        const res = await productsApi.searchProduct(nonExistingQueryForSearch);

        // Check the status code - should be 200OK
        await baseValidator.validateStatusCode(res, 200, 'Status code should be 200');

        // Validate the response
        await baseValidator.validateResponseKeys(res.responseJson, allProductsKeysToValidate);

        // Check that the total, skip and limit are 0
        await baseValidator.validateKeyValuePair(res.responseJson, 'total', 0, 'Response total should be 0');
        await baseValidator.validateKeyValuePair(res.responseJson, 'skip', 0, 'Response skip should be 0');
        await baseValidator.validateKeyValuePair(res.responseJson, 'limit', 0, 'Response limit should be 0');

        // Check that the products array is empty
        await baseValidator.validateKeyValuePair(res.responseJson, 'products', [], 'Products array should be empty');
    });
});
