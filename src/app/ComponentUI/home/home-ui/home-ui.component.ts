import { Component, OnInit,OnDestroy, ElementRef, ViewChild, HostListener, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PrintCVComponent } from 'src/app/ComponentSharedUI/Individual/print-cv/print-cv.component';
import { ProfileService } from 'src/app/services/Profile/profile.service';
import { CurriculumVitaeService } from 'src/app/services/CV/curriculum-vitae.service';
import { UploadProfileComponent } from 'src/app/ComponentSharedUI/Individual/upload-profile/upload-profile.component';
import { ActivatedRoute } from '@angular/router';
import { PostUIComponent } from 'src/app/ComponentSharedUI/Public/post-ui/post-ui.component';
import { PostUploadImagesService } from 'src/app/services/post-upload-images.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { ImageModalComponent } from '../../Modal/image-modal/image-modal.component';
import { CommentService } from 'src/app/services/comment/comment.service';

@Component({
  selector: 'app-home-ui',
  templateUrl: './home-ui.component.html',
  styleUrls: ['./home-ui.component.css']
})
export class HomeUIComponent implements OnInit,OnDestroy {

  error: any;
  profiles: any=[];
  profile_pic: any;
  code:any;
  followers:any;
  activeHours:any;
  isLoading:boolean = false; 
  page = 1; 
  isMobile: boolean = false; 
  currentIndex = 0;
  @ViewChild('scrollContainer', { static: true }) scrollContainer: ElementRef;
  posts:any[] = [];
  ismobile: boolean = false;
  autoSlideInterval: any;
  @Input() post: any = { posts: [] };
  @HostListener('window:resize', ['$event'])
  maxImages:number = 3;
  usercode:any;
  private scrollInterval: any;
  selectedIndex = 0;
  constructor(private router:Router,private profile:ProfileService,private photo:CurriculumVitaeService,
    private dialog:MatDialog,private route:ActivatedRoute,private postDataservices:PostUploadImagesService,
    private authService: AuthService,private alert:NotificationsService,private comment:CommentService
  ) {
   
  }
  
  modalOpen = false;
  currentPage = 0;
  pageSize = 6;
  newComment = '';

  get pagedImages() {
    const start = this.currentPage * this.pageSize;
    return this.post.posts.slice(start, start + this.pageSize);
  }
  
  get totalPages() {
    return Math.ceil(this.post.posts.length / this.pageSize);
  }


  openModal(image: any): void {
    const dialogRef = this.dialog.open(ImageModalComponent, {
      data: image,
      minWidth: '60%',
      maxWidth: '90%',
      maxHeight: '90vh'
    });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) this.loadUserPost();
      });
  
  }
  
  openModalx(image: any): void {
   // const selectedImage = this.post.posts[index];
    console.log(image.path_url)

    // this.dialog.open(ImageModalComponent, {
    //   data: { imageUrl: selectedImage.path_url },
    //   panelClass: 'custom-modal',
    //   width: '90%',
    //   maxWidth: '900px'
    // });
  }


  openModalxx(index: number): void {
     this.selectedIndex = index;
    this.modalOpen = true;
    this.currentIndex = this.currentPage * this.pageSize + index;
  }
  
  closeModal(): void {
    this.modalOpen = false;
  }
  
  changeSlide(direction: number): void {
    const total = this.post.posts.length;
    this.currentIndex = (this.currentIndex + direction + total) % total;
  }
  
  goToSlide(index: number): void {
    this.currentIndex = index;
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) this.currentPage++;
  }
  
  prevPage(): void {
    if (this.currentPage > 0) this.currentPage--;
  }
  
  getCaption(index: number): string {
    return this.post.posts[index]?.path_url.split('/').pop() || '';
  }

  addCommentPreview(): void {
    const trimmed = this.newComment.trim();
    if (trimmed) {
      this.post.posts[this.currentIndex].comments.push({
        user: 'You', // You can replace with actual user name
        text: trimmed
      });
      this.newComment = '';
    }
  }





  onResize() {
    this.isMobile = window.innerWidth <= 768; // or your breakpoint for mobile
  }

  ngOnDestroy(): void {
    clearInterval(this.autoSlideInterval);
  }

  ngOnInit(): void {
    
    const url = window.location.href;
    const codesplit = url.split('/').pop();
    this.code = codesplit;

    this.onResize();
    this.fetchProfilePicture();

    this.getProfileByUser();
    this.startAutoSlide();
    this.getCode();

    this.getComment();
  
  }


  getCode(): void {
    this.authService.getProfilecode().subscribe({
      next: (res) => {
        if (res.success && res.message.length > 0) {
          this.usercode = res.message[0].code;
          this.loadUserPost();
        }
      },
      error: (err) => {
        console.error("Error fetching profile:", err);
      }
    });
  }
  
  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide(this.posts);
    }, 5000); // Change to your preferred interval (ms)
  }

  nextSlide(post: any): void {
    if (post.images && post.images.length > 0) {
      post.currentIndex = (post.currentIndex + 1) % post.images.length;
    }
  }

  prevSlide(posts: any): void {
    console.log(posts)
    if (posts.posts.path_url.length > 0) {
      posts.currentIndex = (posts.currentIndex - 1 + posts.posts.path_url.length) % posts.posts.path_url.length;
    }
  }



createPost() {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.width = '600px';
  const dialogRef = this.dialog.open(PostUIComponent, dialogConfig);


  dialogRef.afterClosed().subscribe(() => {
    this.loadUserPost();
  });
}


  toggleComments(post: any): void {
    post.showComments = !post.showComments;
  }
  
  addCommentxx(post: any): void {
    if (!post.newComment.trim()) return;
  
    post.comments.push({
      user: 'Current User',
      text: post.newComment,
      profile_pic: 'assets/images/default.png'
    });
  
    post.newComment = '';
  }

  
  addCommentx(post: any) {
    if (!post.newComment || !post.newComment.trim()) {
      return; // Prevent adding empty or undefined comments
    }
  
    // Ensure 'comments' array exists before pushing a new comment
    if (!post.comments) {
      post.comments = []; // Initialize if undefined
    }
  
    post.comments.push({
      text: post.newComment,
      timestamp: new Date()
    });
  
    post.newComment = ""; // Clear input after submitting
  }
  
  likePost(post: any): void {
    if (!post.liked) {
      post.likes = (post.likes || 0) + 1; // Increment likes
    } else {
      post.likes = Math.max((post.likes || 1) - 1, 0); // Decrement likes, but not below zero
    }
    post.liked = !post.liked; // Toggle liked state
  
    // Call API to update like status in the backend
    // this.postDataservices.likePost(post.id, post.liked).subscribe(
    //   (response) => {
    //     console.log('✅ Like status updated successfully:', response);
    //   },
    //   (error) => {
    //     console.error('❌ Error updating like status:', error);
    //   }
    // );
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
            sessionStorage.setItem('code', this.profile_pic.code);
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
      if (!this.usercode) {
        this.alert.popupWarning("Usercode is ", "undefined, cannot load posts.")
        return;
      }

      
      this.isLoading = true;

      this.postDataservices.getDataPostAddFollow(this.usercode).subscribe(
        (data) => {
          if (data && Array.isArray(data)) {
            this.posts = data.map(post => ({
              ...post,
              activeHours: this.getActiveHours(post.lastActive),
              followers: post.followers || 0,
              currentIndex: 0, // for image carousel
              images: post.images || [] // ensure it has images
            
            }));
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching posts:', error);
          this.isLoading = false;
        }
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



  //react emoji
  showReactions = false;
  selectedReaction: any = null;
  hoveredReaction: any = null;


  reactions = [
    { name: 'Like', emoji: '👍' },
    { name: 'Love', emoji: '❤️' },
    { name: 'Haha', emoji: '😂' },
    { name: 'Wow', emoji: '😮' },
    { name: 'Sad', emoji: '😢' },
    { name: 'Angry', emoji: '😡' }
  ];
  

  selectedReactions: { [postId: string]: any } = {};


  onReactionHover(post: any, reaction: any) {
    this.hoveredReaction = reaction;
  this.selectedReactions[post.id] = reaction;
  this.sendReactionToServer(post.id, reaction);

  // optional: hide popup automatically
  setTimeout(() => this.showReactions = false, 300);
  }
  
  hideReactions() {
    this.showReactions = false;
  //  this.hoveredReaction = null;
  }
  menuRef(index: number): string {
    return `menu-${index}`;
  }
  
  sendReactionToServer(postId: string, reaction: any) {
    console.log(`✅ Sent reaction '${reaction.name}' for post ID: ${postId}`);
    // TODO: Use HttpClient or service here
    // this.api.sendReaction(postId, reaction).subscribe(...)
  }

  onEditPost(){

  }

  onDelete(post: any): void {
    this.alert.popupWarning("","Are you sure you want to delete this post?").then((result: any) => {
      if (result?.value) {
        this.isLoading = true;
  
        this.postDataservices.deletePost(post.posts_uuid).subscribe({
          next: (res: any) => {
            if (res.success === true) {
              this.alert.toastrSuccess(res.message);
            } else {
              this.alert.toastrError(res.message);
            }
            this.loadUserPost();
            this.isLoading = false;
          },
          error: (error: any) => {
            this.alert.toastrError(error.error?.message || "An error occurred while deleting the post.");
            this.isLoading = false;
          }
        });
      }
    });
  }

  //postcomment
  addComment(post: any): void {
    const commentText = post.newComment?.trim();
    if (!commentText) return;
  
    const payload = {
      comment: commentText
    };
  
    this.comment.postComment(post,"data").subscribe({
      next: (res) => {
        post.comments.push({
          user: 'Current User',
          comment: commentText,
          profile_pic: '',
          likes: 0,
          replies: []
        });
        post.newComment = '';
      },
      error: (err) => {
        console.error('Comment failed:', err);
      }
    });
  }
  
//getcomment
comments:any[]=[];
getComment(): void{

  this.comment.getComment("4a752eaa-16b3-4716-9db3-878d70a826d2").subscribe({
    next: (res) => {
      this.comments = res;
      console.log(this.comments)
    },
    error: (err) => {
      this.error = err.message || 'An error occurred while fetching profile data';
    },
  });
}

addReply(comment: any) {
  const reply = {
    user: 'Current User',
    comment: comment.newReply,
    profile_pic: ''
  };
  comment.replies = comment.replies || [];
  comment.replies.push(reply);
  comment.newReply = '';
  comment.showReply = false;
}

likeComment(comment: any) {
  comment.likes = (comment.likes || 0) + 1;
}


}

