import { ProductWithCategory } from "../products/products.types";



export type CategoryWithProducts = {
    created_at: string;
    id: number;
    imageUrl: string;
    name: string;
    products: ProductWithCategory[];
    slug: string;
}

export type Category = {
    created_at: string,
    id: number,
    imageUrl: string,
    name: string,
    slug: string
}

export type CategoriesWithProductResponse = CategoryWithProducts[];