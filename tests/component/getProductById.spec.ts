import { test } from '../../src/fixtures/fixtures';
import { ProductResponseDTO, ErrorResponseDTO } from '../../src/interfaces-and-dtos/products.dto';
import { APIValidationMessages as msgs } from '../../src/test-data/validationMessages';
import { faker } from '@faker-js/faker';

// ------------ TEST DATA ------------
const existingProductId = faker.number.int({ min: 1, max: 60 }); // in range of existing products
const nonexistingProductId = faker.number.int({ min: 2000, max: 3000 }); // in range of non-existing products
const invalidProductId = faker.number.int({ min: -1000, max: -1 }); // in range of invalid product ids

/* for validating the most important keys that should be visible in the json
   this is just random subset, this will depend on real requirements */
const keysToValidate: (keyof ProductResponseDTO)[] = ['id', 'title', 'description', 'category', 'price'];

test.describe('Get product by id tests', () => {
    test('Get product by existing ID, check subset of keys and product id', async ({ productsApi, baseValidator }) => {
        // Get the product by id
        const res = await productsApi.getProductById(existingProductId);

        // Check the status code - should be 200OK
        await baseValidator.validateStatusCode(res, 200, 'Status code should be 200');

        // Check that response contains all important keys (random subset of keys, but should be based on requirements)
        await baseValidator.validateResponseKeys(res.responseJson, keysToValidate);

        // Validate product id is the same as specified in path param
        await baseValidator.validateKeyValuePair(
            res.responseJson,
            'id',
            existingProductId,
            'Product id should be the same one specified in the path param',
        );
    });

    test('Negative case - get product by non-existing ID, check status code and message', async ({
        productsApi,
        baseValidator,
    }) => {
        // Get the product by id
        const res = await productsApi.getProductById(nonexistingProductId);

        // Validate that the status code is 404
        await baseValidator.validateStatusCode(res, 404, 'Status code should be 404');

        // Validate the error message in the response body
        await baseValidator.validateKeyValuePair(
            res.responseJson,
            'message',
            msgs.productNotFoundMsg(nonexistingProductId),
            'Product should not be found',
        );
    });

    test('Negative case - get product by invalid ID, check status code and message', async ({
        productsApi,
        baseValidator,
    }) => {
        // Get the product by id
        const res = await productsApi.getProductById(invalidProductId);

        // Validate that the status code is 404
        await baseValidator.validateStatusCode(res, 404);

        // Validate the error message in the response body
        await baseValidator.validateKeyValuePair(
            res.responseJson,
            'message',
            msgs.productNotFoundMsg(invalidProductId),
            'Product should not be found',
        );
    });
});
