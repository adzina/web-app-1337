import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { BackendService } from '../../services/backend.service';
import { Router } from '@angular/router';
import { Group } from '../../models/group';
import { User } from '../../models/user';

@Component({
  selector: 'teacherSeeProgress',
  templateUrl: './teacherSeeProgress.component.html'
})
export class TeacherSeeProgressComponent{
  groups: Group[];
  students:User[];
  groupChosen=false;
  constructor(private _loginService: LoginService,
              private _backendService: BackendService) {
    this.students=[];
    _backendService.getAllMyGroups().subscribe(
      data=>{
        this.groups=data
      }
    )
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
  choose(i){
    this.students=[];
    this._backendService.getActiveUsers(this.groups[i].id).subscribe(
      data=>{
           for(let user of data){
             if(this.isStudent(user))
                this.students.push(user);
           }
          this.groupChosen=true;
      }
    )
  }
  info(i){
    var allGuessed,allWords;
    let student=this.students[i];
    this._backendService.countAllGuessedWords(student.id).subscribe(
      data=>{
        allGuessed=data._body;
        this._backendService.countAllWords(student.id).subscribe(
          data=>{
            allWords=data._body;
            if(allWords==undefined)
                allWords=0
            if(allGuessed==undefined)
                allGuessed=0
            alert("Words already learnt: "+allGuessed+"\nWords opened: "+allWords);
          }
        )
      }
    );
  }

}
