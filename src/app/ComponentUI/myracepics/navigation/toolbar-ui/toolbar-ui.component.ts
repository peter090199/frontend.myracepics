import { Component, OnInit, ViewChild, QueryList, ViewChildren, HostListener } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { MatMenu, MatMenuPanel } from '@angular/material/menu';
import { firstValueFrom } from 'rxjs';
import { TNavigationService } from 'src/app/services/TNavigation/tnavigation.service';
import { SigInService } from 'src/app/services/signIn/sig-in.service';
import { ImagesService } from 'src/app/services/myracepics/cart/images.service';
import { AuthService } from 'src/app/services/auth.service';

interface MenuItem {
  menuRef: MatMenuPanel<any>;
  description: string;
  icon?: string;
  route: string;
  sort?: number;
  submenus?: MenuItem[];
}

@Component({
  selector: 'app-toolbar-ui',
  templateUrl: './toolbar-ui.component.html',
  styleUrls: ['./toolbar-ui.component.css']
})
export class ToolbarUIComponent implements OnInit {
  menuMobile: MatMenuPanel<any>;
  menuDesktop: MatMenuPanel<any>;
  openNotifications() {
    throw new Error('Method not implemented.');
  }
  toggleSearch() {
    throw new Error('Method not implemented.');
  }
  toggleSidebar() {
    throw new Error('Method not implemented.');
  }

  @ViewChild('sidenav') sidenav!: MatSidenav;

  // Optional: get references to all mat-menu in template
  @ViewChildren(MatMenu) menuRefs!: QueryList<MatMenu>;

  nav_module: any[] = [];
  loading: boolean = true;
  cartCount: number = 0;
  isMobile: boolean = false;
  menu: MatMenuPanel<any>;
  isLoading: any;
  unreadCount: any;
  isSearchOpen: any;
  isSidebarOpen: any;
  user: any;
  cartItems: any[] = [];
  users: any = [];
  userInitials = '';



  constructor(
    private navigationService: TNavigationService,
    private breakpointObserver: BreakpointObserver, private authService: SigInService,
    private cartService: ImagesService, private authServices: AuthService,
  ) { }

  ngOnInit(): void {
    this.userInitials = this.getInitials(this.users?.fullname);
    this.loadCartCount();
    this.fetchModules();
    this.detectMobile();
    this.checkScreen();
    this.getUserAccounts();
    // this.cartService.cartItems$.subscribe(items => {
    //   this.cartItems = items;
    //   this.cartCount = items.length;
    // });

    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.cartCount = this.cartService.getTotalCount(); // 🔥 Shopee count
    });
  }


  getInitials(name?: string): string {
    if (!name || typeof name !== 'string') return '';
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  }


  @HostListener('window:resize')
  onResize() {
    this.checkScreen();
  }

  checkScreen() {
    this.isMobile = window.innerWidth <= 600;
  }


  /** Detect if screen is mobile */
  private detectMobile(): void {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
        if (!this.isMobile && this.sidenav?.opened) {
          this.sidenav.close();
        }
      });
  }

  /** Fetch dynamic menu modules from API */
  async fetchModules(): Promise<void> {
    this.loading = true;
    try {
      const response = await firstValueFrom(this.navigationService.getData());
      if (Array.isArray(response)) {
        this.nav_module = response.map(item => ({
          description: item.description || 'No Title',
          icon: item.icon || 'menu',
          route: item.route || '',
          sort: item.sort || 0,
          submenus: Array.isArray(item.submenus) ? item.submenus : []
        }));
      } else {
        this.nav_module = [];
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
      this.nav_module = [];
    } finally {
      this.loading = false;
    }
  }


  get eventsLink() {
    return this.nav_module.find(link => link.description === 'Events');
  }

  get profileLink() {
    return this.nav_module.find(link => link.description === 'Profile');
  }

  /** Load cart count from localStorage */
  private loadCartCount(): void {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      this.cartCount = Array.isArray(cart) ? cart.length : 0;
    } catch {
      this.cartCount = 0;
    }
  }

  /** Toggle sidenav */
  toggleSidenav(): void {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }


  async getUserAccounts(): Promise<void> {
    this.isLoading = true;
    try {
      const res: any = await firstValueFrom(this.authServices.getProfilecode());
      this.users = { ...this.users, ...res.message };

      if (!this.users.activity || this.users.activity.length === 0) {
        this.users.activity = [
          'Logged in on ' + new Date().toLocaleDateString(),
          'Updated profile information',
          'Changed password last week'
        ];
      }
    } catch (err) {
      console.error('Error loading user:', err);
      // this.alert.toastrError('Error loading user profile');
    } finally {
      this.isLoading = false;
    }
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        const showChat = JSON.stringify(false);
        const cookiesAccepted = JSON.stringify(true);
        sessionStorage.clear();
        localStorage.clear();
        localStorage.setItem('showWebsiteChat', showChat);
        localStorage.setItem('cookiesAccepted', cookiesAccepted);
        window.location.href = '/homepage';
      },
      error: (err) => console.error('Logout failed:', err)
    });
  }

}
