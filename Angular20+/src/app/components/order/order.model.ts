import { OrderItemModel } from "./orderItem.model";


export interface OrderModel {
    id: number;
    userId: number;
    orderDate: Date;
    totalAmount: number;
    status: string;
    items: OrderItemModel[];
    
}