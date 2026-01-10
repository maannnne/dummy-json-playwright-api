import { test } from '../../src/fixtures/fixtures';
import { ProductBuilder } from '../../src/utils/addProduct.builder';
import { GetProductResponseDTO, CreateProductDTO } from '../../src/interfaces-and-dtos/products.dto';
import { allProductCategories } from '../../src/test-data/productCategories';
import { faker } from '@faker-js/faker';

// ------------ TEST DATA ------------

/* for validating the most important keys that should be visible in the json
   this is just random subset, this will depend on real requirements */
const keysToValidate1: (keyof GetProductResponseDTO)[] = ['id', 'title', 'brand', 'category', 'price'];
const keysToValidate2: (keyof GetProductResponseDTO)[] = ['id', 'title'];

// in range of existing products. If no default products were available, we would create one first
const existingProductId1 = faker.number.int({ min: 1, max: 60 }); // in range of existing mock products
const existingProductId2 = faker.number.int({ min: 1, max: 60 }); // in range of existing mock products

// create products data with a builder
const updatedProduct: CreateProductDTO = new ProductBuilder()
    .withTitle(faker.book.title())
    .withBrand(faker.book.publisher())
    .withPrice(faker.number.float({ min: 1, max: 100 }))
    .withCategory(faker.helpers.arrayElement(allProductCategories))
    .build();
const partiallyUpdatedProduct = new ProductBuilder().withTitle(faker.book.title()).build();

test.describe('Update product tests', () => {
    test('Update product and validate the response', async ({ productsApi, baseValidator }) => {
        // Get the product by id
        const res = await productsApi.updateProduct(existingProductId1, updatedProduct);

        // Check the status code - should be 200 OK
        await baseValidator.validateStatusCode(res, 200, 'Status code should be 200');

        // Check that response contains all important keys (random subset of keys, but should be based on requirements)
        await baseValidator.validateResponseKeys(res.responseJson, keysToValidate1);

        // Check the value of each key we set to make sure it's the same as provided
        await baseValidator.validateKeyValuePair(
            res.responseJson,
            'id',
            existingProductId1,
            'Updated product id should be correct',
        );
        await baseValidator.validateKeyValuePair(
            res.responseJson,
            'title',
            updatedProduct.title,
            'Updated product title should be correct',
        );
        await baseValidator.validateKeyValuePair(
            res.responseJson,
            'brand',
            updatedProduct.brand,
            'Updated product brand should be correct',
        );
        await baseValidator.validateKeyValuePair(
            res.responseJson,
            'price',
            updatedProduct.price,
            'Updated product price should be correct',
        );
        await baseValidator.validateKeyValuePair(
            res.responseJson,
            'category',
            updatedProduct.category,
            'Updated product category should be correct',
        );
    });

    test('Update product partial and validate the response', async ({ productsApi, baseValidator }) => {
        // Update existing mock product
        const res = await productsApi.updateProduct(existingProductId2, partiallyUpdatedProduct);

        // Check the status code - should be 200 OK
        await baseValidator.validateStatusCode(res, 200, 'Status code should be 200');

        // Check that response contains all important keys (random subset of keys, but should be based on requirements)
        await baseValidator.validateResponseKeys(res.responseJson, keysToValidate2);

        // Check the value of each key we set to make sure it's the same as provided
        await baseValidator.validateKeyValuePair(
            res.responseJson,
            'id',
            existingProductId2,
            'Updated product id should be correct',
        );
        await baseValidator.validateKeyValuePair(
            res.responseJson,
            'title',
            partiallyUpdatedProduct.title,
            'Updated product title should be correct',
        );
    });

    /* IMPORTANT NOTES */
    /*
    The DummyJSON does not provide enough resources to test negative cases.
    No body parameters are required, you can add to the values anything you want, empty string, spaces, 17000+ characters, etc
    That is why I did not write any negative cases here, but I will describe the tests I would write briefly:
    ... lets assume this is done above...
    - Update a product with only required parameters (full and partial update. For partial, multiple different ones)
    ... I would also...
    - Update a product with 1 missing required parameter at a time, valdiate the response
    - Update a product with empty required parameter ("" or "    ") and validate the response
    */
});
