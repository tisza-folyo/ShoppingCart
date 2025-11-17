import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { Cartservice } from '../../cart/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';

  constructor(private userService: UserService, private cartService: Cartservice, private router: Router) { }

  check = false;
  success = false;

  onLogin(form: NgForm) {

    if (!form.valid) {
      this.check = true;
      return;
    }

    this.userService.loginUser(this.email,this.password).subscribe({
      next: (response) => {
        alert('Login successful!');
        form.resetForm();
        this.check = false;
        this.userService.setToken(response.data.token);
        this.userService.setUserId(response.data.id);
        this.userService.setRole();

        //fetch user data after login
        this.userService.getActualUser(response.data.id).subscribe({
          next: (res) => {
            this.userService.setActualUser(res.data);
          },
          error: (err) => {
            console.error('Error fetching user data:', err);
          }
        });
        this.cartService.loadItems();
        this.success = true;
        this.router.navigate(['/product']);
      },
      error: (err) => {
        console.error('Error during login:', err);
        alert('Login failed!');
      }
    });
  }
}
