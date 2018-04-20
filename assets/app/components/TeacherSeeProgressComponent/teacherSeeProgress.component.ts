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
  group: Group;
  students:User[];
  groupChosen=false;
  progress:number[];
  constructor(private _loginService: LoginService,
              private _backendService: BackendService,
              private _router: Router) {
    this.students=[];
    this.progress=[];
    this.group = _loginService.getChosenGroup();
    this.getData();
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
  getData(){
    this._backendService.getActiveUsers(this.group.id).subscribe(
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
      }
    )
  }
goBack(){
  this._router.navigate(['./choose-progress']);
}

}
