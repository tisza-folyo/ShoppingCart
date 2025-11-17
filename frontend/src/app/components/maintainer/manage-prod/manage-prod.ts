import { CommonModule } from '@angular/common';
import { Component, inject, ModelOptions } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MaintainerService } from '../maintainer.service';
import { CategoryModel } from '../../category/category.model';
import { ProductModel } from '../../product/product.model';
import { ProductRequestModel } from '../../product/product.request.model';
import { Operation } from '../operation';

@Component({
  selector: 'app-manage-prod',
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-prod.html',
  styleUrl: './manage-prod.css',
})
export class ManageProd {
  op = Operation;
  submitted = false;
  selectedCategory: string = '';
  categories: CategoryModel[] = [];
  categoryNames: string[] = [];
  name: string = '';
  brand: string = '';
  price: number | null = null;
  inventory: number | null = null;
  description: string = '';
  prodId: number = 0;
  maintainerService = inject(MaintainerService);

  ngOnInit() {
    this.maintainerService.getCategories().subscribe((response) => {
      this.categories = response.data;
      this.categoryNames = this.categories.map((cat) => cat.name);
    });    
  }

  onAdd(form: NgForm) {
    this.submitted = true;
    if (!form.valid) {
      console.log("invalid");
      return;
    }

    const product : ProductRequestModel = {
      name: this.name,
      brand: this.brand,
      price: this.price!,
      inventory: this.inventory!,
      description: this.description,
      category: this.categories.find((cat => cat.name === this.selectedCategory))!,
    };

    this.maintainerService.addProduct(product).subscribe((response) => {
      console.log('Product added successfully:', response);
      form.resetForm();
      this.submitted = false;
    });

  };

  onRemove(form: NgForm){
    this.submitted = true;
    if (!form.valid) {
      console.log("invalid");
      return;
    }

    const prodId = this.prodId;
    console.log(prodId);
    
    this.maintainerService.removeProduct(prodId).subscribe((resp) => {
      form.resetForm();
      this.submitted = false;
    });
  };
  
}
