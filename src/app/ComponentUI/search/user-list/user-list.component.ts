import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';
interface User {
  code: number;
  status: string;
  fullname: string;
  skills: string;
  photo_pic: string;
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

  constructor(private route: ActivatedRoute, private userService: SearchService) {}

  ngOnInit(): void {
    this.getLoggedInUserId();

    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      console.log('Search Query:', this.searchQuery); // Debugging
      this.fetchUsers();
    });
  }

  fetchUsers(): void {
    if (this.searchQuery) {
      this.userService.getSearch(this.searchQuery).subscribe(
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
  
  getLoggedInUserId(): boolean {
    return !!localStorage.getItem('token'); // Returns true if token exists
  }
}



// import { Component, OnInit } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { SearchService } from 'src/app/services/search.service';
// interface User {
//   code: number;
//   status: string;
//   fullname: string;
//   skills: string;
//   photo_pic: string;
// }

// @Component({
//   selector: 'app-user-list',
//   templateUrl: './user-list.component.html',
//   styleUrls: ['./user-list.component.css']
// })
// export class UserListComponent implements OnInit {
//   users: User[] = [];
//   searchQuery: string = '';

//   constructor(private http: HttpClient,private userService: SearchService) {}

//   ngOnInit(): void {
//     this.fetchUsers();
//   }

//   getToken(): string {
//     return localStorage.getItem('authToken') || '';  // Retrieve token dynamically
//   }

//   fetchUsers(): void {
//     this.userService.getSearch(this.searchQuery).subscribe(
//       (response) => {
//         this.users = response;
//         console.log(this.users)
//       },
//       (error) => {
//         console.error('Error fetching users:', error);
//       }
//     );
//   }

//   onSearch(): void {
//     this.fetchUsers();
//   }
// }
