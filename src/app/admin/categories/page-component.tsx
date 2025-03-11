"use client"

import { FC, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { PlusCircle, Router } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuid } from 'uuid';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';


import {
  createCategorySchema,
  CreateCategorySchema,
} from '@/app/admin/categories/schema';
import { CategoriesWithProductResponse } from '@/app/admin/categories/categories.types';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CategoryForm } from './category-form';
import { CategoryTableRow } from '@/components/category';
import { createCategory, deleteCategory, imageUploadHandler, updateCategory } from '@/actions/categories';

type Props = {
  categories: CategoriesWithProductResponse;
};

const CategoryPageComponent: FC<Props> = ({ categories }) => {
  const router = useRouter()
  const [isCreateCategoryModalOpen,setIsCreateCategoryModalOpen] = useState<boolean>(false);
  const [currentCatgory, setCurrentCategory] = useState<CreateCategorySchema|null>(null);
  const form = useForm<CreateCategorySchema>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      image: undefined
    }
  })

  const submitCategoryHandler: SubmitHandler<CreateCategorySchema> = async(data)=>{
    const { image, name, intent='create' } = data;
    console.log(intent, name, image);
    const handleImageUpload = async()=>{
      const uniqueid = uuid();
      const filename = `category/category-${uniqueid}`;
      const file = new File([data.image[0]], filename)
      const formData= new FormData();
      formData.append('file', file);
      
      return await imageUploadHandler(formData)
    }

    switch(intent){
      case 'create':{
        const imageUrl = await handleImageUpload();
        if(imageUrl){
          await createCategory({imageUrl, name: data.name})
          form.reset()
          router.refresh();
          toast.success('Category created successfully')
        }
      }
      case 'update': {
        if(image && currentCatgory?.slug){
          const imageUrl = await handleImageUpload();
          if(imageUrl){
            await updateCategory({imageUrl, name, slug: currentCatgory.slug, intent: 'update'})
            form.reset()
            router.refresh();
            toast.success('Category created successfully')
          }
        }
      }
    default:
      console.error('Invalid intent')

  }
}

  const deleteCategoryHandler = async (id: number)=>{
    await deleteCategory(id);
    router.refresh();
    toast.success('Category deleted successfully')
  }
  return <main className='grid flex-1 items-start p-4 gap-4 sm:px-6 sm:py-0 md:gap-8'>
    <div className='flex items-center my-10'>
      <div className='ml-auto flex items-center gap-2'>
        <Dialog open={isCreateCategoryModalOpen} onOpenChange={
          ()=> setIsCreateCategoryModalOpen(!isCreateCategoryModalOpen)
        }>
          <DialogTrigger asChild>
            <Button size="sm" className='h-8 gap-1 cursor' onClick={()=>{
              setCurrentCategory(null)
              setIsCreateCategoryModalOpen(true)
            }}>
              <PlusCircle className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-now'>
                Add Category
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
            </DialogHeader>
            <CategoryForm form={form} onSubmit={submitCategoryHandler} defaultValues={currentCatgory} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
    <Card className='overflow-x-auto'>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className='min-w-[600px]'>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px] sm:table-cell'>
                <span className='sr-only '>Image</span>
              </TableHead>
              <TableHead>
                Name
              </TableHead>
              <TableHead className='md:table-cell'>
                Created At
              </TableHead>
              <TableHead className='md:table-cell'>
                Products
              </TableHead>
              <TableHead >
                <span className='sr-only'>Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              categories.map(category=>{
                return <CategoryTableRow deleteCategoryHandler={deleteCategoryHandler} key={category.id} category={category} setCurrentCategory={setCurrentCategory} setIsCreateCategoryModalOpen={setIsCreateCategoryModalOpen} />
              })
            }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </main>
};

export {CategoryPageComponent};