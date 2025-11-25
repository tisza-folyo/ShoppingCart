import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductModel } from './product.model';
import { environment } from '../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class ProductService {
  private getProductsUrl = `${environment.apiUrl}/products/all`;
  private addToCartUrl = (productId: number, quantity: number) => `${environment.apiUrl}/cartItems/${productId}/items?&quantity=${quantity}`;
  private getProductUrl = (id: number) => `${environment.apiUrl}/products/${id}`;
  private filterByBrandUrl = (brand: string) => `${environment.apiUrl}/products/by/brand?brand=${brand}`;
  private filterByCategoryUrl = (category: string) => `${environment.apiUrl}/products/by/category?category=${category}`;
  private filterByCategoryAndBrandUrl = (category: string, brand: string) => `${environment.apiUrl}/products/by/category-and-brand?category=${category}&brand=${brand}`;
  private filterByBrandAndNameUrl = (brand: string, name: string) => `${environment.apiUrl}/products/by/brand-and-name?name=${name}&brand=${brand}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<{message: string; data: ProductModel[]}> {
    return this.http.get<{message: string; data: ProductModel[]}>(this.getProductsUrl);
  }

  addToCart(productId: number, quantity: number): Observable<{message: string; data: any}> {
    return this.http.post<{message: string; data: any}>(this.addToCartUrl(productId, quantity), {});
  }

  getProductById(id: number): Observable<{message: string; data: ProductModel}> {
    return this.http.get<{message: string; data: ProductModel}>(this.getProductUrl(id));
  }

  getByBrand(brand: string): Observable<{message: string; data: ProductModel[]}> {
    return this.http.get<{message: string; data: ProductModel[]}>(this.filterByBrandUrl(brand));
  }

  getByCategory(category: string): Observable<{message: string; data: ProductModel[]}> {
    return this.http.get<{message: string; data: ProductModel[]}>(this.filterByCategoryUrl(category));
  }

  getByCategoryAndBrand(category: string, brand: string): Observable<{message: string; data: ProductModel[]}> {
    return this.http.get<{message: string; data: ProductModel[]}>(this.filterByCategoryAndBrandUrl(category, brand));
  }


  getByBrandAndName(brand: string, name: string): Observable<{message: string; data: ProductModel[]}> {
    return this.http.get<{message: string; data: ProductModel[]}>(this.filterByBrandAndNameUrl(brand, name));
  }

}
