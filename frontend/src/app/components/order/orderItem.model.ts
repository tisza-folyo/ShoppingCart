import { ProductModel } from "../product/product.model";

export interface OrderItemModel {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
}