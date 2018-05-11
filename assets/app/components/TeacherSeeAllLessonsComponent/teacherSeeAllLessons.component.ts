import { Component,Output,EventEmitter } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { LoginService } from '../../services/login.service';
import { PagerService } from '../../services/pager.service';
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
  pager: any = {};
  pagedLessons: Lesson[];
  constructor(private _backendService:BackendService,
              private _loginService:LoginService,
              private _pagerService: PagerService,
              private _router:Router) {

    this.lessons=[];
    this.backendError=null;
    this.getLessons();

  }
  getLessons(){

        this._backendService.getTeachersLessons().
            subscribe(response=>{


                let i=0;
                while(i<response.length){
                  this.lessons[i]=response[i];
                  this.lessons[i].date=new Date(response[i].date)
                  i++;
                }

              this.setPage(1)
              },
              error=>{
                  this.backendError=error._body;
                }
              );
  }
  setPage(page: number) {
   if (page < 1 || page > this.pager.totalPages) {
     return;
   }
   // get pager object from service
   this.pager = this._pagerService.getPager(this.lessons.length, page);
   // get current page of items
   this.pagedLessons = this.lessons.slice(this.pager.startIndex,
     this.pager.endIndex + 1);
 }
  chooseLesson(nr:string) {
    var lesson=this.pagedLessons[nr];
    this._loginService.setChosenLesson(lesson);
    this._router.navigate(['./words-panel']);
  }
  chooseGroup(nr:string){
    var groupID=this.pagedLessons[nr].groupID;
    this._loginService.setChosenGroup(groupID);
    this._router.navigate(['./see-groups-lessons']);
  }
  navigate(){
    this._router.navigate(['./create-lesson']);
  }
  goBack(){
      this._router.navigate(['./see-all-lessons']);
  }
  delete(i:number){
    let lesson = this.pagedLessons[i]
    this._backendService.deleteLesson(lesson.id).subscribe(data=>{
      this.lessons = [];
      this.getLessons();
    })
  }
}
