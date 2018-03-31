import {Router} from '@angular/router';
import {Component} from '@angular/core';
import { CompleterService, CompleterData } from 'ng2-completer';
import {LoginService} from '../../services/login.service';
import {BackendService} from '../../services/backend.service';
import { AuthHttp} from 'angular2-jwt';
import { Group } from '../../models/group';

const now = new Date();

@Component({
  selector: 'teacher-create-lesson',
  templateUrl: 'teacherCreateLesson.component.html',
  styleUrls: ['teacherCreateLesson.component.scss']
})
export class TeacherCreateLessonComponent {
  groups: Group[];
  dataService: CompleterData;
  dataServiceHour: CompleterData;
  dataServiceMin: CompleterData;
  subject=null;
  created: boolean;
  error: boolean;
  date=new Date();
  minDate=new Date();
  backend_error:string;
  placeholder="click to see all groups";
  placeholder_hour="choose hours";
  placeholder_min="choose minutes";

  hour_start:string;
  hour_end:string;
  min_start:string;
  min_end:string;
  group: string;
  user=this._loginService.getUserName();
  constructor(private _router:Router,
              private http:AuthHttp,
              private _loginService:LoginService,
              private _backendService: BackendService,
              private completerService: CompleterService){
                let hours = this.generateHours()[0];
                let mins = this.generateHours()[1]
                this.dataServiceHour=completerService.local(hours,'value','value');
                this.dataServiceMin = completerService.local(mins, "value","value");
                this.minDate.setDate(this.date.getDate()-8);
                //this.model = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};

                _backendService.getAllMyGroups().
                  subscribe(response=>{
                    this.groups=response;
                     this.dataService=completerService.local(this.groups,'name','name');
                      }
                    );
  }
  create(){
    if(this.subject!=null  && this.group!=null){
      this.sendRequest();
    }
    else{
      this.error=true;
    }
  }
  sendRequest(){
    let hour=this.hour_start+":"+this.min_start+" - "+this.hour_end+":"+this.min_end;
    this._backendService.createLesson(this._loginService.getUserID(),this.subject,this.date,hour).subscribe(data => {

      for(var i=0;i<this.groups.length;i++){
        if(this.group==this.groups[i].name)
          {
            this._backendService.addGroupToLesson(this.groups[i].id,data.id).subscribe(result=>{
              this._loginService.setChosenLesson(data);
              this.subject=null;
              this.error=false;
              this.created=true;
              this._router.navigate(['./words-panel']);
            })
          }
      }
    }
  );
  }
  generateHours(){
    let hours = []
    let mins = []
    for(let i=0;i<24;i++)
      hours.push({value:i.toString()})
    for(let i=0;i<60;i+=5){
      if(i.toString().length<2)
          mins.push({value:"0"+i.toString()})
      else{
          mins.push({value:i.toString()})
      }
    }
    return [hours,mins]
  }
  goBack(){
    this._router.navigate(['./see-all-lessons']);
  }
  toggleCalendar(){
    document.getElementById("calendar").classList.toggle("visible");
    if(document.getElementById("calendarHeader").innerHTML=="Show calendar"){
        document.getElementById("calendarHeader").innerHTML="Hide calendar"
    }
    else{
      document.getElementById("calendarHeader").innerHTML="Show calendar"
    }
  }

}
