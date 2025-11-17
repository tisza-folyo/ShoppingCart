import { ProductModel } from "../product/product.model";

export interface CartItemModel {
  id: number;
  quantity: number;
  unitPrice: number;
  product: ProductModel
}