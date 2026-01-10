import { test } from '../../src/fixtures/fixtures';
import { apiValidationMessages as msgs } from '../../src/test-data/validationMessages';
import { DeleteProductResponseDTO } from '../../src/interfaces-and-dtos/products.dto';
import { faker } from '@faker-js/faker';

// ------------ TEST DATA ------------

/* for validating the most important keys that should be visible in the json
   this is just random subset, this will depend on real requirements */
const keysToValidate: (keyof DeleteProductResponseDTO)[] = ['id', 'title', 'isDeleted', 'deletedOn'];
const productId = faker.number.int({ min: 1, max: 60 }); // lets assume this are existing mock products
const nonExistingproductId = faker.number.int({ min: 600, max: 1000 }); // out of range of existing mock products

test.describe('Delete product tests', () => {
    test('Delete product and validate the response', async ({ productsApi, baseValidator }) => {
        // Delete the product
        const res = await productsApi.deleteProduct(productId);

        // Check the status code - should be 200 OK
        await baseValidator.validateStatusCode(res, 200, 'Status code should be 200');

        // Check that response contains all important keys (random subset of keys, but should be based on requirements)
        await baseValidator.validateResponseKeys(res.responseJson, keysToValidate);

        // Check the id is correct
        await baseValidator.validateKeyValuePair(res.responseJson, 'id', productId);

        // Check that isDeleted is true
        await baseValidator.validateKeyValuePair(res.responseJson, 'isDeleted', true);
    });

    test('Negative case - Delete non-existing product and validate the response', async ({
        productsApi,
        baseValidator,
    }) => {
        // Delete the product
        const res = await productsApi.deleteProduct(nonExistingproductId);

        // Check the status code - should be 404 Not Found
        await baseValidator.validateStatusCode(res, 404, 'Status code should be 404 not found');

        // Validate the error message in the response body
        await baseValidator.validateKeyValuePair(
            res.responseJson,
            'message',
            msgs.productNotFoundMsg(nonExistingproductId),
            'Product should not be found',
        );
    });
});
