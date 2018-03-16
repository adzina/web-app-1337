import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/LoginComponent/login.component';
import { AdminRegisterComponent } from './components/AdminRegisterComponent/adminRegister.component';
import { AdminGroupComponent } from './components/AdminGroupComponent/adminGroupComponent.component';
import { AdminUserComponent } from './components/AdminUserComponent/adminUser.component';
import { AdminCreateGroupComponent } from './components/AdminCreateGroupComponent/adminCreateGroup.component';
import { AdminAddUsersComponent } from './components/AdminAddUsersComponent/adminAddUsers.component';
import { AdminModifyAccountsComponent } from './components/AdminModifyAccountsComponent/adminModifyAccounts.component';
import { TeacherSeeAllLessonsComponent } from './components/TeacherSeeAllLessonsComponent/teacherSeeAllLessons.component';
import { TeacherAddStudentsComponent } from './components/TeacherAddStudentsComponent/teacherAddStudents.component';
import { TeacherCreateLessonComponent } from './components/TeacherCreateLessonComponent/teacherCreateLesson.component';
import { TeacherSeeProgressComponent } from './components/TeacherSeeProgressComponent/teacherSeeProgress.component';
import { TeacherWordsPanelComponent } from './components/TeacherWordsPanelComponent/teacherWordsPanel.component';
import { UpdateProfileComponent } from './components/UpdateProfileComponent/updateProfile.component';
import { GoodbyeComponent } from './components/GoodbyeComponent/goodbye.component';
import { AuthGuard } from './common/auth.guard';
import { RoleGuard } from './common/role.guard';

// Define the routes
export const routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'admin-register',
    component: AdminRegisterComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: 'admin'
    }
  },
  {
    path: 'admin-group',
    component: AdminGroupComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: 'admin'
    }
  },
  {
    path: 'admin-user',
    component: AdminUserComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: 'admin'
    }
  },
    {
      path: 'admin-create-group',
      component: AdminCreateGroupComponent,
      canActivate: [RoleGuard],
      data: {
        expectedRole: 'admin'
      }
    },

    {
        path: 'admin-add-users',
        component: AdminAddUsersComponent,
        canActivate: [RoleGuard],
        data: {
          expectedRole: 'admin'
        }
      },
      {
          path: 'admin-modify-accounts',
          component: AdminModifyAccountsComponent,
          canActivate: [RoleGuard],
          data: {
            expectedRole: 'admin'
          }
        },
      {
        path: 'see-all-lessons',
        component: TeacherSeeAllLessonsComponent,
        canActivate: [AuthGuard]
      },

    {
      path: 'words-panel',
      component: TeacherWordsPanelComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'create-lesson',
      component: TeacherCreateLessonComponent,
      canActivate: [RoleGuard],
        data: {
          expectedRole: 'teacher'
        }
    },
    {
      path: 'see-progress',
      component: TeacherSeeProgressComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'add-students',
      component: TeacherAddStudentsComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'update-profile',
      component: UpdateProfileComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'goodbye',
      component: GoodbyeComponent
    },
   { //Redirect urls not found at root
       path: '**',
       redirectTo: ''
     }
];


@NgModule({
  imports: [
    //RouterModule.forRoot(appRoutes)
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
