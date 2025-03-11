'use server'

import slugify from "slugify"

import { createClient } from "@/supabase/server"

import { ProductsWithCategoryResponse, UpdateProductSchema } from "@/app/admin/products/products.types"
import { createProductSchemaServer, CreateOrUpdateProductSchema, CreateProductServer, createOrUpdateProductSchema } from "@/app/admin/products/schema"
import { create } from "domain"

export const getProductWithCategories = async (): Promise<ProductsWithCategoryResponse>=>{
    const supabase = await createClient();
    const {data, error}= await supabase.from('product').select('*, category:category(*)').returns<ProductsWithCategoryResponse>();

    if(error) throw new Error(`Error fetching product with category: ${error.message}`)
    
    return data || []
}

export const createProduct = async({category, heroImage,  images, maxQuantity, price, title}: CreateProductServer)=>{
    const supabase = await createClient();
    const slug = slugify(title, { lower: true})
    const { data, error } = await supabase.from('product').insert({
        category,
        heroImage,
        imagesUrl: images,
        maxQuantity,
        price,
        title,
        slug
    })

    if(error) {
        throw new Error(`Error in creating product: ${error.message}`)
    }

    return data;
}

export const updateProduct = async({category, heroImage, imagesUrl, maxQuantity, price, title}: UpdateProductSchema)=>{
    const supabase = await createClient()

    const slug = slugify(title, {lower: true})

    const { data, error } = await supabase.from('product').update({
        category,
        slug,
        price,
        maxQuantity,
        title,
        heroImage,
        imagesUrl,
    }).match({slug})

    if(error) throw new Error(`Error in updating product: ${error.message}`)

    return data;
}

export const deleteProduct = async(slug: string)=>{
    const supabase = await createClient();

    const {error} = await supabase.from('product').delete().match({slug});

    if(error) throw new Error(`Error in deleting product: ${error.message}`);
}