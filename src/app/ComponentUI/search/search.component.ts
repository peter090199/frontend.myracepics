import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { SearchModalComponent } from './search-modal/search-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

interface User {
  code: number;
  status: string;
  fullname: string;
  skills: string;
  photo_pic: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  users: User[] = [];
  searchQuery: string = '';
  dataSource = new MatTableDataSource<any>([]);
  showOverlay: boolean = false;
  code:any;
  onlineUsers:any=[];
  offlineUsers:any=[];


  constructor(
    private userService: SearchService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      console.log('Search Query:', this.searchQuery);
      this.fetchUsers(); // Fetch users when query changes
    });
  }

  usersRecent = [
  {
    fullname: 'Pedro Yorpo',
    photo_pic: 'assets/images/pedro.png'
  },
  {
    fullname: 'iGotSolutions Rea',
    photo_pic: 'assets/images/igotsolutions.png'
  },
  {
    fullname: 'LanceSoft, Inc.',
    photo_pic: 'assets/images/lancesoft.png'
  },
  {
    fullname: 'Harold Archival',
    photo_pic: ''
  }
];


  applyFilter(){
    this.dataSource.filter = this.searchQuery.trim().toLocaleLowerCase();
  }

  fetchUsers(): void {
    if (this.searchQuery.trim()) {
      this.userService.searchUsers(this.searchQuery).subscribe({
        next: (response) => {
          console.log('✅ API Response:', response);
          
          if (response && ('online' in response) && ('offline' in response)) {
            this.users = [...response.online, ...response.offline]; // Merge both lists
          } else {
            console.error('⚠️ Unexpected API response format:', response);
            this.users = [];
          }
        },
        error: (error) => {
          console.error('❌ Error fetching users:', error);
          this.users = [];
        }
      });
    } else {
      this.users = []; // Clear when search is empty
    }
  }
  
  fetchUsersxc(): void {
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
  
  fetchUsersxx(): void {
    if (!this.searchQuery.trim()) {
      this.users = [];
      return;
    }

    this.userService.getSearch(this.searchQuery).subscribe(
      (response: User[]) => {
        this.users = response;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  openUserModal(user: User): void {
    this.dialog.open(SearchModalComponent, {
      width: '900px',
      data: user
    });
  }

  isActive(name: string): boolean {
    return this.route.snapshot.queryParams['search'] === name;
  }

  onSearch(): void {
      this.showOverlay = !!this.searchQuery;
    if (!this.searchQuery.trim()) {
      this.clearSearch();
    }
    this.fetchUsers();
  }

  selectItem(name: string): void {
    this.searchQuery = ''; // Clear input to close dropdown
    this.clearSearch();
    
  }

  clearSearch() {
    this.searchQuery = ""; // Reset search query
    this.users = [];
    this.router.navigate(['/search'], { queryParams: { search: null }, queryParamsHandling: 'merge' });
    this.showOverlay = false;
  }


  hideOverlay() {
    setTimeout(() => {
      if (!this.searchQuery) {
        this.showOverlay = false;
      }
    }, 200);
  }
}