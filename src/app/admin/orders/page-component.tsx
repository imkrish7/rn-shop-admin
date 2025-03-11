'use client'

import { OrdersWithProducts } from "@/app/admin/orders/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

type Props = {
    ordersWithProducts: OrdersWithProducts
}

export default function PageComponent({ ordersWithProducts }:Props){
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
                    ordersWithProducts.map((order)=>{
                        return <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{format(new Date(order.created_at), 'MMM dd, YYYY')}</TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell>{order.description || 'No Description'}</TableCell>
                                <TableCell>{order.description || 'No Description'}</TableCell>
                                <TableCell>{order.user.email?? 'No email' }</TableCell>
                                <TableCell>{order.slug}</TableCell>
                                <TableCell>$ {order.total_price.toFixed(2)}</TableCell>
                                <TableCell>
                                   {order.order_items.length} item
                                   {order.order_items.length >1 ? 's': ''}
                                </TableCell>
                                <TableCell>Actions</TableCell>
                        </TableRow>
                    })
                }
            </TableBody>
        </Table>
    </div>
}