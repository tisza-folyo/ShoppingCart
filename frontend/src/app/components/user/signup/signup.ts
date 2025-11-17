import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { RequestUserModel } from '../user.request.model';
import { UserService } from '../user.service';
import { Cartservice } from '../../cart/cart.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  firstName = '';
  lastName = '';
  email = '';
  password = '';


  constructor(private userService: UserService, private cartService: Cartservice, private router: Router) { }

  submitAttempted = false;
  check = false;


  onSignUp(form: NgForm) {
    this.submitAttempted = true;

    if (!form.valid) {
      this.check = true;
      return;
    }

    const user: RequestUserModel = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    };


    this.userService.registerUser(user).subscribe({
      next: (response) => {
        console.log('User successfully registered:', response);
        alert('Registration successful!');
        form.resetForm();
        this.check = false;
        this.userService.setActualUser(user);


        //get token after registration
        this.userService.loginUser(this.email, this.password).subscribe({
          next: (resp) => {
            this.userService.setToken(resp.data.token);
            this.userService.setUserId(resp.data.id);
            //create cart for new user
            this.userService.makeCartForUser(response.data.id).subscribe({
              next: (res) => {
                console.log(res.msg);
              },
              error: (err) => {
                console.error(err.msg);
              }
            })
            this.cartService.loadItems();
          }
        })


      },
      error: (err) => {
        console.error('Error during registration:', err);
        alert('Registration failed!');
      }
    });

    this.router.navigate(['/product']);
  }
}
