import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | undefined ;

  constructor(private http: HttpClient) {}

  getToken(){
    return this.token;
  }

  getSignUp(email: any, password: any) {
    const userData = { email: email, password: password}
    this.http.post<Auth>(
      'http://localhost:3000/api/user/signup', userData)
      .subscribe(response => {
        console.log(response);
      })
  }

  getLogIn(email: any, password: any){
    const userData = { email: email, password: password}
    this.http.post<{token: string, message: string}>(
      'http://localhost:3000/api/user/login', userData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        console.log(this.token);
      })
  }
}
