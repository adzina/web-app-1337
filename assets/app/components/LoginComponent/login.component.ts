import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Headers,Http} from '@angular/http';
import {LoginService} from '../../services/login.service';
import {BackendService} from '../../services/backend.service';
import * as bcrypt from "bcryptjs";

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})

export class LoginComponent{
  inputType: string;
  email: string;
  password: string;
  wrong: boolean;
  url: string;
  backendError:string;
  headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private _router:Router,
              private _loginService: LoginService,
              private http: Http,
              private _backendService: BackendService){
    this.inputType = 'password';
    this.email="";
    this.password="";
    this.backendError=null;
  }

  hideShowPassword(){
    if (this.inputType == 'password')
      this.inputType = 'text';
    else
      this.inputType = 'password';
  };
  submit(type:string) {
    this.backendError=null;
    var email=this.email;
    var pswd=this.password;
    let body = JSON.stringify({ email, pswd });

      this.url=this._backendService.getApiUrl()+'user/login';
      this.http.post(this.url, body)
        .map(res=>res.json())
        .subscribe(
          response => {
            localStorage.setItem('token', response.id_token);
            this._loginService.setUserID(response.id);
            this._loginService.setUserRole(response.role);
            this._loginService.setUsername(response.first_name);
            if(this._loginService.isAdmin())
              this._router.navigate(['./admin-create-group']);
            else
              this._router.navigate(['./see-all-lessons']);
          },
          error => {
            this.backendError="Invalid credentials";
          }
        );


  }
}
interface ItemsResponse {
  email: string,
  password: string,
  first_name: string,
  id:string
}
