'use client'
import React, { FC, useState } from 'react'
import { Category } from '@/app/admin/categories/categories.types'
import { PlusIcon } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ProductsWithCategoryResponse } from '@/app/admin/products/products.types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  createOrUpdateProductSchema,
  CreateOrUpdateProductSchema,
} from '@/app/admin/products/schema';
import { imageUploadHandler } from '@/actions/categories';
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from '@/actions/products';
import { ProductForm } from '@/app/admin/products/product-form';
import { ProductTableRow } from '@/app/admin/products/products-table-row';

type Props = {
    categories: Category[],
    productWithCategories: ProductsWithCategoryResponse
}

export const ProductPageComponent: FC<Props> = ({
  categories,
  productWithCategories
}) => {
  const [currentProduct, setCurrentProduct] = useState<CreateOrUpdateProductSchema|null>(null);
  const [isProdutModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [isProdutDeleteModalOpen, setIsProductDeleteModalOpen] = useState<boolean>(false);

  const form = useForm<CreateOrUpdateProductSchema>({
    resolver: zodResolver(createOrUpdateProductSchema),
    defaultValues: {
      title: '',
      category: undefined,
      price: undefined,
      maxQuantity: undefined,
      heroImage: undefined,
      images: [],
      intent: 'create'
    }
  })

  const router = useRouter();

  const productCreateAndUpdateHandler = async(data:CreateOrUpdateProductSchema)=>{
    
    const {
      category,
      price,
      slug,
      intent='create',
      maxQuantity,
      title,
      images,
      heroImage
     } = data;

      const uploadFile = async (file: File)=>{
        const id = uuid();
        const fileName = `product/product-${id}-${file.name}`;
        const formData = new FormData();
        formData.append('file', file, fileName)
        return imageUploadHandler(formData)
     }

     let heroImageUrl: string|undefined;
     let imageUrls: string[] = [];

     if(heroImage){
      const imagePromise = Array.from(heroImage).map(file => uploadFile(file as File));
      try {
          [heroImageUrl] = await Promise.all(imagePromise);
      } catch (error) {
        console.error(`Error in uploading images: ${error}`);
        toast.error('Error in uploading images');
        return;
      }
     }

     if(images.length>0){
      const imagesPromise = Array.from(images).map(file=> uploadFile(file as File));

      try {
          imageUrls= (await Promise.all(imagesPromise)) as string[];
      } catch (error) {
        console.error(`Error in uploading images: ${error}`);
        toast.error('Error in uploading images');
        return;
      }

     }

     switch(intent){
      case 'create':{
        if(heroImageUrl && heroImageUrl?.length> 0){
          await createProduct({
            category: Number(category),
            price: Number(price),
            maxQuantity: Number(maxQuantity),
            images: imageUrls,
            title,
            heroImage: heroImageUrl
          })
          form.reset();
          router.refresh();
          setIsProductModalOpen(false);
          toast.success("Product created Successfully")
        }
      }
      case 'update': {
        if(heroImageUrl && imageUrls.length > 0&& slug){
          await updateProduct({
            category: Number(category),
            price: Number(price),
            maxQuantity: Number(maxQuantity),
            heroImage: heroImageUrl,
            imagesUrl: imageUrls,
            title,
            slug
          })
          form.reset();
          router.refresh();
          setIsProductModalOpen(false);
          toast.success("Product udpated Successfully")
        }
      }
      default:
          break;
     }
  }

  const deleteProductHandler = async()=> {
    if(currentProduct?.slug){
      await deleteProduct(currentProduct.slug);
      router.refresh()
      toast.success('Product deleted successfully')
      setIsProductDeleteModalOpen(false)
      setCurrentProduct(null)
    }
  }

  return <main className='grid flex-1 items-start gap-4 p-4 px-6 sm:py-0 md:gap-8'>
    <div className='container mx-aut p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Products Management</h1>
        <Button onClick={()=>{
          setCurrentProduct(null)
          setIsProductModalOpen(true)
        }}>
          <PlusIcon className='mr-2 h-4 w-4' /> Add Product
        </Button>
      </div>
      <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>MaxQuantity</TableHead>
              <TableHead>Hero Image</TableHead>
              <TableHead>Product Images</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              productWithCategories.map(product=>{
                return <ProductTableRow 
                key={product.id}
                setIsDeleteModalOpen={setIsProductDeleteModalOpen}
                product={product}
                setIsProductModalOpen={setIsProductModalOpen}
                setCurrentProduct={setCurrentProduct}
                />
              })
            }
          </TableBody>
      </Table>
      <ProductForm form={form} onSubmit={productCreateAndUpdateHandler} categories={categories} isProductModalOpen={isProdutModalOpen} setIsProductModalOpen={setIsProductModalOpen} defaultValues={currentProduct}/>
      <Dialog open={isProdutDeleteModalOpen} onOpenChange={setIsProductDeleteModalOpen} >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Title</DialogTitle>
                <p>Ary you sure want to delete the product: {currentProduct?.title}</p>
              </DialogHeader>
              <DialogFooter>
                <Button variant={'destructive'} onClick={deleteProductHandler}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
      </Dialog>
    </div>
  </main>
}
