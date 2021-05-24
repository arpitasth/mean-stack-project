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

  baseurl ='http://localhost:3000/api/auth';


  getAuthStatus(){
    return this.authStatusListener.asObservable();
  }

  /**
   * Getting auth status
   */
  getAuth(){
    return this.isAuthenticated;
  }

  /**
   * Getting the token
   */
  getToken(){
    return localStorage.getItem('token');
  }

  /**
   * Getting user Id
   */
  getUserId(){
    return localStorage.getItem('user');
  }

  /**
   * Calling Sign up API & getting the response
   */
  getSignUp(email: any, password: any) {
    const userData = { email: email, password: password}
    this.http.post<Auth>(
      `${this.baseurl}/register`, userData)
      .subscribe(response => {
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
      })
  }

  /**
   * Calling Login API & subscribe the response
   */
  getLogIn(email: any, password: any){
    const userData = { email: email, password: password}
    this.http.post<{token: string, message: string, user: string}>(
      `${this.baseurl}/login`, userData)
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

  /**
   * Checking user is authorize or not
   */
  autoAuthUser(){
    const authInfo = this.getAuthData();
    if(authInfo && authInfo.token && authInfo.user){
      this.token = authInfo?.token;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
    }

  }

  /**
   * Logout functionality to remove the token from localstorage
   */
  logout(){
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/login']);
    this.userId = null;
  }

  /**
   * Storing Auth Data in localstorage
   */
  private saveAuthData(token: string, user: string){
    localStorage.setItem('token', token);
    localStorage.setItem('user', user);
  }

  /**
   * Clear Auth Data in localstorage
   */
  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Getting Auth Data from localstorage
   */
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
