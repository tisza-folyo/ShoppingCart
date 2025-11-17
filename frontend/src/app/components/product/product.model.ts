import { CategoryModel } from "../category/category.model";
import { ImageModel } from "./image.model";

export interface ProductModel {
    id: number;
    name: string;
    brand: string;
    price: number;
    inventory: number;
    description: string;
    category: CategoryModel;
    images: ImageModel[];
}