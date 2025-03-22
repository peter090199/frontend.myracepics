import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatMenuPanel } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SigInService } from 'src/app/services/signIn/sig-in.service';
import { TNavigationService } from 'src/app/services/TNavigation/tnavigation.service';
import { slideUp, slideFade } from 'src/app/animations';
import { ChatPopupComponent } from 'src/app/ComponentUI/messages/chat-popup/chat-popup.component';
import { MatDialog } from '@angular/material/dialog';

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
  
  notificationCount = 1;
  messageCount = 3;
  
  myControl = new FormControl();
  options: User[] = [{ name: 'Mary' }, { name: 'Shelley' }, { name: 'Igor' }];
  filteredOptions!: Observable<User[]>;

  searchQuery = '';
  filteredData: string[] = [];
  
  data: string[] = [
    'Software Engineer', 'Frontend Developer', 'Backend Developer',
    'Full Stack Developer', 'Data Scientist', 'Machine Learning Engineer',
    'DevOps Engineer', 'UI/UX Designer', 'Product Manager', 'Project Manager'
  ];

  constructor(
    private authService: SigInService,
    private navigationService: TNavigationService,private dialog:MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchModules();
    
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.name)),
      map(name => (name ? this._filter(name) : this.options.slice()))
    );

    setTimeout(() => {
      this.notificationCount = 5;
      this.messageCount = 100;
    }, 3000);
  }

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
    localStorage.clear(); // Clears ALL local storage items for better performance
    localStorage.setItem('showWebsiteChat', JSON.stringify(true));
    localStorage.setItem('cookiesAccepted', JSON.stringify(true));
    window.location.href = '/homepage';
  }
  



  // onLogout() {
  //   this.authService.logout().subscribe({
  //     next: () => {
  //       this.router.navigate(['/homepage']).then(() => {
  //         localStorage.setItem('showWebsiteChat', JSON.stringify(true));
  //         // Clear all related local storage items
  //         localStorage.removeItem('chatHistory');
  //         localStorage.removeItem('showChatButton');
  //         localStorage.removeItem('isLoggedIn');
  //         localStorage.removeItem('token');
  //         localStorage.removeItem('cookiesAccepted');

  //         location.reload(); 
        
  //       });
  //     },
  //     error: (err) => console.error('Logout failed:', err)
  //   });
  // }
  
  
  
}
