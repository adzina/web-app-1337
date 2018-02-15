import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from '../../services/login.service';

@Component({
  selector: 'navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss']
})

export class NavbarComponent{
  user: string;
  isAdmin: boolean;
  constructor(private _router:Router, private _loginService:LoginService){
    this.user=_loginService.getUserName();
    this.isAdmin=_loginService.isAdmin();
    console.log(this.isAdmin);
  }
  logout(){
    this._router.navigate(['./goodbye']);
  }
  navigate(nr: number){
    switch(nr){
      case(0): this._router.navigate(['./see-all-lessons']);break;
      case(1): this._router.navigate(['./admin-create-group']);break;
      case(2): this._router.navigate(['./admin-register']);break;
      case(3): this._router.navigate(['./admin-add-users']);break;
      case(4): this._router.navigate(['./admin-modify-accounts']);break;
      case(5): this._router.navigate(['./see-all-lessons']);break;
      case(6): this._router.navigate(['./create-lesson']);break;
      case(7): this._router.navigate(['./words-panel']);break;
      case(-1): this._router.navigate(['./add-students']);break;
      case(8): this._router.navigate(['./see-progress']);break;
      case(9): this._router.navigate(['./update-profile']);break;
      case(10): this._router.navigate(['./goodbye']);break;
    }
  }
}
