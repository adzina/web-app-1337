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
  maxLessonsPerPage = 20;
  @Output() lessonChosen = new EventEmitter<Lesson>();
  constructor(private backendService:BackendService,
              private loginService:LoginService,
              private router:Router) {

    this.lessons=[];
    this.backendError=null;

    backendService.getTeachersLessons().
        subscribe(response=>{


            let i=0;
            while(i<this.maxLessonsPerPage && i<response.length){
              this.lessons[i]=response[i];
              this.lessons[i].date = new Date(response[i].date);
              i++;
            }


          this.lessonChosen.emit(this.loginService.getChosenLesson());

          },
          error=>{
              this.backendError=error._body;
            }
          );

  }

  chooseLesson(nr:string) {
    var lesson=this.lessons[nr];
    this.loginService.setChosenLesson(lesson);
    this.router.navigate(['./words-panel']);
  }
  chooseGroup(nr:string){
    var groupID=this.lessons[nr].groupID.id;
    this.loginService.setChosenGroup(groupID);
    this.router.navigate(['./see-groups-lessons']);
  }
  navigate(){
    this.router.navigate(['./create-lesson']);
  }
  goBack(){
      this.router.navigate(['./see-all-lessons']);
  }
}
