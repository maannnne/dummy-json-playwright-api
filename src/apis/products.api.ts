import { APIRequestContext, APIResponse } from '@playwright/test';
import { IProductsQueryParams, IProductData } from '../interfaces-and-dtos/products.interface';
import { GetProductDTO } from '../interfaces-and-dtos/products.dto';

export const productEndpoints = {
    products: '/products',
    search: '/products/search',
    category: '/products/category',
    categories: '/products/categories',
    categoryList: '/products/category-list',
    addProduct: '/products/add',
};

export class ProductsApi {
    constructor(private request: APIRequestContext) {}

    /**
     * Get all products
     * @param queries.limit page limit (0 returns all)
     * @param queries.skip items to skip
     * @param queries.select comma-separated fields to select
     * @param queries.sortBy field to sort by
     * @param queries.order asc or desc
     */
    async getAllProducts(queries?: IProductsQueryParams): Promise<APIResponse> {
        // check if query params defined or not, create a params project with only defined params
        const params = new URLSearchParams();
        if (queries && queries.limit !== undefined) params.append('limit', `${queries.limit}`);
        if (queries && queries.skip !== undefined) params.append('skip', `${queries.skip}`);
        if (queries && queries.select) params.append('select', queries.select);
        if (queries && queries.sortBy) params.append('sortBy', queries.sortBy);
        if (queries && queries.order) params.append('order', queries.order);

        return await this.request.get(productEndpoints.products, {
            params: params,
        });
    }

    /**
     * Gets a product by it's ID
     * @param id string - id of the product,
     */
    async getProductById(id: number): Promise<APIResponse> {
        return await this.request.get(`${productEndpoints.products}/${id}`);
    }

    /**
     * Searches the products using provided query
     * @param query string - query for searching products
     */
    async searchProduct(query: string): Promise<APIResponse> {
        return await this.request.get(productEndpoints.search, {
            params: {
                q: query,
            },
        });
    }

    /**
     * Get all product categories
     */
    async getAllProductCategories(): Promise<APIResponse> {
        return await this.request.get(productEndpoints.categories);
    }

    /**
     * Get products category list
     */
    async getProductsCategoryList(): Promise<APIResponse> {
        return await this.request.get(productEndpoints.categoryList);
    }

    /**
     * Get product by category
     * @param category string - product category
     * @returns
     */
    async getProductByCategory(category: string): Promise<APIResponse> {
        return await this.request.get(`${productEndpoints.category}/${category}`);
    }

    /**
     *
     * @param data IProductData - {title} | the json body for the request
     * @returns
     */
    async addNewProduct(data: IProductData): Promise<APIResponse> {
        return await this.request.post(productEndpoints.addProduct, {
            data: data,
        });
    }

    /**
     * Product update with PUT
     * @param productId string - id of the product you want to update
     * @param data IProductData - {title} | the json body for the request
     */
    async updateProduct(productId: number, data: IProductData): Promise<APIResponse> {
        return await this.request.put(`${productEndpoints.products}/${productId}`, {
            data: data,
        });
    }

    /**
     * Partial product update with PATCH
     * @param productId string - id of the product you want to update
     * @param data IProductData - {title?} | the json body for the request
     */
    async updateProductPartial(productId: number, data: IProductData): Promise<APIResponse> {
        return await this.request.patch(`${productEndpoints.products}/${productId}`, {
            data: data,
        });
    }

    /**
     * Delete a product
     * @param productId number - id of the product you want to delete
     */
    async deleteProduct(productId: number): Promise<APIResponse> {
        return await this.request.delete(`${productEndpoints.products}/${productId}`);
    }
}
