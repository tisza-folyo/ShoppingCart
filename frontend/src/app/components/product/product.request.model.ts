import { CategoryModel } from "../category/category.model";

export interface ProductRequestModel {
    name: string;
    brand: string;
    price: number;
    inventory: number;
    description: string;
    category: CategoryModel;
}