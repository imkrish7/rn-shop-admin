import React from 'react'
import PageComponent from './page-component'
import { getMonthlyOrder } from '@/actions/orders'
import { getCategoryData } from '@/actions/categories'
import { getLatestUsers } from '@/actions/auth'

const AdminDashboard = async () => {
  const monthlyOrder = await getMonthlyOrder()
  const categoryData = await getCategoryData();
  const latestUsers = await getLatestUsers()
  return <PageComponent monthlyOrder={monthlyOrder} categoryData={categoryData} latestUser={latestUsers}/>
}

export default AdminDashboard