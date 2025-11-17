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
  rawJSON: string = "";
  parseError: string | null = null;
  productData: ProductRequestModel | null = null;
  isActive: boolean = false;
  maintainerService = inject(MaintainerService);
  jsonPlaceholder = `{
  "name": "Example name",
  "brand": "Example brand",
  "price": 99.9,
  "inventory": 1,
  "description": "Example description",
  "category": {
    "id": 1,
    "name": "Example category name"
  }
}`;

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

  onAddJSON(form: NgForm){
    this.submitted = true;
    this.parseJson(this.rawJSON);

    if(this.parseError === null){
      this.maintainerService.addProduct(this.productData!).subscribe({
        next: resp => {
          form.resetForm();
          this.submitted = false;
        },
        error: err => {
          console.log(err.message);
        }
      });
    }
    
  }

  resetSubmitted(){
    this.submitted = false;
  }

  private isProduct(data: any): data is ProductRequestModel {
  return(
    typeof data === "object" &&
    typeof data.name === "string" &&
    typeof data.brand === "string" &&
    typeof data.price === "number" &&
    typeof data.inventory === "number" &&
    typeof data.description === "string" &&
    typeof data.category === "object" &&
    typeof data.category.id === "number" &&
    typeof data.category.name === "string");
  };

  private parseJson(rawJSON: string) {
    try {
      const parsed = JSON.parse(this.rawJSON);

      if (this.isProduct(parsed)) {
        this.productData = parsed;
        this.parseError = null;
        console.log("Valid product:", this.productData);
      } else {
        this.parseError = "JSON does not match ProductRequestModel";
        this.productData = null;
      }
    } catch (err) {
      this.parseError = "Invalid JSON format";
      this.productData = null;
      console.log(this.parseError);
    }
  };
  
}
