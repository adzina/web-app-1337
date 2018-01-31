import { Injectable } from '@angular/core';
import {Router,CanActivate,ActivatedRouteSnapshot} from '@angular/router';
import { AuthGuard } from './auth.guard';
import * as decode from 'jwt-decode';
@Injectable()

export class RoleGuard implements CanActivate {
  constructor(public auth: AuthGuard, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;
    const token = localStorage.getItem('token');
    // decode the token to get its payload
    const tokenPayload = decode(token);
    var ad:boolean;
    ad=false;
    for(var i=0;i<tokenPayload.role.length;i++){
      if(tokenPayload.role[i]==expectedRole)
        ad=true
    }
    if (
      !this.auth.canActivate() || !ad
    ) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}
