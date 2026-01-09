import { IProductData, IProductsQueryParams } from '../../src/interfaces-and-dtos/product.interface';
import { APIRequestContext, expect } from '@playwright/test';
import { test } from '../../src/fixtures/fixtures';
import { GetProductDTO, GetAllProductsDTO } from '../../src/interfaces-and-dtos/getProduct.dto';
import { APIValidationMessages as msgs } from '../../src/test-data/validationMessages';
import { faker } from '@faker-js/faker';

// ------------ TEST DATA ------------
/* for validating the most important keys that should be visible in the json
   this is just random subset, this will depend on real requirements */
const productKeysToValidate: (keyof GetProductDTO)[] = [
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
        const productResponse = await productsApi.getAllProducts();

        // Check the status code - should be 200OK
        await baseValidator.validateStatusCode(productResponse, 200, 'Status code should be 200');

        // Get the response json
        const responseJson = await productResponse.json();

        // Check that the response contains all neccessary keys
        await baseValidator.validateResponseKeys(responseJson, allProductsKeysToValidate);

        // Validate the products is not an empty array
        expect(responseJson.products.length).toBeGreaterThanOrEqual(1);

        // Validate the first product, check that response contains the all important keys (random subset of keys, but should be based on requirements)
        await baseValidator.validateResponseKeys(responseJson.products[0], productKeysToValidate);

        // Validate that skip is 0, since it was not specified
        await baseValidator.validateKeyValue(responseJson, 'skip', 0);

        // Verify the limit is 30 by default, since it was not specified
        await baseValidator.validateKeyValue(responseJson, 'limit', 30);
    });

    test('Get all products, set the limit to 0 and get all products displayed', async ({
        productsApi,
        baseValidator,
    }) => {
        // Get all products
        const productResponse = await productsApi.getAllProducts({ limit: limitForAllProducts });

        // Check the status code - should be 200OK
        await baseValidator.validateStatusCode(productResponse, 200, 'Status code should be 200');

        // Get the response json
        const responseJson = await productResponse.json();

        // Check that the response contains all neccessary keys
        await baseValidator.validateResponseKeys(responseJson, allProductsKeysToValidate);

        // Validate that the limit is the same as total number of products and are not 0 (because we dont know exact number of all products, just making sure its not 0)
        expect(responseJson.total).toBe(responseJson.limit);
        expect(responseJson.total).toBeGreaterThan(0);
    });

    test(`Get all products, set a random limit and get correct amount products displayed`, async ({
        productsApi,
        baseValidator,
    }) => {
        // Get all products
        const productResponse = await productsApi.getAllProducts({ limit: randomLimit });

        // Check the status code - should be 200OK
        await baseValidator.validateStatusCode(productResponse, 200, 'Status code should be 200');

        // Get the response json
        const responseJson = await productResponse.json();

        // Check that the response contains all neccessary keys
        await baseValidator.validateResponseKeys(responseJson, allProductsKeysToValidate);

        // Validate the limit, should be exactly as the specified number
        await baseValidator.validateKeyValue(responseJson, 'limit', randomLimit);

        // Additional check, make sure the response products contain the correct amount of products
        expect(responseJson.products.length).toBe(randomLimit);
    });

    test('Get all products, but skip the first random count of products', async ({ productsApi, baseValidator }) => {
        // Get all products
        const productResponse = await productsApi.getAllProducts({ skip: randomSkip });

        // Check the status code - should be 200OK
        await baseValidator.validateStatusCode(productResponse, 200, 'Status code should be 200');

        // Get the response json
        const responseJson = await productResponse.json();

        // Check that the response contains all neccessary keys
        await baseValidator.validateResponseKeys(responseJson, allProductsKeysToValidate);

        // Validate the skip, should be exactly as the specified number
        await baseValidator.validateKeyValue(responseJson, 'skip', randomSkip);

        /* Since the products are displayed via their id, we can check that the products started with id randomSkip + 1,
    but it's a risky check without clear requirements, so I did not include it */
    });

    test('Get all products and randomly display only 1 field in each product object', async ({
        productsApi,
        baseValidator,
    }) => {
        // Get all products
        const productResponse = await productsApi.getAllProducts({ select: randomSelect });

        // Check the status code - should be 200OK
        await baseValidator.validateStatusCode(productResponse, 200, 'Status code should be 200');

        // Get the response json
        const responseJson = await productResponse.json();

        // Check that the response contains all neccessary keys
        await baseValidator.validateResponseKeys(responseJson, allProductsKeysToValidate);

        // Validate the first element of the products array - should have only the specified key displayed + id
        await baseValidator.validateResponseKeys(responseJson.products[0], ['id', randomSelect]);
    });
});
