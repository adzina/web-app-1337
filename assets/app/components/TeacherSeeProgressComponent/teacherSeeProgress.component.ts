import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { BackendService } from '../../services/backend.service';
import { Router } from '@angular/router';
import { Group } from '../../models/group';
import { User } from '../../models/user';

@Component({
  selector: 'teacherSeeProgress',
  templateUrl: './teacherSeeProgress.component.html',
  styleUrls: ['./teacherSeeProgress.component.scss']
})
export class TeacherSeeProgressComponent{
  groups: Group[];
  students:User[];
  groupChosen=false;
  progress:number[];
  constructor(private _loginService: LoginService,
              private _backendService: BackendService) {
    this.students=[];
    this.progress=[];
    _backendService.getAllMyGroups().subscribe(
      data=>{
        this.groups=data
      }
    )
  }
  isStudent(user){
    for(let role of user.role){
      if(role=="admin")
        return false;
    }
    for(let role of user.role){
      if(role=="student")
        return true;
    }
    return false;
  }
  choose(i){
    this.students=[];
    this._backendService.getActiveUsers(this.groups[i].id).subscribe(
      data=>{
           for(let user of data){
             let ids=[]
             if(this.isStudent(user)){
                this.students.push(user);
                ids.push(user.id);
             }
             this._backendService.countWordsForManyStudents(ids)
             .subscribe(data=>{
               for (let record of data){
                 if(record.all!=0)
                      this.progress.push(record.guessed/record.all)
                  else
                      this.progress.push(0)
               }
             }
             )

           }
          this.groupChosen=true;
      }
    )
  }


}
