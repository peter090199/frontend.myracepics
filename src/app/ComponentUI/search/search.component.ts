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
  applyFilter(){
    this.dataSource.filter = this.searchQuery.trim().toLocaleLowerCase();
  }


  fetchUsers(): void {
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
  }
}
