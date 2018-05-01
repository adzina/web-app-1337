import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { LoginService } from '../../services/login.service';
import { PagerService } from '../../services/pager.service';
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
  pagedUsers: User[];
  dropdownText:string;
  pager: any = {};
  constructor(private _backendService: BackendService,
              private _loginService: LoginService,
              private _pagerService: PagerService,
              private _router:Router) {

            _backendService.getAllUsers().
              subscribe(response=>{
                this.users=response;
                this.setPage(1);
                  }
                );
      }
    navigate(){
      this._router.navigate(["./admin-register"]);
    }
    setPage(page: number) {
     if (page < 1) {
       return;
     }
     // get pager object from service
     this.pager = this._pagerService.getPager(this.users.length, page);
     // get current page of items
     this.pagedUsers = this.users.slice(this.pager.startIndex,
       this.pager.endIndex + 1);
   }
    modify(nr: string){
      var user=this.pagedUsers[nr];
      this._loginService.setChosenUser(user);
      this._router.navigate(['./admin-modify-accounts']);

    }
    seeGroups(nr:string){
      var user=this.pagedUsers[nr];
      this._loginService.setChosenUser(user);
      this._router.navigate(['./admin-see-user-groups']);
    }
    seeLessons(nr:string){
      var user=this.pagedUsers[nr];
      this._loginService.setChosenUser(user);
      this._router.navigate(['./admin-see-user-lessons']);
    }
    }
