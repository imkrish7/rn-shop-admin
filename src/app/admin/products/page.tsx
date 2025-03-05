import { getCategoriesWithProduct } from "@/actions/categories";
import { ProductPageComponent } from "./page-component";


const Products = async () => {
    const categories = await getCategoriesWithProduct();
  return (<ProductPageComponent categories={categories}/>)
}

export default Products