// // import { Component, HostListener, OnInit } from '@angular/core';

// // @Component({
// //   selector: 'app-topheader',
// //   templateUrl: './topheader.component.html',
// //   styleUrls: ['./topheader.component.css']
// // })
// // export class TopheaderComponent implements OnInit {
// //   isSidebarOpen: boolean = false;
// //   isMobile: boolean = false;
// //   nav_module: any[] = []; // Explicitly set as an array
// //   isLoading: boolean = false;

// //   constructor(
// //   ) {}

// //   ngOnInit(): void {
// //     this.checkScreenSize();
// //    // this.getModule();
// //   }

// //   @HostListener('window:resize', ['$event'])
// //   onResize(event: Event): void {
// //     this.checkScreenSize();
// //     if (!this.isMobile) {
// //       this.isSidebarOpen = false; // Auto-close sidebar on larger screens
// //     }
// //   }

// //   checkScreenSize(): void {
// //     this.isMobile = window.innerWidth <= 767;
// //     if (!this.isMobile) {
// //       this.isSidebarOpen = false; // Ensure sidebar stays closed on larger screens
// //     }
// //   }

// //   toggleSidebar(): void {
// //     if (this.isMobile) {
// //       this.isSidebarOpen = !this.isSidebarOpen;
// //     }
// //   }

// //   closeSidebar(): void {
// //     this.isSidebarOpen = false;
// //   }

// //   // async getModule(): Promise<void> {
// //   //   this.isLoading = true; // Start loading indicator
// //   //   try {
// //   //     const response = await this.navigationService.getWebsiteMenu().toPromise();
// //   //     if (response?.success) {
// //   //       this.nav_module = response.data;
// //   //     } else {
// //   //       console.warn('Menu fetch unsuccessful:', response);
// //   //     }
// //   //   } catch (error) {
// //   //     console.error('Error fetching menu data:', error);
// //   //   } finally {
// //   //     this.isLoading = false; // Stop loading indicator
// //   //   }
// //   // }

// //   // onLogout(): void {
// //   //   this.authService.logout();
// //   // }
// // }

// import { Component, HostListener, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-topheader',
//   templateUrl: './topheader.component.html',
//   styleUrls: ['./topheader.component.css']
// })
// export class TopheaderComponent implements OnInit {
//   nav_module = [
//     { module: 'SignIn', routes: '/signInUI' },
//     { module: 'SignUp', routes: '/signUpUI' },
//   ];

//   isLoading = false;
//   isMobile = false;
//   isSidebarOpen = false;

//   ngOnInit() {
//     this.onResize();
//   }

//   @HostListener('window:resize')
//   onResize() {
//     this.isMobile = window.innerWidth <= 768;
//   }

//   toggleSidebar() {
//     this.isSidebarOpen = !this.isSidebarOpen;
//   }

//   closeSidebar() {
//     this.isSidebarOpen = false;
//   }

//   refreshHomePage() {
//     window.location.href = '/';
//   }
// }
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { slideUp,slideFade} from 'src/app/animations';
import {map, startWith} from 'rxjs/operators';
import { Router } from '@angular/router';
import { ChatPopupComponent } from 'src/app/ComponentUI/messages/chat-popup/chat-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ChatWebsitePopUPComponent } from 'src/app/ComponentUI/messages/chat-website-pop-up/chat-website-pop-up.component';

export interface User {
  name: string;
}

@Component({
  selector: 'app-topheader',
  templateUrl: './topheader.component.html',
  styleUrls: ['./topheader.component.css']
})
export class TopheaderComponent implements OnInit {
  fadeIn: boolean = false;
  isSidebarOpen = false; // Sidebar state
  isDesktop: true;
  value = '';
  isMobile: boolean = false; // Mobile detection state



  constructor(private router:Router,private dialog:MatDialog
  ) {
    this.updateMobileState(); // Set initial state
  }
 
  myControl = new FormControl();
  options: User[] = [{name: 'UX Designer'}, {name: 'Software Engineer'}, {name: 'Data Scientist'}];
  filteredOptions: Observable<User[]>;

  ngOnInit(): void {
    this.fadeIn = true; 
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this._filter(name) : this.options.slice())),
    );


    const storedState = localStorage.getItem('showWebsiteChat');
    this.chatOpened = storedState ? JSON.parse(storedState) : false;
  }



  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }
  searchQuery: string = ''; // The input model for the search query
  filteredData: string[] = []; // The array of filtered results

  // Sample data to be filtered
  data: string[] = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'Machine Learning Engineer',
    'DevOps Engineer',
    'UI/UX Designer',
    'Product Manager',
    'Project Manager',
    'System Administrator',
    'Cloud Engineer',
    'Database Administrator',
    'Quality Assurance Engineer',
    'Technical Support Specialist',
    'Business Analyst',
    'Network Engineer',
    'Security Engineer',
    'Web Developer',
    'Mobile Developer',
    'SEO Specialist',
    'Digital Marketing Manager',
    'Content Writer',
    'Graphic Designer',
    'Game Developer'
  ];
  

  // Method to filter data based on the search query
  filterData(): void {
    this.filteredData = this.data.filter(item =>
      item.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen; // Toggle sidebar visibility
  }

  refreshHomePage() {
    this.router.navigate(['/homepage']).then(() => {
      window.location.reload();
    });
  }

  // Update the mobile state based on window width
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateMobileState();
  }

  updateMobileState() {
    this.isMobile = window.innerWidth <= 768; // Adjust this breakpoint as needed
  }


  chatOpened:boolean = false; // Initially hidden

  openChat() {
    const dialogRef = this.dialog.open(ChatWebsitePopUPComponent, {
      width: '450px',
      position: { bottom: '20px', right: '20px' },
      panelClass: 'custom-chat-popup',
    });
  
    // Set chat state to open
    this.chatOpened = true;
    localStorage.setItem('chatOpened', JSON.stringify(false));
  
    // Listen for close event to reset state
    dialogRef.afterClosed().subscribe(() => {
      this.chatOpened = false;
      localStorage.setItem('chatOpened', JSON.stringify(false));
    });
  }

  closeChat() {
    this.chatOpened = false;
  }

}


