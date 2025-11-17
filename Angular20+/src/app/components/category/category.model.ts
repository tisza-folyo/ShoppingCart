import { ProductModel } from "../product/product.model";

export interface CategoryModel {
  id: number;
  name: string;
  products: ProductModel[];
}