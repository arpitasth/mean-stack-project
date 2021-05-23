import { AuthService } from './auth.service';
import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()

export class AuthInterceptor implements HttpInterceptor{

  constructor(private authService: AuthService){}

  intercept(req:HttpRequest<any>, next:HttpHandler) {
    const token = this.authService.getToken();
    console.log(token);
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer '+ token)
    })
    return next.handle(authRequest);
  }
}