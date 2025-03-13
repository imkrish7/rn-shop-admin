'use server'

import { createClient } from "@/supabase/server";

export const authenticate = async(email: string, password: string)=>{
    // console.log(email, password)
    try {
        const supabase = await createClient()
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if(error) throw error;

    } catch (error) {
        console.error('Authentication error: ', error);
        throw error;
        
    }
}

export const getLatestUsers = async()=>{
    const supabase = await createClient();

    const { data, error} = await supabase.from('users').select('id, email, created_at').order('created_at', { ascending: false }).limit(5);

    if(error){
        throw new Error(error.message)
    }

    return data.map((user)=>{
        return {
            id: user.id,
            email: user.email,
            date: user.created_at?.toString()
        }
    })
}