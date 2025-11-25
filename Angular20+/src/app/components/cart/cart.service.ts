import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartModel } from './cart.model';
import { UserService } from '../user/user.service';
import { CartItemModel } from './cartItem.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class Cartservice {
    private getCartUrl = (id:number) => `${environment.apiUrl}/carts/${id}`;
    private deleteCartItemUrl = (cartId:number, itemId:number) => `${environment.apiUrl}/cartItems/${cartId}/cart/${itemId}/items`;
    private updateCartItemUrl = (cartId:number, itemId:number, quantity:number) => `${environment.apiUrl}/cartItems/${cartId}/cart/${itemId}/items?quantity=${quantity}`;
    private orderUrl = (userId:number) => `${environment.apiUrl}/orders/order?userId=${userId}`;
    private getTotalAmountUrl = (cartId:number) => `${environment.apiUrl}/carts/${cartId}/total`;
    private clearCartUrl = (cartId:number) => `${environment.apiUrl}/carts/${cartId}/cart`;
    items = signal<CartItemModel[]>([]);
    loggedIn = signal<boolean>(false);
    cartId = signal<number | null>(null);

    getItems() {
        return this.items();
    }
    getLoggedIn() {
        return this.loggedIn();
    }
    getCartId() {
        return this.cartId();
    }
    getCartItemsLength(): number {
        return this.items().length;
    }

    constructor(private http: HttpClient, private userService: UserService) {}

    getCart(id: number): Observable<{message: string; data: CartModel}> {
        return this.http.get<{message: string; data: CartModel}>(this.getCartUrl(id));
    }

    removeCartItem(cartId: number, itemId: number): Observable<any> {
        return this.http.delete(this.deleteCartItemUrl(cartId, itemId));
    }
    updateCartItem(cartId: number, itemId: number, quantity: number): Observable<any> {
        return this.http.put(this.updateCartItemUrl(cartId, itemId, quantity), {});
    }
    makeOrder(userId: number): Observable<any> {
        return this.http.post(this.orderUrl(userId), {});
    }

    getTotalAmount(cartId: number): Observable<{message: string; data: number}> {
        return this.http.get<{message: string; data: number}>(this.getTotalAmountUrl(cartId));
    }

    clearCart(cartId: number): Observable<any> {
        return this.http.delete(this.clearCartUrl(cartId));
    }

    loadItems(): void {
    this.userService.getUser(this.userService.userId()!).subscribe({
        next: (response) => {
          this.items.set(response.data.cart.cartItems); 
          console.log(response.data.cart);
          this.loggedIn.set(true);  
          this.cartId.set(response.data.cart.id);
        },
        error: (err) => {
          console.error(err);
        }
      })
    }

}