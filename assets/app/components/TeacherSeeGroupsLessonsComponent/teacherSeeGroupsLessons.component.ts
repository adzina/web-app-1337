import { Component,Output,EventEmitter } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { LoginService } from '../../services/login.service';
import {Lesson} from '../../models/lesson';
import { Group } from '../../models/group';
import { User } from '../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'see-groups-lessons',
  templateUrl: './teacherSeeGroupsLessons.component.html',
  styleUrls: ['./teacherSeeGroupsLessons.component.scss']
})

export class TeacherSeeGroupsLessonsComponent {
  show:boolean;
  lessons: Lesson[];
  className:string;
  backendError:string;
  group:Group;
  students:User[];
  sortedStudents:User[]
  groupChosen=false;
  progress:number[];
  progress2:number[];
  constructor(private _backendService:BackendService,
              private _loginService:LoginService,
              private _router:Router) {
    this.group = this._loginService.getChosenGroup();
    this.lessons=[];
    this.backendError=null;
    this.students=[];
    this.progress=[];
    this.progress2=[];
    this.group = _loginService.getChosenGroup();
    this.getData();

    _backendService.getGroupsLessons(this.group.id).
        subscribe(response=>{
          for (let index in response){
              this.lessons[index]=response[index];
              this.lessons[index].date = new Date(response[index].date);
          }

          },
          error=>{
              this.backendError=error._body;
            }
          );

  }

  choose(nr:string) {
    var lesson=this.lessons[nr];
    this._loginService.setChosenLesson(lesson);
    this._router.navigate(['./words-panel']);
  }
  navigate(){
    this._router.navigate(['./create-lesson']);
  }
  goBackGroups(){
    this._router.navigate(['./see-groups']);
  }
  seeGroup(){
    this._router.navigate(['./see-groups']);

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
}
