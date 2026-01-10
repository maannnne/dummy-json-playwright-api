import { test } from '../../src/fixtures/fixtures';
import { ProductBuilder } from '../../src/builders/addProduct.builder';
import { GetProductResponseDTO, CreateProductDTO } from '../../src/interfaces-and-dtos/products.dto';
import { faker } from '@faker-js/faker';

// ------------ TEST DATA ------------

/* for validating the most important keys that should be visible in the json
   this is just random subset, this will depend on real requirements */
const keysToValidate: (keyof GetProductResponseDTO)[] = ['id', 'title', 'brand', 'category', 'price'];

// create product data with a builder
const createdProduct: CreateProductDTO = new ProductBuilder().withTitle(faker.book.title()).build();
const partiallyUpdatedProduct = new ProductBuilder().withTitle(faker.book.title()).build();

test.describe('Products CRUD integration test', () => {
    test('Product CRUD - create, get, update and delete the product', async ({ productsApi, baseValidator }) => {
        /* IMPORTANT NOTE */
        /*
            Adding a new product will not add it into the server.
            Updating a product will not update it into the server.
            Deleting a product will not delete it into the server.
            Everything here is a simulation, so please follow the comments above ...
        */
        // ------- CREATE THE PRODUCT --------
        const createdRes = await productsApi.addNewProduct(createdProduct);

        // Check the status code - should be 201 Created
        await baseValidator.validateStatusCode(createdRes, 201, 'Status code should be 201');

        // Not adding more checks here, because everything is laready checked in component tests

        // Get the created product id for later use
        /* 
            const productId = createdRes.responseJson.id; 
            this is what I should have done, 
            but since the product is not really created, I will assign an existing mock product id here
        */
        const productId = faker.number.int({ min: 1, max: 60 }); // in range of existing mock products

        // ------- GET THE PRODUCT --------
        const fetchedRes = await productsApi.getProductById(productId);

        // Check the status code - should be 200 OK
        await baseValidator.validateStatusCode(fetchedRes, 200, 'Status code should be 200');

        // Check the product id is correct in the response
        await baseValidator.validateKeyValuePair(fetchedRes.responseJson, 'id', productId);

        // Check that the field we created product title is correct
        /*
            This will fail, since creation is just a simulation. So, commenting this step out...
            await baseValidator.validateKeyValuePair(fetchedRes.responseJson, 'title', createdProduct.title);
        */

        // ------- UPDATE THE PRODUCT --------
        // Get the product by id
        const updatedRes = await productsApi.updateProduct(productId, partiallyUpdatedProduct);

        // Check the status code - should be 200 OK
        await baseValidator.validateStatusCode(updatedRes, 200, 'Status code should be 200');

        // Check the product id is correct in the response
        await baseValidator.validateKeyValuePair(updatedRes.responseJson, 'id', productId);

        // Check that the field we updated is correctly updated in the response
        await baseValidator.validateKeyValuePair(updatedRes.responseJson, 'title', partiallyUpdatedProduct.title);

        // ------- GET THE PRODUCT --------
        const fetchedAfterUpdateRes = await productsApi.getProductById(productId);

        // Check the status code - should be 200 OK
        await baseValidator.validateStatusCode(fetchedAfterUpdateRes, 200, 'Status code should be 200');

        // Check the product id is correct in the response
        await baseValidator.validateKeyValuePair(fetchedAfterUpdateRes.responseJson, 'id', productId);

        // Check that the field we created product title is correct
        /*
            This will fail, since updating product is just a simulation. So, commenting this step out...
            await baseValidator.validateKeyValuePair(fetchedAfterUpdateRes.responseJson, 'title', createdProduct.title);
        */

        // ------- DELETE THE PRODUCT --------
        const res = await productsApi.deleteProduct(productId);

        // Check the status code - should be 200 OK
        await baseValidator.validateStatusCode(res, 200, 'Status code should be 200');

        // Check the id is correct
        await baseValidator.validateKeyValuePair(res.responseJson, 'id', productId);

        // Check that isDeleted is true
        await baseValidator.validateKeyValuePair(res.responseJson, 'isDeleted', true);
    });
});
