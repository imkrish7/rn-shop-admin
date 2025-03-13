'use server'
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { RenderMounted } from "@/components/render-mouted";
import { ADMIN } from "@/constants/consttants";
import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

// revalidatePath('/', 'layout')

export default async function RootLayout({children}: Readonly<{children: ReactNode}>){
     const supabase = await createClient();
    const {data: authData} = await supabase.auth.getUser();
    
    if(authData?.user){
        const { data, error} = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single()
        
        if(error || !data){
            console.log('Error is fetching user data', error)
            return;
        }


        if(data.type === ADMIN) return redirect('/');
    }
    return <RenderMounted>
            <Header />
                <main className="min-h-[calc(100vh-128px)] py-3">
                {children}
                </main>
            <Footer />
    </RenderMounted>

}