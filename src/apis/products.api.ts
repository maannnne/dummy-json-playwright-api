import { APIRequestContext, APIResponse } from '@playwright/test';
import { IProductsQueryParams, IProductData } from '../interfaces-and-dtos/products.interface';
import { ProductResponseDTO, ProductsListResponseDTO } from '../interfaces-and-dtos/products.dto';
import { CategoryResponseDTO } from '../interfaces-and-dtos/categories.dto';
import { ApiResponse } from '../interfaces-and-dtos/apiResponse.interface';

export class ProductsApi {
    private readonly productsEndpoint = '/products';
    private readonly searchEndpoint = '/products/search';
    private readonly categoryEndpoint = '/products/category';
    private readonly categoriesEndpoint = '/products/categories';
    private readonly categoryListEndpoint = '/products/category-list';
    private readonly addProductEndpoint = '/products/add';

    constructor(private request: APIRequestContext) {}

    /**
     * Get all products
     * @param queries.limit page limit (0 returns all)
     * @param queries.skip items to skip
     * @param queries.select comma-separated fields to select
     * @param queries.sortBy field to sort by
     * @param queries.order asc or desc
     * @returns object containing status code, headers and response json
     */
    async getAllProducts(queries?: IProductsQueryParams): Promise<ApiResponse<ProductsListResponseDTO>> {
        const params = new URLSearchParams();

        // check if queries were provided
        if (queries) {
            if (queries.limit !== undefined) params.append('limit', `${queries.limit}`);
            if (queries.skip !== undefined) params.append('skip', `${queries.skip}`);
            if (queries.select) params.append('select', queries.select);
            if (queries.sortBy) params.append('sortBy', queries.sortBy);
            if (queries.order) params.append('order', queries.order);
        }

        // error handling with try catch
        try {
            const response = await this.request.get(this.productsEndpoint, { params });
            return {
                status: response.status(),
                headers: response.headers(),
                responseJson: await response.json(),
            };
        } catch (error) {
            console.error('Error getting products:', error);
            throw new Error('Failed to fetch products');
        }
    }

    /**
     * Gets a product by it's ID
     * @param id string - id of the product,
     * @returns object containing status code, headers and response json
     */
    async getProductById(id: number): Promise<ApiResponse<ProductResponseDTO>> {
        // error handling with try catch
        try {
            const response = await this.request.get(`${this.productsEndpoint}/${id}`);
            return {
                status: response.status(),
                headers: response.headers(),
                responseJson: await response.json(),
            };
        } catch (error) {
            console.log(`Error getting the product with id ${id}`, error);
            throw new Error(`Error getting the product with id ${id}`);
        }
    }

    /**
     * Searches the products using provided query
     * @param query string - query for searching products
     * @returns object containing status code, headers and response json
     */
    async searchProduct(query: string): Promise<ApiResponse<ProductsListResponseDTO>> {
        // error handling with try catch
        try {
            const response = await this.request.get(this.searchEndpoint, {
                params: {
                    q: query,
                },
            });
            return {
                status: response.status(),
                headers: response.headers(),
                responseJson: await response.json(),
            };
        } catch (e) {
            console.log(`Error searching with query ${query}`, e);
            throw new Error(`Error searching with query ${query}`);
        }
    }

    /**
     * Get all product categories
     * @returns object containing status code, headers and response json
     */
    async getAllProductCategories(): Promise<ApiResponse<CategoryResponseDTO[]>> {
        // error handling with try catch
        try {
            const response = await this.request.get(this.categoriesEndpoint);
            return {
                status: response.status(),
                headers: response.headers(),
                responseJson: await response.json(),
            };
        } catch (e) {
            console.log('Error getting product categories', e);
            throw new Error('Error getting product categories');
        }
    }

    /**
     * Get products category list
     * @returns object containing status code, headers and response json
     */
    async getProductsCategoryList(): Promise<ApiResponse<[]>> {
        // error handling with try catch
        try {
            const response = await this.request.get(this.categoryListEndpoint);
            return {
                status: response.status(),
                headers: response.headers(),
                responseJson: await response.json(),
            };
        } catch (e) {
            console.log('Error getting product category list', e);
            throw new Error('Error getting product category list');
        }
    }

    /**
     * Get product by category
     * @param category string - product category
     * @returns object containing status code, headers and response json
     */
    async getProductByCategory(category: string): Promise<ApiResponse<ProductsListResponseDTO>> {
        // error handling with try catch
        try {
            const response = await this.request.get(`${this.categoryEndpoint}/${category}`);
            return {
                status: response.status(),
                headers: response.headers(),
                responseJson: await response.json(),
            };
        } catch (e) {
            console.log(`Error getting product by category ${category}`, e);
            throw new Error(`Error getting product by category ${category}`);
        }
    }

    // TODO: add error handling staring here and use the custom response type
    /**
     *
     * @param data IProductData - {title} | the json body for the request
     * @returns object containing status code, headers and response json
     */
    async addNewProduct(data: IProductData): Promise<APIResponse> {
        return await this.request.post(this.addProductEndpoint, {
            data: data,
        });
    }

    /**
     * Product update with PUT
     * @param productId string - id of the product you want to update
     * @param data IProductData - {title} | the json body for the request
     * @returns object containing status code, headers and response json
     */
    async updateProduct(productId: number, data: IProductData): Promise<APIResponse> {
        return await this.request.put(`${this.productsEndpoint}/${productId}`, {
            data: data,
        });
    }

    /**
     * Partial product update with PATCH
     * @param productId string - id of the product you want to update
     * @param data IProductData - {title?} | the json body for the request
     * @returns object containing status code, headers and response json
     */
    async updateProductPartial(productId: number, data: IProductData): Promise<APIResponse> {
        return await this.request.patch(`${this.productsEndpoint}/${productId}`, {
            data: data,
        });
    }

    /**
     * Delete a product
     * @param productId number - id of the product you want to delete
     * @returns object containing status code, headers and response json
     */
    async deleteProduct(productId: number): Promise<APIResponse> {
        return await this.request.delete(`${this.productsEndpoint}/${productId}`);
    }
}
