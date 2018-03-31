import { Component,Output,EventEmitter } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { BackendService } from '../../services/backend.service';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { Router } from '@angular/router';
import { SidePanelGroupsComponent } from '../../bars/SidePanelGroupsComponent/sidePanelGroups.component';
import { Group } from '../../models/group';
import { Lesson } from '../../models/lesson';
import { User } from '../../models/user';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'admin-add-users',
  templateUrl: './adminAddUsers.component.html',
  styleUrls: ['./adminAddUsers.component.scss']
})
export class AdminAddUsersComponent{
  dataServiceTeacher: CompleterData;
  dataServiceStudent: CompleterData;
  teacherSubject=new Subject();
  studentSubject=new Subject();
  placeholderTeacher: user = null;
  placeholderStudent: user = null;
  chosenGroup: Group;
  lessons: Lesson[] = [];
  receivedUsers: user[] = [];
  teachers: user[] = [];
  students: user[] = [];
  receivedActiveUsers: user[] = [];
  activeUsers: user[] = [];
  inactiveUsers: user[] = [];
  activeTeachers: user[] = [];
  inactiveTeachers: user[]=[];
  activeStudents: user[] =[]
  inactiveStudents: user[] = [];
  backendError:string =null;
  groups: Group[];
  dropdownTextTeacher="start typing...";
  dropdownTextStudent="start typing...";
  constructor(private _loginService: LoginService,
              private _backendService: BackendService,
              private _completerService: CompleterService,
              private _router: Router) {
                this.chosenGroup = this._loginService.getChosenGroup();

                this.dataServiceTeacher=this._completerService.local(this.teacherSubject,'name','name');
                this.dataServiceStudent=this._completerService.local(this.studentSubject,'name','name');
                this._backendService.getAllUsersMergeName().subscribe(response=>{
                  for (let index in response)
                    this.receivedUsers[index]=response[index];

                  this._backendService.getGroupsLessons(this.chosenGroup.id)
                  .map(res => res.json()).
                    subscribe(resp=>{
                      for (let index in resp)
                        this.lessons[index]=resp[index]
                      this.handleGroupChosen();
                    })

                  this.divideUsers();

                },
                error=>{
                    this.backendError=error._body;
                  }
                );
  }
  onTeacherSelect(selected:CompleterItem){
    var chosenTeacher = selected.originalObject;
    this.add(chosenTeacher);
  }
  onStudentSelect(selected:CompleterItem){
    var chosenStudent = selected.originalObject;
    this.add(chosenStudent);
  }
  divideUsers(){
    let count_active=0;
    let count_inactive=0;
    let flag=false;
    
    for (var i=0; i<this.receivedUsers.length;i++){
      for (var j=0;j< this.receivedActiveUsers.length;j++)
        {
          if(j==0) {flag=false;}
          if (this.receivedUsers[i].id==this.receivedActiveUsers[j].id)
              {
                this.activeUsers[count_active]=this.receivedActiveUsers[j];
                count_active++;
                flag=true;
              }
        }
        if(flag==false){
          this.inactiveUsers[count_inactive]=this.receivedUsers[i];
          count_inactive++;
        }
    }
    this.divideUsersByRole();

    this.teacherSubject.next(this.inactiveTeachers);
    this.studentSubject.next(this.inactiveStudents);

  }
  divideUsersByRole(){
    for (let active of this.activeUsers){
      if(this.isStudent(active.role))
        this.activeStudents.push(active)
      else if(this.isTeacher(active.role))
          this.activeTeachers.push(active)
    }
    for (let inactive of this.inactiveUsers){
      if(this.isStudent(inactive.role))
        this.inactiveStudents.push(inactive)
      else if(this.isTeacher(inactive.role))
          this.inactiveTeachers.push(inactive)
    }


  }
  isStudent(role){
    if(role[0]=="student")
      return true
    return false
  }
  isTeacher(role){
    if(role[0]=='teacher')
      return true
    return false
  }
  handleGroupChosen(){
    this.inactiveUsers=[];
    this.activeUsers=[];
    this.activeTeachers=[];
    this.inactiveTeachers=[];
    this.activeStudents=[];
    this.inactiveStudents=[];
    this._backendService.getActiveUsersMergeName(this.chosenGroup.id)
    .subscribe(response=>{
        this.receivedActiveUsers=response;

        this.divideUsers();
        error=>{
              this.backendError=error._body;
          };
      });

  }

  deleteTeacher(i:number){
    var user=this.activeTeachers[i];
    this.delete(user);
  }
  deleteStudent(i:number){
    var user=this.activeStudents[i];
    this.delete(user);
  }
  delete(user){
    this._backendService.removeUserFromGroup(user.id,this.chosenGroup.id).subscribe(response=>
    {
      this.handleGroupChosen();
    });
  }

  add(user){
      this._backendService.addUserToGroup(user.id,this.chosenGroup.id)
      .subscribe(response=>
        {
          this.handleGroupChosen();

        });
  }
  goBack(){
    this._router.navigate(['./admin-group']);
  }
  goToLesson(i:number){
    var lesson = this.lessons[i];
    this._loginService.setChosenLesson(lesson);
    this._router.navigate(["./words-panel"]);
  }
}
interface user{
  id: string,
  name: string,
  role: string
}
