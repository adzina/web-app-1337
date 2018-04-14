import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { Group } from '../../models/group';
import { User } from '../../models/user';

@Component({
  selector: 'teacherChooseProgress',
  templateUrl: './teacherChooseProgress.component.html',
  styleUrls: ['./teacherChooseProgress.component.scss']
})
export class TeacherChooseProgressComponent{
  groups: Group[];
  constructor(private _loginService: LoginService,
              private _backendService: BackendService,
              private _router: Router) {
    _backendService.getAllMyGroups().subscribe(
      data=>{
        this.groups=data
      }
    )
  }

  choose(i){
    this._loginService.setChosenGroup(this.groups[i]);
    this._router.navigate(['see-progress']);
  }


}
