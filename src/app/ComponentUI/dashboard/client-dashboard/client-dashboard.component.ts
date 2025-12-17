import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {
  totalVacancies = 12;
  totalApplicants = 248;
  pendingReviews = 36;
  hired = 14;
  displayedColumns = ['job', 'applicants', 'status', 'actions'];

  constructor() { }

  ngOnInit(): void {
  }

  vacancies = [
    { title: 'Frontend Developer', applicants: 45, status: 'Active' },
    { title: 'Backend Developer', applicants: 62, status: 'Active' },
    { title: 'UI/UX Designer', applicants: 21, status: 'Closed' }
  ];
}
