import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from 'src/app/services/Profile/profile.service';
import { SearchService } from 'src/app/services/search.service';

interface User {
  code: number;
  status: string;
  fullname: string;
  skills: string;
  photo_pic: string;
}
interface Job {
  title: string;
  company: string;
  location: string;
}
interface Food {
  value: string;
  viewValue: string;
}



@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: any[]=[];
  searchQuery: string = '';
  loggedInUserId: number = 0; 
  isLoading = true;
  profiles:any;
  error: any;
  code:any;
  onlineUsers:any=[];
  offlineUsers:any=[];
  searchResults: string[] = []; // General search results
  jobResults: Job[] = [];
  selectedOption: string = '1';
  selectedJob: string = ''; // Stores the selected job

  jobCategories = ['All', 'People', 'Jobs', 'Post','Companies'];
  filters = [
    { label: 'Date posted', options: ['Last 24 hours', 'Last week', 'Last month'], selected: '' },
    { label: 'Experience level', options: ['Entry', 'Mid', 'Senior'], selected: '' },
    { label: 'Remote', options: ['On-site', 'Hybrid', 'Fully Remote'], selected: '' }
  ];

  selectFilter(filter: any, value: string) {
    filter.selected = value; // Update selected value
  }

  selectJob(job: string) {
    this.selectedJob = job; // Update selected job
  }

  constructor(private route: ActivatedRoute, private userService: SearchService,private profile:ProfileService
    
  ) {
    this.searchResults = ['Result 1', 'Result 2', 'Result 3'];

    this.jobResults = [
      { title: 'Frontend Developer', company: 'TechCorp', location: 'Remote' },
      { title: 'Backend Developer', company: 'Innovate Solutions', location: 'New York' }
    ];}

    
    foods: Food[] = [
      {value: 'steak-0', viewValue: 'Steak'},
      {value: 'pizza-1', viewValue: 'Pizza'},
      {value: 'tacos-2', viewValue: 'Tacos'},
    ];

  loggedInUser: any = null;

  ngOnInit(): void { 
    const url = window.location.href;
    const codesplit = url.split('/').pop();
    this.code = codesplit;

    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      console.log('Search Query:', this.searchQuery); // Debugging
      this.fetchUsers();
    });
  }

  
  connectUser(item: any) {
    if (!item || item.code === this.loggedInUser.code) {
      console.log('Cannot connect to yourself!');
      return;
    }

    console.log(`Sending connection request to ${item.fullname} (User ID: ${item.code})`);

    // Simulate API call to send a connection request
    // Replace this with your actual API call
    setTimeout(() => {
      console.log(`Connection request sent to ${item.fullname}`);
      alert(`You have sent a connection request to ${item.fullname}`);
    }, 1000);

  }


  fetchUsers(): void {
    const query = this.searchQuery?.trim();
  
    if (!query) {
      console.warn('Search query is empty.');
      return;
    }
  
    this.userService.searchUsers(query).subscribe({
      next: (response) => {
        console.log('✅ API Response:', response); // More noticeable debugging output
  
        if (response && typeof response === 'object' && 'online' in response && 'offline' in response) {
          this.onlineUsers = Array.isArray(response.online) ? response.online : [];
          this.offlineUsers = Array.isArray(response.offline) ? response.offline : [];
  
          console.log(`🔹 Found ${this.onlineUsers.length} online users`);
          console.log(`🔹 Found ${this.offlineUsers.length} offline users`);
        } else {
          console.error('⚠️ Unexpected API response format:', response);
          this.onlineUsers = [];
          this.offlineUsers = [];
        }
      },
      error: (error) => {
        console.error('❌ Error fetching users:', error);
        this.onlineUsers = [];
        this.offlineUsers = [];
      }
    });
  }
  
  
  fetchUsersx(): void {
    if (this.searchQuery) {
      this.userService.searchUsers(this.searchQuery).subscribe(
        response => {
          console.log('API Response:', response); // Debugging
          if (Array.isArray(response)) {
            this.users = response;
          } else {
            console.error('Unexpected API response format:', response);
            this.users = [];
          }
        },
        error => {
          console.error('Error fetching users:', error);
          this.users = [];
        }
      );
    }
  }
  
  // getLoggedInUserId(): boolean {
  //   return !!localStorage.getItem('token'); // Returns true if token exists
  // }




  loadProfileCV(){
    this.profile.getProfileByUser(this.code).subscribe({
      next: (response) => {
        if (response.success == true) {
          this.profiles = response.message; 
       
        } else {
          this.error = 'Failed to load profile data';
        }
      },
      error: (err) => {
        this.error = err.message || 'An error occurred while fetching profile data';
      },
    });
  }
}

