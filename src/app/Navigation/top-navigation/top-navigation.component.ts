import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatMenuPanel } from '@angular/material/menu';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SigInService } from 'src/app/services/signIn/sig-in.service';
import { TNavigationService } from 'src/app/services/TNavigation/tnavigation.service';
import { slideUp, slideFade } from 'src/app/animations';
import { ChatPopupComponent } from 'src/app/ComponentUI/messages/chat-popup/chat-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ChatService } from 'src/app/services/chat.service';
import { NotificationComponent } from 'src/app/ComponentUI/notification/notification.component';
import { NotificationService } from 'src/app/services/notification.service';
import { EchoService } from 'src/app/services/echo.service';


export interface User {
  name: string;
}

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css'],
  animations: [slideUp, slideFade]
})
export class TopNavigationComponent implements OnInit {
  isSidebarOpen = false;
  isMobile = window.innerWidth <= 768;
  searchValue = '';
  isLoading = false;
  success = false;
  isChatOpen = false;
  isSearchOpen = false;
  
  nav_module: any[] = [];
  submenuMenu!: MatMenuPanel<any>;
  

  messageCount = 3;
  notificationCounts:number = 0;
  notificationCount: any = [];
  notifications: any[] = []; 

  myControl = new FormControl();
  options: User[] = [{ name: 'Mary' }, { name: 'Shelley' }, { name: 'Igor' }];
  filteredOptions!: Observable<User[]>;

  searchQuery = '';
  filteredData: string[] = [];
  unreadMessages = 0;
  totalUnreadMessages:number = 0;
  data: string[] = [
    'Software Engineer', 'Frontend Developer', 'Backend Developer',
    'Full Stack Developer', 'Data Scientist', 'Machine Learning Engineer',
    'DevOps Engineer', 'UI/UX Designer', 'Product Manager', 'Project Manager'
  ];

  notificationCountSubject = new BehaviorSubject<number>(0); // Initial count of 0
  unreadCount$ = this.notificationCountSubject.asObservable();

  count = 0;
  isOpen = false;

  constructor(
    private authService: SigInService,
    private navigationService: TNavigationService,private dialog:MatDialog,
    private router: Router, private chatService:ChatService,private echoService:EchoService,
    private notificationService:NotificationService, private ngZone: NgZone
  ) {}


  ngOnInit(): void {
    // this.notificationService.notificationCounts$.subscribe(counts => {
    //   this.notificationCounts = counts;
    // });
    console.log(this.count)

    this.fetchModules();
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string' ? value : value?.name)),
        map(name => (name ? this._filter(name) : this.options.slice()))
      );

  }
  getUserIdFromLocalStorage(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null; // Convert it to a number if it's found
  }

  // listenToNotifications(userId: number) {
  //   this.notificationService
  //     .private(`user.${userId}`).listen('notifications.count', (event: { unreadCount: number }) => {
  //       console.log('New unread count:', event.unreadCount);
  //       this.notificationCountSubject.next(event.unreadCount); // Update the unread count
  //     })
  //     .error((err: any) => {
  //       console.error('❌ Error receiving the event:', err);
  //     });
  // }


  loadNoficationsCount(){
    // this.notificationService.unreadCount$.subscribe(count => {
    //   this.notificationCount = count;
    //   this.totalUnreadMessages = this.notificationCount.unreadCount
    // //  console.log(this.totalUnreadMessages)
    // });
    

    // this.notificationService.unreadCount$.subscribe((data) => {
    //   this.notificationCount = data;
    //   this.totalUnreadMessages = this.notificationCount.unreadCount
    // });

  }
  // updateNotificationCount(): void {
  //   this.notificationService.getNotifications().subscribe({
  //     next: (count: any) => {
  //       this.notificationCount = count.unreadCount;
  //     },
  //     error: (err) => {
  //       console.error('Error fetching notification count:', err);
  //     }
  //   });
  // }


  // loadNotifications(): void {
  //   this.chatService.getNotifications().subscribe({
  //     next: (res) => {
  //       this.notifications = res.unreadCount;
  //       this.echoService.totalUnread$.subscribe((cnt) => {
  //         this.totalUnreadMessages = cnt;
  //       });
    
  //     },
  //     error: (err) => console.error('❌ Error fetching notifications:', err),
  //   });
  // }
  
  
   openChat() {
      this.dialog.open(ChatPopupComponent, {
        width: '450px',
        position: { bottom: '80px', right: '20px' },
        panelClass: 'custom-chat-popup'
      });
    }
    
  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  private _filter(name: string): User[] {
    return this.options.filter(option =>
      option.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
    if (this.isSearchOpen) {
      this.autoCloseSearch(); // Auto-hide search after a delay
    }
  }

  closeSearchOnOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('search-overlay')) {
      this.toggleSearch(); // Close if clicking outside the search container
    }
  }

  autoCloseSearch() {
    setTimeout(() => {
      this.isSearchOpen = false;
    }, 5000); // Auto-hide after 5 seconds (adjust as needed)
  }


  closeSearch() {
    this.isSearchOpen = false;
    this.searchQuery = '';
  }

  clearSearch() {
    this.searchValue = '';
  }

  filterData() {
    this.filteredData = this.data.filter(item =>
      item.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  async fetchModules() {
    this.isLoading = true;
    try {
      this.nav_module = await firstValueFrom(this.navigationService.getData());
      this.success = true;
    } catch (error) {
      console.error('Error fetching data:', error);
      this.success = false;
    } finally {
      this.isLoading = false;
    }
  }


  sendData() {
    const requestBody = { name: 'John Doe', email: 'john@example.com' };
    this.navigationService.postData('submit-form', requestBody).subscribe({
      next: response => console.log('Form submitted successfully', response),
      error: error => console.error('Error submitting form:', error)
    });
  }

    onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']).then(() => {
          localStorage.clear(); // Clears ALL local storage items for better performance
          localStorage.setItem('showWebsiteChat', JSON.stringify(true));
          localStorage.setItem('cookiesAccepted', JSON.stringify(true));
          window.location.href = '/homepage';
        });
      },
      error: (err) => console.error('Logout failed:', err)
    });
  }
  
  
  onLogouts() {
    localStorage.clear(); // Clears ALL local storage items for better performance
    localStorage.setItem('showWebsiteChat', JSON.stringify(true));
    localStorage.setItem('cookiesAccepted', JSON.stringify(true));
    window.location.href = '/homepage';
  }
  
  chatHistory: { [key: number]: any[] } = {};

  openNotifications() {
    const dialogRef = this.dialog.open(NotificationComponent, {
      width: '400px',
      height: '90vh',
      position: { top: '60px', right: '90px' }, 
      panelClass: 'custom-notification-popup',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadNoficationsCount();
    });
  }
  

  
}
