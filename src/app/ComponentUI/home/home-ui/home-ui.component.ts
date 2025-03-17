import { Component, OnInit,OnDestroy, ElementRef, ViewChild, HostListener } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PrintCVComponent } from 'src/app/ComponentSharedUI/Individual/print-cv/print-cv.component';
import { ProfileService } from 'src/app/services/Profile/profile.service';
import { CurriculumVitaeService } from 'src/app/services/CV/curriculum-vitae.service';
import { THREE } from '@angular/cdk/keycodes';
import { UploadProfileComponent } from 'src/app/ComponentSharedUI/Individual/upload-profile/upload-profile.component';
import { ActivatedRoute } from '@angular/router';
import { PostUIComponent } from 'src/app/ComponentSharedUI/Public/post-ui/post-ui.component';

@Component({
  selector: 'app-home-ui',
  templateUrl: './home-ui.component.html',
  styleUrls: ['./home-ui.component.css']
})
export class HomeUIComponent implements OnInit {


createPost() {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.width = '600px';
//  dialogConfig.data = element || null; // Pass user data
  const dialogRef = this.dialog.open(PostUIComponent, dialogConfig);

  dialogRef.afterClosed().subscribe(() => {
    
  });
}

  private scrollInterval: any;
  @ViewChild('scrollContainer', { static: true }) scrollContainer: ElementRef; // Reference to the scroll container

  posts = [
    {
      id: 1,
      author: 'John Doe',
      content: 'This is a sample post content. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      timestamp: new Date('2024-11-28T12:00:00'),
      likes: 120,
      comments: 45,
      reposts: 10,
      sends: 8,
    },
    {
      id: 2,
      author: 'Jane Smith',
      content: 'Another example post! Just testing out some content here.',
      timestamp: new Date('2024-11-29T10:30:00'),
      likes: 350,
      comments: 200,
      reposts: 30,
      sends: 15,
    },
    {
      id: 3,
      author: 'Alice Cooper',
      content: 'This post is about the latest trends in tech and innovation.',
      timestamp: new Date('2024-11-27T14:45:00'),
      likes: 75,
      comments: 25,
      reposts: 5,
      sends: 2,
    },
    {
      id: 4,
      author: 'Bob Marley',
      content: 'A beautiful day to share some inspiration with the world!',
      timestamp: new Date('2024-11-29T09:00:00'),
      likes: 500,
      comments: 150,
      reposts: 50,
      sends: 40,
    },
    {
      id: 5,
      author: 'Charlie Brown',
      content: 'Just a simple post to share some thoughts with everyone. Keep it real!',
      timestamp: new Date('2024-11-25T16:20:00'),
      likes: 300,
      comments: 100,
      reposts: 25,
      sends: 20,
    },
    {
      id: 6,
      author: 'Charlie Brown',
      content: 'Just a simple post to share some thoughts with everyone. Keep it real!',
      timestamp: new Date('2024-11-25T16:20:00'),
      likes: 300,
      comments: 100,
      reposts: 25,
      sends: 20,
    },
    {
      id: 7,
      author: 'Charlie Brown',
      content: 'Just a simple post to share some thoughts with everyone. Keep it real!',
      timestamp: new Date('2024-11-25T16:20:00'),
      likes: 300,
      comments: 100,
      reposts: 25,
      sends: 20,
    },
    {
      id: 8,
      author: 'Charlie Brown',
      content: 'Just a simple post to share some thoughts with everyone. Keep it real!',
      timestamp: new Date('2024-11-25T16:20:00'),
      likes: 300,
      comments: 100,
      reposts: 25,
      sends: 20,
    },
    {
      id: 9,
      author: 'Charlie Brown',
      content: 'Just a simple post to share some thoughts with everyone. Keep it real!',
      timestamp: new Date('2024-11-25T16:20:00'),
      likes: 300,
      comments: 100,
      reposts: 25,
      sends: 20,
    },
    {
      id: 10,
      author: 'Charlie Brown',
      content: 'Just a simple post to share some thoughts with everyone. Keep it real!',
      timestamp: new Date('2024-11-25T16:20:00'),
      likes: 300,
      comments: 100,
      reposts: 25,
      sends: 20,
    },
    {
      id: 11,
      author: 'Charlie Brown',
      content: 'Just a simple post to share some thoughts with everyone. Keep it real!',
      timestamp: new Date('2024-11-25T16:20:00'),
      likes: 300,
      comments: 100,
      reposts: 25,
      sends: 20,
    },
    {
      id: 12,
      author: 'Charlie Brown',
      content: 'Just a simple post to share some thoughts with everyone. Keep it real!',
      timestamp: new Date('2024-11-25T16:20:00'),
      likes: 300,
      comments: 100,
      reposts: 25,
      sends: 20,
    },
  ];

  isLoading = false; // Flag for showing spinner
  page = 1; // Pagination or load more page tracking
  isMobile: boolean = false; 
  
  constructor(private router:Router,private profile:ProfileService,private photo:CurriculumVitaeService,
    private dialog:MatDialog,private route:ActivatedRoute
  ) {}
  
  ismobile: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth <= 768; // or your breakpoint for mobile
  }



  error: any;
  profiles: any=[];

  profile_pic: any;
  code:any;
  
  ngOnInit(): void {
    const url = window.location.href;
    const codesplit = url.split('/').pop();
    this.code = codesplit;

    this.onResize();
    this.fetchProfilePicture();
    this.profile.getProfileByUser(this.code).subscribe({
      next: (response) => {
        if (response.success == true) {
          this.profiles = response.message; // Access the first item in the message array
        } else {
          this.error = 'Failed to load profile data';
        }
      },
      error: (err) => {
        this.error = err.message || 'An error occurred while fetching profile data';
      },
    });
  }

  fetchProfilePicture(): void {
    this.photo.getDataCV().subscribe(
      (response) => {
        if (response && response.message) {
          this.profile_pic = response.message; // Assign the response data to `cvData`
        } else {
          console.error('Invalid response format:', response);
        }
      },
      (error) => {
        console.error('Error fetching CV data:', error);
      }
    );
  }

  fetchProfilePicturess(): void {
    this.photo.getDataCV().subscribe({
      next: (res) => {
        console.log(res.photo_pic); // Log for debugging
        this.profile_pic = res.photo_pic; // Assign the image URL
      },
      error: (err) => {
        console.error('Error fetching profile picture:', err); // Log error for debugging
        this.error = err.message || 'An error occurred while fetching profile data';
      },
    });
  }


  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed
  
  }
  // onScroll() {
  //   const scrollElement = this.scrollContainer.nativeElement;
  //   if (scrollElement.scrollHeight - scrollElement.scrollTop === scrollElement.clientHeight) {
  //     if (!this.isLoading) {
  //      // this.loadPosts(); // Load more posts when scrolled to the bottom
  //     }
  //   }
  // }
  startAutoScroll(): void {
    const middleColumn = document.querySelector('.middle-column') as HTMLElement;

    // Clear any existing interval if already scrolling
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
    }

    this.scrollInterval = setInterval(() => {
      // Scroll the content by 1px every 10ms
      middleColumn.scrollTop += 1;

      // Stop scrolling when the bottom is reached
      if (middleColumn.scrollHeight - middleColumn.scrollTop <= middleColumn.clientHeight) {
        clearInterval(this.scrollInterval);
      }
    }, 10);
  }

  stopAutoScroll(): void {
    // Clear the interval to stop auto-scrolling
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
    }
  }
  toggleMenu() {
    // Implement your menu toggle logic if needed
  }

  lastScrollTop: number = 0;
  isScrollingDown: boolean = false;
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > this.lastScrollTop) {
      // User is scrolling down
      this.isScrollingDown = true;
    } else {
      // User is scrolling up
      this.isScrollingDown = false;
    }
  }

   displayedColumns: string[] = ['item'];
    dataSource = new MatTableDataSource([
      { item: 'test' },
    ]);
  
 
  printCV() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '90%';
        dialogConfig.height = '600px';
        const dialogRef = this.dialog.open(PrintCVComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
          
          }
        });
    }

    uploadPic(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';

    const dialogRef = this.dialog.open(UploadProfileComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
      }
    });
  }
}
