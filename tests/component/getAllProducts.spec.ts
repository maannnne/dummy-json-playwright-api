import { expect } from '@playwright/test';
import { test } from '../../src/fixtures/fixtures';
import { GetProductResponseDTO, ProductsListResponseDTO } from '../../src/interfaces-and-dtos/products.dto';
import { faker } from '@faker-js/faker';

/* for validating the most important keys that should be visible in the json
this is just random subset, this will depend on real requirements */
// ------------ TEST DATA ------------
const productKeysToValidate: (keyof GetProductResponseDTO)[] = ['id', 'title', 'description', 'category', 'price'];
const allProductsKeysToValidate: (keyof ProductsListResponseDTO)[] = ['limit', 'products', 'skip', 'total'];
const randomKeyFromKeysTovalidate =
    productKeysToValidate[faker.number.int({ min: 0, max: productKeysToValidate.length - 1 })];

const limitForAllProducts = 0, // limit set to 0 displays all products
    randomLimit = faker.number.int({ min: 1, max: 60 }), // random number within the limit of exisitng products
    randomSkip = faker.number.int({ min: 1, max: 60 }), // random skip
    randomSelect = randomKeyFromKeysTovalidate; // random key for each execution

test.describe('Get all products tests', () => {
    test('Get all products, check at least 1 product exists, check subset of keys for the 1st product', async ({
        productsApi,
        baseValidator,
    }) => {
        // Get all products
        const res = await productsApi.getAllProducts();

        // Check the status code - should be 200OK
        await baseValidator.validateStatusCode(res, 200, 'Status code should be 200');

        // Check that the response contains all neccessary keys
        await baseValidator.validateResponseKeys(res.responseJson, allProductsKeysToValidate);

        // Validate the products is not an empty array
        expect(res.responseJson.products.length, 'Products array should not be empty').toBeGreaterThanOrEqual(1);

        // Validate a random product, check that response contains the all important keys (random subset of keys, but should be based on requirements)
        await baseValidator.validateResponseKeys(
            res.responseJson.products[res.responseJson.products.length - 1],
            productKeysToValidate,
        );

        // Validate that skip is 0, since it was not specified
        await baseValidator.validateKeyValuePair(res.responseJson, 'skip', 0, 'Response skip value should be 0');

        // Verify the limit is 30 by default, since it was not specified
        await baseValidator.validateKeyValuePair(res.responseJson, 'limit', 30, 'Response limit value should be 30');
    });

    test('Get all products, set the limit to 0 and get all products displayed', async ({
        productsApi,
        baseValidator,
    }) => {
        // Get all products
        const res = await productsApi.getAllProducts({ limit: limitForAllProducts });

        // Check the status code - should be 200OK
        await baseValidator.validateStatusCode(res, 200, 'Status code should be 200');

        // Check that the response contains all neccessary keys
        await baseValidator.validateResponseKeys(res.responseJson, allProductsKeysToValidate);

        // Validate that the limit is the same as total number of products and are not 0 (because we dont know exact number of all products, just making sure its not 0)
        expect(res.responseJson.total, 'Total number is not 0').toBeGreaterThan(0);
        expect(res.responseJson.total, 'Limit should be the same as the total number of products').toBe(
            res.responseJson.limit,
        );
    });

    test(`Get all products, set a random limit and get correct amount products displayed`, async ({
        productsApi,
        baseValidator,
    }) => {
        // Get all products
        const res = await productsApi.getAllProducts({ limit: randomLimit });

        // Check the status code - should be 200OK
        await baseValidator.validateStatusCode(res, 200, 'Status code should be 200');

        // Check that the response contains all neccessary keys
        await baseValidator.validateResponseKeys(res.responseJson, allProductsKeysToValidate);

        // Validate the limit, should be exactly as the specified number
        await baseValidator.validateKeyValuePair(
            res.responseJson,
            'limit',
            randomLimit,
            'Response limit value should be correct',
        );

        // Additional check, make sure the response products contain the correct amount of products
        expect(res.responseJson.products.length, 'The response product count is correct').toBe(randomLimit);
    });

    test('Get all products, but skip the first random count of products', async ({ productsApi, baseValidator }) => {
        // Get all products
        const res = await productsApi.getAllProducts({ skip: randomSkip });

        // Check the status code - should be 200OK
        await baseValidator.validateStatusCode(res, 200, 'Status code should be 200');

        // Check that the response contains all neccessary keys
        await baseValidator.validateResponseKeys(res.responseJson, allProductsKeysToValidate);

        // Validate the skip, should be exactly as the specified number
        await baseValidator.validateKeyValuePair(
            res.responseJson,
            'skip',
            randomSkip,
            'Response skip value should be correct',
        );

        /* Since the products are displayed via their id, we can check that the products started with id randomSkip + 1,
    but it's a risky check without clear requirements, so I did not include it */
    });

    test('Get all products and randomly display only 1 field in each product object', async ({
        productsApi,
        baseValidator,
    }) => {
        // Get all products
        const res = await productsApi.getAllProducts({ select: randomSelect });

        // Check the status code - should be 200OK
        await baseValidator.validateStatusCode(res, 200, 'Status code should be 200');

        // Check that the response contains all neccessary keys
        await baseValidator.validateResponseKeys(res.responseJson, allProductsKeysToValidate);

        // Validate a random element of the products array - should have only the specified key displayed + id
        await baseValidator.validateResponseKeys(res.responseJson.products[res.responseJson.products.length - 1], [
            'id',
            randomSelect,
        ]);
    });
});
