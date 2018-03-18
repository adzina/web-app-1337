import {Component} from '@angular/core';
import {LoginService} from '../../services/login.service';
import {Router} from '@angular/router';


@Component({
  selector: 'goodbye',
  templateUrl: 'goodbye.component.html',
  styleUrls: ['goodbye.component.scss']
})

export class GoodbyeComponent{

  user: string;
  constructor(private _router:Router, private _loginService:LoginService){
    this.user=this._loginService.getUserName();
    this._loginService.setUserType(null);
    this._loginService.setUsername(null);
    localStorage.removeItem('token');
  }
  login(){
    this._router.navigate(['./']);
  }
}
