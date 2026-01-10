import { test } from '../../src/fixtures/fixtures';
import { CategoryResponseDTO } from '../../src/interfaces-and-dtos/categories.dto';

const categoryKeysToValidate: (keyof CategoryResponseDTO)[] = ['slug', 'name', 'url'];

test.describe('Get all product categories tests', () => {
    test('Get all product categories and validate the response', async ({ baseValidator, productsApi }) => {
        // Get all product categories
        const response = await productsApi.getAllProductCategories();

        // Validate the status code - should be 200 OK
        await baseValidator.validateStatusCode(response, 200, 'Status code should be 200');

        // Pick a random category and validate taht all keys are present
        await baseValidator.validateResponseKeys(
            response.responseJson[response.responseJson.length - 1],
            categoryKeysToValidate,
        );
    });
});
