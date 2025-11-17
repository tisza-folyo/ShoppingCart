import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { CommonModule } from '@angular/common';
import { ProductModel } from './product.model';
import { UserService } from '../user/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product implements OnInit {
  products: ProductModel[] = [];
  tempProducts: ProductModel[] = [];
  brands = new Set<string>();
  selectedBrand: string = '';
  categories = new Set<string>();
  selectedCategory: string = '';
  inputName: string = '';
  inputNamePart: string = '';
  loading = true;
  error = '';
  userService = inject(UserService);


  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.loadProducts();
    this.loading = false;
  }
  addToCart(productId: number, quantity: string | number) {
    const qty = Number(quantity) || 1;
    this.productService.addToCart(productId, qty).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.error(err)
    });
  }

  fillBrands() {
    this.products.forEach(product => {
      this.brands.add(product.brand);
    });
  }
  fillCategories() {
    this.products.forEach(product => {
      this.categories.add(product.category.name);
    });
  }

  filterByBrand() {
    if (this.selectedCategory !== '') {
      this.getProductsByCategoryAndBrand(this.selectedCategory, this.selectedBrand);
    } else {
      this.getProductsByBrand(this.selectedBrand);
    }
  }

  filterByCategory() {
    if (this.selectedBrand !== '') {
      this.getProductsByCategoryAndBrand(this.selectedCategory, this.selectedBrand);
    } else {
      this.getProductsByCategory(this.selectedCategory);
    }
  }


  filterByNamePart() {
    if (this.tempProducts.length !== 0) {
      this.products = this.tempProducts;
    }
    this.tempProducts = this.products;
    this.products = this.products.filter(p => p.name.toLowerCase().includes(this.inputNamePart.toLowerCase()));
  }

  private getProductsByBrand(brand: string) {
    this.productService.getByBrand(brand).subscribe({
      next: (response) => {
        this.products = response.data;
        this.tempProducts = response.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private getProductsByCategory(category: string) {
    this.productService.getByCategory(category).subscribe({
      next: (response) => {
        this.products = response.data;
        this.tempProducts = response.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  private getProductsByCategoryAndBrand(category: string, brand: string) {
    this.productService.getByCategoryAndBrand(category, brand).subscribe({
      next: (response) => {
        this.products = response.data;
        this.tempProducts = response.data;
      },
      error: (err) => {
        console.log(err);

      }
    });
  }



  private getProductsByBrandAndName(brand: string, name: string) {
    this.productService.getByBrandAndName(brand, name).subscribe({
      next: (response) => {
        this.products = response.data;
        this.tempProducts = response.data;
      },
      error: (err) => {
        if (err.status === 404) {
          console.log("Nincs ilyen termék!");
          this.products = [];
        } else {
          console.error(err);
        }
      }
    });
  }


  clearBrandFilter() {
    this.selectedBrand = '';
    if (this.selectedCategory !== '') {
      this.getProductsByCategory(this.selectedCategory);
    } else {
      this.loadProducts();
    }
  }

  clearCategoryFilter() {
    this.selectedCategory = '';
    if (this.selectedBrand !== '') {
      this.getProductsByBrand(this.selectedBrand);
    } else {
      this.loadProducts();
    }

  }

  private loadProducts() {
    this.productService.getAll().subscribe({
      next: (response) => {
        this.products = response.data;
        this.tempProducts = response.data;
        if (this.selectedBrand.length <= 0) {
          this.fillBrands();
        }
        if (this.selectedCategory.length <= 0) {
          this.fillCategories();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
