import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
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
  sortedStudents:User[]
  groupChosen=false;
  progress:number[];
  progress2:number[];
  constructor(private _loginService: LoginService,
              private _backendService: BackendService,
              private _router: Router) {
    this.students=[];
    this.progress=[];
    this.progress2=[];
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
             this.sortedStudents = this.students.sort((obj1, obj2) => {
               if (obj1.id > obj2.id) return 1
               if (obj1.id < obj2.id) return -1
               return 0;
             });
             this._backendService.countWordsForManyStudents(ids, this.group.id,1)
             .subscribe(data=>{
               var sortedData = data.sort((obj1, obj2) => {
                 if (obj1.studentID > obj2.studentID) return 1
                 if (obj1.studentID < obj2.studentID) return -1
                 return 0;
               });
               for (let record of sortedData){
                 if(record.all!=0)
                      this.progress.push(record.guessed/record.all)
                  else
                      this.progress.push(0)
               }
               this._backendService.countWordsForManyStudents(ids, this.group.id,4)
               .subscribe(data1=>{
                 var sortedData1 = data1.sort((obj1, obj2) => {
                   if (obj1.studentID > obj2.studentID) return 1
                   if (obj1.studentID < obj2.studentID) return -1
                   return 0;
                 });
                 for (let record of sortedData1){
                   if(record.all!=0)
                        this.progress2.push(record.guessed/record.all)
                    else
                        this.progress2.push(0)
                 }
               })


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
