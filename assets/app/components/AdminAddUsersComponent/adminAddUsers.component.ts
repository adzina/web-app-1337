import { Component,Output,EventEmitter } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { BackendService } from '../../services/backend.service';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { Router } from '@angular/router';
import { SidePanelGroupsComponent } from '../../bars/SidePanelGroupsComponent/sidePanelGroups.component';
import { Group } from '../../models/group';

@Component({
  selector: 'admin-add-users',
  templateUrl: './adminAddUsers.component.html',
  styleUrls: ['./adminAddUsers.component.scss']
})
export class AdminAddUsersComponent{
  dataService: CompleterData;
  placeholder: Group;
  chosenGroup: Group;
  receivedUsers: user[];
  teachers: user[];
  students: user[];
  receivedActiveUsers: user[];
  activeUsers: user[]
  inactiveUsers: user[];
  activeTeachers: user[];
  inactiveTeachers: user[];
  activeStudents: user[];
  inactiveStudents: user[];
  backendError:string;
  groups: Group[];
  dropdownText:string;
  constructor(private _loginService: LoginService,
              private _backendService: BackendService,
              private _completerService: CompleterService,
              private _router: Router) {
                this.receivedUsers=[];
                this.activeUsers=[];
                this.inactiveUsers=[];
                this.activeStudents=[];
                this.inactiveStudents=[];
                this.activeTeachers=[];
                this.inactiveTeachers=[];
                this.backendError=null;
                this.placeholder=null;
                this.dropdownText="choose group";
                this._backendService.getAllUsers().subscribe(response=>{
                  for (let index in response)
                  this.receivedUsers[index]=response[index];
                  this.handleGroupChosen();
                  /*_backendService.getAllGroups().
                    subscribe(response=>{
                      this.groups=response;
                       this.dataService=_completerService.local(this.groups,'name','name');
                        }
                      );*/
                },
                error=>{
                    this.backendError=error._body;
                  }
                );
  }
  onItemSelect(selected:CompleterItem){
    if(selected)
    this.chosenGroup = selected.originalObject;
    this.handleGroupChosen();
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
    this.chosenGroup = this._loginService.getChosenGroup();
    this.inactiveUsers=[];
    this.activeUsers=[];
    this.activeTeachers=[];
    this.inactiveTeachers=[];
    this.activeStudents=[];
    this.inactiveStudents=[];
    this._backendService.getActiveUsers(this.chosenGroup.id)
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
      this.inactiveUsers=[];
      this.activeUsers=[];
      this.activeTeachers=[];
      this.inactiveTeachers=[];
      this.activeStudents=[];
      this.inactiveStudents=[];
      this.handleGroupChosen();
    });
  }
  addStudent(i:number){
    var user=this.inactiveStudents[i];
    this.add(user);

  }
  addTeacher(i:number){
    var user=this.inactiveTeachers[i];
    this.add(user);
  }
  add(user){
      this._backendService.addUserToGroup(user.id,this.chosenGroup.id)
      .subscribe(response=>
        {
          this.inactiveUsers=[];
          this.activeUsers=[];
          this.activeTeachers=[];
          this.inactiveTeachers=[];
          this.activeStudents=[];
          this.inactiveStudents=[];
        this.handleGroupChosen();

        });
           /*
          this.inactiveUsers.splice(i,1);
          this.activeUsers.push(user);*/
  }
  goBack(){
    this._router.navigate(['./admin-groups']);
  }
}
interface user{
  id: string,
  first_name: string,
  last_name: string,
  role: string
}
