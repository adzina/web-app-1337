import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { BackendService } from '../../services/backend.service';
import { Router } from '@angular/router';
import { AuthHttp} from 'angular2-jwt';
import {Group} from '../../models/group';


@Component({
  selector: 'admin-create-group',
  templateUrl: './adminCreateGroup.component.html',
  styleUrls: ['./adminCreateGroup.component.scss']
})
export class AdminCreateGroupComponent{
  name: string;
  created: boolean;
  error: boolean;
  backend_error:string;
  user: string;
  groupCreated: Group;
  constructor(private _router:Router,
              private _loginService:LoginService,
              private _backendService: BackendService){
    this.name=null;
    this.user=this._loginService.getUserName();
  }
  create(){
    if(this.name!=null){
      this.sendRequest()
    }
    else{
      this.error=true;
    }
  }
  sendRequest(){
    this._backendService.createGroup(this.name).subscribe(data => {
        this.name=null;
        this.error=false;
        this.created=true;
        this.groupCreated = data;
    }
  );

  }
  goto(){
    this._loginService.setChosenGroup(this.groupCreated);
    this._router.navigate(['./admin-add-users']);

  }
  goBack(){
    this._router.navigate(['./admin-group']);
  }

}
