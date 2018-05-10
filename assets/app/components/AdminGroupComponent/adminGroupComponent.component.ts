import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { LoginService } from '../../services/login.service';
import { PagerService } from '../../services/pager.service';
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
  pager: any = {};
  pagedGroups: Group[];
  constructor(private _backendService: BackendService,
              private _loginService: LoginService,
              private _pagerService: PagerService,
              private _router:Router) {
            this.groups = null;
            _backendService.getAllGroups().
              subscribe(response=>{
                this.groups=response;
                this.setPage(1);
                  }
                );
      }
    navigate(){
      this._router.navigate(["./admin-create-group"]);
    }
    addRemove(nr:string) {
      var group=this.pagedGroups[nr];
      this._loginService.setChosenGroup(group);
      this._router.navigate(['./admin-add-users']);
    }
    setPage(page: number) {
     if (page < 1 || page > this.pager.totalPages) {
       return;
     }
     // get pager object from service
     this.pager = this._pagerService.getPager(this.groups.length, page);
     // get current page of items
     this.pagedGroups = this.groups.slice(this.pager.startIndex,
       this.pager.endIndex + 1);
   }
    delete(i:number){
      let group = this.pagedGroups[i]
      this._backendService.deleteGroup(group.id).subscribe(data=>{
        this._router.navigate(['./admin-group'])
      })

    }

    }
