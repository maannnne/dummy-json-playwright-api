export interface IProductsQueryParams {
    limit?: number;
    skip?: number;
    select?: string;
    sortBy?: string;
    order?: string;
}

export interface IProductData {
    // set the title as non-required, because you can create/ edit a product without a title
    title?: string;
}
