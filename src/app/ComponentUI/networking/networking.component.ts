import { Component, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'app-networking',
  templateUrl: './networking.component.html',
  styleUrls: ['./networking.component.scss']
})
export class NetworkingComponent implements OnInit {

  constructor(private ngZone: NgZone) { }

  ngOnInit(): void {
  }

    posts = [
    { title: 'Welcome to my network', content: 'Excited to start new projects!' },
    { title: 'frontend devs', content: 'comming soon.' }
  ];

suggestedUsers = [
  {
    name: 'Jane Smith',
    title: 'Graphic Designer',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    connected: false
  },
  {
    name: 'Mark Lee',
    title: 'Data Analyst',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    connected: false
  },
  {
    name: 'Sophia Reyes',
    title: 'Mobile Developer',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    connected: false
  },
  {
    name: 'Daniel Cruz',
    title: 'UX Designer',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
    connected: false
  }
];
moreUsers = [
  {
    name: 'Emily Watson',
    title: 'AI Researcher',
    image: 'https://randomuser.me/api/portraits/women/5.jpg',
    connected: false
  },
  {
    name: 'Chris Evans',
    title: 'DevOps Engineer',
    image: 'https://randomuser.me/api/portraits/men/6.jpg',
    connected: false
  },
  {
    name: 'Lara Kim',
    title: 'Product Designer',
    image: 'https://randomuser.me/api/portraits/women/7.jpg',
    connected: false
  },
  {
    name: 'Jason Tan',
    title: 'Cloud Architect',
    image: 'https://randomuser.me/api/portraits/men/8.jpg',
    connected: false
  }
];


connectedUsers: any[] = [];

connect(user: any) {
  if (!user.connected) {
    user.connected = true;
    this.connectedUsers.push({ ...user });
  }
}


    isScrollIdle = false;
  private scrollTimeout: any;
  private hideTimeout: any;
  private lastScrollTop2 = 0;

  onScroll(event: Event): void {
    const el = event.target as HTMLElement;
    const currentScroll = el.scrollTop;

    clearTimeout(this.scrollTimeout);
    clearTimeout(this.hideTimeout);

    // Show button if idle after 1 second
    // this.scrollTimeout = setTimeout(() => {
    //   if (el.scrollTop === this.lastScrollTop2) {
    //     this.ngZone.run(() => this.isScrollIdle = true);
    //   }
    // }, 1000);

    // Hide after 2 minutes of no scroll activity
    this.hideTimeout = setTimeout(() => {
      this.ngZone.run(() => this.isScrollIdle = false);
    }, 120000); // 2 minutes

    this.lastScrollTop2 = currentScroll;
  }
}
