import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService:AuthService, private router:Router){}

  canActivate(route:ActivatedRouteSnapshot, router:RouterStateSnapshot):
   Observable<boolean> | Promise<boolean> | boolean  {
    const isAuth = this.authService.getAuth();
    if(!isAuth){
      this.router.navigate(['/login']);
    }

    return true;
  }
}
