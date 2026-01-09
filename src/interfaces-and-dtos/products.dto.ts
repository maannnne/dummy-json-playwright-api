// the DTOs are usually taken from the libraries in my experience and auto-updated
// but for the sake of demonstration on correct tryping I added them manually

export type ProductResponseDTO = {
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
    products: ProductResponseDTO[];
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
    createdAt: Date;
    updatedAt: Date;
    barcode: string;
    qrCode: string;
};

export type ProductReviewsDTO = {
    rating: number;
    comment: string;
    date: Date;
    reviewerName: string;
    reviewerEmail: string;
};

export type ErrorResponseDTO = {
    message: string;
};
