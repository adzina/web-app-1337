import { NgModule }       from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { HttpModule, Http, RequestOptions,ConnectionBackend } from '@angular/http';

import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { AuthGuard } from './common/auth.guard';
import { RoleGuard } from './common/role.guard';

import { AppRoutingModule } from './app.routing.module';
import { LoginComponent } from "./components/LoginComponent/login.component";
import { AdminRegisterComponent } from './components/AdminRegisterComponent/adminRegister.component';
import { AdminCreateGroupComponent } from './components/AdminCreateGroupComponent/adminCreateGroup.component';
import { TeacherSeeAllLessonsComponent } from './components/TeacherSeeAllLessonsComponent/teacherSeeAllLessons.component';
import {NavbarComponent} from "./bars/NavbarComponent/navbar.component";
import { SidePanelGroupsComponent } from './bars/SidePanelGroupsComponent/sidePanelGroups.component';

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
      AdminRegisterComponent,
      AdminCreateGroupComponent,
      TeacherSeeAllLessonsComponent,
      NavbarComponent,
      SidePanelGroupsComponent

    ],
    imports: [
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
