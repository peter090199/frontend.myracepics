import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { _url } from 'src/global-variables';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  private getAuthToken(): string {
    return localStorage.getItem('token') || ''; // Fetch the token from localStorage or other storage
  }

  private createHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private createParams(): HttpParams {
    return new HttpParams().set('search', '');
  }

  getSecurityRoles(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${_url}security`, { headers }).pipe(
      catchError(error => this.handleAuthError(error))
    );
  }
  
  private handleAuthError(error: any): Observable<any> {
    if (error.status === 401) {
      console.error('Unauthorized: Please log in.');
      alert('Unauthorized access. Please log in again.');
    } else if (error.status === 403) {
      console.error('Forbidden: You do not have permission to access this resource.');
      alert('Forbidden: You do not have the required permissions.');
    } else {
      console.error('An error occurred:', error.message);
      alert('An unexpected error occurred. Please try again.');
    }
    return of(null); // Return an observable with a fallback value
  }

  private apiUrl = 'http://localhost:8000/api/searchUsers';

  getSearch(searchQuery: string = ''): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`, // Attach token dynamically
      'Content-Type': 'application/json'
    });

    const url = `${this.apiUrl}?search=${encodeURIComponent(searchQuery)}`;
    return this.http.get<any>(url, { headers });
  }


  // getSearch(): Observable<any> {
  //   const headers = this.createHeaders();
  //   const params = this.createParams();
  //   return this.http.get(`${_url}searchUsers`, { headers, params });
  // }


  // getSecurityRolesByDesc_Code(rolecode: string): Observable<any> {
  //   const headers = this.createHeaders();
  //   return this.http.get(`${_url}security/${rolecode}`, { headers });
  // }

  // postData(endpoint: string, body: any): Observable<any> {
  //   const headers = this.createHeaders();
  //   return this.http.post(`${_url}${endpoint}`, body, { headers });
  // }

  // putData(endpoint: string, body: any): Observable<any> {
  //   const headers = this.createHeaders();
  //   return this.http.put(`${_url}${endpoint}`, body, { headers });
  // }

  // deleteData(endpoint: string): Observable<any> {
  //   const headers = this.createHeaders();
  //   return this.http.delete(`${_url}${endpoint}`, { headers });
  // }

  // submitData(formData: any): Observable<any> {
  //   const headers = this.createHeaders();
  //   return this.http.post(`${_url}security`,formData, { headers });
  // }

}



// import { Injectable } from '@angular/core';
// import { Component, OnInit } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Subject, Observable, tap, of } from 'rxjs';
// import { _url } from 'src/global-variables';
// import { catchError } from 'rxjs/operators';

// interface User {
//   name: any;
//   code: number;
//   status: string;
//   fullname: string;
//   skills: string;
//   photo_pic: string;
// }


// @Injectable({
//   providedIn: 'root'
// })
// export class SearchService implements OnInit  {
//   users: User[] = [];
//   searchQuery: string = '';

 
//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     this.fetchUsers();
//   }
//   getToken(): string {
//     return localStorage.getItem('token') || '';  // Retrieve token dynamically
//   }


//   // private users = [
//   //   // { code: 701, name: 'John Nexzuz', profilePic: 'assets/images/default.png' },
//   //   // { code: 702, name: 'Pedro Yorpo', profilePic: 'assets/images/default.png' },
//   //   // { code: 703, name: 'Elizabeth Punay', profilePic: 'assets/images/default.png' },
//   //   // { code: 711, name: 'Renjun Laride', profilePic: 'assets/images/default.png' },
//   //   // { code: 705, name: 'David Dela Cruz', profilePic: 'assets/images/default.png' }

//   // ];

//   getUsers(searchQuery: string = ''): Observable<User[]> {
//     const headers = new HttpHeaders({
//       'Authorization': `Bearer ${this.getToken()}`, // Attach token dynamically
//       'Content-Type': 'application/json'
//     });

//     const url = `${this.apiUrl}?search=${encodeURIComponent(searchQuery)}`;
//     return this.http.get<User[]>(url, { headers });
//   }
  
// fetchUsers(): void {
//     const apiUrl = `http://localhost:8000/api/searchUsers?search=${this.searchQuery}`;

//     const headers = new HttpHeaders({
//       'Authorization': `Bearer ${this.getToken()}`,  // Attach dynamic token
//       'Content-Type': 'application/json'
//     });

//     this.http.get<User[]>(apiUrl, { headers }).subscribe(response => {
//       this.users = response;
      
//     }, error => {
//       console.error('Error fetching users:', error);
//     });
//   }

//   search(query: string): any[] {
//     if (!query.trim()) return [];
    
//     return this.users.filter(user =>
//       user.fullname.toLowerCase().includes(query.toLowerCase())
//     );
//   }
  
//   onSearch(): void {
//     this.fetchUsers();
//   }


// }
