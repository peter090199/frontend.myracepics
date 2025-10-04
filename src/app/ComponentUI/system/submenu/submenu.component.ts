import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { firstValueFrom } from 'rxjs';
import { SubMenuService } from 'src/app/services/MasterAdmin/sub-menu.service';
import { SubmenuUIComponent } from '../submenu-ui/submenu-ui.component';
import { EditsubmenuUIComponent } from '../editsubmenu-ui/editsubmenu-ui.component';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.css']
})
export class SubmenuComponent implements OnInit {
  searchKey: string = '';
  placeHolder: string = 'Search';
  isLoading: boolean = false;
  displayedColumns: string[] = ['transNo', 'description', 'route', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  roles: any[] = [];
  pageSizeOptions: number[] = [5, 10, 25, 100];
  success: boolean = false;
  selectedRow: any;
  btnSave: string = "Save";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private notificationsService: NotificationsService,
    private dialogRef: MatDialogRef<SubmenuComponent>,
    private submenuServices: SubMenuService,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog
  ) {
    this.selectedRow = data.selectedRow; // Initialize selectedRow from dialog data
  }

  ngOnInit(): void {
    if (this.selectedRow) {
      this.getSubMenus(); // Fetch submenus when component is initialized
    }
  }

  onClose(): void {
    this.dialogRef.close(); // Close the dialog on cancel
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchKey.trim().toLocaleLowerCase();
  }

  clearSearch(): void {
    this.searchKey = '';
    this.applyFilter();
  }

  async getSubMenus(): Promise<void> {
    this.isLoading = true;
    try {
      if (this.selectedRow?.transNo) {
        const res = await firstValueFrom(this.submenuServices.getSubMenu(this.selectedRow.transNo));
        if (res.success === true) {
          this.dataSource.data = res.submenus;
          this.roles = res.submenus;
          console.log(this.roles)
        } else {
          // this.notificationsService.toastrError('Failed to load submenus.');
        }
      } else {
        this.notificationsService.toastrError('No transaction number available.');
      }
    } catch (error) {
      console.error('Error fetching submenus:', error);
      //    this.notificationsService.toastrError('Failed to load submenus.');
    } finally {
      this.isLoading = false;
      this.dataSource.paginator = this.paginator; // Add paginator to the table
      this.dataSource.sort = this.sort; // Add sorting to the table
    }
  }

  //
  delete(role: any): void {
    this.notificationsService.popupWarning(role.description, 'Are you sure to delete this sub-menu?').then((result) => {
      if (result.value) {
        this.submenuServices.deleteSubmenu(role.id).subscribe({
          next: (res) => {
            if (res.success === true) {
              this.notificationsService.toastrSuccess(res.message);
            } else {
              this.notificationsService.toastrError(res.message);
            }
            this.getSubMenus(); // Refresh the table data
          },
          error: (error) => {
            this.notificationsService.toastrError(error.error || 'Error occurred');
            this.isLoading = false;
          }
        });
      }
    });
  }

  
  onTransNoClick(transNo: string): void {
    console.log('Selected TransNo:', transNo);
    // Fetch submenu data based on transNo if needed
    // this.getSubMenuData(transNo);
  }


  edit(submenu: any): void {
    const dialogRef = this.dialog.open(EditsubmenuUIComponent, {
      width: '600px',
      data: submenu
    });

      console.log(submenu)
     // return;
      
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSubMenus();
      }
    });
  }
  onRowClick(row: any): void {
    this.selectedRow = row; // Set the selected row when clicked
    console.log('Selected Row:', row);
  }

  deletex(row: any): void {
    console.log('Deleting row:', row);
    // Implement additional delete functionality if necessary
  }


  newSubmodule(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = this.selectedRow;
    console.log(this.selectedRow)
    const dialogRef = this.dialog.open(SubmenuUIComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSubMenus(); // Refresh the table after dialog closure
      }

    });
  }
}
