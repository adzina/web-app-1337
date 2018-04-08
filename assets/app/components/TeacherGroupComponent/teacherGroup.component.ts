import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { LoginService } from '../../services/login.service';
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
  constructor(private _backendService: BackendService,
              private _loginService: LoginService,
              private _router:Router) {
            this.groups = null;
            _backendService.getAllMyGroups().
              subscribe(response=>{
                this.groups=response;
                  }
                );
      }
    select(nr:string) {
      var group=this.groups[nr];
      this._loginService.setChosenGroup(group);
      this._router.navigate(['./see-groups-lessons']);
    }

    }
