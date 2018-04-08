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

  @Output() lessonChosen = new EventEmitter<Lesson>();
  constructor(private backendService:BackendService,
              private loginService:LoginService,
              private router:Router) {
    this.group = this.loginService.getChosenGroup();
    this.lessons=[];
    this.backendError=null;

    backendService.getGroupsLessons(this.group.id).
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
    this.loginService.setChosenLesson(lesson);
    this.router.navigate(['./words-panel']);
  }
  navigate(){
    this.router.navigate(['./create-lesson']);
  }
  goBack(){
    this.router.navigate(['./see-all-lessons']);
  }
}
