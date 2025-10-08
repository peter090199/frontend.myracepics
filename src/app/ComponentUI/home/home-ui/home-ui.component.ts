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
import { ClientsService } from 'src/app/services/Networking/clients.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PostReactionByIdService } from 'src/app/services/Reaction/post-reaction-by-id.service';
import { ReactionPostComponent } from 'src/app/ComponentSharedUI/ReactionEmoji/reaction-post/reaction-post.component';

interface Reaction {
  emoji: string;
  label: string;
}

@Component({
  selector: 'app-home-ui',
  templateUrl: './home-ui.component.html',
  styleUrls: ['./home-ui.component.css']
})
export class HomeUIComponent implements OnInit, AfterViewInit {
  maxImages: number = 5;
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
  users: any = [];

  displayedReactions: {
    name: string;
    count: number;
    emoji: string;
    index: number;
    users: { code: number; fullname: string; photo_pic: string }[];
  }[] = [];

  @Input() postId!: number;
  react: any = [];
  reactionEmojiMap2: any = {
    Like: '👍',
    Love: '❤️',
    Care: '🤗',
    Haha: '😂',
    Wow: '😮',
    Sad: '😢',
    Angry: '😡'
  };


  totalReactionsCount: number = 0;
  reactionEmojiMap: { [key: string]: string } = {
    Like: '👍',
    Love: '❤️',
    Haha: '😂',
    Wow: '😮',
    Sad: '😢',
    Angry: '😡',
  };


  isPopupVisible: { [postId: number]: boolean } = {};

  hoveredReactions: { [postId: number]: Reaction | null } = {};
  userReactions: { [postId: number]: Reaction | null } = {};
  reaction = [
    { emoji: '👍', label: 'Like' },
    { emoji: '❤️', label: 'Love' },
    { emoji: '😂', label: 'Haha' },
    { emoji: '😮', label: 'Wow' },
    { emoji: '😢', label: 'Sad' },
    { emoji: '😡', label: 'Angry' }
  ];

  reactions2: { [postId: number]: { emoji: string, label: string } | null } = {};

  async selectReactions(postId: number, react: Reaction) {
    this.userReactions[postId] = react;
    this.isPopupVisible[postId] = false;
    console.log(`Selected reaction for post ${postId}:`, react.label);

    try {
      const res: any = await firstValueFrom(
        this.postReactionByIdService.saveReaction(postId, react.label)
      );
      if (res && res.success) {
        console.log('Reaction saved successfully');
      } else {
        console.error('Failed to save reaction:', res?.message || 'Unknown error');
      }
    } catch (err) {
      console.error('API error:', err);
    }
    this.loadReactions(postId);
  }
  showReaction(postId: number) {
    this.isPopupVisible[postId] = true;
  }

  hideReaction(postId: number) {
    this.isPopupVisible[postId] = false;
    this.hoveredReactions[postId] = null;
  }

  getReactionEmoji(postId: number): string {
    // Hovered emoji > user reaction emoji > default Facebook-like 👍
    return this.hoveredReactions[postId]?.emoji
      || this.userReactions[postId]?.emoji
      || 'thumb_up'; // Material icon for default like
  }

  getReactionLabel(postId: number): string {
    // Hovered label > user reaction label > default text "Like"
    return this.hoveredReactions[postId]?.label
      || this.userReactions[postId]?.label
      || 'Like';
  }


  // Static example data
postReactions2: any = {
  69: {
    reactions: [
      {
        reaction: "Haha",
        count: 1,
        person: [
          { fullname: "PEDRO YORPO", photo_pic: "https://lightgreen-pigeon-122992.hostingersite.com/storage/app/public/uploads/702/cvphoto/8141e9a6-c4a1-4169-a137-d5c0db88d5ac/1754791900.jpg" }
        ]
      },
      {
        reaction: "Wow",
        count: 1,
        person: [
          { fullname: "PEDRO YORPO", photo_pic: "https://lightgreen-pigeon-122992.hostingersite.com/storage/app/public/uploads/701/cvphoto/fc74056c-283b-4883-b8c9-ca7bd6d4f2ac/1754795955.jpg" }
        ]
      },
      {
        reaction: "Love",
        count: 1,
        person: [
          { fullname: "ELIZABETH PUNAY", photo_pic: "https://lightgreen-pigeon-122992.hostingersite.com/storage/app/public/uploads/703/cvphoto/6552206e-1ae2-4dca-8011-0dc5cc468b08/1755613959.webp" }
        ]
      },
       {
        reaction: "Haha",
        count: 1,
        person: [
          { fullname: "ELIZ", photo_pic: "https://lightgreen-pigeon-122992.hostingersite.com/storage/app/public/uploads/703/cvphoto/6552206e-1ae2-4dca-8011-0dc5cc468b08/1755613959.webp" }
        ]
      }
    ],
    totalCount: 3
  }
};

hoverVisible = false;
hoveredPostId: number | null = null;
hoveredReactions2: any[] = [];
hoverPosition = { x: 0, y: 0 };

showHoverNames(postId: number, event: MouseEvent) {
  this.hoveredPostId = postId;
  this.hoverVisible = true;
  this.hoveredReactions2 = this.postReactions[postId]?.reactions || [];
  this.hoverPosition = {
    x: event.clientX - 50,
    y: event.clientY - 100
  };
}

hideHoverNames() {
  this.hoverVisible = false;
  this.hoveredPostId = null;
}



// Tooltip generator
getStaticTooltip(postId: number): string {
  console.log(postId)
  const post = this.postReactions[postId];
  if (!post || !post.reactions?.length) return 'No reactions yet';

  const names: string[] = [];
  post.reactions.forEach((r: any) => {
    r.person.forEach((p: any) => {
      if (p.fullname && !names.includes(p.fullname)) names.push(p.fullname);
    });
  });

  if (names.length <= 3) return names.join(', ');
  return `${names.slice(0, 3).join(', ')}, and ${names.length - 3} others`;
}

  // Load reaction from backend
  // loadReaction(postId: number) {
  //   this.postReactionByIdService.getReaction(postId).subscribe({
  //     next: (res) => {
  //       if (res.success && res.reaction) {
  //         const match = this.reaction.find(r => r.label.toLowerCase() === res.reaction.toLowerCase());
  //         this.userReactions[postId] = match || null;
  //         this.hoveredReactions2 = res.reaction;
  //       } else {
  //         this.userReactions[postId] = null;
  //       }
  //     },
  //     error: (err) => console.error('Error loading reaction:', err)
  //   });


  // }

loadReaction(postId: number) {
  this.postReactionByIdService.getReaction(postId).subscribe({
    next: (res) => {
      if (res.success) {
        // Set current user's reaction
        if (res.reaction) {
          const match = this.reaction.find(r => r.label.toLowerCase() === res.reaction.toLowerCase());
          this.userReactions[postId] = match || null;
        } else {
          this.userReactions[postId] = null;
        }

        // Set all reactions (for hover)
        if (res.reactions && res.totalCount) {
          this.postReactions2[postId] = {
            reactions: res.reactions,
            totalCount: res.totalCount
          };
        } else {
          this.postReactions2[postId] = { reactions: [], totalCount: 0 };
        }
      }
    },
    error: (err) => console.error('Error loading reaction:', err)
  });
}


postTooltips: { [postId: number]: string } = {};





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

  @ViewChild('middleColumn') middleColumn!: ElementRef;
  showScrollTop = false;

  // Detect scroll in middle column
  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    this.showScrollTop = element.scrollTop > 200; // show after 200px
  }

  // Smooth scroll to top
  scrollToTop() {
    if (this.middleColumn) {
      this.middleColumn.nativeElement.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  constructor(private router: Router, private profile: ProfileService, private photo: CurriculumVitaeService,
    private dialog: MatDialog, private route: ActivatedRoute, private postDataservices: PostUploadImagesService,
    private authService: AuthService, private alert: NotificationsService, private comment: CommentService,
    private ngZone: NgZone, private reactionService: ReactionEmojiService, private clientsService: ClientsService,
    private sanitizer: DomSanitizer, private postReactionByIdService: PostReactionByIdService, private reactionsServices: ReactionEmojiService
  ) {
    this.getPeopleRecentActivity();
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
  menuOpened: boolean = false;
  selectedImages: any;


  openModal(data: any[]): void {
    const dialogRef = this.dialog.open(ImageModalComponent, {
      data: data,
      width: '1200px',
      // maxWidth: '80vw',
      // height: 'auto',
      // minHeight: '60vh',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadUserPost();
    });

  }

  openReactionsModal(postId:number): void {
    this.dialog.open(ReactionPostComponent, {
      data: postId,
      width: '100%',
      maxWidth: '600px',
      panelClass: 'centered-modal',
    });

  }



  isScrollIdle = false;
  private scrollTimeout: any;
  private hideTimeout: any;
  private lastScrollTop2 = 0;


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
    this.isMobile = window.innerWidth <= 768;
  }


  currentUserCode: any;
  // Skeleton placeholders
  skeletonPosts = Array(5); // 5 skeleton posts
  skeletonUsers = Array(4); // 4 skeleton users

  ngOnInit(): void {
    this.currentUserCode = this.authService.getAuthCode();
    const url = window.location.href;
    const codesplit = url.split('/').pop();
    this.code = codesplit;

    this.onResize();
    this.fetchProfilePicture();
    this.getProfileByUser();
    this.getCode();

    const sub = this.authService.getProfilecode().subscribe({
      next: (res) => { this.loadUserPost(); },
      error: (err) => console.error(err)
    });
    this.subscriptions.push(sub);



  }
  @Input() reactionsData: any;
  // Get total reactions count
  get totalReactions(): number {
    return this.reactionsData?.react?.reduce((sum: number, r: any) => sum + r.count, 0) || 0;
  }

  // Display tooltip text
  getTooltipText(reaction: any) {
    return reaction.person.map((p: any) => p.fullname).join(', ');
  }


  postReactions: {
    [postId: number]: { reactions: any[], totalCount: number }
  } = {};

  // Load reactions for a single post
  loadReactions(postId: number): void {
    if (!postId) return;

    this.reactionService.getReactionByPostId(postId).subscribe({
      next: (res: any) => {
        if (res && res.react && Array.isArray(res.react)) {
          const mappedReactions = res.react.map((r: any) => ({
            ...r,
            emoji: this.reactionEmojiMap2[r.reaction] || 'thumb' // fallback emoji
          }));

          const total = mappedReactions.reduce((sum: number, r: any) => sum + (r.count || 0), 0);

          this.postReactions[postId] = {
            reactions: mappedReactions,
            totalCount: total
          };
          this.totalReactionsCount = total;
        } else {
          this.postReactions[postId] = { reactions: [], totalCount: 0 };
          this.totalReactionsCount = 0;
        }
      },
      error: (err) => {
        console.error(`Error fetching reactions for post ${postId}:`, err);
        this.postReactions[postId] = { reactions: [], totalCount: 0 };
        this.totalReactionsCount = 0;
      }
    });
  }

  private subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    // Clear intervals & timeouts
    clearInterval(this.autoSlideInterval);
    clearInterval(this.scrollInterval);
    clearTimeout(this.scrollTimeout);
    clearTimeout(this.hideTimeout);

    // Unsubscribe all API subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  sanitizeVideoUrl(url: string): SafeResourceUrl {
    if (!url) return '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }


  loadMoreComments(post: any) {
    post.visibleComments += 2;
  }


  getCode(): void {
    this.authService.getProfilecode().subscribe({
      next: (res) => {
        if (res.success) {
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
  showDefUserButtons: boolean = false;
  showClientOrAdminButtons: boolean = false;

  getProfileByUser(): void {
    this.profile.getProfileByUserOnly().subscribe({
      next: (res) => {
        if (res.success) {
          // Take the first profile object
          this.profiles = res.message;
          console.log('Profile:', this.profiles);

          // Set button visibility
          this.showDefUserButtons = this.profiles.role_code === 'DEF-USERS';
          this.showClientOrAdminButtons = ['DEF-CLIENT', 'DEF-MASTERADMIN'].includes(this.profiles.role_code);
        } else {
          this.profiles = null;
          this.showDefUserButtons = false;
          this.showClientOrAdminButtons = false;
          this.error = 'Failed to load profile data';
        }
      },
      error: (err) => {
        console.error(err);
        this.profiles = null;
        this.showDefUserButtons = false;
        this.showClientOrAdminButtons = false;
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
    this.isLoading = true;

    this.postDataservices.getDataPostAddFollow().subscribe({
      next: (res: any) => {
        if (res.success && Array.isArray(res.data)) {
          this.posts = res.data.map((post: any) => ({
            ...post,
            expanded: false, // for caption see more/less
            images: post.images || [],
            videos: post.videos || []

          }));
          this.posts.forEach(post => {
            if (post.images && post.images.length > 0) {
              post.images.forEach((image: { path_url: string; }) => {
                image.path_url = 'https://lightgreen-pigeon-122992.hostingersite.com/' + image.path_url.replace(/\\/g, '');
              });
            }

          });
          // Fix video URLs
          this.posts.forEach(post => {
            if (post.videos && post.videos.length > 0) {
              post.videos.forEach((video: { path_url: string; }) => {
                video.path_url = 'https://lightgreen-pigeon-122992.hostingersite.com/' + video.path_url.replace(/\\/g, '');
              });
            }
          });
          this.posts.forEach(post => {
            this.loadReaction(post.id);
          });

          this.loadAllPostReactions();

        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching posts:', err);
        this.isLoading = false;
      }
    });
  }


  // Load reactions for all posts in the array
  loadAllPostReactions(): void {
    if (!this.posts || this.posts.length === 0) return;

    this.posts.forEach(post => {
      this.loadReactions(post.id);
    });
  }



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
  @HostListener('window:resize', ['$event'])

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
    dialogConfig.width = '100%';
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

  singleImage: any;
  multipleImages: any = [];

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
        post.comments = res;
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



  // setHoveredReaction(postId: string, reaction: any | null) {

  //   this.initPostReaction(postId);
  //   this.postReactions[postId].hoveredReaction = reaction;
  // }

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

  peopleRecentActivity: any = [];
  getPeopleRecentActivity(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.currentUserCode = this.authService.getAuthCode();

    this.clientsService.getPeopleRecentActivity().subscribe({
      next: (res) => {
        this.users = res.data;
        // const newData = res.data.map((person: any) => ({
        //   ...person,
        //   follow_status: person.follow_status || 'not_following',
        //   follow_id: null
        // }));

        // this.users.push(...newData);
        // this.page++;
        this.isLoading = false;

      },
      error: (err) => {
        console.error('Error loading suggestions:', err);
        this.alert.toastrError('❌ Failed to load suggestions.');
        this.isLoading = false;
      }
    });
  }



  loadClients(): void {
    this.isLoading = true;
    this.clientsService.getPeopleRecentActivity().subscribe({
      next: (res) => {
        this.users = res.data;
        console.log(this.users)
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.isLoading = false;
      }
    });

  }

  errorMsg() {
    this.alert.toastrError('❌ Error updating reaction:')
  }

  AddConnect(code: string, fullName: string, follow_status: string, id: number): void {
    if (!code) {
      this.alert.toastrWarning('⚠️ No user code provided.');
      return;
    }

    const currentStatus = follow_status || 'none';
    let confirmMessage = '';
    let successAction = '';

    switch (currentStatus) {
      case 'not_following':
        confirmMessage = 'Send a follow request to this user?';
        successAction = 'Follow request sent.';
        break;
      case 'pending':
        confirmMessage = 'Cancel your pending follow request?';
        successAction = 'Follow request canceled.';
        break;
      case 'accepted':
        confirmMessage = 'Unfollow this user?';
        successAction = 'Unfollowed successfully.';
        break;
    }

    this.alert.popupWarning(fullName, confirmMessage).then((result) => {
      if (result.value) {
        const action$ = currentStatus === 'accepted'
          ? this.profile.Unfollow(id)
          : this.profile.AddFollow(code);

        action$.subscribe({
          next: (res) => {
            if (res.status === true || res.success === true) {
              this.alert.toastrSuccess(successAction);
              this.getPeopleRecentActivity();
            } else {
              this.alert.toastrError(res.message || 'Action failed.');
            }
          },
          error: (err) => {
            this.alert.toastrError(err.error?.message || 'Something went wrong.');
            console.error(err);
          }
        });
      }
    });
  }



tooltipVisible = false;
tooltipPosition = { x: 0, y: 0 };

showReactionTooltip(postId: number, event: MouseEvent) {
  const reactionData = this.postReactions[postId];
  if (reactionData && reactionData.reactions) {
    this.hoveredReactions2 = reactionData.reactions;
    this.tooltipVisible = true;
    this.tooltipPosition = {
      x: event.pageX + 10,
      y: event.pageY + 10
    };
  }
}

hideReactionTooltip() {
  this.tooltipVisible = false;
}



}

