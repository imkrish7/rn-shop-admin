import { Category } from "@/app/admin/categories/categories.types";

export type ProductWithCategory = {
    category: Category;
    created_at: string;
    heroImage: string;
    id: number;
    imageUrls: string[];
    maxQuantity: number;
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
    price: number | undefined,
    slug: string,
    title: string,
}