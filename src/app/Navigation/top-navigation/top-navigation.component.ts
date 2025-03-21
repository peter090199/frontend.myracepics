import { Component, HostListener, OnInit } from '@angular/core';
import { TNavigationService } from 'src/app/services/TNavigation/tnavigation.service';
import { slideUp, slideFade } from 'src/app/animations';
import { MatMenuPanel } from '@angular/material/menu';
import { firstValueFrom, Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import {map, startWith} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { SigInService } from 'src/app/services/signIn/sig-in.service';
import { Router } from '@angular/router';

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
  fadeIn: boolean = false;
  isSidebarOpen = false; // Sidebar state
  isDesktop: true;
  isMobile: boolean = false; // Mobile detection state
  nav_module: any=[]; // Store user data fetched from API
  submenuMenu: MatMenuPanel<any>;
  searchValue = '';
  isLoading:boolean = false;
  success:boolean = false;
  
  constructor(
    private authService: SigInService,
    private navigationService: TNavigationService,private router: Router// Inject the TNavigationService
  ) {
    this.updateMobileState(); // Set initial state
  }

  myControl = new FormControl();
  options: User[] = [{name: 'Mary'}, {name: 'Shelley'}, {name: 'Igor'}];
  filteredOptions: Observable<User[]>;

  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }
  clearSearch(): void {
    this.searchValue = ''; // Clear the input field
  }
  ngOnInit(): void {
    this.getModule(); 
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this._filter(name) : this.options.slice())),
    );// Fetch user data when component loads
  }
  isChatOpen = false;
  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  onCloseChat() {
    this.isChatOpen = false;
  }
  // Update the mobile state based on window width
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateMobileState();
  }

  updateMobileState() {
    this.isMobile = window.innerWidth <= 768; // Adjust this breakpoint as needed
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen; // Toggle sidebar visibility
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/homepage']); // Redirect after logout
      },
      error: (err) => {
        console.error('Logout failed:', err);
      }
    });
  }


  
  // getModule() {

  //   try{
  //     this.isLoading = true;
  //     this.navigationService.getData() // Use a relevant endpoint
  //     .subscribe(
  //       (data) => {
  //         this.nav_module = data;
  //       },
  //       (error) => {
  //         this.isLoading = false;
  //         console.error('Error fetching user data:', error);
  //       }
  //     );
  //   }catch(error){
  //     console.error('Error fetching data:', error);
  //   }finally {
  //         this.isLoading = false;
  //       }
   
  // }
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

  async getModule(): Promise<void> {
    this.isLoading = true;
    try {
      const response = await firstValueFrom(this.navigationService.getData());
  
      if (response) {
        this.success = true;
        this.nav_module = response;
      } else {
        this.success = false;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.isLoading = false;
    }
  }

//   // Fetch user data from the API
// getUserData(): void {
//   // Start loading before making the API call
//   this.isLoading = true;
  
//   this.navigationService.getData() // Use a relevant endpoint
//     .subscribe(
//       (response) => {
//         if (response.success) {
//           this.nav_module = response.data; // Assuming 'data' contains your relevant data
//         } else {
//           console.error('Failed to fetch user data:', response.message);
//         }
//         // Stop loading after successful response
//         this.isLoading = false;
//       },
//       (error) => {
//         console.error('Error fetching user data:', error);
//         // Stop loading after error response
//         this.isLoading = false;
//       }
//     );
// }

  // Fetch user data from the API
  // getUserData() {
  //   this.isLoading = true;
  //   this.navigationService.getData() // Use a relevant endpoint
  //     .subscribe(
  //       (data) => {
  //         this.nav_module = data;
  //       },
  //       (error) => {
  //         this.isLoading = false;
  //         console.error('Error fetching user data:', error);
  //       }
  //     );
  // }

  // Example of sending data to the API (POST request)
  sendData() {
    const requestBody = { name: 'John Doe', email: 'john@example.com' };
    this.navigationService.postData('submit-form', requestBody)
      .subscribe(
        (response: any) => {
          console.log('Form submitted successfully', response);
        },
        (error: any) => {
          console.error('Error submitting form:', error);
        }
      );
  }

  isSearchOpen = false;

  toggleSearch() {
    this.isSearchOpen = true;
  }

  closeSearch() {
    this.isSearchOpen = false;
    this.searchQuery = ''; // Clear input
  }
}
