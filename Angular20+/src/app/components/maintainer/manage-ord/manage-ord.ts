import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Operation } from '../operation';
import { MaintainerService } from '../maintainer.service';
import { OrderModel } from '../../order/order.model';

@Component({
  selector: 'app-manage-ord',
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-ord.html',
  styleUrl: './manage-ord.css',
})
export class ManageOrd {

  op = Operation;
  submitted = false;
  ordId = 0;
  orders: OrderModel[]= [];
  maintainerService = inject(MaintainerService);


  ngOnInit(){
    this.maintainerService.getOrders().subscribe(
        (resp) =>{
          this.orders = resp.data;
        },
        (err) => {
          console.log(err);
        }
    );
  }

  onRemove(form:NgForm){
    this.submitted = true;
    if (!form.valid) {
      console.log("invalid");
      return;
    }

    const ordId = this.ordId;
    
    this.maintainerService.removeOrder(ordId).subscribe((resp) =>{
      form.resetForm();
      this.submitted = false;
    })
  }
}
