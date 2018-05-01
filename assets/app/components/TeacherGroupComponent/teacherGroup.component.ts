import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { LoginService } from '../../services/login.service';
import { PagerService } from '../../services/pager.service';
import { Router } from '@angular/router';
import { Group } from '../../models/group';

@Component({
  selector: 'teacher-group',
  templateUrl: './teacherGroup.component.html',
  styleUrls: ['./teacherGroup.component.scss']
})

export class TeacherGroupComponent{
  placeholder: Group;
  chosenGroup: Group;
  groups: Group[];
  dropdownText:string;
  pager: any = {};
  pagedGroups: Group[];
  constructor(private _backendService: BackendService,
              private _loginService: LoginService,
              private pagerService: PagerService,
              private _router:Router) {
            this.groups = null;
            _backendService.getAllMyGroups().
              subscribe(response=>{
                this.groups=response;
                this.setPage(1)
                  }
                );
      }
    select(nr:string) {
      var group=this.pagedGroups[nr];
      this._loginService.setChosenGroup(group);
      this._router.navigate(['./see-groups-lessons']);
    }
    setPage(page: number) {
     if (page < 1) {
       return;
     }
     // get pager object from service
     this.pager = this.pagerService.getPager(this.groups.length, page);
     // get current page of items
     this.pagedGroups = this.groups.slice(this.pager.startIndex,
       this.pager.endIndex + 1);
   }
    }
