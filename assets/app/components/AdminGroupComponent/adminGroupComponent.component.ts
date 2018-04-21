import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { Group } from '../../models/group';

@Component({
  selector: 'admin-group',
  templateUrl: './adminGroupComponent.component.html',
  styleUrls: ['./adminGroupComponent.component.scss']
})

export class AdminGroupComponent{
  placeholder: Group;
  chosenGroup: Group;
  groups: Group[];
  dropdownText:string;
  constructor(private _backendService: BackendService,
              private _loginService: LoginService,
              private _router:Router) {
            this.groups = null;
            _backendService.getAllGroups().
              subscribe(response=>{
                this.groups=response;
                  }
                );
      }
    navigate(){
      this._router.navigate(["./admin-create-group"]);
    }
    addRemove(nr:string) {
      var group=this.groups[nr];
      console.log(group)
      this._loginService.setChosenGroup(group);
      this._router.navigate(['./admin-add-users']);
    }
    delete(i:number){
      let group = this.groups[i]
      this._backendService.deleteGroup(group.id).subscribe(data=>{
        this._router.navigate(['./admin-group'])
      })

    }

    }
