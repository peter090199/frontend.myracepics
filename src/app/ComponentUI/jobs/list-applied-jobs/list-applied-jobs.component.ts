import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { JobPostingUIComponent } from 'src/app/ComponentSharedUI/job-posting-ui/job-posting-ui.component';
import { AppiedListJobService } from '../../../services/Jobs/appied-list-job.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { Router } from '@angular/router';
import { AppliedStatusService } from 'src/app/services/NotificationsApp/applied-status.service';

@Component({
  selector: 'app-list-applied-jobs',
  templateUrl: './list-applied-jobs.component.html',
  styleUrls: ['./list-applied-jobs.component.css']
})
export class ListAppliedJobsComponent implements OnInit, AfterViewInit {
  searchKey = '';
  placeHolder = 'Search';

  // Loading state per table
  isLoadingApply = false;
  isLoadingOngoing = false;
  isLoadingFinished = false;

  displayedColumns: string[] = [];
  dataSourceApply = new MatTableDataSource<any>([]);
  dataSourceOngoing = new MatTableDataSource<any>([]);
  dataSourceFinished = new MatTableDataSource<any>([]);

  pageSizeOptions: number[] = [5, 10, 25, 100];
  success = false;

  @ViewChild('paginatorApply') paginatorApply!: MatPaginator;
  @ViewChild('paginatorOngoing') paginatorOngoing!: MatPaginator;
  @ViewChild('paginatorFinished') paginatorFinished!: MatPaginator;

  @ViewChild('sortApply') sortApply!: MatSort;
  @ViewChild('sortOngoing') sortOngoing!: MatSort;
  @ViewChild('sortFinished') sortFinished!: MatSort;

  constructor(
    private jobServices: AppiedListJobService,
    private router: Router,
    public dialog: MatDialog,
    private notificationsService: NotificationsService,
    private appliedService:AppliedStatusService
  ) { }

  columnDefs = [
    { columnDef: 'transNo', header: 'TransNo', cell: (job: any) => `${job.transNo}` },
    { columnDef: 'fullname', header: 'Fullname', cell: (job: any) => job },
    { columnDef: 'job_name', header: 'Job Name', cell: (job: any) => `${job.job_name}` },
    { columnDef: 'email', header: 'Email', cell: (job: any) => `${job.email}` },
    { columnDef: 'phone_number', header: 'Phone', cell: (job: any) => `+${job.country_code} ${job.phone_number}` },
    { columnDef: 'applied_status', header: 'Status', cell: (job: any) => `${job.applied_status}` },
    { columnDef: 'actions', header: 'Actions', cell: () => '' }
  ];

  ngOnInit(): void {
    this.displayedColumns = this.columnDefs.map(c => c.columnDef);
    this.getJobPosting();
  }

  ngAfterViewInit(): void {
    this.dataSourceApply.paginator = this.paginatorApply;
    this.dataSourceApply.sort = this.sortApply;

    this.dataSourceOngoing.paginator = this.paginatorOngoing;
    this.dataSourceOngoing.sort = this.sortOngoing;

    this.dataSourceFinished.paginator = this.paginatorFinished;
    this.dataSourceFinished.sort = this.sortFinished;
  }

  async getJobPosting(): Promise<void> {
    try {
      // Start loading all three tables
      this.isLoadingApply = true;
      this.isLoadingOngoing = true;
      this.isLoadingFinished = true;

      const res = await firstValueFrom(this.jobServices.getAppliedJob());

      if (res.success) {
        const jobs = res.data || [];
        // ✅ split data per status
        this.dataSourceApply.data = jobs.filter((j: any) => j.applied_status === 'applied_active');
        this.dataSourceOngoing.data = jobs.filter((j: any) => j.applied_status === 'ongoing');
        this.dataSourceFinished.data = jobs.filter((j: any) => j.applied_status.toLowerCase() === 'finished');
      } else {
        this.dataSourceApply.data = [];
        this.dataSourceOngoing.data = [];
        this.dataSourceFinished.data = [];
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      this.dataSourceApply.data = [];
      this.dataSourceOngoing.data = [];
      this.dataSourceFinished.data = [];
    } finally {
      // ✅ stop loading individually
      this.isLoadingApply = false;
      this.isLoadingOngoing = false;
      this.isLoadingFinished = false;
    }
  }

  applyFilter(): void {
    const filterValue = this.searchKey.trim().toLowerCase();

    const filterFn = (data: any, filter: string) => {
      const str = (
        data.fullname +
        data.job_name +
        data.email +
        data.phone_number +
        data.applied_status
      ).toLowerCase();
      return str.includes(filter);
    };

    this.dataSourceApply.filterPredicate = filterFn;
    this.dataSourceOngoing.filterPredicate = filterFn;
    this.dataSourceFinished.filterPredicate = filterFn;

    this.dataSourceApply.filter = filterValue;
    this.dataSourceOngoing.filter = filterValue;
    this.dataSourceFinished.filter = filterValue;
  }

  clearSearch(): void {
    this.searchKey = '';
    this.applyFilter();
  }


  deleteJob(job: any) {
    console.log(job.transNo)
  }

  
  markOngoing(job: any) {
    if (!job || !job.transNo) {
        this.notificationsService.toastrError("Missing transNo.!");
      return;
    }
    this.appliedService.updateAppliedStatus(job.transNo, { status: 'Ongoing' })
      .subscribe({
        next: (res) => {
          console.log("Status updated:", res);
          this.notificationsService.toastrSuccess("Marked as Ongoing!");
          this.getJobPosting();
        },
        error: (err) => {
          console.error("Failed to update:", err);
          this.notificationsService.toastrError("Failed to update status.");
        }
      });
  }



  markFinished(job: any) {
    console.log(job.transNo)
  }

}
