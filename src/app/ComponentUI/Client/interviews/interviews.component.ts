import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { AppiedListJobService } from 'src/app/services/Jobs/appied-list-job.service';

@Component({
  selector: 'app-interviews',
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.css']
})
export class InterviewsComponent implements OnInit {

  isLoadingInterview = false;
  searchKey: string = '';
  placeHolder: string = 'Search';

  dataSourceInterview = new MatTableDataSource<any>([]);

  displayedColumns: string[] = [
    'job_name',
    'fullname',
    'applied_status',
    'actions'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private jobServices: AppiedListJobService) { }

  ngOnInit(): void {
    this.getJobPosting();
  }

  applyFilter() {
    this.dataSourceInterview.filter = this.searchKey.trim().toLocaleLowerCase();
  }
  clearSearch() {
    this.searchKey = "";
    this.applyFilter();
  }

  onClickNew(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';

    // const dialogRef = this.dialog.open(RoleUIComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.getJobPosting(); // Refresh the table after dialog closure
    //   }
    // });
  }
  
  async getJobPosting(): Promise<void> {
    try {
      this.isLoadingInterview = true;

      const res = await firstValueFrom(this.jobServices.getInterviewAppliedJobs());

      if (res?.success) {
        this.dataSourceInterview.data =
          (res.data || []).filter(
            (j: any) => j.applied_status?.toLowerCase() === 'interview'
          );
      } else {
        this.dataSourceInterview.data = [];
      }

      this.dataSourceInterview.paginator = this.paginator;
      this.dataSourceInterview.sort = this.sort;

    } catch (error) {
      console.error('Error fetching interview jobs:', error);
      this.dataSourceInterview.data = [];
    } finally {
      this.isLoadingInterview = false;
    }
  }

  /** Schedule Interview */
  scheduleInterview(job: any): void {
    this.popupWarning(
      job.fullname,
      'Are you sure you want to schedule an interview for this candidate?'
    );
  }

  /** View CV */
  openResumeDialog(job: any): void {
    console.log('View CV:', job);
  }

  /** Placeholder popup */
  popupWarning(title: string, message: string): void {
    alert(`${title}\n\n${message}`);
  }
}
