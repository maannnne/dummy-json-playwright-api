import { test } from '../../src/fixtures/fixtures';
import { CategoryDTO } from '../../src/interfaces-and-dtos/categories.dto';

const categoryKeysToValidate: (keyof CategoryDTO)[] = ['slug', 'name', 'url'];

test.describe('Get all product categories tests', () => {
    test('Get all product categories and validate the response', async ({ baseValidator, productsApi }) => {
        // Get all product categories
        const response = await productsApi.getAllProductCategories();

        // Validate the status code - should be 200 OK
        await baseValidator.validateStatusCode(response, 200, 'Status code should be 200');

        // Get the response json
        const resJson = (await response.json()) as CategoryDTO[];

        // Validate the first category and make sure all keys are present
        await baseValidator.validateResponseKeys(resJson[0], categoryKeysToValidate);
    });
});
