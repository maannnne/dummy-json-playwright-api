import { test } from '../../src/fixtures/fixtures';
import { GetProductDTO, GetAllProductsDTO } from '../../src/interfaces-and-dtos/getProduct.dto';
import { APIValidationMessages as msgs } from '../../src/test-data/validationMessages';
import { base, faker } from '@faker-js/faker';
import { expect } from '@playwright/test';

// ------------ TEST DATA ------------
const existingQueriesForSearch = ['book', 'mascara', 'phone', 'shirt'];
const randomQuery = faker.helpers.arrayElement(existingQueriesForSearch);
const nonExistingQueryForSearch = faker.string.alphanumeric({ length: 8 });

/* for validating the most important keys that should be visible in the json
   this is just random subset, this will depend on real requirements */
const keysToValidate: (keyof GetProductDTO)[] = [
    'id',
    'title',
    'description',
    'category',
    'price',
    'discountPercentage',
    'rating',
    'stock',
    'brand',
    'sku',
    'availabilityStatus',
];
const allProductsKeysToValidate: (keyof GetAllProductsDTO)[] = ['limit', 'products', 'skip', 'total'];

test.describe('Search products with query tests', () => {
    test('Search products with existing query, validate product details and the search word', async ({
        productsApi,
        baseValidator,
    }) => {
        // Get the product by id
        const productResponse = await productsApi.searchProduct(randomQuery);

        // Check the status code - should be 200OK
        await baseValidator.validateStatusCode(productResponse, 200, 'Status code should be 200');

        // Get the response json and product 0 details
        const responseJson = (await productResponse.json()) as GetAllProductsDTO;
        const p0Details = responseJson.products[0];

        // Check that first product contains all important keys (random subset of keys, but should be based on requirements)
        await baseValidator.validateResponseKeys(p0Details, keysToValidate);

        // Validate the values of title and description keys of the 1st product, because that is where the search word is looked for
        expect(`${p0Details.title} ${p0Details.description}`.toLowerCase()).toContain(randomQuery);
    });

    test('Search products with non-existing query, validate the returned response', async ({
        productsApi,
        baseValidator,
    }) => {
        // Get the product by id
        const productResponse = await productsApi.searchProduct(nonExistingQueryForSearch);

        // Check the status code - should be 200OK
        await baseValidator.validateStatusCode(productResponse, 200, 'Status code should be 200');

        // Get the response json and product 0 details
        // TODO: add this everywhere
        const responseJson = (await productResponse.json()) as GetAllProductsDTO;
        console.log(responseJson);

        // Validate the response
        await baseValidator.validateResponseKeys(responseJson, allProductsKeysToValidate);

        // Check that the total, skip and limit are 0
        await baseValidator.validateKeyValuePair(responseJson, 'total', 0);
        await baseValidator.validateKeyValuePair(responseJson, 'skip', 0);
        await baseValidator.validateKeyValuePair(responseJson, 'limit', 0);

        // Check that the products array is empty
        await baseValidator.validateKeyValuePair(responseJson, 'products', []);
    });
});
