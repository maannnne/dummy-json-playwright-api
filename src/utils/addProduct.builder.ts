import { CreateProductDTO } from '../interfaces-and-dtos/products.dto';

export class ProductBuilder {
    // since none of the fields are required, I will not enforce any field
    private product: Partial<CreateProductDTO> = {};

    withBrand(brand: string): ProductBuilder {
        this.product.brand = brand;
        return this;
    }

    withTitle(title: string): ProductBuilder {
        this.product.title = title;
        return this;
    }

    withCategory(category: string): ProductBuilder {
        this.product.category = category;
        return this;
    }

    withPrice(price: number): ProductBuilder {
        this.product.price = price;
        return this;
    }

    withDescription(description: string): ProductBuilder {
        this.product.description = description;
        return this;
    }

    withStock(stock: number): ProductBuilder {
        this.product.stock = stock;
        return this;
    }

    // ... more product fields

    build(): CreateProductDTO {
        return { ...this.product };
    }
}
