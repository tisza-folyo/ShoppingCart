import { CartItemModel } from "./cartItem.model";

export interface CartModel {
  id: number;
  totalAmount: number;
  cartItems: CartItemModel[];
}