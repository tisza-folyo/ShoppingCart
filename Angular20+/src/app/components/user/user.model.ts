import { CartModel } from "../cart/cart.model";
import { OrderModel } from "../order/order.model";

export interface UserModel {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    orders: OrderModel[];
    cart: CartModel;
}