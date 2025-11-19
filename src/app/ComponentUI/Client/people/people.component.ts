import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  peopleList = [{ fullName: 'Elizabeth Punay', profilePic: 'assets/images/logo2.png', location: 'Makati, Philippines', isConnected: true }, 
    { fullName: 'Steven Yorpo', profilePic: 'assets/images/logo2.png', location: 'Iloilo City, Philippines', isConnected: true },
     { fullName: 'John Doe', profilePic: 'assets/images/logo2.png', location: 'Cebu City, Philippines', isConnected: true }, 
     { fullName: 'Jane Smith', profilePic: 'assets/images/logo2.png', location: 'Davao, Philippines', isConnected: true }];
}
