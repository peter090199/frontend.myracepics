import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { UsersUIComponent } from 'src/app/ComponentSharedUI/system/users-ui/users-ui.component';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { UserServicesService } from 'src/app/services/MasterAdmin/user-services.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit {
  searchKey: string = '';
  placeHolder: string = 'Search';

  displayedColumns: string[] = [
    'id', 'fullname', 'email', 'contactno', 'company', 'status', 'is_online', 'role_code', 'actions'
  ];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;

  selectedRole: string = ''; // store selected role
  roleCodes: string[] = ['DEF-MASTERADMIN', 'DEF-USERS', 'DEF-CLIENT'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userServices: UserServicesService,
    private notificationsService: NotificationsService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Custom filter predicate for search + role
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const { search, role } = JSON.parse(filter);

      const matchesSearch =
        data.fullname.toLowerCase().includes(search) ||
        data.email.toLowerCase().includes(search) ||
        data.contactno.toLowerCase().includes(search);

      const matchesRole = role ? data.role_code === role : true;

      return matchesSearch && matchesRole;
    };
  }

  applyFilter(): void {
    const filterValue = JSON.stringify({
      search: this.searchKey.trim().toLowerCase(),
      role: this.selectedRole
    });

    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearSearch(): void {
    this.searchKey = '';
    this.selectedRole = '';
    this.applyFilter();
  }

  /** Fetch users from API */
  async getUsers(): Promise<void> {
    try {
      this.isLoading = true;
      const res = await firstValueFrom(this.userServices.getUsers());

      if (res.success) {
        this.dataSource.data = res.data;
        this.applyFilter(); // Apply filter after data load
      } else {
        this.notificationsService.toastrError(res.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      this.notificationsService.toastrError('Something went wrong while fetching users');
    } finally {
      this.isLoading = false;
    }
  }

  /** Open dialog to create/edit user */
  newSubmodule(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = {}; // pass any initial data if needed

    const dialogRef = this.dialog.open(UsersUIComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUsers(); // Refresh table after dialog closes
      }
    });
  }

  /** Edit user */
  editUser(user: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = { user }; // pass selected user to dialog

    const dialogRef = this.dialog.open(UsersUIComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUsers(); // Refresh table after edit
      }
    });
  }

  /** Refresh table */
  viewUsers(): void {
    this.getUsers();
  }
}
