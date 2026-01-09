import { test } from '../../src/fixtures/fixtures';
import { CategoryDTO } from '../../src/interfaces-and-dtos/categories.dto';
import { faker } from '@faker-js/faker';
import { expect } from '@playwright/test';
import { allProductCategories } from '../../src/test-data/productCategories';
import { GetAllProductsDTO, GetProductDTO } from '../../src/interfaces-and-dtos/products.dto';

const randomExistingCategory = faker.helpers.arrayElement(allProductCategories);

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

test.describe('Get prodyct by category tests', () => {
    test('Get product by category and validate the response', async ({ baseValidator, productsApi }) => {
        // Get all product categories
        const response = await productsApi.getProductByCategory(randomExistingCategory);

        // Validate the status code - should be 200 OK
        await baseValidator.validateStatusCode(response, 200, 'Status code should be 200');

        // Get the response json
        const resJson = (await response.json()) as GetAllProductsDTO;

        // Check that the response contains all neccessary keys
        await baseValidator.validateResponseKeys(resJson, allProductsKeysToValidate);

        // Validate the products is not an empty array
        expect(resJson.products.length, 'Products array should not be empty').toBeGreaterThanOrEqual(1);

        // Validate the first product, check that response contains the all important keys (random subset of keys, but should be based on requirements)
        await baseValidator.validateResponseKeys(resJson.products[0], productKeysToValidate);

        // Validate the category is correct for all products
        await baseValidator.validateKeyValuePairsInObjectsArray(
            resJson.products,
            'category',
            randomExistingCategory,
            `All categories in the list of products should be ${randomExistingCategory}`,
        );
    });
});
