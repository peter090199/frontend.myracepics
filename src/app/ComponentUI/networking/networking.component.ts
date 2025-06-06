import { Component, NgZone, OnInit } from '@angular/core';
import { AllSuggestionsModalComponent } from './all-suggestions-modal/all-suggestions-modal.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-networking',
  templateUrl: './networking.component.html',
  styleUrls: ['./networking.component.css']
})
export class NetworkingComponent implements OnInit {

  constructor(private ngZone: NgZone,private dialog: MatDialog
    
  ) { }

  
  showAll = false;
  toggleShowAll() {
    this.showAll = !this.showAll;
  }

  
  ngOnInit(): void {
  }

   people = [
    {
      name: 'Ramiro Gurgel',
      subtitle: 'Graduando em Engenharia Elétrica na ...',
      image: 'assets/images/default.png'
    },
    {
      name: 'Zeeshan Khan',
      subtitle: '',
       image: 'assets/images/default2.png'
    },
    {
      name: 'Deepam Saini',
      subtitle: 'Travel & Customer Relationship Management...',
       image: 'assets/images/default2.png'
    },
    {
      name: 'Shafaqat Fatima',
      subtitle: '',
       image: 'assets/images/default2.png'
    },
     {
      name: 'Shafaqat Fatima',
      subtitle: '',
       image: 'assets/images/default2.png'
    },
     {
      name: 'Shafaqat Fatima',
      subtitle: '',
       image: 'assets/images/default2.png'
    },
     {
      name: 'Shafaqat Fatima',
      subtitle: '',
       image: 'assets/images/default2.png'
    },
     {
      name: 'Shafaqat Fatima',
      subtitle: '',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
    }
  ];
  


selectedTabIndex = 0;
  networkSummary = [
  { icon: 'people', label: 'Connections', count: 17 },
  { icon: 'person', label: 'Invitations' },
  // { icon: 'group', label: 'Groups' },
  // { icon: 'event', label: 'Events' },
  // { icon: 'pages', label: 'Pages', count: 68 },
  // { icon: 'email', label: 'Newsletters', count: 6 }
];


  openSuggestionsModal() {
  this.dialog.open(AllSuggestionsModalComponent, {
    width: '900px',
   data: { people: this.people }
  });
}
}
