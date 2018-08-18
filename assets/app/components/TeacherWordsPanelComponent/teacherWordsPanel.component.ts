import { Component,OnInit } from "@angular/core";
import { LoginService } from "../../services/login.service";
import { BackendService} from "../../services/backend.service";
import { Router } from "@angular/router";
import { Http } from "@angular/http";
import { Word } from "../../models/word";
import { Lesson } from "../../models/lesson";
import { Group } from "../../models/group";
import { User } from "../../models/user";
import * as XLSX from "xlsx";
import * as async from "async";


@Component({
  selector: "teacher-words-panel",
  templateUrl: "teacherWordsPanel.component.html",
  styleUrls: ["teacherWordsPanel.component.scss"]
})

export class TeacherWordsPanelComponent implements OnInit {
  polish: string;
  english: string;
  comment: string;
  editedRow : number;
  editedWord: Word;
  words: Word[];
  group: Group;
  users: User[];
  teachers: User[];
  students: User[];
  chosenLesson: Lesson;
  subject: string;
  buttonClass: string;
  showInput = false;
  contentReady = false;
  ngOnInit():void {
    this.words=[];
    this.buttonClass="btn btn-success disabled";
    this.chosenLesson=this._loginService.getChosenLesson();
    console.log(this.chosenLesson.date);
    console.log(this.chosenLesson.date.getDate());
    if(this.chosenLesson!=null) {
        this._backendService.getLessonsGroup(this.chosenLesson.id)
        .subscribe(elem=> {
          this.group=elem;
          this._backendService.getActiveUsersMergeName(this.group.id)
              .subscribe(users=> {
                this.users=users;
                this.divideUsersByRole();
                this.prepare();
                this.contentReady = true;
              });
        });
    }
  }

  constructor(private _loginService: LoginService,
              private http: Http,
              private _backendService: BackendService,
              private _router: Router) {


  }

  prepare():void {
    this.subject=this.chosenLesson.subject;
    var that = this;
    this._backendService.getWords(this.chosenLesson.id).subscribe(words=> {
      this.polish = "";
      this.english = "";
      this.comment = "";
      this.words=[];
      this.words=words;
      async.each(words, function (word, cb) {
        that._backendService.getAudio(word.id).subscribe(data=> {
          word.url = data;
        });
      }, function(error) {
        if(error) {
          console.log(error);
        } else {
          console.log("success");
        }
      });
      this.buttonClass="btn btn-success active";
  });
  }
  divideUsersByRole():void {
    this.students=[];
    this.teachers=[];
    for (let user of this.users) {
      if (this.isStudent(user.role)) {
        this.students.push(user);
      } else if (this.isTeacher(user.role)) {
        this.teachers.push(user);

      }
    }
  }
  isStudent(role:string): boolean {
    if(role[0]==="student") {
      return true;
    }
    return false;
  }
  isTeacher(role:string): boolean {
    if(role[0]==="teacher") {
      return true;
    }
    return false;
  }
  delete(i:number):void {
    let len:number = this.words.length-1;
    var word:Word =this.words[len-i];
    this._backendService.removeWordFromLesson(this.chosenLesson.id,word.id)
    .subscribe(deleted=> {
      this.buttonClass="btn btn-success disabled";
      this.prepare();
    });
  }
  submit(element:any):void {
    if (this.polish!=="" && this.english!=="") {
      this.addWord();
    } else {
      alert("Provide both polish and english version of the word");
    }
    element.focus();
  }
  addWord():void {
    this._backendService.addWord(this.polish,this.english,this.comment,this.chosenLesson.id)
    .subscribe(
      response => {
        this.buttonClass="btn btn-success disabled";
        this.prepare();
      },
      error => {
        console.log(error.text());
      }
    );
  }

  update(i: number):void {
        this._backendService.updateWord(this.editedWord.id, this.editedWord.polish, this.editedWord.comment)
    .subscribe(response=> {
      this._backendService.getWords(this.chosenLesson.id).subscribe(words=>{
        this.words=[];
        this.words=words;
        this.showInput = false;
        this.editedRow = -1;
      });
    });
  }
  funShowInput(i:number):void {
     let len: number = this.words.length-1;
     this.editedRow = i;
     this.editedWord = this.words[len-i];
     this.showInput = !this.showInput;
   }

  goBack():void {
    this._router.navigate(["./see-all-lessons"]);
  }
  goBackGroups():void {
    this._router.navigate(["./see-groups"]);
  }

  uploadFile(evt: any):void {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) { throw new Error("Cannot use multiple files");}
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: "binary"});

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      var data = (XLSX.utils.sheet_to_json(ws, {header: 1}));
      for (let i of data) {
        this.english = i[0];
        this.polish = i[1];
        this.comment = i[2];
        if(this.english!=="" && this.polish!==""){
          this.addWord();
        } else {
          this.english = "";
          this.polish = "";
          this.comment = "";
        }
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }
  play(id:string):void {
    let audioPlayer: HTMLAudioElement = <HTMLAudioElement>document.getElementById("player"+id);
    audioPlayer.play();
  }
}
