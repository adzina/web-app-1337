import {Injectable} from '@angular/core';
import { AuthHttp} from 'angular2-jwt';
import {LoginService} from '../services/login.service';
import {Observable,Observer} from 'rxjs/Rx';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import {Lesson} from '../Models/lesson';
import {Word} from '../Models/word';
import {Group} from '../Models/group';
import {User} from '../Models/user';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import * as async from "async";

@Injectable()

export class BackendService{

  g_url='http://localhost:1337/';

  constructor(private http:AuthHttp,
              private _http:Http,
              private _loginService: LoginService){}

getApiUrl(){
    return this.g_url;
  }
  setApiUrl(url:string){
    this.g_url=url;
  }
  getTeachersLessons(): Observable<Lesson[]> {
    var teacherID=this._loginService.getUserID();
    var url=this.g_url+'lesson/'+teacherID;

  return  this.http.get(url)
   .map((res:Response) => res.json())
   .catch((error:any) => Observable.throw("Error getting teacher's lessons"));

  }
  getAllGroups():Observable<any>{
    var url=this.g_url+'group';
    return this.http.get(url).
    map((res:Response) => res.json())
    .catch((error:any) => Observable.throw("Error getting all groups"));
  }

  getAllMyGroups(): Observable<Group[]>{
    var url=this.g_url+'groupUser/getAll';
    var id=this._loginService.getUserID();
    var body=JSON.stringify({userID: id});
    return this.http.post(url,body)
    .map((res:Response)=>res.json())
    .catch((error:any) => Observable.throw("Error getting all user's groups"));

  }
  getAllUsers(): Observable<User[]>{
    var url=this.g_url+'user/getAll';
    return this.http.get(url)
    .map((res:Response)=>res.json())
    .catch((error:any) => Observable.throw("Error getting all users"));

  }
  getActiveUsers(groupID: string): Observable<User[]>{
    var url=this.g_url+'groupuser/getGroupsUsers';

    var body=JSON.stringify({groupID:groupID})
    return this.http.post(url,body)
      .map((res:Response)=>res.json())
      .catch((error:any) => Observable.throw("Error getting active users"));

  }

  getActiveGroups(lessonID: string): Observable<Group[]>{
    var url=this.g_url+'groupLesson/getLessonsGroups';

    var body=JSON.stringify({lessonID:lessonID})
    return this.http.post(url,body)
      .map((res:Response)=>res.json())
      .catch((error:any) => Observable.throw("Error getting active groups"));

  }

  getWords(lessonID:string): Observable<Word[]>{
    var url=this.g_url+'lessonword/getLessonsWords';
    var body=JSON.stringify({lessonID:lessonID});

    return this.http.post(url,body)
    .map((res:Response) => res.json())
    .catch((error:any) => Observable.throw("Error getting words"));


  }
  addUserToGroup(userID: string, groupID:string): Observable<any>{

      var url=this.g_url+'groupuser/addUserToGroup';
      var body=JSON.stringify({groupID:groupID,userID:userID});

          return this.http.post(url,body)
          .map((res:Response) => res.json())
          .catch((error:any) => Observable.throw('Error adding users to group'));
  }
  addGroupToLesson(groupID: string, lessonID:string): Observable<any>{
      var url=this.g_url+'groupLesson/addGroupToLesson';
      console.log("adding lesson to group "+groupID);
      var body=JSON.stringify({lessonID:lessonID,groupID:groupID});

          return this.http.post(url,body)
          .map(res => res.json())
          .catch((error:any) => Observable.throw('Error adding group to lesson'));
  }
  removeUserFromGroup(userID: string, groupID: string): Observable<any>{
    var url=this.g_url+'groupuser/delete';
    var body=JSON.stringify({groupID:groupID,userID:userID});

    return this.http.post(url,body)
    .map(res => res.json())
    .catch((error:any) => Observable.throw('Error removing user form group'));
  }
  removeWordFromLesson(lessonID:string,wordID:string):Observable<any>{
    var url=this.g_url+'lessonWord/delete';
    var body=JSON.stringify({lessonID: lessonID,wordID: wordID});

    return this.http.post(url,body)
    .map(res => res.json())
    .catch((error:any) => Observable.throw('Error removing word from lesson'));


  }
  removeGroupFromLesson(groupID: string, lessonID: string): Observable<any>{
    var url=this.g_url+'grouplesson/delete';
    var body=JSON.stringify({lessonID:lessonID,groupID:groupID});

    return this.http.post(url,body)
    .map(res => res.json())
    .catch((error:any) => Observable.throw('Error removing group from lesson'));
  }
  //zwraca wszystkie lekcje studenta
  getStudentsLessons(groupID:string):Observable<any>{

    var url=this.g_url+'groupLesson/getGroupsLessons';
    var body=JSON.stringify({groupID:groupID})
    return this.http.post(url,body)


  }
  getStudentsWords(studentID:string,groupID:string):Observable<any>{
    var url=this.g_url+'lessonword/getLessonsWords';
    return this.getStudentsLessons(groupID)
    .flatMap((res:Response)=>res.json())
    .flatMap((lesson:Lesson)=>
      this.http.post(url, JSON.stringify({lessonID:lesson.id})),
      (lesson:Lesson,resp:Response)=>resp.json()
      )


  }
  countAllWords(studentID:string):Observable<any>{
    var url=this.g_url+"studentword/countAll";
    return this.http.post(url,JSON.stringify({studentID:studentID}))
  }
  countAllGuessedWords(studentID:string):Observable<any>{
    var url=this.g_url+"studentword/countAllGuessed";
    return this.http.post(url,JSON.stringify({studentID:studentID}))
  }

createGroup(name:string):Observable<any>{
  var body={name:name};
  var url=this.g_url+"group";
  return this.http.post(url,body)

}
createUser(first_name:string,last_name:string,email:string,password:string,role:string):Observable<any>{
  var body={first_name: first_name,last_name: last_name, email: email, password: password,role: [role]};
  var url=this.g_url+"user";
  return this.http.post(url,body)

}
createLesson(login:string,subject:string,date:Date):Observable<any>{
  var body={teacherID:login,subject:subject, date:date.toISOString()};
  var url=this.g_url+"lesson";
  return this.http.post(url,body)
  .map(res => res.json())
  .catch((error:any) => Observable.throw('Error creating lesson'));

}
addWord(polish:string,english:string,lessonID:string):Observable<any>{
  var url=this.g_url+'word';
  var body=JSON.stringify({polish:polish,english:english,lessonID: lessonID});
  return this.http.post(url,body)

}

}
