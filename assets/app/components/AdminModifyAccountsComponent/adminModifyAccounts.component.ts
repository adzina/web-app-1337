import { Component} from '@angular/core';
import {Router} from '@angular/router';
import { AuthHttp} from 'angular2-jwt';
import {HttpErrorResponse} from '@angular/common/http';
import {LoginService} from '../../services/login.service';
import {BackendService} from '../../services/backend.service';
import {User} from '../../models/user';
@Component({
  selector: 'admin-modify-accounts',
  templateUrl: './adminModifyAccounts.component.html'
})
export class AdminModifyAccountsComponent {
  email: string;
  inputType: string;
  new_password: string;
  registered: boolean;
  empty_field: boolean;
  backend_error: string;
  user: User;
  constructor(private _router:Router,
     private _loginService:LoginService,
     private _backendService: BackendService,
     private http:AuthHttp) {
    this.inputType = 'password';
    this.new_password=null;
    this.registered=null;
    this.empty_field = false;
    this.backend_error=null;
    this.user = _loginService.getChosenUser();
    this.email = this.user.email;
  }

    hideShowPassword(){
      if (this.inputType == 'password')
        this.inputType = 'text';
      else
        this.inputType = 'password';
    };

  submit(){
    if(this.email==null || this.new_password==null){
      this.empty_field=true;
    }
    else{
      this._backendService.adminChangePassword(this.email,this.new_password)
        .subscribe(data=>{this.registered=true},(error:HttpErrorResponse) => {

          this.backend_error=`Backend returned code ${error.status}`;
        })
    }

  }

}

interface ItemsResponse {
  login: string,
  password: string
}
