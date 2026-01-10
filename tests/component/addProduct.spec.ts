import { test } from '../../src/fixtures/fixtures';
import { ProductBuilder } from '../../src/utils/addProduct.builder';
import { GetProductResponseDTO, CreateProductDTO } from '../../src/interfaces-and-dtos/products.dto';
import { allProductCategories } from '../../src/test-data/productCategories';
import { faker } from '@faker-js/faker';

// ------------ TEST DATA ------------

/* for validating the most important keys that should be visible in the json
   this is just random subset, this will depend on real requirements */
const keysToValidate: (keyof GetProductResponseDTO)[] = ['id', 'title', 'brand', 'category', 'price'];

// create product data with a builder
const product1: CreateProductDTO = new ProductBuilder()
    .withTitle(faker.book.title())
    .withBrand(faker.book.publisher())
    .withPrice(faker.number.float({ min: 1, max: 100 }))
    .withCategory(faker.helpers.arrayElement(allProductCategories))
    .build();

test.describe('Add product tests', () => {
    test('Add product and validate the response', async ({ productsApi, baseValidator }) => {
        // Create the product
        const res = await productsApi.addNewProduct(product1);

        // Check the status code - should be 201 Created
        await baseValidator.validateStatusCode(res, 201, 'Status code should be 201');

        // Check that response contains all important keys (random subset of keys, but should be based on requirements)
        await baseValidator.validateResponseKeys(res.responseJson, keysToValidate);

        // Check the value of each key we set to make sure it's the same as provided
        await baseValidator.validateKeyValuePair(
            res.responseJson,
            'title',
            product1.title,
            'Product title should be as specified',
        );
        await baseValidator.validateKeyValuePair(
            res.responseJson,
            'brand',
            product1.brand,
            'Product brand should be as specified',
        );
        await baseValidator.validateKeyValuePair(
            res.responseJson,
            'price',
            product1.price,
            'Product price should be as specified',
        );
        await baseValidator.validateKeyValuePair(
            res.responseJson,
            'category',
            product1.category,
            'Product category should be as specified',
        );
    });

    /* IMPORTANT NOTES */
    /*
    The DummyJSON does not provide enough resources to test negative cases.
    No body parameters are required, you can add to the values anything you want, empty string, spaces, 17000+ characters, etc
    That is why I did not write any negative cases here, but I will describe the tests I would write briefly:
    ... lets assume this is done above...
    - Create a product with only required parameters
    ... I would also...
    - Create a product with 1 missing required parameter at a time, valdiate the response
    - Create a product with empty required parameter ("" or "    ") and validate the response
    */
});
