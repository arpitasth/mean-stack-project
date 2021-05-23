import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../models/auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | undefined ;
  private isAuthenticated: boolean = false;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) {}

  getAuthStatus(){
    return this.authStatusListener.asObservable();
  }

  getAuth(){
    return this.isAuthenticated;
  }

  getToken(){
    return localStorage.getItem('token');
  }

  getSignUp(email: any, password: any) {
    const userData = { email: email, password: password}
    this.http.post<Auth>(
      'http://localhost:3000/api/auth/register', userData)
      .subscribe(response => {
        console.log(response)
        this.router.navigate(['/']);
      })
  }

  getLogIn(email: any, password: any){
    const userData = { email: email, password: password}
    this.http.post<{token: string, message: string}>(
      'http://localhost:3000/api/auth/login', userData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if(token){
          localStorage.setItem('token', token);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      })
  }

  logout(){
    this.isAuthenticated = false;
    localStorage.removeItem('token');
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }
}
