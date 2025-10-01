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
import { SubmenuComponent } from '../submenu/submenu.component';
import { MenuUIComponent } from 'src/app/ComponentSharedUI/system/menu-ui/menu-ui.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  searchKey: string = '';
  placeHolder: string = 'Search';
  isLoading: boolean = false;
  displayedColumns: string[] = ['transNo', 'routes', 'description','created_by','updated_by', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  menus: any[] = [];
  pageSizeOptions: number[] = [10, 25, 100];
  success: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog, private menuServices: MenuService,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit(): void {
    this.getMenus();
  }

  async getMenus(): Promise<void> {
    this.isLoading = true;

    try {
      this.dataSource.data = [];
      const res = await firstValueFrom(this.menuServices.getMenu());

      if (res.success) {
        this.menus = res.data;
        this.menus.sort((a, b) => a.transNo - b.transNo);
        this.dataSource.data = this.menus;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.success = true;
      } else {
        this.success = false;
        this.notificationsService.toastrError(res.message);
      }

    } catch (error) {
      console.error('Error fetching menus:', error);
      this.notificationsService.toastrError('Failed to load menus');
    } finally {
      this.isLoading = false;
    }
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLocaleLowerCase();
  }
  clearSearch() {
    this.searchKey = "";
    this.applyFilter();
  }



  selectedRow: any = null;

  onRowClick(row: any): void {
    this.selectedRow = row;
    console.log('Selected Row:', row);
  }

  onClickSubModule(): void {
    if (!this.selectedRow) {
      this.notificationsService.toastrWarning('Please Select a Menu.');
      return; // Prevent opening the dialog if no row is selected
    }
    else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '600px';
      dialogConfig.data = { selectedRow: this.selectedRow }; // Pass the selected row data to the dialog

      const dialogRef = this.dialog.open(SubmenuComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getMenus();
        }
        this.selectedRow = null;
      });
    }
  }

  onClickNew(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';

    const dialogRef = this.dialog.open(MenuUIComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getMenus(); // Refresh the table after dialog closure
      }
    });
  }

  delete(role: any): void {

    this.notificationsService.popupWarning(role.description," "+"Are you sure to delete this menu?").then((result) => {
      if (result.value) 
      {
        this.menuServices.deleteMenu(role.transNo).subscribe({
            next:(res)=>{
              if(res.success === true)
                {
                  this.notificationsService.toastrSuccess(res.message);
                  this.isLoading = false;
                }
                else{
                  this.notificationsService.toastrError(res.message);
                  this.isLoading = false;
                }
                this.getMenus();
            },
            error:(error)=>{
              this.notificationsService.toastrError(error.error);
              this.isLoading = false;
            }

        });
      }


    });

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
