import { Component,Output,EventEmitter } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { LoginService } from '../../services/login.service';
import {Lesson} from '../../models/lesson';
import { Router } from '@angular/router';

@Component({
  selector: 'see-all-lessons',
  templateUrl: './teacherSeeAllLessons.component.html',
  styleUrls: ['./teacherSeeAllLessons.component.scss']
})

export class TeacherSeeAllLessonsComponent {
  show:boolean;
  lessons: Lesson[];
  className:string;
  backendError:string;
  @Output() lessonChosen = new EventEmitter<Lesson>();
  constructor(private backendService:BackendService,
              private loginService:LoginService,
              private router:Router) {

    this.lessons=[];
    this.backendError=null;

    backendService.getTeachersLessons().
        subscribe(response=>{

          for (let index in response)
              this.lessons[index]=response[index];
          this.lessonChosen.emit(this.loginService.getChosenLesson());

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
}
