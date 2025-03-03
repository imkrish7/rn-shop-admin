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