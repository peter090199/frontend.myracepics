// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { UserhomepageComponent } from './Users/userhomepage/userhomepage.component';
// import { SignInUIComponent } from './SignIn/sign-in-ui/sign-in-ui.component';
// import { SignUpUIComponent } from './SignUp/sign-up-ui/sign-up-ui.component';
// import { AuthGuard } from './AuthGuard/auth.guard';
// import { PageNotFoundComponentComponent } from './PageError/page-not-found-component/page-not-found-component.component';
// import { TopNavigationComponent } from './Navigation/top-navigation/top-navigation.component';
// import { SecurityRolesComponent } from './ComponentUI/system/security-roles/security-roles.component';
// import { UsersComponent } from './ComponentUI/system/users/users.component';
// import { MenuComponent } from './ComponentUI/system/menu/menu.component';
// import { RoleComponent } from './ComponentUI/system/role/role.component';
// import { HomeUIComponent } from './ComponentUI/home/home-ui/home-ui.component';
// import { ProtectedComponent } from './TermsModal/protected/protected.component';
// import { MessagesComponent } from './ComponentUI/messages/messages.component';
// import { ForgotPasswordUIComponent } from './ComponentSharedUI/forgot-password-ui/forgot-password-ui.component';
// import { ResetPasswordUIComponent } from './ComponentSharedUI/reset-password-ui/reset-password-ui.component';
// import { ClientUIComponent } from './SignUp/client-ui/client-ui.component';
// import { ActivationUIComponent } from './ComponentSharedUI/Activation/activation-ui/activation-ui.component';
// import { LayoutComponent } from './layout/layout.component';
// import { CurriculumVitaeUIComponent } from './ComponentSharedUI/Individual/curriculum-vitae-ui/curriculum-vitae-ui.component';
// import { ProfileUIComponent } from './ComponentSharedUI/Profile/profile-ui/profile-ui.component';
// import { UserCVComponent } from './ComponentSharedUI/Individual/user-cv/user-cv.component';
// import { UploadProfileComponent } from './ComponentSharedUI/Individual/upload-profile/upload-profile.component';
// import { PrintCVComponent } from './ComponentSharedUI/Individual/print-cv/print-cv.component';
// import { PrintReceiptComponent } from './print-layout/print-receipt/print-receipt.component';
// import { PrintReceiptsComponent } from './print-layout/print-receipts/print-receipts.component';
// import { PrintComponent } from './print-layout/print/print.component';
// import { UserListComponent } from './ComponentUI/search/user-list/user-list.component';
// import { NetworkingComponent } from './ComponentUI/networking/networking.component';
// import { ChatUIComponent } from './chat-ui/chat-ui.component';
// import { SettingsComponent } from './ComponentUI/profile/settings/settings.component';
// import { JobPostingComponent } from './ComponentUI/job-posting/job-posting.component';
// import { JobsComponent } from './ComponentUI/jobs/jobs.component';
// import { JobsProfileComponent } from './ComponentUI/jobs-profile/jobs-profile.component';
// import { PostingJobComponent } from './ComponentSharedUI/posting-job/posting-job.component';
// import { CompanyProfileUIComponent } from './ComponentSharedUI/Jobs/company-profile-ui/company-profile-ui.component';
// import { ApplyJobComponent } from './ComponentSharedUI/Jobs/apply-job/apply-job.component';
// import { ListAppliedJobsComponent } from './ComponentUI/jobs/list-applied-jobs/list-applied-jobs.component';
// import { ClientDashboardComponent } from './ComponentUI/dashboard/client-dashboard/client-dashboard.component';
// import { AdminDashboardComponent } from './ComponentUI/dashboard/admin-dashboard/admin-dashboard.component';
// import { SideBarPanelComponent } from './Navigation/Client/side-bar-panel/side-bar-panel.component';
// import { RoleGuard } from './AuthGuard/role.guard';
// import { CandidatesComponent } from './ComponentUI/Client/candidates/candidates.component';
// import { InterviewsComponent } from './ComponentUI/Client/interviews/interviews.component';
// import { SigninandsignupComponent } from './ComponentUI/myracepics/createaccount/signinandsignup/signinandsignup.component';
// import { TemplateComponent } from './ComponentUI/myracepics/navigation/template/template.component';
// import { ProfileEventComponent } from './ComponentUI/myracepics/Events/profile-event/profile-event.component';
// import { ViewCartCheckOutComponent } from './ComponentUI/myracepics/Events/Cart/view-cart-check-out/view-cart-check-out.component';
// import { ToolbarUIComponent } from './ComponentUI/myracepics/navigation/toolbar-ui/toolbar-ui.component';
// import { AllEventsComponent } from './ComponentUI/myracepics/Events/all-events/all-events.component';
// import { CreateEventsComponent } from './ComponentUI/myracepics/Events/create-events/create-events.component';



// const routes: Routes = [
//   // Public routes
//   { path: '', redirectTo: '/homepage', pathMatch: 'full' }, // Default redirect
//   { path: 'homepage', component: TemplateComponent },
//   { path: 'createaccount', component: SigninandsignupComponent },
//   { path: 'publicevents', component: AllEventsComponent },

//   {
//     path: '',
//     component: ToolbarUIComponent,
//     canActivate: [AuthGuard, RoleGuard],
//     data: { roles: ['DEF-USERS'] },
//     children: [
//       { path: 'eventprofile/:title/:uuid', component: ProfileEventComponent },
//     ]
//   },
//   {
//     path: 'photographer',
//     component: SideBarPanelComponent,
//     canActivate: [AuthGuard, RoleGuard],
//     data: { roles: ['DEF-PHOTOGRAPHER'] },
//     children: [
//       { path: 'eventprofile/:title/:uuid', component: ProfileEventComponent },
//     ]
//   },
//   {
//    path: 'masteradmin',
//     component: SideBarPanelComponent,
//     canActivate: [AuthGuard, RoleGuard],
//     data: { roles: ['DEF-MASTERADMIN'] },
//     children: [
//       { path: 'eventprofile/:title/:uuid', component: ProfileEventComponent },
//     ]
//   },

  
//   {
//     path: 'runner',
//     component: ToolbarUIComponent,
//     canActivate: [AuthGuard, RoleGuard],
//     data: { roles: ['DEF-PHOTOGRAPHER'] },
//     children: [
//       { path: 'allevents', component: AllEventsComponent },
//       // { path: 'eventprofile/:title/:uuid', component: ProfileEventComponent },
//       { path: 'profile', component: SettingsComponent },
//     ]
//   },
//   {
//     path: 'photographer',
//     component: SideBarPanelComponent,
//     canActivate: [AuthGuard, RoleGuard],
//     data: { roles: ['DEF-PHOTOGRAPHER'] },
//     children: [
//       { path: 'eventrecords', component: AllEventsComponent },
//       // { path: 'eventprofile/:title/:uiid', component: ProfileEventComponent },
//       { path: 'profile', component: SettingsComponent },
//     ]
//   },
//   {
//     // path: 'masteradmin', admin
//     path: 'masteradmin',
//     component: SideBarPanelComponent,
//     canActivate: [AuthGuard, RoleGuard],
//     data: { roles: ['DEF-MASTERADMIN'] },
//     children: [
//       { path: 'createevent', component: CreateEventsComponent },
//       { path: 'eventrecords', component: AllEventsComponent },
//       // { path: 'eventprofile/:title/:uiid', component: ProfileEventComponent },
//       { path: 'profile', component: SettingsComponent },
//     ]
//   },

//   // {
//   //   path: 'runner',
//   //   component: ToolbarUIComponent,
//   //   canActivate: [AuthGuard, RoleGuard],
//   //   data: { roles: ['DEF-USERS'] },
//   //   children: [
//   //     { path: 'events', component: AllEventsComponent },
//   // { path: 'shop-section', component: ProfileEventComponent },



//   // { path: 'profile/:code', component: ProfileUIComponent },
//   // { path: 'client_profile/:code', component: CompanyProfileUIComponent },
//   // { path: 'profile', component: ProfileUIComponent },
//   // { path: 'home', component: HomeUIComponent },
//   // { path: 'message', component: MessagesComponent },
//   // { path: 'network', component: NetworkingComponent },
//   // { path: 'settings', component: SettingsComponent },
//   // { path: 'search', component: UserListComponent },
//   // { path: 'user-cv', component: UserCVComponent },
//   // { path: 'jobs', component: JobsComponent },
//   // { path: 'recommended-jobs/:transNo', component: JobsProfileComponent },
//   // { path: 'apply-job/:transNo', component: ApplyJobComponent },
//   // { path: 'applied-jobs', component: ListAppliedJobsComponent },

//   //   ]
//   // },
//   {
//     path: 'recruiter',
//     component: SideBarPanelComponent,
//     canActivate: [AuthGuard, RoleGuard],
//     data: { roles: ['DEF-CLIENT'] },
//     children: [
//       { path: 'client-dashboard', component: ClientDashboardComponent },
//       { path: 'home', component: HomeUIComponent },
//       { path: 'vacancies', component: JobPostingComponent },
//       { path: 'posting-job', component: PostingJobComponent },
//       { path: 'message', component: MessagesComponent },
//       { path: 'settings', component: SettingsComponent },
//       { path: 'recommended-jobs/:transNo', component: JobsProfileComponent },
//       { path: 'client_profile/:code', component: CompanyProfileUIComponent },
//       { path: 'profile/:code', component: ProfileUIComponent },
//       { path: 'network', component: NetworkingComponent },
//       { path: 'candidates', component: CandidatesComponent },
//       { path: 'interviews', component: InterviewsComponent },
//     ]
//   },
//   {
//     path: 'admin',
//     component: SideBarPanelComponent,
//     canActivate: [AuthGuard, RoleGuard],
//     data: { roles: ['DEF-ADMIN'] },
//     children: [
//       { path: 'admin-dashboard', component: AdminDashboardComponent },
//       { path: 'home', component: HomeUIComponent },
//       { path: 'message', component: MessagesComponent },
//       { path: 'settings', component: SettingsComponent },
//       { path: 'client_profile/:code', component: CompanyProfileUIComponent },
//       { path: 'network', component: NetworkingComponent },
//       { path: 'user', component: UsersComponent },
//     ]
//   },
//   {
//     path: 'masteradmin',
//     component: SideBarPanelComponent,
//     canActivate: [AuthGuard, RoleGuard],
//     data: { roles: ['DEF-MASTERADMIN'] },
//     children: [
//       /* DASHBOARD */
//       { path: 'admin-dashboard', component: ClientDashboardComponent },
//       /* CORE PAGES */
//       { path: 'home', component: HomeUIComponent },
//       { path: 'message', component: MessagesComponent },
//       { path: 'network', component: NetworkingComponent },
//       { path: 'settings', component: SettingsComponent },
//       { path: 'vacancies', component: JobPostingComponent },
//       /* PROFILE */
//       { path: 'profile/:code', component: ProfileUIComponent },
//       { path: 'client_profile/:code', component: CompanyProfileUIComponent },

//       /* ADMIN MANAGEMENT */
//       { path: 'search', component: UserListComponent },
//       { path: 'security', component: SecurityRolesComponent },
//       { path: 'user', component: UsersComponent },
//       { path: 'menu', component: MenuComponent },
//       { path: 'role', component: RoleComponent },

//       /* JOBS */
//       { path: 'user-cv', component: UserCVComponent },
//       { path: 'profile/recommended-jobs/:transNo', component: JobsProfileComponent },
//       { path: 'client_profile/recommended-jobs/:transNo', component: JobsProfileComponent },
//       { path: 'apply-job/:transNo', component: ApplyJobComponent },
//       { path: 'applied-jobs', component: ListAppliedJobsComponent },

//       { path: 'candidates', component: CandidatesComponent },
//       { path: 'interviews', component: InterviewsComponent },
//     ]
//   },
//   {
//     path: 'print', component: PrintComponent,
//     children: [
//       {
//         path: 'printreceipts', component: PrintReceiptsComponent
//       },
//       {
//         path: 'printreceipt', component: PrintReceiptComponent
//       },
//       {
//         path: 'printcv', component: PrintCVComponent
//       },
//     ]
//   },

//   // Wildcard route for 404 handling
//   { path: '**', component: PageNotFoundComponentComponent }
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }



// // import { NgModule, APP_INITIALIZER } from '@angular/core';
// // import { RouterModule, Router, Routes, Route } from '@angular/router';
// // import { AuthGuard } from './AuthGuard/auth.guard';
// // import { PageNotFoundComponentComponent } from './PageError/page-not-found-component/page-not-found-component.component';
// // import { NavigationService, NavRoute } from './navigation.service';
// // import { firstValueFrom } from 'rxjs';
// // import { ActivationUIComponent } from './ComponentSharedUI/Activation/activation-ui/activation-ui.component';
// // import { CurriculumVitaeUIComponent } from './ComponentSharedUI/Individual/curriculum-vitae-ui/curriculum-vitae-ui.component';
// // import { PrintCVComponent } from './ComponentSharedUI/Individual/print-cv/print-cv.component';
// // import { UploadProfileComponent } from './ComponentSharedUI/Individual/upload-profile/upload-profile.component';
// // import { UserCVComponent } from './ComponentSharedUI/Individual/user-cv/user-cv.component';
// // import { ForgotPasswordUIComponent } from './ComponentSharedUI/forgot-password-ui/forgot-password-ui.component';
// // import { ResetPasswordUIComponent } from './ComponentSharedUI/reset-password-ui/reset-password-ui.component';
// // import { SignInUIComponent } from './SignIn/sign-in-ui/sign-in-ui.component';
// // import { ClientUIComponent } from './SignUp/client-ui/client-ui.component';
// // import { SignUpUIComponent } from './SignUp/sign-up-ui/sign-up-ui.component';
// // import { UserhomepageComponent } from './Users/userhomepage/userhomepage.component';
// // import { ChatUIComponent } from './chat-ui/chat-ui.component';
// // import { LayoutComponent } from './layout/layout.component';
// // import { TopNavigationComponent } from './Navigation/top-navigation/top-navigation.component';
// // // Static public routes
// // const staticRoutes: Routes = [
// //   { path: '', redirectTo: '/homepage', pathMatch: 'full' }, // Default redirect
// //   { path: 'homepage', component: UserhomepageComponent },
// //   { path: 'signUpUI', component: SignUpUIComponent },
// //   { path: 'clientsignup', component: ClientUIComponent },
// //   { path: 'signInUI', component: SignInUIComponent },
// //   { path: 'signInUI/:email', component: SignInUIComponent },
// //   { path: 'forgetpassword', component: ForgotPasswordUIComponent },
// //   { path: 'reset-password/:email/:token', component: ResetPasswordUIComponent },
// //   { path: 'activation/:email', component: ActivationUIComponent },
// //   { path: 'layout', component: LayoutComponent },
// //   { path: 'curriculum-vitae', component: CurriculumVitaeUIComponent, canActivate: [AuthGuard] },
// //   { path: 'user-cv', component: UserCVComponent },
// //   { path: 'upload-cv', component: UploadProfileComponent, canActivate: [AuthGuard] },
// //   { path: 'print-cv', component: PrintCVComponent, canActivate: [AuthGuard] },
// //   { path: 'socket', component: ChatUIComponent },

// // ];

// // // Nested TopNavigation and print routes
// // const nestedRoutes: Routes = [
// //   {
// //     path: '',
// //     canActivate: [AuthGuard],
// //     children: [
// //       { path: 'profile/:code', loadChildren: () => import('./ComponentSharedUI/Profile/profile-ui/profile-ui.component').then(m => m.ProfileUIComponent) },
// //       { path: 'profile', loadChildren: () => import('./ComponentSharedUI/Profile/profile-ui/profile-ui.component').then(m => m.ProfileUIComponent) },
// //       { path: 'home', loadChildren: () => import('./ComponentUI/home/home-ui/home-ui.component').then(m => m.HomeUIComponent) },
// //       { path: 'message', loadChildren: () => import('./ComponentUI/messages/messages.component').then(m => m.MessagesComponent) },
// //       { path: 'network', loadChildren: () => import('./ComponentUI/networking/networking.component').then(m => m.NetworkingComponent) },
// //       { path: 'settings', loadChildren: () => import('./ComponentUI/profile/settings/settings.component').then(m => m.SettingsComponent) },
// //       { path: 'search', loadChildren: () => import('./ComponentUI/search/user-list/user-list.component').then(m => m.UserListComponent) },
// //       { path: 'security', loadChildren: () => import('./ComponentUI/system/security-roles/security-roles.component').then(m => m.SecurityRolesComponent) },
// //       { path: 'user', loadChildren: () => import('./ComponentUI/system/users/users.component').then(m => m.UsersComponent) },
// //       { path: 'menu', loadChildren: () => import('./ComponentUI/system/menu/menu.component').then(m => m.MenuComponent) },
// //       { path: 'role', loadChildren: () => import('./ComponentUI/system/role/role.component').then(m => m.RoleComponent) },
// //       { path: 'job_posting', loadChildren: () => import('./ComponentUI/job-posting/job-posting.component').then(m => m.JobPostingComponent) },
// //       { path: 'jobs', loadChildren: () => import('./ComponentUI/jobs/jobs.component').then(m => m.JobsComponent) },
// //       { path: 'recommended-jobs/:transNo', loadChildren: () => import('./ComponentUI/jobs-profile/jobs-profile.component').then(m => m.JobsProfileComponent) },
// //       { path: 'posting-job', loadChildren: () => import('./ComponentSharedUI/posting-job/posting-job.component').then(m => m.PostingJobComponent) },
// //       { path: 'company_profile/:code', loadChildren: () => import('./ComponentSharedUI/Jobs/company-profile-ui/company-profile-ui.component').then(m => m.CompanyProfileUIComponent) },
// //       { path: 'apply-job/:transNo', loadChildren: () => import('./ComponentSharedUI/Jobs/apply-job/apply-job.component').then(m => m.ApplyJobComponent) },
// //       { path: 'applied-jobs', loadChildren: () => import('./ComponentUI/jobs/list-applied-jobs/list-applied-jobs.component').then(m => m.ListAppliedJobsComponent) }
// //     ]
// //   },
// //   {
// //     path: 'print',
// //     loadChildren: () => import('./print-layout/print/print.component').then(m => m.PrintComponent),
// //     children: [
// //       { path: 'printreceipts', loadChildren: () => import('./print-layout/print-receipts/print-receipts.component').then(m => m.PrintReceiptsComponent) },
// //       { path: 'printreceipt', loadChildren: () => import('./print-layout/print-receipt/print-receipt.component').then(m => m.PrintReceiptComponent) },
// //       { path: 'printcv', loadChildren: () => import('./ComponentSharedUI/Individual/print-cv/print-cv.component').then(m => m.PrintCVComponent) }
// //     ]
// //   },
// //   { path: '**', component: PageNotFoundComponentComponent }
// // ];

// // // APP_INITIALIZER for dynamic routes from API
// // export function initializeRoutes(navService: NavigationService, router: Router) {
// //   return async () => {
// //     try {
// //       const routesFromApi: NavRoute[] = await firstValueFrom(navService.getNavigation()) || [];
// //       const dynamicRoutes: Routes = routesFromApi.map(route => mapRoute(route));

// //       const finalRoutes: Routes = [
// //         ...staticRoutes,
// //         ...nestedRoutes,
// //         ...dynamicRoutes
// //       ];

// //       router.resetConfig(finalRoutes);
// //       console.log('Routes initialized:', finalRoutes);
// //     } catch (error) {
// //       console.error('Failed to load dynamic routes', error);
// //     }
// //   };
// // }


// // // Map NavRoute to Angular Route
// // function mapRoute(route: NavRoute): Route {
// //   return {
// //     path: route.path,
// //     children: route.children ? route.children.map(child => mapRoute(child)) : undefined
// //     // no canActivate here
// //   };
// // }


// // @NgModule({
// //   imports: [
// //     RouterModule.forRoot(staticRoutes, { onSameUrlNavigation: 'reload' })
// //   ],
// //   exports: [RouterModule],
// //   providers: [
// //     {
// //       provide: APP_INITIALIZER,
// //       useFactory: initializeRoutes,
// //       deps: [NavigationService, Router],
// //       multi: true
// //     }
// //   ]
// // })
// // export class AppRoutingModule {}


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './AuthGuard/auth.guard';
import { RoleGuard } from './AuthGuard/role.guard';

/* PUBLIC */
import { TemplateComponent } from './ComponentUI/myracepics/navigation/template/template.component';
import { SigninandsignupComponent } from './ComponentUI/myracepics/createaccount/signinandsignup/signinandsignup.component';
import { AllEventsComponent } from './ComponentUI/myracepics/Events/all-events/all-events.component';
import { PageNotFoundComponentComponent } from './PageError/page-not-found-component/page-not-found-component.component';

/* SHARED */
import { ProfileEventComponent } from './ComponentUI/myracepics/Events/profile-event/profile-event.component';
import { SettingsComponent } from './ComponentUI/profile/settings/settings.component';

/* LAYOUTS */
import { ToolbarUIComponent } from './ComponentUI/myracepics/navigation/toolbar-ui/toolbar-ui.component';
import { SideBarPanelComponent } from './Navigation/Client/side-bar-panel/side-bar-panel.component';

/* MASTER ADMIN */
import { CreateEventsComponent } from './ComponentUI/myracepics/Events/create-events/create-events.component';

/* PRINT */
import { PrintComponent } from './print-layout/print/print.component';
import { PrintReceiptComponent } from './print-layout/print-receipt/print-receipt.component';
import { PrintReceiptsComponent } from './print-layout/print-receipts/print-receipts.component';
import { PrintCVComponent } from './ComponentSharedUI/Individual/print-cv/print-cv.component';
import { AdminDashboardComponent } from './ComponentUI/dashboard/admin-dashboard/admin-dashboard.component';
import { UserListComponent } from './ComponentUI/search/user-list/user-list.component';
import { SecurityRolesComponent } from './ComponentUI/system/security-roles/security-roles.component';
import { UsersComponent } from './ComponentUI/system/users/users.component';
import { MenuComponent } from './ComponentUI/system/menu/menu.component';
import { RoleComponent } from './ComponentUI/system/role/role.component';

const routes: Routes = [

  /* =======================
     PUBLIC ROUTES
  ======================== */
  { path: '', redirectTo: 'homepage', pathMatch: 'full' },
  { path: 'homepage', component: TemplateComponent },
  { path: 'createaccount', component: SigninandsignupComponent },
  { path: 'publicevents', component: AllEventsComponent },

  /* =======================
     RUNNER / USER
  ======================== */
  {
    path: 'runner',
    component: ToolbarUIComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['runner'] },
    children: [
      { path: 'allevents', component: AllEventsComponent },
      { path: 'eventprofile/:title/:uuid', component: ProfileEventComponent },
      { path: 'profile', component: SettingsComponent }
    ]
  },

  /* =======================
     PHOTOGRAPHER
  ======================== */
  {
    path: 'photographer',
    component: SideBarPanelComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['photographer'] },
    children: [
      { path: 'eventrecords', component: AllEventsComponent },
      { path: 'eventprofile/:title/:uuid', component: ProfileEventComponent },
      { path: 'profile', component: SettingsComponent }
    ]
  },

  /* =======================
     MASTER ADMIN
  ======================== */
  {
    path: 'masteradmin',
    component: SideBarPanelComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['masteradmin'] },
    children: [
      { path: 'createevent', component: CreateEventsComponent },
      { path: 'eventrecords', component: AllEventsComponent },
      { path: 'eventprofile/:title/:uuid', component: ProfileEventComponent },
      { path: 'profile', component: SettingsComponent },
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'search', component: UserListComponent },
      { path: 'security', component: SecurityRolesComponent },
      { path: 'user', component: UsersComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'role', component: RoleComponent },
    ]
  },

  /* =======================
     PRINT
  ======================== */
  {
    path: 'print',
    component: PrintComponent,
    children: [
      { path: 'printreceipts', component: PrintReceiptsComponent },
      { path: 'printreceipt', component: PrintReceiptComponent },
      { path: 'printcv', component: PrintCVComponent }
    ]
  },

  /* =======================
     404
  ======================== */
  { path: '**', component: PageNotFoundComponentComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
