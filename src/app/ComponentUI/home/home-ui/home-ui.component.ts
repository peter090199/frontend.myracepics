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
import { PostUploadImagesService } from 'src/app/services/post-upload-images.service';

@Component({
  selector: 'app-home-ui',
  templateUrl: './home-ui.component.html',
  styleUrls: ['./home-ui.component.css']
})
export class HomeUIComponent implements OnInit {

  error: any;
  profiles: any=[];
  profile_pic: any;
  code:any;
  followers:any;
  activeHours:any;
  isLoading = false; 
  page = 1; 
  isMobile: boolean = false; 
  

createPost() {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.width = '600px';
  const dialogRef = this.dialog.open(PostUIComponent, dialogConfig);

  dialogRef.afterClosed().subscribe(() => {
    
  });
}

  private scrollInterval: any;
  @ViewChild('scrollContainer', { static: true }) scrollContainer: ElementRef; // Reference to the scroll container
  posts:any[] = [];

  constructor(private router:Router,private profile:ProfileService,private photo:CurriculumVitaeService,
    private dialog:MatDialog,private route:ActivatedRoute,private postDataservices:PostUploadImagesService
  ) {}
  
  ismobile: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth <= 768; // or your breakpoint for mobile
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    const url = window.location.href;
    const codesplit = url.split('/').pop();
    this.code = codesplit;

    this.onResize();
    this.fetchProfilePicture();
    this.loadUserPost();
    this.getProfileByUser();
  }

  getProfileByUser(): void{
    this.profile.getProfileByUser(this.code).subscribe({
      next: (response) => {
        if (response.success == true) {
          this.profiles = response.message; 
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
      (response: any) => {
        if (response?.message) {
          this.profile_pic = response.message;
  
          if (this.profile_pic?.code) {
            localStorage.setItem('code', this.profile_pic.code);
          }
        } else {
          console.error('Invalid response format:', response);
        }
      },
      (error) => {
        console.error('Error fetching CV data:', error);
      }
    );
  }
  
    // Function to calculate active hours
    getActiveHours(lastActive: string): string {
      if (!lastActive) return 'unknown';

      const lastActiveDate = new Date(lastActive);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60));

      if (diffInHours < 1) return 'Just now';
      if (diffInHours === 1) return '1 hour ago';
      return `${diffInHours} hours ago`;
    }


  loadUserPost(): void {
    this.postDataservices.getDataPostAddFollow().subscribe(
      (data) => {
        if (data && Array.isArray(data)) {
          this.posts = data.map(post => ({
            ...post,
            activeHours: this.getActiveHours(post.lastActive),
            followers: post.followers || 0
          }));
        }
      },
      (error) => console.error('Error fetching posts:', error)
    );
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



  // postsx = [
  //   {
  //     id: 1,
  //     author: 'John Doe',
  //     content: 'This is a sample post content. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  //     timestamp: new Date('2024-11-28T12:00:00'),
  //     likes: 120,
  //     comments: 45,
  //     reposts: 10,
  //     sends: 8,
  //   },
  //   {
  //     id: 2,
  //     author: 'Jane Smith',
  //     content: 'Another example post! Just testing out some content here.',
  //     timestamp: new Date('2024-11-29T10:30:00'),
  //     likes: 350,
  //     comments: 200,
  //     reposts: 30,
  //     sends: 15,
  //   },
  //   {
  //     id: 3,
  //     author: 'Alice Cooper',
  //     content: 'This post is about the latest trends in tech and innovation.',
  //     timestamp: new Date('2024-11-27T14:45:00'),
  //     likes: 75,
  //     comments: 25,
  //     reposts: 5,
  //     sends: 2,
  //   },
  //   {
  //     id: 4,
  //     author: 'Bob Marley',
  //     content: 'A beautiful day to share some inspiration with the world!',
  //     timestamp: new Date('2024-11-29T09:00:00'),
  //     likes: 500,
  //     comments: 150,
  //     reposts: 50,
  //     sends: 40,
  //   },
  //   {
  //     id: 5,
  //     author: 'Charlie Brown',
  //     content: 'Just a simple post to share some thoughts with everyone. Keep it real!',
  //     timestamp: new Date('2024-11-25T16:20:00'),
  //     likes: 300,
  //     comments: 100,
  //     reposts: 25,
  //     sends: 20,
  //   },
  //   {
  //     id: 6,
  //     author: 'Charlie Brown',
  //     content: 'Just a simple post to share some thoughts with everyone. Keep it real!',
  //     timestamp: new Date('2024-11-25T16:20:00'),
  //     likes: 300,
  //     comments: 100,
  //     reposts: 25,
  //     sends: 20,
  //   },
  //   {
  //     id: 7,
  //     author: 'Charlie Brown',
  //     content: 'Just a simple post to share some thoughts with everyone. Keep it real!',
  //     timestamp: new Date('2024-11-25T16:20:00'),
  //     likes: 300,
  //     comments: 100,
  //     reposts: 25,
  //     sends: 20,
  //   },
  //   {
  //     id: 8,
  //     author: 'Charlie Brown',
  //     content: 'Just a simple post to share some thoughts with everyone. Keep it real!',
  //     timestamp: new Date('2024-11-25T16:20:00'),
  //     likes: 300,
  //     comments: 100,
  //     reposts: 25,
  //     sends: 20,
  //   },
  //   {
  //     id: 9,
  //     author: 'Charlie Brown',
  //     content: 'Just a simple post to share some thoughts with everyone. Keep it real!',
  //     timestamp: new Date('2024-11-25T16:20:00'),
  //     likes: 300,
  //     comments: 100,
  //     reposts: 25,
  //     sends: 20,
  //   },
  //   {
  //     id: 10,
  //     author: 'Charlie Brown',
  //     content: 'Just a simple post to share some thoughts with everyone. Keep it real!',
  //     timestamp: new Date('2024-11-25T16:20:00'),
  //     likes: 300,
  //     comments: 100,
  //     reposts: 25,
  //     sends: 20,
  //   },
  //   {
  //     id: 11,
  //     author: 'Charlie Brown',
  //     content: 'Just a simple post to share some thoughts with everyone. Keep it real!',
  //     timestamp: new Date('2024-11-25T16:20:00'),
  //     likes: 300,
  //     comments: 100,
  //     reposts: 25,
  //     sends: 20,
  //   },
  //   {
  //     id: 12,
  //     author: 'Charlie Brown',
  //     content: 'Just a simple post to share some thoughts with everyone. Keep it real!',
  //     timestamp: new Date('2024-11-25T16:20:00'),
  //     likes: 300,
  //     comments: 100,
  //     reposts: 25,
  //     sends: 20,
  //   },
  // ];

