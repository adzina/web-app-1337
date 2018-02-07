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
  headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private _router:Router,
              private _loginService: LoginService,
              private http: Http,
              private _backendService: BackendService){
    this.inputType = 'password';
    this.email="";
    this.password="";
  }

  hideShowPassword(){
    if (this.inputType == 'password')
      this.inputType = 'text';
    else
      this.inputType = 'password';
  };
  submit(type:string) {
    var email=this.email;
    var pswd=this.password;
    let body = JSON.stringify({ email, pswd });
    if(this.url){
          var x='http://'+this.url+':1337/';
              this._backendService.setApiUrl(x);
      }
      this.url=this._backendService.getApiUrl()+'user/login';
      this.headers.set('Access-Control-Allow-Origin' , '*');
      this.http.post(this.url, body, { headers: this.headers })
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
            alert("login error:"+error);
            console.log(error);
          }
        );


  }
  /*
submit(type:string){
  var results: ItemsResponse;
  var first_name: string;
  var http_string="http://localhost:1337/users/"+this.email

  this.http.get<ItemsResponse>(http_string).subscribe(
    data => {
      bcrypt.compare(this.password, data.password, function(err, res) {
        if(res==true){
          alert("haslo ok");
          //====================================================================
          this._loginService.setUserType(type);
          this._loginService.setUserID(data.id);
          this._loginService.setLoggedIn(true);
          this._loginService.setUsername(data.first_name);
          this._router.navigate(['./choose-mode']);
          //=================================================================
        }
        else this.wrong=true;
  });


      },


    (error)=>{
      this.wrong=true;

    });

  };
*/
register(){
  this._router.navigate(['./register']);
}

}
interface ItemsResponse {
  email: string,
  password: string,
  first_name: string,
  id:string
}
