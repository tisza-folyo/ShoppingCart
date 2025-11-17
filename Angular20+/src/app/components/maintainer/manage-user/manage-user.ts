import { Component, inject } from '@angular/core';
import { Operation } from '../operation';
import { MaintainerService } from '../maintainer.service';
import { UserModel } from '../../user/user.model';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-user',
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-user.html',
  styleUrl: './manage-user.css',
})
export class ManageUser {
  op = Operation;
  submitted = false;
  userId = 0;
  users: UserModel[]= [];
  selectedRole: string = "";
  maintainerService = inject(MaintainerService);

  ngOnInit(){
    this.maintainerService.getUsers().subscribe({
      next: (resp) => this.users = resp.data,
      error: (err) => console.error(err)
    });
  }

  onRemove(form:NgForm){
    this.submitted = true;
    if (!form.valid) {
      console.log("invalid");
      return;
    }

    const userId = this.userId;
    
    this.maintainerService.removeUser(userId).subscribe((resp) =>{
      form.resetForm();
      this.submitted = false;
      this.userId = 0;
    })
  }

  onUpdate(form:NgForm){
    this.submitted = true;
    if (!form.valid) {
      console.log("invalid");
      return;
    }

    const userId = this.userId;
    const role = this.selectedRole;
    
    this.maintainerService.changeRole(userId,role).subscribe((resp) =>{
        form.resetForm();
        this.submitted = false;
        this.userId = 0;
      }
    )
  }
  
}
