import { Injectable, signal } from "@angular/core";
import { Operation } from "./operation";
import { environment } from "../../enviroments/enviroment";
import { Observable } from "rxjs";
import { CategoryModel } from "../category/category.model";
import { HttpClient } from "@angular/common/http";
import { ProductRequestModel } from "../product/product.request.model";
import { OrderModel } from "../order/order.model";
import { UserModel } from "../user/user.model";

@Injectable({ providedIn: 'root' })
export class MaintainerService {
    private mode = signal<Operation | null>(null);

    private getAllCategoriesUrl = `${environment.apiUrl}/categories/all`
    private addProductUrl = `${environment.apiUrl}/products/add`
    private removeProductUrl = (prodId: number) => `${environment.apiUrl}/products/${prodId}/product`;
    private addCategoryUrl = `${environment.apiUrl}/categories/add`
    private removeCategoryUrl =  (catId: number) => `${environment.apiUrl}/categories/${catId}/category`;
    private removeOrderUrl = (ordId: number) => `${environment.apiUrl}/orders/${ordId}/order`;
    private getAllOrdersUrl = `${environment.apiUrl}/orders/all`;
    private getAllUsersUrl = `${environment.apiUrl}/users/all`;
    private removeUserUrl = (userId: number) => `${environment.apiUrl}/users/${userId}/user`;
    private changeRoleUrl = (userId: number, role: string) => `${environment.apiUrl}/users/${userId}/user/${role}/role`;

    constructor(private http: HttpClient) {}
    getMode() {
        return this.mode();
    }
    setMode(m: Operation){
        this.mode.set(m);
    }

    getCategories(): Observable<{message: string; data: CategoryModel[]}> {
        return this.http.get<{message: string; data: CategoryModel[]}>(this.getAllCategoriesUrl);
    }

    addProduct(product: ProductRequestModel ): Observable<{message: string; data: any}> {
        return this.http.post<{message: string; data: any}>(this.addProductUrl, product);
    }

    removeProduct(prodId: number): Observable<{message: string; data: any}>{
        return this.http.delete<{message: string; data: any}>(this.removeProductUrl(prodId));
    }

    addCategory(name: string): Observable<any>{
        return this.http.post(this.addCategoryUrl,{name});
    }

    removeCategory(id: number): Observable<any>{
        return this.http.delete(this.removeCategoryUrl(id));
    }
    removeOrder(id: number): Observable<any>{
        return this.http.delete(this.removeOrderUrl(id));
    }

    getOrders(): Observable<{message: string; data: OrderModel[]}> {
        return this.http.get<{message: string; data: OrderModel[]}>(this.getAllOrdersUrl);
    }

    getUsers(): Observable<{message: string; data: UserModel[]}> {
        return this.http.get<{message: string; data: UserModel[]}>(this.getAllUsersUrl);
    }

    removeUser(id: number): Observable<any>{
        return this.http.delete(this.removeUserUrl(id));
    }

    changeRole(id: number, role:string): Observable<{message: string, data: UserModel}>{
        return this.http.put<{message: string, data: UserModel}>(this.changeRoleUrl(id,role),{});
    }

    
}