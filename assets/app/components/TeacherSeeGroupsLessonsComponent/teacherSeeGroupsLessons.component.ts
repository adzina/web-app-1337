import { Component,Output,EventEmitter } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { LoginService } from '../../services/login.service';
import {Lesson} from '../../models/lesson';
import { Group } from '../../models/group';
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

  constructor(private _backendService:BackendService,
              private _loginService:LoginService,
              private _router:Router) {
    this.group = this._loginService.getChosenGroup();
    this.lessons=[];
    this.backendError=null;

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
}
