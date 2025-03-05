'use server'
import slugify from 'slugify'
import { CategoriesWithProductResponse } from "@/app/admin/categories/categories.types";
import { CreateCategorySchema, CreateCategorySchemaServer, UpdateCategorySchema, updateCategorySchema } from "@/app/admin/categories/schema";
import { createClient } from "@/supabase/server";
import { Supermercado_One } from 'next/font/google';



export const getCategoriesWithProduct = async(): Promise<CategoriesWithProductResponse>=>{
    const supabase = await createClient();
    const { data, error } = await supabase
    .from('category')
    .select('* , products:product(*)')
    .returns<CategoriesWithProductResponse>();

    if(error) throw new Error('Error fetching categores', error);

    return data || []
}

export const imageUploadHandler = async(formData: FormData)=>{
    const supabase = await createClient();
    if(!formData) return;

    const fileEntry = formData.get('file') as File;

    if(!(fileEntry instanceof File)) throw new Error('Expecte a file');

    const fileName = fileEntry.name;
    
    try {
        const { data, error } = await supabase.storage
        .from('app-image')
        .upload(fileName, fileEntry, {
            cacheControl: '3600',
            upsert: false
        })

        if(error){
            console.error('Error uploading image:', error);
            throw new Error('Error uploading image')
        }

        const { data: {publicUrl} } = await supabase.storage.from('app-image').getPublicUrl(data.path);
        return publicUrl;
        
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Error uploading image')
    }

}

export const createCategory = async({imageUrl, name}:CreateCategorySchemaServer)=>{
    const supabase = await createClient();

    const slug = slugify(name, {lower: true});

    const { data, error } = await supabase.from('category').insert({
        name,
        imageUrl,
        slug
    });

    if(error) throw new Error(`Error creating category: ${error.message}`);

    return data;
}

export const updateCategory= async({imageUrl, name, slug, intent}: UpdateCategorySchema)=>{
    const supabase = await createClient();

    const { data, error } = await supabase.from('category').update({
        name,
        imageUrl,
    }).match({slug});

    if(error) throw new Error(`Error updating category: ${error.message}`);

    return data;
}
export const deleteCategory = async(id: number)=>{

    const supabase = await createClient();


    const {error} = await supabase.from('category').delete().match({id})
    if(error) throw new Error(`Error deleting category: ${error.message}`)

}


