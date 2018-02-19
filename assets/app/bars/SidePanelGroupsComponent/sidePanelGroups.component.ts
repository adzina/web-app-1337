import { Component,Output,EventEmitter } from '@angular/core';
import {BackendService} from '../../services/backend.service';
import {LoginService} from '../../services/login.service';
import { Group } from '../../models/group';

@Component({
  selector: 'side-panel-groups',
  templateUrl: 'sidePanelGroups.component.html',
  styleUrls: ['sidePanelGroups.component.scss']
})

export class SidePanelGroupsComponent {
  show:boolean;
  groups: Group[];
  className:string;
  @Output() groupChosen = new EventEmitter<Group>();
  constructor(private backendService:BackendService,
              private loginService: LoginService) {

    this.show=true;
    this.className="sidenav_true";
    backendService.getAllGroups().
      subscribe(response=>{
        this.groups=response;
          }
        );
  }
  toggle(){
    if(this.show){
      this.show=false;
      this.className="sidenav_false";
    }
    else{
      this.show=true;
      this.className="sidenav_true";
    }
  }

  choose(i:number) {
    this.groupChosen.emit(this.groups[i]);
    this.toggle();
  }
}
