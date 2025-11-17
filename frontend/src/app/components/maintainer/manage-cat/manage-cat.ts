import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MaintainerService } from '../maintainer.service';
import { Operation } from '../operation';
import { from } from 'rxjs';

@Component({
  selector: 'app-manage-cat',
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-cat.html',
  styleUrl: './manage-cat.css',
})
export class ManageCat {

  op = Operation;
  submitted = false;
  catName = '';
  catId = 0;
  maintainerService = inject(MaintainerService);

  onAdd(form: NgForm){

    this.submitted = true;
    if (!form.valid) {
      console.log("invalid");
      return;
    }

    const catName = this.catName;

    this.maintainerService.addCategory(catName).subscribe((resp) => {
      console.log('Category added successfully:', resp);
      form.resetForm();
      this.submitted = false;
    });

  }

  onRemove(form: NgForm){
    this.submitted = true;
    if (!form.valid) {
      console.log("invalid");
      return;
    }

    const catId = this.catId;
    
    this.maintainerService.removeCategory(catId).subscribe((resp) =>{
      form.resetForm();
      this.submitted = false;
    })
  }
}
