import { getCategoriesWithProduct } from "@/actions/categories";
import { ProductPageComponent } from "./page-component";
import { getProductWithCategories } from "@/actions/products";


const Products = async () => {
    const categories = await getCategoriesWithProduct();
    const productWithCategories = await getProductWithCategories();

  return (<ProductPageComponent productWithCategories={productWithCategories} categories={categories}/>)
} 

export default Products