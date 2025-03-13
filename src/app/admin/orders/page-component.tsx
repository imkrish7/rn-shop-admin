'use client'

import { updateOrderStatus } from "@/actions/orders"
import { OrdersWithProducts } from "@/app/admin/orders/types"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { format } from "date-fns"
import Image from "next/image"
import { useState } from "react"

const selectOptions = ["Pending", "Shipped", "InTransit", "Completed"]

type Props = {
    ordersWithProducts: OrdersWithProducts
}

type OrderProduct = {
    order_id: number;
    product: number & {
        category: string,
        created_at: string,
        heroImage: string,
        id: number,
        imagesUrl: string[],
        maxQuantity: number,
        price: number | null,
        slug: string | null,
        title: string,
    }
};

export default function PageComponent({ ordersWithProducts }:Props){
    const [selectedProduct, setSelectedProduct] = useState<OrderProduct[]>([]); 

    const openProductModal = (products: OrderProduct[])=>{
        setSelectedProduct(products)
    }
    const orderedProducts = ordersWithProducts.flatMap(order =>
        order.order_items.map(item => ({
          order_id: order.id,
          product: item.product,
        }))
      );
    const handleStatusChange =async (id: number, value: string)=>{
        await updateOrderStatus(id, value);
    }
    return <div className="container mx-auto p-6">
        <div className="font-bold text-2xl mb-6">Orders Management</div>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Crated At</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    ordersWithProducts.length > 0 && ordersWithProducts.map((order)=>{
                        return <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{format(new Date(order.created_at), 'MMM dd, yyyy')}</TableCell>
                                <TableCell>
                                    <Select onValueChange={(value)=>{
                                        handleStatusChange(order.id, value)
                                    }} defaultValue={order.status}>
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue>
                                                {order.status}
                                            </SelectValue>
                                            <SelectContent>
                                                {
                                                    selectOptions.map((option, index)=>{
                                                        return <SelectItem key={index} value={option}>
                                                            {option}
                                                        </SelectItem>
                                                    })
                                                }
                                            </SelectContent>
                                        </SelectTrigger>

                                    </Select>
                                </TableCell>
                                <TableCell>{order.description || 'No Description'}</TableCell>
                                <TableCell>{order.user.email}</TableCell>
                                {/* <TableCell>{order.user.email }</TableCell> */}
                                <TableCell>{order.slug}</TableCell>
                                <TableCell>$ {order.total_price.toFixed(2)}</TableCell>
                                <TableCell>
                                   {order.order_items.length} item
                                   {order.order_items.length >1 ? 's': ''}
                                </TableCell>
                                <TableCell>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant={'outline'} size="sm" onClick={()=>{
                                                
                                                let p=  orderedProducts.filter((item)=> item.order_id == order.id)
                                                /* @ts-ignore */
                                                openProductModal(p)
                                                }
                                            }>
                                                View Products
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Orderd Products</DialogTitle>
                                            </DialogHeader>
                                            <div className="mt-4 ">
                                                {
                                                    selectedProduct.map(({product}, index)=>{
                                                        return <div className="mr-2 mb-2 flex items-center space-x-2" key={index}>
                                                                    <Image
                                                                        src={product.heroImage}
                                                                        alt="product image"
                                                                        height={64}
                                                                        width={64}
                                                                        className="w-16 h-16 object-cover rounded"
                                                                    />
                                                                    <div className="flex flex-col">
                                                                            <span className="font-semibold">
                                                                                {product.title}
                                                                            </span>
                                                                            <span className="text-gray-600">
                                                                                $ {product.price?.toFixed()}
                                                                            </span>
                                                                            <span className="text-sm text-gray-500">
                                                                               Available Quantity: {product.maxQuantity}
                                                                            </span>
                                                                    </div>
                                                            </div>
                                                    })
                                                }
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                        </TableRow>
                    })
                }
            </TableBody>
        </Table>
    </div>
}