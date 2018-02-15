import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule, Http, RequestOptions,ConnectionBackend } from '@angular/http';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { RouterModule } from "@angular/router";

import { AlertModule } from 'ngx-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap';
import { DatepickerModule } from 'ngx-bootstrap';
import { Ng2CompleterModule } from "ng2-completer";

import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { AuthGuard } from './common/auth.guard';
import { RoleGuard } from './common/role.guard';

import { LoginComponent } from "./components/LoginComponent/login.component";
import { AdminRegisterComponent } from './components/AdminRegisterComponent/adminRegister.component';
import { AdminCreateGroupComponent } from './components/AdminCreateGroupComponent/adminCreateGroup.component';
import { AdminAddUsersComponent } from './components/AdminAddUsersComponent/adminAddUsers.component';
import { TeacherSeeAllLessonsComponent } from './components/TeacherSeeAllLessonsComponent/teacherSeeAllLessons.component';
import { TeacherAddStudentsComponent } from './components/TeacherAddStudentsComponent/teacherAddStudents.component';
import { TeacherCreateLessonComponent } from './components/TeacherCreateLessonComponent/teacherCreateLesson.component';
import { TeacherSeeProgressComponent } from './components/TeacherSeeProgressComponent/teacherSeeProgress.component';
import { TeacherWordsPanelComponent } from './components/TeacherWordsPanelComponent/teacherWordsPanel.component'
import { GoodbyeComponent } from './components/GoodbyeComponent/goodbye.component';

import {NavbarComponent} from "./bars/NavbarComponent/navbar.component";
import { SidePanelGroupsComponent } from './bars/SidePanelGroupsComponent/sidePanelGroups.component';
import { FooterComponent } from './bars/FooterComponent/footer.component';


import { LoginService } from "./services/login.service";
import { BackendService } from "./services/backend.service";

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    /*
        headerName: 'Authorization',
        headerPrefix: 'bearer',
        tokenGetter: (() => localStorage.getItem(this.tokenName)),
        */
  }), http, options);
}
@NgModule({
    declarations: [
      AppComponent,
      LoginComponent,
      SidePanelGroupsComponent,
      NavbarComponent,
      FooterComponent,
      AdminCreateGroupComponent,
      AdminAddUsersComponent,
      GoodbyeComponent,
      TeacherSeeAllLessonsComponent,
      TeacherCreateLessonComponent,
      TeacherWordsPanelComponent,
      TeacherSeeProgressComponent,
      TeacherAddStudentsComponent,
      AdminRegisterComponent,

    ],
    imports: [
      AlertModule.forRoot(),
  	  BsDropdownModule.forRoot(),
      ModalModule.forRoot(),
      DatepickerModule.forRoot(),
      Ng2CompleterModule,
      BrowserModule,
      AppRoutingModule,
      FormsModule,
      HttpModule,
      HttpClientModule
    ],
    bootstrap: [AppComponent],
    providers: [
      {
       provide: AuthHttp,
       useFactory: authHttpServiceFactory,
       deps: [ Http, RequestOptions ]
     },
      LoginService,
      BackendService,
      AuthGuard,
      RoleGuard
    ]

})
export class AppModule {}
