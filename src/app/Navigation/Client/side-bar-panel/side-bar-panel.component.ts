import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SigInService } from 'src/app/services/signIn/sig-in.service';
import { TNavigationService } from 'src/app/services/TNavigation/tnavigation.service';
import { NotificationComponent } from 'src/app/ComponentUI/notification/notification.component';
import { MatDialog } from '@angular/material/dialog';
import { EchoService } from 'src/app/services/echo.service';
import { Title } from '@angular/platform-browser';
import { ProfileService } from 'src/app/services/Profile/profile.service';
import { SharedService } from 'src/app/services/SharedServices/shared.service';

@Component({
  selector: 'app-side-bar-panel',
  templateUrl: './side-bar-panel.component.html',
  styleUrls: ['./side-bar-panel.component.css']
})
export class SideBarPanelComponent implements OnInit, OnDestroy {
  sidebarOpen = true;
  isMobile = false;
  menuItems: any[] = [];
  pageTitle = 'Dashboard';
  unreadCount = 0;
  userName = 'John Doe';
  profile: any;

  private countsSubscription?: Subscription;
  private breakpointSubscription?: Subscription;
  private routerSubscription?: Subscription;

  constructor(
    private observer: BreakpointObserver,
    private authService: SigInService,
    private navigationService: TNavigationService,
    private router: Router,
    private dialog: MatDialog,
    private echoService: EchoService,
    private titleService: Title,
    private profileService: ProfileService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.breakpointSubscription = this.observer.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
        this.sidebarOpen = !this.isMobile;
      });

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updatePageTitle());

    this.fetchModules();
    this.loadRealtimeCounts();
    this.getProfile();
  }

  getProfile() {
    this.profileService.getProfileByUserOnly().subscribe({
      next: (res) => {
        this.profile = res.message;
        console.log(this.profile?.role_code);
      },
      error: (err) => console.error(err)
    });
  }

  ngOnDestroy(): void {
    this.countsSubscription?.unsubscribe();
    this.breakpointSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

  async fetchModules(): Promise<void> {
    try {
      const response = await firstValueFrom(this.navigationService.getData());
      this.menuItems = response
        .sort((a: any, b: any) => a.sort - b.sort)
        .map((item: any) => ({
          label: item.description,
          icon: item.icon,
          route: item.route,
          submenus: item.submenus || [],
          expanded: false
        }));
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  }

  loadRealtimeCounts() {
    if (!this.countsSubscription || this.countsSubscription.closed) {
      this.echoService.listenToNotificationCount();
      this.countsSubscription = this.echoService.notificationCount$
        .subscribe(count => {
          this.unreadCount = count;
          this.updateTitle(count);
        });
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleSubmenu(item: any): void {
    item.expanded = !item.expanded;
  }

  openNotifications(): void {
    const dialogRef = this.dialog.open(NotificationComponent, {
      width: '400px',
      maxHeight: '90vh',
      position: { top: '40px', right: '90px' },
      panelClass: 'custom-notification-popup',
    });

    dialogRef.afterClosed().subscribe(() => this.loadRealtimeCounts());
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        sessionStorage.clear();
        localStorage.clear();
        localStorage.setItem('showWebsiteChat', 'false');
        localStorage.setItem('cookiesAccepted', 'true');
        window.location.href = '/homepage';
      },
      error: err => console.error('Logout failed:', err)
    });
  }

  updateTitle(count: number): void {
    this.titleService.setTitle(count > 0 ? `🔔 (${count}) Nexsuz` : 'Nexsuz');
  }

  updatePageTitle(): void {
    const currentUrl = this.router.url;
    const mainItem = this.menuItems.find(item => currentUrl.includes(item.route));
    if (mainItem) {
      this.pageTitle = mainItem.label;
      return;
    }

    for (const item of this.menuItems) {
      const sub = item.submenus?.find((subItem: any) => currentUrl.includes(subItem.route));
      if (sub) {
        this.pageTitle = sub.label || sub.description;
        return;
      }
    }

    this.pageTitle = 'Dashboard';
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }

  // get settingsUrl(): string {
  //   return this.profile?.role_code === 'MASTER-ADMIN' ? '/masteradmin/settings' :
  //     this.profile?.role_code === 'DEF-ADMIN' ? '/admin/settings' :
  //       this.profile?.role_code === 'RECRUITER' ? '/recruiter/settings' :
  //         '/settings';
  // }

  // get profileUrl(): string {
  //   return this.profile?.role_code === 'MASTER-ADMIN' ? '/masteradmin/profile' :
  //          this.profile?.role_code === 'DEF-ADMIN' ? '/admin/profile' :
  //          this.profile?.role_code === 'RECRUITER' ? '/recruiter/profile' :
  //          '/profile';
  // }

//  settingsUrl(): string {
//     if (!this.profile) return '/profile';

//     const code = this.profile.code; // or id, depending on your API

//     switch (this.profile.role_code) {
//       case 'DEF-CLIENT':
//         return `/recruiter/settings`;
//       case 'DEF-MASTER-ADMIN':
//         return `/masteradmin/settings`;
//       case 'DEF-ADMIN':
//         return `/admin/settings`;
//       default:
//         return `/profile/settings`;
//     }
//   }

//   getProfileUrl(): string {
//     if (!this.profile) return '/profile';

//     const code = this.profile.code; // or id, depending on your API

//     switch (this.profile.role_code) {
//       case 'DEF-CLIENT':
//         return `/recruiter/client_profile/${code}`;
//       case 'DEF-MASTER-ADMIN':
//         return `/masteradmin/profile/${code}`;
//       case 'DEF-ADMIN':
//         return `/admin/profile/${code}`;
//       default:
//         return `/profile/${code}`;
//     }
//   }


 getsettingsUrl(): string {
    return this.sharedService.getSettingsUrl(this.profile);
  }

 getProfileUrl(): string {
    return this.sharedService.getProfileUrl(this.profile);
  }


}
