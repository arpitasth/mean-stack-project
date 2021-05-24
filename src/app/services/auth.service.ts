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
  private userId: any;
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

  getUserId(){
    return localStorage.getItem('user');
  }

  getSignUp(email: any, password: any) {
    const userData = { email: email, password: password}
    this.http.post<Auth>(
      'http://localhost:3000/api/auth/register', userData)
      .subscribe(response => {
        console.log(response)
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
      })
  }

  getLogIn(email: any, password: any){
    const userData = { email: email, password: password}
    this.http.post<{token: string, message: string, user: string}>(
      'http://localhost:3000/api/auth/login', userData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        this.userId = response.user;
        if(token){
          this.saveAuthData(token, this.userId);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      })
  }

  autoAuthUser(){
    const authInfo = this.getAuthData();
    this.token = authInfo?.token;
    this.isAuthenticated = true;
    this.authStatusListener.next(true);
  }

  logout(){
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/login']);
    this.userId = null;
  }

  private saveAuthData(token: string, user: string){
    localStorage.setItem('token', token);
    localStorage.setItem('user', user);
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if(!token || !user){
      return;
    }

    return {
      token: token,
      user: user
    }
  }
}
