import { test as base } from '@playwright/test';
import { ProductsApi } from '../apis/products.api';
import { BaseValidator } from '../validators/base.validator';

type ApiFixtures = {
    productsApi: ProductsApi;
    baseValidator: BaseValidator;
};

/* create a fixture for each api and use it as a fixture in the tests to avoid
  repeated object instance creation */
export const test = base.extend<ApiFixtures>({
    productsApi: async ({ request }, use) => {
        const productsApi = new ProductsApi(request);
        use(productsApi);
    },
    baseValidator: async ({}, use) => {
        const baseValidator = new BaseValidator();
        use(baseValidator);
    },
});
