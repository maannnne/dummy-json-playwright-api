// the DTOs are usually taken from the libraries in my experience and auto-updated
// but for the sake of demonstration on correct tryping I added them manually

export type CreateProductDTO = {
    // none of the body parameters are required, all are optional
    title?: string;
    description?: string;
    category?: string;
    price?: number;
    discountPercentage?: number;
    rating?: number;
    stock?: number;
    tags?: string[];
    brand?: string;
    sku?: string;
    weight?: number;
    dimensions?: ProductDimentionsDTO;
    warrantyInformation?: string;
    shippingInformation?: string;
    availabilityStatus?: string;
    reviews?: ProductReviewsDTO[];
    returnPolicy?: string;
    minimumOrderQuantity?: number;
    images?: string[];
};

export type CreateProductResponseDTO = {
    id: number;
    title: string;
    price: number;
    discountPercentage: number;
    stock: number;
    rating: number;
    images: string[];
    thumbnail: string;
    description: string;
    brand: string;
    category: string;
};

export type UpdateProductDTO = {
    // none of the body parameters are required, all are optional
    title?: string;
    description?: string;
    category?: string;
    price?: number;
    discountPercentage?: number;
    rating?: number;
    stock?: number;
    tags?: string[];
    brand?: string;
    sku?: string;
    weight?: number;
    dimensions?: ProductDimentionsDTO;
    warrantyInformation?: string;
    shippingInformation?: string;
    availabilityStatus?: string;
    reviews?: ProductReviewsDTO[];
    returnPolicy?: string;
    minimumOrderQuantity?: number;
    images?: string[];
};

export type UpdateProductResponseDTO = {
    id: number;
    title: string;
    price: number;
    discountPercentage: number;
    stock: number;
    rating: number;
    images: string[];
    thumbnail: string;
    description: string;
    brand: string;
    category: string;
};

export type DeleteProductResponseDTO = {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    tags: string[];
    brand: string;
    sku: string;
    weight: number;
    dimensions: ProductDimentionsDTO;
    warrantyInformation: string;
    shippingInformation: string;
    availabilityStatus: string;
    reviews: ProductReviewsDTO[];
    returnPolicy: string;
    minimumOrderQuantity: number;
    meta: ProductMetaDTO;
    images: string[];
    thumbnail: string;
    isDeleted: boolean;
    deletedOn: string;
};

export type GetProductResponseDTO = {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    tags: string[];
    brand: string;
    sku: string;
    weight: number;
    dimensions: ProductDimentionsDTO;
    warrantyInformation: string;
    shippingInformation: string;
    availabilityStatus: string;
    reviews: ProductReviewsDTO[];
    returnPolicy: string;
    minimumOrderQuantity: number;
    meta: ProductMetaDTO;
    images: string[];
    thumbnail: string;
};

export type ProductsListResponseDTO = {
    products: GetProductResponseDTO[];
    total: number;
    skip: number;
    limit: number;
};

export type ProductDimentionsDTO = {
    width: number;
    height: number;
    depth: number;
};

export type ProductMetaDTO = {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
};

export type ProductReviewsDTO = {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
};

export type ErrorResponseDTO = {
    message: string;
};
