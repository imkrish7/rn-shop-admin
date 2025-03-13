import { getOrderWithProducts } from "@/actions/orders";
import PageComponent from "./page-component";

const Orders = async ()=>{
    const ordersWithProducts = await getOrderWithProducts();
    console.log(ordersWithProducts);
    if(!ordersWithProducts) return <div className="text-center font-bold text-2xl">No orders found</div>
    
    return <div>
        <PageComponent ordersWithProducts={ordersWithProducts} />
        </div>
}

export default Orders;