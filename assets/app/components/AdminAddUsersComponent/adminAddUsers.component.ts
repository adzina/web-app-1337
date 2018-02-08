import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { BackendService } from '../../services/backend.service';
import { Router } from '@angular/router';
import { SidePanelGroupsComponent } from '../../bars/SidePanelGroupsComponent/sidePanelGroups.component';
import { Group } from '../../models/group';

@Component({
  selector: 'admin-add-users',
  templateUrl: './adminAddUsers.component.html'
})
export class AdminAddUsersComponent{

  chosenGroup: Group;
  receivedUsers: user[];
  receivedActiveUsers: user[];
  activeUsers: user[];
  inactiveUsers: user[];

  constructor(private _loginService: LoginService,
              private _backendService: BackendService) {
                this.receivedUsers=[];
                 this.activeUsers=[];
                 this.inactiveUsers=[];

                this._backendService.getAllUsers().subscribe(response=>{
                  for (let index in response)
                  this.receivedUsers[index]=response[index];
      },
      error=>{
          alert(error);
        }
   );
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
  }
  handleGroupChosen(x:Group){

    this.activeUsers=[];
    this.inactiveUsers=[];
    this.chosenGroup=x;
    this._backendService.getActiveUsers(x.id)
    .subscribe(response=>{
        this.receivedActiveUsers=response;
        this.divideUsers();
        error=>{
            alert(error);
          };
      });

  }

  delete(i:number){
    var user=this.activeUsers[i];
        this._backendService.removeUserFromGroup(user.id,this.chosenGroup.id).subscribe(response=>
        {
          this.inactiveUsers=[];
          this.activeUsers=[];
          this.handleGroupChosen(this.chosenGroup);
        });
    // this.activeUsers.splice(i,1);
    // this.inactiveUsers.push(user);
  }
  add(i:number){
  var user=this.inactiveUsers[i];
      this._backendService.addUserToGroup(user.id,this.chosenGroup.id)
      .subscribe(response=>
        {
        this.inactiveUsers=[];
        this.activeUsers=[];
        this.handleGroupChosen(this.chosenGroup);

        });
           /*
          this.inactiveUsers.splice(i,1);
          this.activeUsers.push(user);*/
  }
}
interface user{
  id: string,
  first_name: string,
  last_name: string,
  role: string
}
