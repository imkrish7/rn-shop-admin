'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type MonthlyOrder = {
    name: string,
    orders: number
}

type CategoryData = {
    name: string,
    products: number,
}

type User = {
    id: string,
    email: string,
    date?: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PageComponent = ({
    monthlyOrder,
    categoryData,
    latestUser
}: { monthlyOrder: MonthlyOrder[], categoryData: CategoryData[], latestUser: User[] }) => {
    
  return <div className='flex-1 p-8 overflow-auto'>
    <h1 className='text-3xl font-bold mb-16'>Dashboard Overview</h1>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
            <CardHeader>
                <CardTitle>
                    Order Over time
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width='100%' height={300}>
                    <BarChart data={monthlyOrder}>
                        <CartesianGrid strokeDasharray={'3 3'} />
                        <XAxis dataKey={'name'}/>
                        <Tooltip />
                        <Legend />
                        <Bar dataKey='orders' fill='#8884d8' />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>
                   Product Distribution
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width='100%' height={300}>
                   <PieChart>
                    <Pie 
                        data={categoryData}
                        dataKey={'products'}
                        nameKey='name'
                        cx='50%'
                        cy='50%'
                        outerRadius={80}
                        // fill='#8884d8'
                        label={({name, percent})=>`${name} ${(percent*100).toFixed(0)}%`}
                        labelLine={false}
                        >
                    
                    {
                        categoryData.map((category, index)=>{
                            return <Cell key={`cell-${index}`} fill={COLORS[index%COLORS.length]} />
                        })
                    }
                    </Pie>
                   </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>
                   Products by Category
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width='100%' height={300}>
                    <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray={'3 3'} />
                        <XAxis dataKey={'name'}/>
                        <Tooltip />
                        <Legend />
                        <Bar dataKey='products' fill='#8884d8' />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>
                   Latest User
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>id</TableHead>
                            <TableHead>Email</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            latestUser.map((user)=>{
                                return <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                </TableRow>
                            })
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  </div>
}

export default PageComponent