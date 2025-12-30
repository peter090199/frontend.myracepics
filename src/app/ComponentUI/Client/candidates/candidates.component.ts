import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { AppiedListJobService } from 'src/app/services/Jobs/appied-list-job.service';

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css']
})
export class CandidatesComponent implements OnInit, AfterViewInit {
  isLoading = false;
  dataSource = new MatTableDataSource<any>([]);
  statuses: string[] = ['applied_active', 'interview', 'review', 'hired'];
  selectedStatus: string = '';
  searchKey: string = '';
  placeHolder = 'Search candidates';

  displayedColumns: string[] = ['fullname', 'job_name', 'applied_status', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private jobServices: AppiedListJobService) { }

  ngOnInit(): void {
    this.getAllCandidates();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async getAllCandidates(): Promise<void> {
    try {
      this.isLoading = true;
      const res = await firstValueFrom(this.jobServices.getAllAppliedJobsByCode());
      this.dataSource.data = res?.success ? res.data : [];
    } catch (error) {
      console.error('Error fetching candidates:', error);
      this.dataSource.data = [];
    } finally {
      this.isLoading = false;
    }
  }

  applyFilter(): void {
    const filterValue = this.searchKey.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: any) => {
      const matchesSearch = data.fullname.toLowerCase().includes(filterValue)
        || data.job_name.toLowerCase().includes(filterValue);

      const matchesStatus = this.selectedStatus
        ? data.applied_status.toLowerCase() === this.selectedStatus.toLowerCase()
        : true;

      return matchesSearch && matchesStatus;
    };

    // Trigger the filter
    this.dataSource.filter = '' + Math.random();
  }

  clearSearch(): void {
    this.searchKey = '';
    this.selectedStatus = '';
    this.applyFilter();
  }

  scheduleInterview(job: any) {
    alert(`Schedule interview for ${job.fullname}`);
  }

  viewResume(job: any) {
    console.log('View CV', job);
  }

  onClickView() {
    this.getAllCandidates();
  }

  markStatus(job: any, status: string) {
    alert(`Change status of ${job.fullname} to ${status}`);
  }
}
