
import { Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Lesson} from '../models/lesson';
import {Group} from '../models/group';
import {User} from '../models/user';
@Injectable()

export class LoginService{
  userName: string;
  userType: string;
  mode: number;
  userID: string;
  role: string[];
  chosenLesson: Lesson;
  chosenGroupID: string;
  chosenUser: User;
  constructor(private _router:Router){
  }
  getUserID(){
    return this.userID;
  }
  getUserName(){
    return this.userName;
  }
  getUserType(){
    return this.userType;
  }
  getMode(){
    return this.mode;
  }
  getChosenLesson(){
    return this.chosenLesson;
  }
  getChosenGroup(){
    return this.chosenGroupID;
  }
  getChosenUser(){
    return this.chosenUser;
  }
  setUserID(id:string){
    this.userID=id;
  }
  setUserRole(role:string[]){
    this.role=role;
  }
  setUsername(username:string){
    this.userName=username;

  }
  setUserType(userType:string){
    this.userType=userType;

  }
  setMode(mode:number){
    this.mode=mode;
  }
  setChosenLesson(lesson:Lesson){
    this.chosenLesson=lesson;
  }
  setChosenGroup(group:string){
    this.chosenGroupID=group
  }
  setChosenUser(user:User){
    this.chosenUser=user;
  }
  isAdmin(){
    for (var i=0;i<this.role.length;i++)
      if (this.role[i]=="admin")
        return true;
      return false;
  }
}
