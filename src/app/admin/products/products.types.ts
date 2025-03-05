import { Category } from "@/app/admin/categories/categories.types";

export type ProductWithCategory = {
    category: Category;
    created_at: string;
    hero_image: string;
    id: number;
    image_url: string[];
    max_quantity: number;
    price: number | null;
    slug: string;
    title: string
}

export type ProductsWithCategoryResponse = ProductWithCategory[];

export type UpdateProductSchema = {
    category: number,
    heroImage: string,
    imagesUrl: string[],
    maxQuantity: number,
    price: number | null,
    slug: string,
    title: string,
}