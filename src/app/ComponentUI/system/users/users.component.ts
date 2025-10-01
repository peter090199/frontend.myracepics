import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SecurityRolesService } from 'src/app/services/Security/security-roles.service';// assuming you have a service for API calls
import { firstValueFrom } from 'rxjs';
import { SecurityRolesUIComponent } from 'src/app/ComponentSharedUI/system/security-roles-ui/security-roles-ui.component';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { MenuService } from 'src/app/services/MasterAdmin/menu.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  searchKey: string = '';
  placeHolder: string = 'Search';
  isLoading: boolean = false;
  displayedColumns: string[] = ['id', 'rolecode', 'description', 'created_by', 'updated_by', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  menus: any[] = [];
  pageSizeOptions: number[] = [5, 10, 25, 100];
  success: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog, private menuServices: MenuService,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit(): void {
  //  this.getMenus();
  }



  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLocaleLowerCase();
  }
  clearSearch() {
    this.searchKey = "";
    this.applyFilter();
  }


  onClickNew(): void {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.width = '400px';

    // const dialogRef = this.dialog.open(RoleUIComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.getRoles(); // Refresh the table after dialog closure
    //   }
    // });
  }

  async getMenus(): Promise<void> {

    try {
      this.isLoading = true;
      const res = await firstValueFrom(this.menuServices.getMenu());
      if (res.success == true) {
        this.isLoading = res.success;
        this.success = res.success;
        this.menus = res.data;
        console.log(this.menus)
        this.dataSource.data = this.menus;
      }
     if (res.success == false) {
        this.isLoading = res.success;
        this.success = res.success;
        this.notificationsService.toastrError(res.message);
      }
    
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    } catch (error) {
      console.error('Error fetching roles data:', error);
    } finally {
      this.isLoading = false;
    }
  }


  delete(role: any): void {

    // this.notificationsService.popupWarning(role.rolecode," "+"Are you sure to delete this role?").then((result) => {
    //   if (result.value) 
    //   {
    //     this.role.deleteData(role.id).subscribe({
    //         next:(res)=>{
    //           if(res.success === true)
    //             {
    //               this.notificationsService.toastrSuccess(res.message);
    //               this.isLoading = false;
    //             }
    //             else{
    //               this.notificationsService.toastrError(res.message);
    //               this.isLoading = false;
    //             }
    //             this.getRoles();
    //         },
    //         error:(error)=>{
    //           this.notificationsService.toastrError(error.error);
    //           this.isLoading = false;
    //         }

    //     });
    //   }


    // });

  }


  edit(element: any): void {
    // const dialogRef = this.dialog.open(RoleUIComponent, {
    //   width: '400px',
    //   data: element || null
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.getRoles();
    //   }
    // });
  }


}
