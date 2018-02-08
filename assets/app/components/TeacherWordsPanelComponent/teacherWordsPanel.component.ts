import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { BackendService} from '../../services/backend.service';
import { Router } from '@angular/router';
import {Http} from '@angular/http';
import {Word} from '../../models/word';
import {Lesson} from '../../models/lesson';
@Component({
  selector: 'teacher-words-panel',
  templateUrl: 'teacherWordsPanel.component.html',
})

export class TeacherWordsPanelComponent {
  polish: string;
  english: string;
  words: Word[];
  chosenLesson: Lesson;
  subject: string;
  buttonClass: string;
  constructor(private _loginService: LoginService,
              private http: Http,
              private _backendService: BackendService,
              private _router: Router) {
    this.words=[];
    this.buttonClass="btn btn-success disabled";
    this.chosenLesson=this._loginService.getChosenLesson();
    console.log(this.chosenLesson!=null);
    console.log("^");
    if(this.chosenLesson!=null)
      this.prepare();

  }

  prepare(){
    this.subject=this.chosenLesson.subject;
    this._backendService.getWords(this.chosenLesson.id).subscribe(words=>{
      this.polish = "";
      this.english = "";
      this.words=[];
      this.words=words;

      this.buttonClass="btn btn-success active";
  });
  }
  delete(i:number){
    var word=this.words[i];
    this._backendService.removeWordFromLesson(this.chosenLesson.id,word.id)
    .subscribe(deleted=>{
      this.buttonClass="btn btn-success disabled";
      this.prepare();
    })
  }
  submit(){
    if (this.polish!="" || this.english!="") this.addWord();
    else alert("Provide both polish and english version of the word");
  }
  addWord() {
    this._backendService.addWord(this.polish,this.english,this.chosenLesson.id)
    .subscribe(
      response => {
        this.buttonClass="btn btn-success disabled";
        this.prepare();
      },
      error => {
        console.log(error.text());
      }
    );

/*
    var n={pol:this.polish,eng:this.english,lesson:this.chosenLesson,id:""};

    this.lessonsFiltered.push({pol:this.polish,eng:this.english,lesson:this.chosenLesson,id:""});
*/
  }

  goto(){
    this._router.navigate(['./see-all-lessons']);
  }
}

interface word {
  eng: string;
  pol: string;
  lesson: string;
  id: string;
}
