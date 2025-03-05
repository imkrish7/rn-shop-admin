import { getCategoriesWithProduct } from "@/actions/categories"
import {CategoryPageComponent}  from "@/app/admin/categories/page-component"

export default async function Categories() {
    const categories = await getCategoriesWithProduct();
    return <CategoryPageComponent categories={categories} />
}