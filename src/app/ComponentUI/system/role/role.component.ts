import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { RoleUIComponent } from 'src/app/ComponentSharedUI/system/role-ui/role-ui.component';
import { RolesService } from 'src/app/services/Role/roles.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  searchKey: string = '';
  placeHolder: string = 'Search';
  isLoading: boolean = false;
  displayedColumns: string[] = ['id', 'rolecode', 'description', 'created_by', 'updated_by','actions'];
  dataSource = new MatTableDataSource<any>([]);
  roles: any[] = [];

  pageSizeOptions   : number[] = [5, 10, 25, 100];
  success: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private role: RolesService, public dialog: MatDialog,
    private notificationsService:NotificationsService
  ) {}

  ngOnInit(): void {
    this.getRoles();
  }



  applyFilter(){
    this.dataSource.filter = this.searchKey.trim().toLocaleLowerCase();
  }
  clearSearch(){
    this.searchKey = "";
    this.applyFilter();
  }


 onClickNew(): void {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.width = '400px';

  const dialogRef = this.dialog.open(RoleUIComponent, dialogConfig);
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.getRoles(); // Refresh the table after dialog closure
    }
  });
}

async getRoles(): Promise<void> {
 
  try {
    this.isLoading = true;
      const response = await firstValueFrom(this.role.getRoles());
      if (response.success)
      {
        this.isLoading = true;
        this.success = true;
        this.roles = response.message;
         // Assign the fetched data
        this.dataSource.data = this.roles;
      } 
      else
      {
        console.error('Data roles unsuccessful');
        this.success = false;
        this.getRoles();
      }
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

  } catch (error) {
    console.error('Error fetching roles data:', error);
  } finally {
    this.isLoading = false;
  }
}


delete(role:any):void{

    this.notificationsService.popupWarning(role.rolecode," "+"Are you sure to delete this role?").then((result) => {
      if (result.value) 
      {
        this.role.deleteData(role.id).subscribe({
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
                this.getRoles();
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
  const dialogRef = this.dialog.open(RoleUIComponent, {
    width: '400px',
    data: element || null
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.getRoles();
    }
  });
}


}
