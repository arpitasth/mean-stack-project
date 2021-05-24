import { Subscription } from 'rxjs';
import { AuthService } from './../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  private authListener : Subscription;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.getAuth();
    this.authListener = this.authService.getAuthStatus()
    .subscribe(userAuthenticated => {
      this.isAuthenticated = userAuthenticated;
    });
  }

  onLogOut(){
    this.authService.logout();
  }

  ngOnDestroy(){
    this.authListener.unsubscribe();
  }

}
