'use server'

import slugify from "slugify"

import { createClient } from "@/supabase/server"

import { ProductsWithCategoryResponse, UpdateProductSchema } from "@/app/admin/products/products.types"
import { createProductSchemaServer, CreateOrUpdateProductSchema } from "@/app/admin/products/schema"

export const getProductWithCategories = async (): Promise<ProductsWithCategoryResponse>=>{
    const supabase = await createClient();
    const {data, error}= await supabase.from('product').select('*, category:category(*)').returns<ProductsWithCategoryResponse>();

    if(error) throw new Error(`Error fetching product with category: ${error.message}`)
    
    return data || []
}