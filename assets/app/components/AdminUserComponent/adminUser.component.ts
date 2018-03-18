import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'admin-user',
  templateUrl: './adminUser.component.html',
  styleUrls: ["./adminUser.component.scss"]
})

export class AdminUserComponent{
  chosenuser: User;
  users: User[];
  dropdownText:string;
  constructor(private _backendService: BackendService,
              private _loginService: LoginService,
              private _router:Router) {

            _backendService.getAllUsers().
              subscribe(response=>{
                this.users=response;
                  }
                );
      }
    navigate(){
      this._router.navigate(["./admin-register"]);
    }
    modify(nr: string){
      var user=this.users[nr];
      this._loginService.setChosenUser(user);
      this._router.navigate(['./admin-modify-accounts']);

    }
    seeGroups(nr:string){
      var user=this.users[nr];
      this._loginService.setChosenUser(user);
      this._router.navigate(['./admin-see-user-groups']);
    }
    seeLessons(nr:string){
      var user=this.users[nr];
      this._loginService.setChosenUser(user);
      this._router.navigate(['./admin-see-user-lessons']);
    }
    }
