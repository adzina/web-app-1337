import { Component} from '@angular/core';
import {Router} from '@angular/router';
import { AuthHttp} from 'angular2-jwt';
import {HttpErrorResponse} from '@angular/common/http';
import {LoginService} from '../../services/login.service';
import {BackendService} from '../../services/backend.service';
@Component({
  selector: 'update-profile',
  templateUrl: './updateProfile.component.html',
  styleUrls: ["./updateProfile.component.scss"]
})
export class UpdateProfileComponent {
  inputType0: string;
  inputType1: string;
  old_password: string;
  new_password: string;
  registered: boolean;
  empty_field: boolean;
  backend_error: string;
  constructor(private _router:Router,
     private _loginService:LoginService,
     private _backendService: BackendService,
     private http:AuthHttp) {
    this.inputType0 = 'password';
    this.inputType1 = 'password';
    this.old_password=null;
    this.new_password=null;
    this.empty_field = false;
    this.backend_error=null;
  }

    hideShowPassword0(){
      if (this.inputType0 == 'password')
        this.inputType0 = 'text';
      else
        this.inputType0 = 'password';
    };
    hideShowPassword1(){
      if (this.inputType1 == 'password')
        this.inputType1 = 'text';
      else
        this.inputType1 = 'password';
    };

  submit(){
    if(this.old_password==null || this.new_password==null){
      this.empty_field=true;
    }
    else{
      this._backendService.updateMyProfile(this.old_password,this.new_password)
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
