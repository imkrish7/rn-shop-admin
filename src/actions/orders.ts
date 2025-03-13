'use server';

import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";
import { sendNotification } from "./notifications";

export const getOrderWithProducts = async ()=>{
    const supabase = await createClient()

    const { data, error } = await supabase
    .from('order')
    .select('*, order_items:order_item(*, product(*)), user(*)')
    .order('created_at', { ascending: false });

    if(error){
        throw new Error('An error occured while fetching orders'+error.message);
    }

    return data;
}

export const updateOrderStatus = async(id: number, status: string)=>{
    const supabase = await createClient();

    const {error} = await supabase.from('order').update({status}).eq('id', id);
    if(error){
        throw new Error('An error occured while updating orderd status'+ error.message);
    }
    const {data: orderData, error: orderError} = await supabase.from('order').select('*').eq('id', id).single();
    if(orderError){
        throw new Error(orderError.message)
    }

    const {data: {session}} = await supabase.auth.getSession();

    const userId = session?.user.id;

    

    await sendNotification({
        userId: userId!,
        title: 'Order update',
        body:  orderData.description??'status update',
        data: {
            status: orderData.status
        }
    })

    revalidatePath('/admin/orders');

}