import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import {LoginService} from '../services/login.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
              private loginService: LoginService) {}

  canActivate() {
    // Check to see if a user has a valid JWT
    if (tokenNotExpired()) {
      // If they do, return true and allow the user to load the home component
      return true;
    }
    // If not, they redirect them to the login page
    this.router.navigate(['']);
    return false;
  }
  isAdmin(){
    if(this.loginService.isAdmin()){
      return true;
    }
    return false;
  }
}
