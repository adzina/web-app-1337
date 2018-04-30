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
  subject=null;
  created: boolean;
  error: boolean;
  hourError: boolean;
  date=new Date();
  minDate=new Date();
  backend_error:string;
  placeholder="click to see all groups";
  now = new Date(Date.now());
  hour_start:string;
  hour_end:string;
  min_start:string;
  min_end:string;
  group: string;

  hours: number[];
  mins:number[];
  user=this._loginService.getUserName();
  constructor(private _router:Router,
              private http:AuthHttp,
              private _loginService:LoginService,
              private _backendService: BackendService,
              private completerService: CompleterService){
                let time = this.generateHours()
                this.hours = time[0];
                this.mins = time[1];

                this.minDate.setDate(this.date.getDate()-8);

                _backendService.getAllMyGroups().
                  subscribe(response=>{
                    this.groups=response;
                     this.dataService=completerService.local(this.groups,'name','name');
                      }
                    );
  }
  setEndHour(){
    if(parseInt(this.hour_start)<23){
      let val=parseInt(this.hour_start)+1;
      this.hour_end=val.toString();
    }
    else
      this.hour_end=this.hour_start;

  }
  setEndMin(){
    this.min_end=this.min_start;
  }
  create(){
    if(this.subject!=null  && this.group!=null){
      this.sendRequest();
    }
    else{
      this.error=true;
    }
    if(this.hour_end<this.hour_start || (this.hour_end==this.hour_start && this.min_end<this.min_start)){
      this.hourError=true;
    }
  }
  sendRequest(){
    this.date.setDate(this.date.getDate() + 1);
    let hour=this.hour_start.toString()+":"+this.min_start.toString()+" - "+this.hour_end.toString()+":"+this.min_end.toString();
    let groupID;
    for(var i=0;i<this.groups.length;i++){
      if(this.group==this.groups[i].name)
        {
          groupID = this.groups[i].id
        }
    }
    this._backendService.createLesson(this._loginService.getUserID(),groupID,this.subject,this.date,hour).subscribe(data => {
        this._loginService.setChosenLesson(data);
        this.subject=null;
          this.error=false;
          this.hourError=false;
          this.created=true;
          this._router.navigate(['./words-panel']);

    }
  );
  }
  generateHours(){

    let hours:number[]
    let mins:number[]
    hours=[]
    mins=[]
    for(let i=0;i<24;i++)
      hours.push(i)
    for(let i=0;i<60;i+=5){
          mins.push(i)
    }
    console.log(this.now.getMinutes())
    let min = Math.round(this.now.getMinutes()/10)*10
    console.log(min)
    this.min_start = min.toString()
    console.log(this.min_start)
    this.hour_start = this.now.getHours().toString()
    this.setEndHour()
    this.setEndMin()
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
