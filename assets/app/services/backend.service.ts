import {Injectable} from '@angular/core';
import { AuthHttp} from 'angular2-jwt';
import {LoginService} from '../services/login.service';
import {Observable,Observer} from 'rxjs/Rx';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import {Lesson} from '../models/lesson';
import {Word} from '../models/word';
import {Group} from '../models/group';
import {User} from '../models/user';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import * as async from "async";

@Injectable()

export class BackendService{

  // g_url='http://54976-1-fba7f6-01.services.oktawave.com:1337/';
  g_url = 'http://localhost:1337/';


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
  getAllUsersMergeName(): Observable<any[]>{
    var url=this.g_url+'user/getAllMergeName';
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
  getActiveUsersMergeName(groupID: string): Observable<any[]>{
    var url=this.g_url+'groupuser/getGroupsUsersMergeName';

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

  //zwraca wszystkie lekcje studenta
  getGroupsLessons(groupID:string):Observable<any>{

    var url=this.g_url+'group/getGroupsLessons';
    var body=JSON.stringify({groupID:groupID})
    return this.http.post(url,body)
    .map(res => res.json())
    .catch((error:any) => Observable.throw('Error getting lessons'));


  }
  getStudentsWords(studentID:string,groupID:string):Observable<any>{
    var url=this.g_url+'lessonword/getLessonsWords';
    return this.getGroupsLessons(groupID)
    .flatMap((res:Response)=>res.json())
    .flatMap((lesson:Lesson)=>
      this.http.post(url, JSON.stringify({lessonID:lesson.id})),
      (lesson:Lesson,resp:Response)=>resp.json()
      )
  }

  countWordsForManyStudents(studentsID: string[], groupID:string, limit:number):Observable<any>{
      var url=this.g_url+'studentword/countWordsForManyStudents';
      var body=JSON.stringify({studentsID:studentsID,groupID:groupID, limit:limit})
      return this.http.post(url,body)
      .map(res =>res.json())
      .catch((error:any)=>Observable.throw('Error counting words'));
    }
  createGroup(name:string):Observable<Group>{
    var body={name:name};
    var url=this.g_url+"group";
    return this.http.post(url,body)
    .map(res => res.json())
    .catch((error:any) => Observable.throw('Error creating group'));

  }
  countAllWords(studentID:string):Observable<any>{
    var url=this.g_url+"studentword/countAll";
    return this.http.post(url,JSON.stringify({studentID:studentID}))
    .map(res => res.json())
    .catch((error:any) => Observable.throw('Error counting words'));
  }
  countAllGuessedWords(studentID:string):Observable<any>{
    var url=this.g_url+"studentword/countAllGuessed";
    return this.http.post(url,JSON.stringify({studentID:studentID}))
    .map(res => res.json())
    .catch((error:any) => Observable.throw('Error counting words'));
  }

createUser(first_name:string,last_name:string,email:string,password:string,role:string):Observable<User>{
  var body={first_name: first_name,last_name: last_name, email: email, password: password,role: [role]};
  var url=this.g_url+"user";
  return this.http.post(url,body)
        .map(res=>res.json())
        .catch((error:any) => Observable.throw('Error creating user'))

}
createLesson(login:string,groupID: string,subject:string,date:Date,hour:string):Observable<Lesson>{
  var body={teacherID:login,groupID:groupID,subject:subject, date:date.toISOString(), hour:hour};
  var url=this.g_url+"lesson";
  return this.http.post(url,body)
  .map(res => res.json())
  .catch((error:any) => Observable.throw('Error creating lesson'));

}
addWord(polish:string,english:string,comment:string,lessonID:string):Observable<Word>{
  var url=this.g_url+'word';
  var body=JSON.stringify({polish:polish,english:english,comment:comment,lessonID: lessonID});
  return this.http.post(url,body)
        .map(res=>res.json())
        .catch((error:any) => Observable.throw('Error adding word'))

}
adminChangePassword(email:string,new_password:string):Observable<User>{
  var url=this.g_url+'user/adminChangePassword';
  var body=JSON.stringify({email:email,new_password:new_password});
  return this.http.post(url,body)
        .map(res=>res.json())
        .catch((error:any) => Observable.throw('Error changing password'))
}
updateMyProfile(old_password:string,new_password:string):Observable<User>{
  var url=this.g_url+'user/changeMyPassword';
  var id = this._loginService.getUserID();
  var body=JSON.stringify({id:id,old_password:old_password,new_password:new_password});
  return this.http.post(url,body)
        .map(res=>res.json())
        .catch((error:any) => Observable.throw('Error updating profile'))
}
updateWord(id:string, pol:string, eng:string, comment: string):Observable<Word>{
  var url = this.g_url+"word/update"
  var body = JSON.stringify({id:id,pol:pol,eng:eng, comment:comment})
  return this.http.post(url,body)
        .map(res=>res.json())
        .catch((error:any) => Observable.throw('Error updating word'))
}
getLessonsGroup(lessonID:string):Observable<any>{
  var url = this.g_url+"lesson/getLessonsGroup"
  var body = JSON.stringify({lessonId:lessonID})
  return this.http.post(url,body)
        .map(res=>res.json())
        .catch((error:any)=>Observable.throw('Error getting lessons group'))
}
deleteGroup(groupID:string):Observable<any>{
  var url = this.g_url+"group/delete"
  var body = JSON.stringify({groupID:groupID})
  return this.http.post(url,body)
        .map(res=>res.json())
        .catch((error:any)=>Observable.throw('Error deleting group'))
}
deleteLesson(lessonID:string):Observable<any>{
  var url = this.g_url+"lesson/delete"
  var body = JSON.stringify({lessonID:lessonID})
  return this.http.post(url,body)
        .map(res=>res.json())
        .catch((error:any)=>Observable.throw('Error deleting group'))
}

}
