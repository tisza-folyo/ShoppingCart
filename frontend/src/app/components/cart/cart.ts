import { Component, inject } from '@angular/core';
import { CartItemModel } from './cartItem.model';
import { CommonModule } from '@angular/common';
import { Cartservice } from './cart.service';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

  userService = inject(UserService);
  cartService = inject(Cartservice);
  itemId : number = 0;
  cartId : number = 0;
  totalAmount : number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if(this.userService.actualUser() === null) {
      console.log("Must login");
      return;
    }else{
      this.cartService.loadItems(); 
      this.getTotalAmount();
    }
  }

  removeItem(itemId: number): void {
    this.cartService.removeCartItem(this.cartService.getCartId()!, itemId).subscribe({
      next: (response) => {
        console.log("Item removed successfully");
        this.cartService.loadItems(); 
        this.getTotalAmount();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  updateQuantity(itemId: number, quantity: number | string): void {
    const qty = Number(quantity) || 0;
    this.cartService.updateCartItem(this.cartService.getCartId()!, itemId, qty).subscribe({
      next: (response) => {
        console.log("Item quantity updated successfully");
        this.cartService.loadItems(); 
        this.getTotalAmount();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  makeOrder(): void {
    this.cartService.makeOrder(this.userService.userId()!).subscribe({
      next: (response) => {
        console.log("Order placed successfully");
        alert("Order placed successfully");
        this.cartService.loadItems(); 
        this.router.navigate(['/product']);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getTotalAmount(): void {
    this.cartService.getTotalAmount(this.cartService.getCartId()!).subscribe({
      next: (response) => {
        this.totalAmount = response.data;
        console.log(response);
        
      },
      error: (err) => {
        console.error(err);
      }
    }); 
  }

  clearCart(): void {
    this.cartService.clearCart(this.cartService.getCartId()!).subscribe({
      next: (response) => {
        console.log("Cart cleared successfully");
        this.cartService.loadItems(); 
        this.totalAmount = 0;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
   
}
