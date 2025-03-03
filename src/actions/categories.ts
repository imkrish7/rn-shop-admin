'use server'
import { CategoriesWithProductResponse } from "@/app/admin/categories/categories.types";
import { createClient } from "@/supabase/server";



export const getCategoriesWithProduct = async(): Promise<CategoriesWithProductResponse>=>{
    const supabase = await createClient();
    const { data, error } = await supabase
    .from('category')
    .select('* , products:product(*)')
    .returns<CategoriesWithProductResponse>();

    if(error) throw new Error('Error fetching categores', error);

    return data || []
}