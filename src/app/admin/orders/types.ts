import { createClient } from "@/supabase/server";
import { QueryData } from "@supabase/supabase-js";

const supabase = createClient();

const ordersWithProducts = async () => await (await supabase)
    .from('order')
    .select('*, order_items: order_item(*, products:product(*)), user(*)')
    .order('created_at', {ascending: false});

export type OrdersWithProducts = QueryData<ReturnType<typeof ordersWithProducts>>;