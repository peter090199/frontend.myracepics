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
import { EventPageUIComponent } from './ComponentUI/myracepics/Events/event-page-ui/event-page-ui.component';
import { GoogleCallbackComponent } from './ComponentUI/myracepics/Account/google-call-back/google-call-back.component';
import { GoogleSelectRoleUIComponent } from './ComponentUI/myracepics/Account/google-select-role-ui/google-select-role-ui.component';


const routes: Routes = [

  /* =======================
     PUBLIC ROUTES
  ======================== */
  { path: '', redirectTo: 'homepage', pathMatch: 'full' },
  { path: 'homepage', component: TemplateComponent },
  { path: 'createaccount', component: SigninandsignupComponent },
  { path: 'publicevents', component: AllEventsComponent },
  { path: 'auth/google/callback', component: GoogleCallbackComponent },
  { path: 'auth/google/select-role', component: GoogleSelectRoleUIComponent },
  /* =======================
     RUNNER / USER
  ======================== */
  {
    path: 'runner',
    component: ToolbarUIComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['runner'] },
    children: [
      // { path: 'pageevent', component: EventPageUIComponent },
      { path: 'allevents', component: AllEventsComponent },
      { path: 'eventprofile/:title/:uuid', component: EventPageUIComponent },
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
      // { path: 'pageevent', component: EventPageUIComponent },
      { path: 'allevents', component: AllEventsComponent },
      { path: 'eventprofile/:title/:uuid', component: EventPageUIComponent },
      { path: 'profile', component: SettingsComponent }
    ]
  },
    /* =======================
      ADMIN
  ======================== */
  {
    path: 'admin',
    component: SideBarPanelComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
    children: [
      { path: 'createevent', component: CreateEventsComponent },
      { path: 'eventrecords', component: AllEventsComponent },
      { path: 'eventprofile/:title/:uuid', component: EventPageUIComponent },
      { path: 'profile', component: SettingsComponent },
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'search', component: UserListComponent },
      { path: 'user', component: UsersComponent },
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
    //  { path: 'pageevent', component: EventPageUIComponent },
      { path: 'eventrecords', component: AllEventsComponent },
      { path: 'eventprofile/:title/:uuid', component: EventPageUIComponent },
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
