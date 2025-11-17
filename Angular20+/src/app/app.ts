import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { UserService } from './components/user/user.service';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink,RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  userService = inject(UserService);
}
