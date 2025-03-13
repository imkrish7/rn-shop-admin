'use server';

import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";
import { sendNotification } from "./notifications";
import { Mohave } from "next/font/google";

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

export const getMonthlyOrder = async ()=>{

    const supabase = await createClient();

    const { data, error} = await supabase.from('order').select('created_at');

    if(error){
        throw new Error(error.message)
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    const orderByMonths = data.reduce((
        acc: Record<string, number>, order: {created_at: string})=>{
            const month = monthNames[new Date(order.created_at).getUTCMonth()];

            if(!acc[month]) acc[month] = 0;
            
            acc[month]++;
            return acc;
        }, {})

        return Object.keys(orderByMonths).map(month=>{
            return {
                name: month,
                orders: orderByMonths[month]
            }
        })
}