import { Component, OnInit, OnDestroy, ElementRef, ViewChild, HostListener, Input, NgZone, AfterViewInit } from '@angular/core';
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
import { ReactionEmojiService } from 'src/app/services/Reaction/reaction-emoji.service';

@Component({
  selector: 'app-home-ui',
  templateUrl: './home-ui.component.html',
  styleUrls: ['./home-ui.component.css']
})
export class HomeUIComponent implements OnInit, OnDestroy, AfterViewInit {

  error: any;
  profiles: any = [];
  profile_pic: any;
  code: any;
  followers: any;
  activeHours: any;
  isLoading: boolean = false;
  page = 1;
  isMobile: boolean = false;
  currentIndex = 0;
  @ViewChild('scrollContainer', { static: true }) scrollContainer: ElementRef;
  posts: any[] = [];
  ismobile: boolean = false;
  autoSlideInterval: any;
  @Input() post: any = { posts: [] };
  @HostListener('window:resize', ['$event'])
  maxImages: number = 3;
  usercode: any;
  private scrollInterval: any;
  selectedIndex = 0;
  post_uuidOrUind: any[] = [];
  uuidOrUind: any = [];
  loadCommentStep: number = 2; 
  hoveredReaction: { reaction: string, emoji: string } | null = null;
  selectedReaction: any;
  selectedReactions: { [postId: string]: any } = {};
  reactionList: any = [];
  displayedReactions: {
    name: string;
    count: number;
    emoji: string;
    index: number;
    users: { code: number; fullname: string; photo_pic: string }[];
  }[] = [];

  totalReactionsCount: number = 0;
  reactionEmojiMap: { [key: string]: string } = {
    Like: '👍',
    Love: '❤️',
    Haha: '😂',
    Wow: '😮',
    Sad: '😢',
    Angry: '😡',
  };
  //react emoji
  showReactions = false;
  reactions: any[] = [
    { reaction: 'Like', emoji: '👍' },
    { reaction: 'Love', emoji: '❤️' },
    { reaction: 'Haha', emoji: '😂' },
    { reaction: 'Wow', emoji: '😮' },
    { reaction: 'Sad', emoji: '😢' },
    { reaction: 'Angry', emoji: '😡' },
    { reaction: 'Clap', emoji: '👏' }
  ];


  constructor(private router: Router, private profile: ProfileService, private photo: CurriculumVitaeService,
    private dialog: MatDialog, private route: ActivatedRoute, private postDataservices: PostUploadImagesService,
    private authService: AuthService, private alert: NotificationsService, private comment: CommentService,
    private ngZone: NgZone,private reactionService:ReactionEmojiService
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

  selectedImages: any;
  openModal(data: any): void {
    const dialogRef = this.dialog.open(ImageModalComponent, {
        data: data,
        width: '80%', 
        maxWidth: '80vw',
        height: 'auto',  
        minHeight: '60vh', 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadUserPost();
    });

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

  scrollToTop(element: HTMLElement): void {
    element.scrollTo({ top: 0, behavior: 'smooth' });
    this.loadUserPost();

    // Hide refresh button manually
    clearTimeout(this.hideTimeout);
    this.ngZone.run(() => this.isScrollIdle = false);
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


    this.posts.forEach(post => {
      post.visibleComments = this.loadCommentStep;

      if (!this.postReactions[post.posts_uuid]) {
          this.postReactions[post.posts_uuid] = {
            selectedReaction: null,
            hoveredReaction: null,
            showPopup: false,
          };
        }

         
    });

    // if (this.posts.length > 0) {
    //   this.currentIndex = 0;
    //   // this.posts.forEach(post => post.showComments = false);
    //   this.post_uuidOrUind = this.posts[0].posts_uuind;
    //   console.log(this.post_uuidOrUind)
    //   this.getComments();
    // }
  }

  // loadMoreComments(posts: number) {
  //   console.log(posts)
  //   posts += this.loadCommentStep;
  // }


  loadMoreComments(post: any) {
    post.visibleComments += 2;
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

  getProfileByUser(): void {
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

    this.postDataservices.getDataPostAddFollow().subscribe(
      (data) => {
        if (data && Array.isArray(data)) {
          this.posts = data.map(post => ({
            ...post,
            activeHours: this.getActiveHours(post.lastActive),
            followers: post.followers || 0,
            currentIndex: 0,
            images: post.images || [],
            visibleComments: 3,
          }));
        }

        this.post_uuidOrUind = data.map((item: any) => item.posts_uuid);
        this.post.comments = []; // Clear before loading
        this.post_uuidOrUind.forEach(uuid => {
          this.getComment(uuid, this.posts);
          this.getReactionPost_uuidOrUuid(uuid);
        });
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



 
 hideReactions() {
    this.showReactionsFor = null;
    this.hoveredReaction = null;
  }

  menuRef(index: number): string {
    return `menu-${index}`;
  }

 singleImage:any;
 multipleImages:any = [];
 
ngAfterViewInit(): void {
  const currentPost = this.posts?.[this.currentIndex];

  if (!currentPost) {
    console.warn('No current post found at index:', this.currentIndex);
    return;
  }

  this.post_uuidOrUind = currentPost.post_uuidOrUind;

  if (currentPost.images?.length === 1) {
    console.log('Only one image:', currentPost.images[0]);
    this.singleImage = currentPost.images[0];
    this.multipleImages = []; // Clear if previously set
  } else {
    this.singleImage = null; // Clear if previously set
    this.multipleImages = currentPost.images || [];
  }
}




  onEditPost() {

  }

  onDelete(post: any): void {
    this.alert.popupWarning("", "Are you sure you want to delete this post?").then((result: any) => {
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
  addCommentxxx(post: any): void {
    if (!post.newComment?.trim()) return;

    post.isSubmitting = true;

    this.comment.postComment(post.post_uuidOrUind, post.newComment).subscribe({
      next: (response) => {
        post.comments = post.comments || [];
        post.comments.push(response); // or however your backend returns it
        post.newComment = '';
        post.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error submitting comment:', error);
        post.isSubmitting = false;
      }
    });
  }

  addComment(post: any): void {
    const commentText = post.newComment?.trim();
    if (!commentText) return;
    post.isSubmitting = true;

    const payload = {
      comment: commentText
    };

    this.comment.postComment(post.posts_uuid, payload).subscribe({
      next: (res) => {
         post.comments.push({
          user: 'Current User',
          comment: commentText,
          profile_pic: '',
          likes: 0,
          replies: []
        });
        post.newComment = '';
        post.isSubmitting = false;

      //  post.comments.push(res.data);
      //   console.log("comment:", post.comments)
      //   this.alert.toastrSuccess(res.message);
      //   post.newComment = '';
      //   post.isSubmitting = false;
      
      
      },
      error: (err) => {
        this.alert.toastPopUpError("Comment failed:")
      }
    });
  }


  getComments(): void {
    this.comment.getComment(this.post_uuidOrUind).subscribe({
      next: (res) => {
        this.comments = res;
      },
      error: (err: any) => {
        this.alert.toastPopUpError(err?.message || 'Failed to fetch comments');
      }
    });
  }


  getComment2(): void {
    this.comment.getComment(this.post_uuidOrUind).subscribe({
      next: (res) => {
        this.comments = res;
      },
      error: (err: any) => {
        this.alert.toastPopUpError(err?.message || 'Failed to fetch comments');
      }
    });
  }

  //getcomment
  comments: any = [];
  getComment(post_uuid: any, post: any): void {
    this.comment.getComment(post_uuid).subscribe({
      next: (res) => {
        post.comments= res;
      },
      error: (err) => {
        this.error = err.message || 'An error occurred while fetching comments';
      }
    });
  }

  getDataComment(post_uuid: string) {
    this.comment.getComment(post_uuid).subscribe({
      next: (res) => {
        this.post.posts = res;
      },
      error: (err) => {
        this.error = err.message || 'An error occurred while fetching comments';
      }
    });
  }


  //reply comment
  addReply(comment: any): void {
    const replyText = comment.newReply?.trim();
    if (!replyText) return;

    comment.isSubmitting = true;

    const payload = {
      comment: replyText
    };

    // console.log(payload);

    this.comment.postCommentByReply(comment.comment_uuid, payload).subscribe({
      next: () => {
        comment.replies = comment.replies || []; // ensure it exists
        comment.replies.push({
          user: 'Current User', // Replace with actual user data
          comment: replyText,
          profile_pic: '',
          likes: 0,
          replies: []
        });
        comment.newReply = '';
        comment.isSubmitting = false;
      },
      error: (err) => {
        comment.isSubmitting = false;
        this.alert.toastPopUpError("Comment failed");
      }
    });
  }


  likeComment(comment: any) {
    comment.likes = (comment.likes || 0) + 1;
  }


  //edit reply
  startEdit(reply: any) {
      reply.isEditing = true;
      reply.editText = reply.comment;
    }

    cancelEdit(reply: any) {
      reply.isEditing = false;
    }

    saveEdit(reply: any) {
      // You can call your backend service here to update the reply
      reply.comment = reply.editText;
      reply.isEditing = false;
      // Optionally send to backend:
      // this.commentService.updateReply(reply.id, reply.comment).subscribe(...)
    }

postReactions: {
  [postId: string]: {
    selectedReaction: { emoji: string } | null;
    hoveredReaction: { emoji: string } | null;
    showPopup: boolean;
  };
} = {};


initPostReaction(post_uuidOrUuid: any) {
  if (!this.postReactions[post_uuidOrUuid]) {
    this.postReactions[post_uuidOrUuid] = {
      selectedReaction: null,
      hoveredReaction: null,
      showPopup: false,
    };
  }
}

togglePopup(post_uuidOrUuid: any, show: boolean) {
  this.initPostReaction(post_uuidOrUuid);
  this.postReactions[post_uuidOrUuid].showPopup = show;
}

//react 
  selectReaction(post_uuidOrUuid: any, react: any) {
    console.log("react", post_uuidOrUuid, " ", react.reaction)

    this.initPostReaction(post_uuidOrUuid);
    this.selectedReaction = react;
    this.hoveredReaction = null;
    this.showReactions = false;
    this.saveReactionToDatabase(post_uuidOrUuid, react.reaction);
  }

 //save react
  saveReactionToDatabase(post_uuidOrUuid: any, reaction: string): void {
    const payload = {
      reaction: reaction
    };
    this.reactionService.putReactionInvidual(post_uuidOrUuid, payload).subscribe({
      next: (res) => {
             console.log('✅ Reaction response:', res);
            this.getReactionPost_uuidOrUuid(post_uuidOrUuid); // Make sure this method exists
      },
      error: () => {
         this.errorMsg();
      }
    });
  }

showReactionsFor: number | null = null;
 showReactionss(post: any) {
   console.log(post.posts_uuid)
    this.showReactionsFor = post.posts_uuid;
  }

  

setHoveredReaction(postId: string, reaction: any | null) {

  this.initPostReaction(postId);
  this.postReactions[postId].hoveredReaction = reaction;
}

reactionsMap: any = [];
getReactionPost_uuidOrUuid(post_uuidOrUind: any): void {
  const currentUserCode = this.authService.getAuthCode();

  this.reactionService.getReactionPost_uuidOrUuid(post_uuidOrUind).subscribe({
    next: (res) => {
      this.reactionList = res.reaction || [];
      this.totalReactionsCount = res.count || 0;

      this.displayedReactions = this.reactionList
        .slice(0, 5)
        .map((r: { reaction: any; count: any; person: any; }, i: any) => {
          const reactionMeta = this.reactions.find(e => e.reaction === r.reaction);
          return {
            name: r.reaction,
            count: r.count,
            emoji: reactionMeta?.emoji || '', // ✅ map emoji here
            index: i,
            users: r.person || []
          };
        });

      // ✅ Select current user's reaction
      this.selectedReaction = this.displayedReactions.find(r =>
        r.users.some(u => u.code === Number(currentUserCode))
      ) || null;
    },
    error: () => {
      this.errorMsg();
    }
  });
}

  //save react
  // saveReactionToDatabase(post_uuidOrUuid: any, reaction: string): void {
  //   const payload = {
  //     reaction: reaction
  //   };
  //   this.reactionService.putReactionInvidual(post_uuidOrUuid, payload).subscribe({
  //     next: (res) => {
  //       //     console.log('✅ Reaction response:', res);
  //       this.getReactionPost_uuidOrUuid(); // Make sure this method exists
  //     },
  //     error: () => {
  //        this.errorMsg();
  //     }
  //   });
  // }

// getReactionPost_uuidOrUuid(post_uuidOrUuid: any) {
//   const currentUserCode = this.authService.getAuthCode();

//   this.reactionService.getReactionPost_uuidOrUuid(post_uuidOrUuid).subscribe({
//     next: (res) => {
//       const reactionList = res.reaction || [];

//       this.reactionsMap[post_uuidOrUuid] = reactionList.slice(0, 5).map((r: { reaction: any; count: any; person: any; }, i: any) => {
//        this.reactions.find(e => e.reaction === r.reaction);
//         return {
//           name: r.reaction,
//           count: r.count,
//           index: i,
//           users: r.person || []
//         };
//       });
//       this.selectedReaction = this.displayedReactions.find(r =>
//           r.users.some(u => u.code === Number(currentUserCode)) // Convert string to number
//         ) || null;

//       // Optionally track selectedReaction per post if needed
//     },
//     error: () => {
//       this.errorMsg();
//     }
//   });
// }


  errorMsg(){
     this.alert.toastrError('❌ Error updating reaction:')
  }
}

