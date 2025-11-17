import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { RequestUserModel } from './user.request.model';
import { UserModel } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  actualUser = signal<RequestUserModel | null>(null);
  token = signal<string | null>(null);
  role = signal<string>("");
  userId = signal<number | null>(null);

  setActualUser(user: RequestUserModel) {
    this.actualUser.set(user);
  }
  setUserId(id: number) {
    this.userId.set(id);
  }

  setToken(token: string) {
    this.token.set(token);
  }

  getToken(): string | null {
    return this.token();
  }

  getUserId(): number | null {
    return this.userId();
  }

  setRole() {
    if(this.token() != null) {
      const payload = JSON.parse(atob(this.getToken()!.split('.')[1]));
      this.role.set(payload.roles[0]);
      console.log(this.role());
      
    }
  }

  private registUrl = `${environment.apiUrl}/users/user`;
  private loginUrl = `${environment.apiUrl}/auth/login`;
  private getUserUrl = (id: number) => `${environment.apiUrl}/users/${id}/user`;
  private makeCartUrl = (id: number) => `${environment.apiUrl}/carts/${id}/cart`;

  constructor(private http: HttpClient) { }

  registerUser(user: RequestUserModel): Observable<any> {
    return this.http.post(this.registUrl, user);
  }

  loginUser(email: string, password: string): Observable<{msg:string, data:{id:number, token:string}}> {
    const loginData = { email, password };
    return this.http.post<{msg:string, data:{id:number, token:string}}>(this.loginUrl, loginData);
  }

  getActualUser(id: number): Observable<{msg:string, data:RequestUserModel}> {
    return this.http.get<{msg:string, data:RequestUserModel}>(this.getUserUrl(id));
  }
  makeCartForUser(id: number): Observable<{msg:string, data:any}> {
    return this.http.post<{msg:string, data:any}>(this.makeCartUrl(id), {});
  }
  
  getUser(id: number): Observable<{msg:string, data:UserModel}> {
    return this.http.get<{msg:string, data:UserModel}>(this.getUserUrl(id));
  }
}
