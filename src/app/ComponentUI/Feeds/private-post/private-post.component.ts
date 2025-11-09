// // import { Component, OnInit } from '@angular/core';

// // @Component({
// //   selector: 'app-private-post',
// //   templateUrl: './private-post.component.html',
// //   styleUrls: ['./private-post.component.css']
// // })
// // export class PrivatePostComponent implements OnInit {

// //   constructor() { }

// //   ngOnInit(): void {
// //   }

// // }
// import { Component, OnInit, OnDestroy, ElementRef, ViewChild, HostListener, Input, NgZone, AfterViewInit, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
// import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
// import { MatTableDataSource } from '@angular/material/table';
// import { Router, ActivatedRoute } from '@angular/router';
// import { PrintCVComponent } from 'src/app/ComponentSharedUI/Individual/print-cv/print-cv.component';
// import { ProfileService } from 'src/app/services/Profile/profile.service';
// import { CurriculumVitaeService } from 'src/app/services/CV/curriculum-vitae.service';
// import { UploadProfileComponent } from 'src/app/ComponentSharedUI/Individual/upload-profile/upload-profile.component';
// import { PostUIComponent } from 'src/app/ComponentSharedUI/Public/post-ui/post-ui.component';
// import { PostUploadImagesService } from 'src/app/services/post-upload-images.service';
// import { AuthService } from 'src/app/services/auth.service';
// import { NotificationsService } from 'src/app/services/Global/notifications.service';
// import { ImageModalComponent } from '../../Modal/image-modal/image-modal.component';
// import { CommentService } from 'src/app/services/comment/comment.service';
// import { ReactionEmojiService } from 'src/app/services/Reaction/reaction-emoji.service';
// import { ClientsService } from 'src/app/services/Networking/clients.service';
// import { Subscription, Subject, forkJoin, interval } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import { PostReactionByIdService } from 'src/app/services/Reaction/post-reaction-by-id.service';
// import { ReactionPostComponent } from 'src/app/ComponentSharedUI/ReactionEmoji/reaction-post/reaction-post.component';
// import { finalize, take } from 'rxjs/operators';
// import { EchoService } from 'src/app/services/echo.service';
// import { PusherService } from 'src/app/services/pusher.service';
// interface Reaction {
//   emoji: string;
//   label: string;
// }

// @Component({
//   selector: 'app-private-post',
//   templateUrl: './private-post.component.html',
//   styleUrls: ['./private-post.component.css']
// })
// export class PrivatePostComponent implements OnInit, AfterViewInit, OnDestroy {
//   // Basic UI / data
//   maxImages: number = 5;
//   error: any;
//   profiles: any = [];
//   profile_pic: any;
//   code: any;
//   followers: any;
//   activeHours: any;
//   isLoading: boolean = false;
//   page = 1;
//   isMobile: boolean = false;
//   currentIndex = 0;
//   @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef;
//   posts: any[] = [];
//   ismobile: boolean = false;
//   autoSlideInterval: any;
//   @Input() post: any = { posts: [] };
//   usercode: any;
//   private scrollInterval: any;
//   selectedIndex = 0;
//   post_uuidOrUind: any[] = [];
//   uuidOrUind: any = [];
//   loadCommentStep: number = 2;
//   hoveredReaction: { reaction: string, emoji: string } | null = null;
//   selectedReaction: any;
//   selectedReactions: { [postId: string]: any } = {};
//   reactionList: any = [];
//   users: any = [];

//   displayedReactions: {
//     name: string;
//     count: number;
//     emoji: string;
//     index: number;
//     users: { code: number; fullname: string; photo_pic: string }[];
//   }[] = [];

//   @Input() postId!: number;
//   react: any = [];
//   reactionEmojiMap2: any = {
//     Like: '👍',
//     Love: '❤️',
//     Care: '🤗',
//     Haha: '😂',
//     Wow: '😮',
//     Sad: '😢',
//     Angry: '😡'
//   };

//   totalReactionsCount: number = 0;
//   reactionEmojiMap: { [key: string]: string } = {
//     Like: '👍',
//     Love: '❤️',
//     Haha: '😂',
//     Wow: '😮',
//     Sad: '😢',
//     Angry: '😡',
//   };

//   isPopupVisible: { [postId: number]: boolean } = {};
//   hoveredReactions: { [postId: number]: Reaction | null } = {};
//   userReactions: { [postId: number]: Reaction | null } = {};
//   reaction = [
//     { emoji: '👍', label: 'Like' },
//     { emoji: '❤️', label: 'Love' },
//     { emoji: '😂', label: 'Haha' },
//     { emoji: '😮', label: 'Wow' },
//     { emoji: '😢', label: 'Sad' },
//     { emoji: '😡', label: 'Angry' }
//   ];

//   reactions2: { [postId: number]: { emoji: string, label: string } | null } = {};

//   // Static example data (kept for local testing)
//   postReactions2: any = {
//     69: {
//       reactions: [
//         {
//           reaction: "Haha",
//           count: 1,
//           person: [
//             { fullname: "PEDRO YORPO", photo_pic: "https://lightgreen-pigeon-122992.hostingersite.com/storage/app/public/uploads/702/cvphoto/8141e9a6-c4a1-4169-a137-d5c0db88d5ac/1754791900.jpg" }
//           ]
//         },
//         {
//           reaction: "Wow",
//           count: 1,
//           person: [
//             { fullname: "PEDRO YORPO", photo_pic: "https://lightgreen-pigeon-122992.hostingersite.com/storage/app/public/uploads/701/cvphoto/fc74056c-283b-4883-b8c9-ca7bd6d4f2ac/1754795955.jpg" }
//           ]
//         },
//         {
//           reaction: "Love",
//           count: 1,
//           person: [
//             { fullname: "ELIZABETH PUNAY", photo_pic: "https://lightgreen-pigeon-122992.hostingersite.com/storage/app/public/uploads/703/cvphoto/6552206e-1ae2-4dca-8011-0dc5cc468b08/1755613959.webp" }
//           ]
//         },
//         {
//           reaction: "Haha",
//           count: 1,
//           person: [
//             { fullname: "ELIZ", photo_pic: "https://lightgreen-pigeon-122992.hostingersite.com/storage/app/public/uploads/703/cvphoto/6552206e-1ae2-4dca-8011-0dc5cc468b08/1755613959.webp" }
//           ]
//         }
//       ],
//       totalCount: 3
//     }
//   };

//   // hover tooltip state
//   hoverVisible = false;
//   hoveredPostId: number | null = null;
//   hoveredReactions2: any[] = [];
//   hoverPosition = { x: 0, y: 0 };

//   showHoverNames(postId: number, event: MouseEvent) {
//     this.hoveredPostId = postId;
//     this.hoverVisible = true;
//     this.hoveredReactions2 = this.postReactions[postId]?.reactions || [];
//     this.hoverPosition = {
//       x: event.clientX - 50,
//       y: event.clientY - 100
//     };
//   }

//   hideHoverNames() {
//     this.hoverVisible = false;
//     this.hoveredPostId = null;
//   }

//   // Tooltip generator
//   getStaticTooltip(postId: number): string {
//     const post = this.postReactions[postId];
//     if (!post || !post.reactions?.length) return 'No reactions yet';

//     const names: string[] = [];
//     post.reactions.forEach((r: any) => {
//       r.person.forEach((p: any) => {
//         if (p.fullname && !names.includes(p.fullname)) names.push(p.fullname);
//       });
//     });

//     if (names.length <= 3) return names.join(', ');
//     return `${names.slice(0, 3).join(', ')}, and ${names.length - 3} others`;
//   }

//   postTooltips: { [postId: number]: string } = {};

//   // react emoji
//   showReactions = false;
//   reactions: any[] = [
//     { reaction: 'Like', emoji: '👍' },
//     { reaction: 'Love', emoji: '❤️' },
//     { reaction: 'Haha', emoji: '😂' },
//     { reaction: 'Wow', emoji: '😮' },
//     { reaction: 'Sad', emoji: '😢' },
//     { reaction: 'Angry', emoji: '😡' },
//     { reaction: 'Clap', emoji: '👏' }
//   ];

//   @ViewChild('middleColumn') middleColumn!: ElementRef;
//   showScrollTop = false;

//   // scrolling state
//   isScrollIdle = false;
//   private scrollTimeout: any;
//   private hideTimeout: any;
//   private lastScrollTop2 = 0;

//   // modal state
//   modalOpen = false;
//   currentPage = 0;
//   pageSize = 6;
//   newComment = '';
//   menuOpened: boolean = false;
//   selectedImages: any;
//   singleImage: any;
//   multipleImages: any = [];
//   currentUserCode: any;
//   skeletonUsers: any[] = [];
//   skeletonPosts: any[] = [];
//   // subscriptions & cleanup
//   private subscriptions: Subscription[] = [];
//   private destroy$ = new Subject<void>();

//   // comment storage
//   comments: any = [];

//   // table example
//   displayedColumns: string[] = ['item'];
//   dataSource = new MatTableDataSource([
//     { item: 'test' },
//   ]);

//   // constructor with DI
//   constructor(
//     private router: Router,
//     private profile: ProfileService,
//     private photo: CurriculumVitaeService,
//     private dialog: MatDialog,
//     private route: ActivatedRoute,
//     private postDataservices: PostUploadImagesService,
//     private authService: AuthService,
//     private alert: NotificationsService,
//     private comment: CommentService,
//     private ngZone: NgZone,
//     private reactionService: ReactionEmojiService,
//     private clientsService: ClientsService,
//     private sanitizer: DomSanitizer,
//     private postReactionByIdService: PostReactionByIdService,
//     private reactionsServices: ReactionEmojiService,
//     private cdr: ChangeDetectorRef,
//     private echoService: EchoService,
//     private pusherService: PusherService
//   ) {
//     // optional eager call moved to ngOnInit flows
//   }
//   subscription!: Subscription;
//   private postsLoaded = false;
//   allLoaded = false;
//   perPage = 5;
//   showLoadButton: boolean = false;
//   // ----------------------- LIFECYCLE -----------------------


//   ngOnInit(): void {
//     const url = window.location.href;
//     const codesplit = url.split('/').pop();
//     this.code = codesplit;

//     this.loadRealtimePosts();


//     this.currentUserCode = this.authService.getAuthCode();
//     this.skeletonUsers = Array.from({ length: 8 });
//     this.skeletonPosts = Array.from({ length: 5 });
//     // Load all posts and related APIs once
//     if (!this.postsLoaded) {
//       this.loadAllApisConcurrently();
//       this.loadUserPost();
//       this.postsLoaded = true;
//     }

//   }

//   newPostSubscription!: Subscription;
//   newPostsQueue: any[] = [];         // temporary queue for new posts
//   hasNewPosts = false;

//   loadRealtimePosts() {
//     if (!this.newPostSubscription || this.newPostSubscription.closed) {
//       this.echoService.listenToPosts();
//       this.newPostSubscription = this.echoService.newPost$.subscribe(post => {
//         console.log('🆕 New post received:', post);
//         this.newPostsQueue.unshift(post);
//         this.newPostsAvailable = true; // matches the template
//       });
//     }
//   }

//   refreshFeed() {
//     if (this.newPostsQueue.length === 0) return;

//     this.isLoading = true;
//     setTimeout(() => {
//       this.posts = [...this.newPostsQueue, ...this.posts];
//       this.newPostsQueue = [];
//       this.hasNewPosts = false;
//       this.isLoading = false;
//     }, 1000); // simulate API delay
//   }



//   newPostsAvailable = false;

//   onRefreshClick() {
//     if (this.newPostsQueue.length === 0) return;

//     this.isLoading = true;
//     setTimeout(() => {
//       this.posts = [...this.newPostsQueue, ...this.posts]; // prepend new posts
//       this.newPostsQueue = [];
//       this.newPostsAvailable = false; // hide banner
//       this.isLoading = false;
//     }, 500); // small delay to show spinner
//   }


//   checkForNewPosts() {
//     // ✅ Simulate new posts from server
//     const hasNewPosts = Math.random() < 0.5; // randomly true or false

//     if (hasNewPosts) {
//       this.newPostsAvailable = true;
//       console.log('🔔 New posts detected!');
//     }
//   }

//   checkForNewPosts2(): void {
//     if (this.isLoading) return; // avoid overlap

//     this.postDataservices.getDataPostAddFollow().subscribe({
//       next: (res: any) => {
//         if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
//           const latestServerPostId = res.data[0].id;
//           const latestLocalPostId = this.posts?.[0]?.id;

//           // Compare latest IDs
//           if (latestLocalPostId && latestServerPostId > latestLocalPostId) {
//             this.newPostsAvailable = true; // ✅ show popup button
//           }
//         }
//       },
//       error: (err) => console.error('Error checking new posts:', err),
//     });
//   }


//   refreshPosts() {
//     this.page = 1;
//     this.loadUserPost(1, true);
//     this.newPostsAvailable = true;
//   }

//   // ⬇️ Infinite scroll
//   onScroll2(): void {
//     if (this.isLoading || this.allLoaded) return;

//     this.page++;
//     this.loadUserPost(this.page, true); // Append new posts at bottom
//   }


//   onScroll(event: Event) {
//     const element = event.target as HTMLElement;
//     this.showScrollTop = element.scrollTop > 200;
//   }

//   trackByPostId(index: number, post: any) {
//     return post.id;
//   }
//   // getPostPreview(post: any): string {
//   //   return post.caption.length > 800 ? post.caption.slice(0, 800) + '...' : post.caption;
//   // }

//   toggleReply(comment: any) {
//     comment.showReply = !comment.showReply;
//   }

//   openPanels: { [key: number]: boolean } = {};
//   togglePanel(postId: number) {
//     this.openPanels[postId] = !this.openPanels[postId];
//   }

//   isPanelOpen(postId: number): boolean {
//     return !!this.openPanels[postId];
//   }

//   postComment(post: any) {
//     if (post.newComment?.trim()) {
//       post.comments.push({ user: 'You', text: post.newComment });
//       post.newComment = '';
//     }
//   }

//   @ViewChildren('videoEl') videoElements!: QueryList<ElementRef<HTMLVideoElement>>;
//   private observer!: IntersectionObserver;



//   ngAfterViewInit(): void {
//     this.setupAutoPlayOnScroll();
//     this.checkScroll();
//     const currentPost = this.posts?.[this.currentIndex];
//     if (!currentPost) {
//       return;
//     }

//     this.post_uuidOrUind = currentPost.post_uuidOrUind;

//     if (currentPost.images?.length === 1) {
//       this.singleImage = currentPost.images[0];
//       this.multipleImages = [];
//     } else {
//       this.singleImage = null;
//       this.multipleImages = currentPost.images || [];
//     }
//   }


//   setupAutoPlayOnScroll() {
//     this.observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           const video = entry.target as HTMLVideoElement;

//           if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
//             // Pause other videos first (optional)
//             this.videoElements.forEach((v) => v.nativeElement.pause());

//             // Play the one that's visible
//             video.play().catch(() => { });
//           } else {
//             video.pause();
//           }
//         });
//       },
//       { threshold: [0.6] } // 60% visible triggers play
//     );

//     this.videoElements.forEach((video) =>
//       this.observer.observe(video.nativeElement)
//     );
//   }


//   ngOnDestroy(): void {
//     if (this.observer) this.observer.disconnect();
//     clearInterval(this.autoSlideInterval);
//     clearInterval(this.scrollInterval);
//     clearTimeout(this.scrollTimeout);
//     clearTimeout(this.hideTimeout);

//     if (this.newPostSubscription) {
//       this.newPostSubscription.unsubscribe();
//     }
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   // -------------------- CONCURRENT LOADING --------------------
//   /**
//    * Load critical APIs concurrently:
//    * - profile.getProfileByUserOnly()
//    * - photo.getDataCV()
//    * - clientsService.getPeopleRecentActivity()
//    * - postDataservices.getDataPostAddFollow()
//    * - authService.getProfilecode()
//    */


//   private loadAllApisConcurrently(): void {
//     const calls: any = {
//       profile: this.profile.getProfileByUserOnly(),
//       cv: this.photo.getDataCV(),
//       people: this.clientsService.getPeopleRecentActivity(),
//       profileCode: this.authService.getProfilecode()
//     };


//     forkJoin(calls)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (res: any) => {
//           // PROFILE
//           if (res.profile?.success) {
//             this.profiles = res.profile.message;
//             this.showDefUserButtons = this.profiles.role_code === 'DEF-USERS';
//             this.showClientOrAdminButtons = ['DEF-CLIENT', 'DEF-MASTERADMIN'].includes(this.profiles.role_code);
//           } else {
//             this.profiles = null;
//             this.showDefUserButtons = false;
//             this.showClientOrAdminButtons = false;
//           }

//           // CV / Profile pic
//           if (res.cv?.message) {
//             this.profile_pic = res.cv.message;
//             if (this.profile_pic?.code) sessionStorage.setItem('code', this.profile_pic.code);
//           }

//           // People recent activity
//           if (res.people?.data) {
//             this.users = res.people.data;
//           }

//           // POSTS
//           if (res.posts?.success && Array.isArray(res.posts.data)) {
//             this.posts = res.posts.data.map((post: any) => ({
//               ...post,
//               expanded: false,
//               images: post.images || [],
//               videos: post.videos || []
//             }));

//             // Normalize image & video URLs
//             this.posts.forEach(post => {
//               if (post.images && post.images.length > 0) {
//                 post.images.forEach((image: { path_url: string; }) => {
//                   image.path_url = 'https://lightgreen-pigeon-122992.hostingersite.com/' + (image.path_url || '').replace(/\\/g, '');
//                 });
//               }
//               if (post.videos && post.videos.length > 0) {
//                 post.videos.forEach((video: { path_url: string; }) => {
//                   video.path_url = 'https://lightgreen-pigeon-122992.hostingersite.com/' + (video.path_url || '').replace(/\\/g, '');
//                 });
//               }
//             });

//             this.posts.forEach((post) => this.loadReaction(post.id));
//             // Load per-post reactions
//             this.loadAllPostReactions();
//           }

//           // optional profileCode logic
//           if (res.profileCode?.success) {
//             // nothing required here by default
//           }

//           this.isLoading = false;
//         },
//         error: (err) => {
//           console.error('Error loading initial data with forkJoin:', err);
//           // fallback to individual fetchers
//           this.fetchProfilePicture();
//           this.getProfileByUser();
//           this.getPeopleRecentActivity();
//           this.loadUserPost();
//           this.isLoading = false;
//         }
//       });
//   }

//   // ---------------------- POSTS / SLIDER / MODALS ----------------------
//   get pagedImages() {
//     const start = this.currentPage * this.pageSize;
//     return this.post.posts.slice(start, start + this.pageSize);
//   }

//   get totalPages() {
//     return Math.ceil(this.post.posts.length / this.pageSize);
//   }

//   openModal(data: any[]): void {
//     const dialogRef = this.dialog.open(ImageModalComponent, {
//       data,
//       width: '1200px',
//     });

//     dialogRef.afterClosed().subscribe((result: any) => {
//       if (result) {
//         this.loadUserPost();
//       }
//     });
//   }

//   openReactionsModal(postId: number): void {
//     this.dialog.open(ReactionPostComponent, {
//       data: postId,
//       width: '100%',
//       maxWidth: '600px',
//       panelClass: 'centered-modal',
//     });
//   }

//   changeSlide(direction: number): void {
//     const total = this.post.posts.length;
//     this.currentIndex = (this.currentIndex + direction + total) % total;
//   }

//   goToSlide(index: number): void {
//     this.currentIndex = index;
//   }

//   nextPage(): void {
//     if (this.currentPage < this.totalPages - 1) this.currentPage++;
//   }

//   prevPage(): void {
//     if (this.currentPage > 0) this.currentPage--;
//   }

//   getCaption(index: number): string {
//     return this.post.posts[index]?.path_url?.split('/').pop() || '';
//   }

//   addCommentPreview(): void {
//     const trimmed = this.newComment.trim();
//     if (trimmed) {
//       this.post.posts[this.currentIndex].comments.push({
//         user: 'You',
//         text: trimmed
//       });
//       this.newComment = '';
//     }
//   }

//   // onResize() {
//   //   this.isMobile = window.innerWidth <= 768;
//   // }

//   startAutoSlide(): void {
//     this.autoSlideInterval = setInterval(() => {
//       this.nextSlide(this.posts);
//     }, 5000);
//   }

//   nextSlide(post: any): void {
//     if (post.images && post.images.length > 0) {
//       post.currentIndex = (post.currentIndex + 1) % post.images.length;
//     }
//   }

//   prevSlide(posts: any): void {
//     if (posts.posts?.path_url?.length > 0) {
//       posts.currentIndex = (posts.currentIndex - 1 + posts.posts.path_url.length) % posts.posts.path_url.length;
//     }
//   }

//   createPost() {
//     const dialogConfig = new MatDialogConfig();
//     dialogConfig.disableClose = true;
//     dialogConfig.autoFocus = true;
//     dialogConfig.width = '600px';
//     const dialogRef = this.dialog.open(PostUIComponent, dialogConfig);

//     dialogRef.afterClosed().subscribe(() => {
//       this.loadUserPost();
//     });
//   }

//   toggleComments(post: any): void {
//     post.showComments = !post.showComments;
//   }

//   addCommentxx(post: any): void {
//     if (!post.newComment?.trim()) return;

//     post.isSubmitting = true;

//     this.comment.postComment(post.post_uuidOrUind, post.newComment).subscribe({
//       next: (response) => {
//         post.comments = post.comments || [];
//         post.comments.push(response);
//         post.newComment = '';
//         post.isSubmitting = false;
//       },
//       error: (error) => {
//         console.error('Error submitting comment:', error);
//         post.isSubmitting = false;
//       }
//     });
//   }

//   addComment(post: any): void {
//     const commentText = post.newComment?.trim();
//     if (!commentText) return;
//     post.isSubmitting = true;

//     const payload = { comment: commentText };

//     this.comment.postComment(post.posts_uuid, payload).subscribe({
//       next: (res) => {
//         post.comments = post.comments || [];
//         post.comments.push({
//           user: 'Current User',
//           comment: commentText,
//           profile_pic: '',
//           likes: 0,
//           replies: []
//         });
//         post.newComment = '';
//         post.isSubmitting = false;
//       },
//       error: (err) => {
//         this.alert.toastPopUpError("Comment failed:");
//         post.isSubmitting = false;
//       }
//     });
//   }

//   // ----------------------- REACTIONS -----------------------
//   async selectReactions(postId: number, react: Reaction) {
//     this.userReactions[postId] = react;
//     this.isPopupVisible[postId] = false;
//     console.log(`Selected reaction for post ${postId}:`, react.label);

//     try {
//       const res: any = await this.postReactionByIdService.saveReaction(postId, react.label).toPromise();
//       if (res && res.success) {
//         console.log('Reaction saved successfully');
//       } else {
//         console.error('Failed to save reaction:', res?.message || 'Unknown error');
//       }
//     } catch (err) {
//       console.error('API error:', err);
//     }
//     this.loadReactions(postId);
//   }

//   showReaction(postId: number) {
//     this.isPopupVisible[postId] = true;
//   }

//   hideReaction(postId: number) {
//     this.isPopupVisible[postId] = false;
//     this.hoveredReactions[postId] = null;
//   }

//   getReactionEmoji(postId: number): string {
//     return this.hoveredReactions[postId]?.emoji
//       || this.userReactions[postId]?.emoji
//       || 'thumb_up';
//   }

//   getReactionLabel(postId: number): string {
//     return this.hoveredReactions[postId]?.label
//       || this.userReactions[postId]?.label
//       || 'Like';
//   }

//   // Load reaction (single)
//   loadReaction(postId: number) {
//     this.postReactionByIdService.getReaction(postId).subscribe({
//       next: (res) => {
//         if (res.success) {
//           if (res.reaction) {
//             const match = this.reaction.find(r => r.label.toLowerCase() === res.reaction.toLowerCase());
//             this.userReactions[postId] = match || null;
//           } else {
//             this.userReactions[postId] = null;
//           }

//           if (res.reactions && res.totalCount) {
//             this.postReactions2[postId] = {
//               reactions: res.reactions,
//               totalCount: res.totalCount
//             };
//           } else {
//             this.postReactions2[postId] = { reactions: [], totalCount: 0 };
//           }
//         }
//       },
//       error: (err) => console.error('Error loading reaction:', err)
//     });
//   }

//   // Load all post reactions (for posts[] array)
//   loadAllPostReactions(): void {
//     if (!this.posts || this.posts.length === 0) return;
//     this.posts.forEach(post => this.loadReactions(post.id));
//   }

//   // load reactions by reactionService (per-post)
//   loadReactions(postId: number): void {
//     if (!postId) return;

//     this.reactionService.getReactionByPostId(postId).subscribe({
//       next: (res: any) => {
//         if (res && res.react && Array.isArray(res.react)) {
//           const mappedReactions = res.react.map((r: any) => ({
//             ...r,
//             emoji: this.reactionEmojiMap2[r.reaction] || 'thumb'
//           }));

//           const total = mappedReactions.reduce((sum: number, r: any) => sum + (r.count || 0), 0);

//           this.postReactions[postId] = {
//             reactions: mappedReactions,
//             totalCount: total
//           };
//           this.totalReactionsCount = total;
//         } else {
//           this.postReactions[postId] = { reactions: [], totalCount: 0 };
//           this.totalReactionsCount = 0;
//         }
//       },
//       error: (err) => {
//         console.error(`Error fetching reactions for post ${postId}:`, err);
//         this.postReactions[postId] = { reactions: [], totalCount: 0 };
//         this.totalReactionsCount = 0;
//       }
//     });
//   }

//   // ----------------------- PROFILE & POSTS -----------------------
//   showDefUserButtons: boolean = false;
//   showClientOrAdminButtons: boolean = false;
//   getProfileByUser(): void {
//     this.isLoading = true;

//     this.profile.getProfileByUserOnly().pipe(
//       take(1), // completes after one emission → prevents memory leaks
//       finalize(() => {
//         this.isLoading = false; // stops loading indicator no matter success or error
//         this.cdr.detectChanges(); // ensures UI updates quickly
//       })
//     ).subscribe({
//       next: (res) => {
//         if (res?.success) {
//           this.profiles = res.message;
//           const role = this.profiles.role_code;

//           this.showDefUserButtons = role === 'DEF-USERS';
//           this.showClientOrAdminButtons = ['DEF-CLIENT', 'DEF-MASTERADMIN'].includes(role);
//         } else {
//           this.handleError('Failed to load profile data');
//         }
//       },
//       error: (err) => {
//         console.error('Profile API Error:', err);
//         this.handleError(err?.message || 'An error occurred while fetching profile data');
//       }
//     });
//   }

//   private handleError(message: string): void {
//     this.profiles = null;
//     this.showDefUserButtons = false;
//     this.showClientOrAdminButtons = false;
//     this.error = message;
//   }



//   fetchProfilePicture(): void {
//     this.photo.getDataCV().subscribe(
//       (response: any) => {
//         if (response?.message) {
//           this.profile_pic = response.message;
//           if (this.profile_pic?.code) {
//             sessionStorage.setItem('code', this.profile_pic.code);
//           }
//         } else {
//           console.error('Invalid response format:', response);
//         }
//       },
//       (error) => {
//         console.error('Error fetching CV data:', error);
//       }
//     );
//   }

//   // Function to calculate active hours
//   getActiveHours(lastActive: string): string {
//     if (!lastActive) return 'unknown';
//     const lastActiveDate = new Date(lastActive);
//     const now = new Date();
//     const diffInHours = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60));
//     if (diffInHours < 1) return 'Just now';
//     if (diffInHours === 1) return '1 hour ago';
//     return `${diffInHours} hours ago`;
//   }


// loadUserPost(page: number = 1, append: boolean = false): void {
//   this.isLoading = true;

//   this.postDataservices.getDataPost(this.code).subscribe({
//     next: (res) => {
//       if (res && res.success && Array.isArray(res.data)) {
//         const normalizeUrl = (path: string) =>
//           `https://lightgreen-pigeon-122992.hostingersite.com/${(path || '').replace(/\\/g, '')}`;

//         const formattedPosts = res.data.map((post: any) => {
//           const images = Array.isArray(post.images)
//             ? post.images.map((img: any) => ({
//                 ...img,
//                 path_url: normalizeUrl(img.path_url),
//               }))
//             : [];

//           const videos = Array.isArray(post.videos)
//             ? post.videos.map((vid: any) => ({
//                 ...vid,
//                 path_url: normalizeUrl(vid.path_url),
//               }))
//             : [];

//           return {
//             ...post,
//             fullname: post.fullname || post.Fullname || 'Unknown User',
//             profile_pic: post.profile_pic
//               ? normalizeUrl(post.profile_pic)
//               : 'https://lightgreen-pigeon-122992.hostingersite.com/storage/app/public/uploads/DEFAULTPROFILE/DEFAULTPROFILE.png',
//             images,
//             videos,
//             expanded: false,
//           };
//         });

//         // ✅ Merge posts properly
//         this.posts = append ? [...this.posts, ...formattedPosts] : formattedPosts;

//         // ✅ Load reactions for each post
//         console.log(this.post.id)
//         this.posts.forEach((post) => this.loadReaction(post.id));
//       } else {
//         console.warn('Unexpected response format:', res);
//         if (!append) this.posts = [];
//       }

//       this.isLoading = false;
//     },
//     error: (err) => {
//       console.error('Error fetching posts:', err);
//       this.isLoading = false;
//     },
//   });
// }

//   // loadUserPost(): void {
//   //   this.isLoading = true;

//   //   this.postDataservices.getDataPostAddFollow().subscribe({
//   //     next: (res: any) => {
//   //       if (res?.success && Array.isArray(res.data)) {
//   //         this.posts = res.data.map((post: any) => {
//   //           const normalizeUrl = (path: string) =>
//   //             `https://lightgreen-pigeon-122992.hostingersite.com/${(path || '').replace(/\\/g, '')}`;

//   //           const images = Array.isArray(post.images)
//   //             ? post.images.map((img: any) => ({
//   //               ...img,
//   //               path_url: normalizeUrl(img.path_url),
//   //             }))
//   //             : [];

//   //           const videos = Array.isArray(post.videos)
//   //             ? post.videos.map((vid: any) => ({
//   //               ...vid,
//   //               path_url: normalizeUrl(vid.path_url),
//   //             }))
//   //             : [];

//   //           return {
//   //             ...post,
//   //             expanded: false,
//   //             images,
//   //             videos,
//   //           };
//   //         });

//   //         // Load reactions per post
//   //         this.posts.forEach((post) => this.loadReaction(post.id));
//   //       } else {
//   //         console.warn('Unexpected response format:', res);
//   //         this.posts = [];
//   //       }

//   //       this.isLoading = false;
//   //     },
//   //     error: (err) => {
//   //       console.error('Error fetching posts:', err);
//   //       this.isLoading = false;
//   //     },
//   //   });
//   // }


//   // loadUserPost(): void {
//   //   this.isLoading = true;

//   //   this.postDataservices.getDataPostAddFollow().subscribe({
//   //     next: (res: any) => {
//   //       if (res.success && Array.isArray(res.data)) {
//   //         this.posts = res.data.map((post: any) => ({
//   //           ...post,
//   //           expanded: false,
//   //           images: post.images || [],
//   //           videos: post.videos || []
//   //         }));

//   //         // Normalize image/video urls
//   //         this.posts.forEach(post => {
//   //           if (post.images && post.images.length > 0) {
//   //             post.images.forEach((image: { path_url: string; }) => {
//   //               image.path_url = 'https://lightgreen-pigeon-122992.hostingersite.com/' + (image.path_url || '').replace(/\\/g, '');
//   //             });
//   //           }
//   //           if (post.videos && post.videos.length > 0) {
//   //             post.videos.forEach((video: { path_url: string; }) => {
//   //               video.path_url = 'https://lightgreen-pigeon-122992.hostingersite.com/' + (video.path_url || '').replace(/\\/g, '');
//   //             });
//   //           }
//   //         });

//   //         this.posts.forEach(post => {
//   //           this.loadReaction(post.id);
//   //         });

//   //       //  this.loadAllPostReactions();
//   //       }

//   //       this.isLoading = false;
//   //     },
//   //     error: (err) => {
//   //       console.error('Error fetching posts:', err);
//   //       this.isLoading = false;
//   //     }
//   //   });
//   // }

//   // ------------------------ AUTOSCROLL -------------------------
//   startAutoScroll(): void {
//     const middleColumn = document.querySelector('.middle-column') as HTMLElement;
//     if (this.scrollInterval) {
//       clearInterval(this.scrollInterval);
//     }
//     this.scrollInterval = setInterval(() => {
//       if (!middleColumn) return;
//       middleColumn.scrollTop += 1;
//       if (middleColumn.scrollHeight - middleColumn.scrollTop <= middleColumn.clientHeight) {
//         clearInterval(this.scrollInterval);
//       }
//     }, 10);
//   }

//   stopAutoScroll(): void {
//     if (this.scrollInterval) {
//       clearInterval(this.scrollInterval);
//     }
//   }

//   // ------------------------- SCROLL HELPERS -------------------------
//   lastScrollTop: number = 0;
//   isScrollingDown: boolean = false;

//   @HostListener('window:scroll', [])
//   @ViewChild('feedContainer') feedContainer!: ElementRef;
//   onWindowScroll(): void {
//     const scrollY = window.scrollY || document.documentElement.scrollTop;
//     this.showScrollTop = scrollY > 300; // Show button after 300px scroll
//   }



//   scrollToTop(): void {
//     if (!this.feedContainer) return;
//     this.feedContainer.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
//   }

//   private checkScroll(): void {
//     const scrollTop = this.feedContainer?.nativeElement.scrollTop || 0;
//     this.showScrollTop = scrollTop > 300; // show button after 300px
//   }

//   // ------------------------ POST ACTIONS ------------------------
//   printCV() {
//     const dialogConfig = new MatDialogConfig();
//     dialogConfig.disableClose = true;
//     dialogConfig.autoFocus = true;
//     dialogConfig.width = '100%';
//     dialogConfig.height = '600px';
//     const dialogRef = this.dialog.open(PrintCVComponent, dialogConfig);
//     dialogRef.afterClosed().subscribe(result => {
//       if (result) { /* no-op for now */ }
//     });
//   }

//   uploadPic(): void {
//     const dialogConfig = new MatDialogConfig();
//     dialogConfig.disableClose = true;
//     dialogConfig.autoFocus = true;
//     dialogConfig.width = '400px';
//     const dialogRef = this.dialog.open(UploadProfileComponent, dialogConfig);
//     dialogRef.afterClosed().subscribe(result => {
//       if (result) { /* no-op for now */ }
//     });
//   }

//   hideReactions() {
//     this.showReactionsFor = null;
//     this.hoveredReaction = null;
//   }

//   menuRef(index: number): string {
//     return `menu-${index}`;
//   }

//   onEditPost() { /* implement if needed */ }

//   onDelete(post: any): void {
//     this.alert.popupWarning("", "Are you sure you want to delete this post?").then((result: any) => {
//       if (result?.value) {
//         this.isLoading = true;
//         this.postDataservices.deletePost(post.posts_uuid).subscribe({
//           next: (res: any) => {
//             if (res.success === true) {
//               this.alert.toastrSuccess(res.message);
//             } else {
//               this.alert.toastrError(res.message);
//             }
//             this.loadUserPost();
//             this.isLoading = false;
//           },
//           error: (error: any) => {
//             this.alert.toastrError(error.error?.message || "An error occurred while deleting the post.");
//             this.isLoading = false;
//           }
//         });
//       }
//     });
//   }

//   // ----------------------- COMMENTS & REPLIES -----------------------
//   addReply(comment: any): void {
//     const replyText = comment.newReply?.trim();
//     if (!replyText) return;

//     comment.isSubmitting = true;
//     const payload = { comment: replyText };

//     this.comment.postCommentByReply(comment.comment_uuid, payload).subscribe({
//       next: () => {
//         comment.replies = comment.replies || [];
//         comment.replies.push({
//           user: 'Current User',
//           comment: replyText,
//           profile_pic: '',
//           likes: 0,
//           replies: []
//         });
//         comment.newReply = '';
//         comment.isSubmitting = false;
//       },
//       error: (err) => {
//         comment.isSubmitting = false;
//         this.alert.toastPopUpError("Comment failed");
//       }
//     });
//   }

//   likeComment(comment: any) {
//     comment.likes = (comment.likes || 0) + 1;
//   }
//   commentText: string = '';

//   sendComment() {
//     if (this.commentText.trim()) {
//       console.log('Comment:', this.commentText);
//       this.commentText = '';
//     }
//   }
//   addReply2(postId: number, commentId: number) {
//     const post = this.posts.find(p => p.id === postId);
//     const comment = post?.comments.find((c: { id: number; }) => c.id === commentId);
//     if (comment && comment.newReply?.trim()) {
//       comment.replies.push({
//         userName: 'You',
//         userAvatar: 'assets/images/user-avatar.png',
//         text: comment.newReply
//       });
//       comment.newReply = '';
//       comment.showReply = false;
//     }
//   }

//   startEdit(reply: any) {
//     reply.isEditing = true;
//     reply.editText = reply.comment;
//   }

//   cancelEdit(reply: any) {
//     reply.isEditing = false;
//   }

//   saveEdit(reply: any) {
//     reply.comment = reply.editText;
//     reply.isEditing = false;
//     // Optionally call backend to persist edits
//   }

//   // ------------------- REACTION HELPERS (UUID) -------------------
//   saveReactionToDatabase(post_uuidOrUuid: any, reaction: string): void {
//     const payload = { reaction };
//     this.reactionService.putReactionInvidual(post_uuidOrUuid, payload).subscribe({
//       next: (res) => {
//         console.log('✅ Reaction response:', res);
//         this.getReactionPost_uuidOrUuid(post_uuidOrUuid);
//       },
//       error: () => {
//         this.errorMsg();
//       }
//     });
//   }

//   showReactionsFor: number | null = null;
//   showReactionss(post: any) {
//     this.showReactionsFor = post.posts_uuid;
//   }

//   reactionsMap: any = [];
//   getReactionPost_uuidOrUuid(post_uuidOrUind: any): void {
//     const currentUserCode = this.authService.getAuthCode();

//     this.reactionService.getReactionPost_uuidOrUuid(post_uuidOrUind).subscribe({
//       next: (res) => {
//         this.reactionList = res.reaction || [];
//         this.totalReactionsCount = res.count || 0;

//         this.displayedReactions = this.reactionList
//           .slice(0, 5)
//           .map((r: { reaction: any; count: any; person: any; }, i: any) => {
//             const reactionMeta = this.reactions.find(e => e.reaction === r.reaction);
//             return {
//               name: r.reaction,
//               count: r.count,
//               emoji: reactionMeta?.emoji || '',
//               index: i,
//               users: r.person || []
//             };
//           });

//         this.selectedReaction = this.displayedReactions.find(r =>
//           r.users.some((u: any) => u.code === Number(currentUserCode))
//         ) || null;
//       },
//       error: () => {
//         this.errorMsg();
//       }
//     });
//   }

//   peopleRecentActivity: any = [];
//   getPeopleRecentActivity(): void {
//     if (this.isLoading) return;

//     this.currentUserCode = this.authService.getAuthCode();

//     this.clientsService.getPeopleRecentActivity().subscribe({
//       next: (res) => {
//         this.users = res.data;
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error('Error loading suggestions:', err);
//         this.alert.toastrError('❌ Failed to load suggestions.');
//         this.isLoading = false;
//       }
//     });
//   }

//   loadClients(): void {
//     this.clientsService.getPeopleRecentActivity().subscribe({
//       next: (res) => {
//         this.users = res.data;
//         console.log(this.users);
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error('Error loading users:', err);
//         this.isLoading = false;
//       }
//     });
//   }

//   errorMsg() {
//     this.alert.toastrError('❌ Error updating reaction:');
//   }

//   AddConnect(code: string, fullName: string, follow_status: string, id: number): void {
//     if (!code) {
//       this.alert.toastrWarning('⚠️ No user code provided.');
//       return;
//     }

//     const currentStatus = follow_status || 'none';
//     let confirmMessage = '';
//     let successAction = '';

//     switch (currentStatus) {
//       case 'not_following':
//         confirmMessage = 'Send a follow request to this user?';
//         successAction = 'Follow request sent.';
//         break;
//       case 'pending':
//         confirmMessage = 'Cancel your pending follow request?';
//         successAction = 'Follow request canceled.';
//         break;
//       case 'accepted':
//         confirmMessage = 'Unfollow this user?';
//         successAction = 'Unfollowed successfully.';
//         break;
//       default:
//         confirmMessage = 'Send a follow request to this user?';
//         successAction = 'Follow request sent.';
//     }

//     this.alert.popupWarning(fullName, confirmMessage).then((result) => {
//       if (result.value) {
//         const action$ = currentStatus === 'accepted'
//           ? this.profile.Unfollow(id)
//           : this.profile.AddFollow(code);

//         action$.subscribe({
//           next: (res) => {
//             if (res.status === true || res.success === true) {
//               this.alert.toastrSuccess(successAction);
//               this.getPeopleRecentActivity();
//             } else {
//               this.alert.toastrError(res.message || 'Action failed.');
//             }
//           },
//           error: (err) => {
//             this.alert.toastrError(err.error?.message || 'Something went wrong.');
//             console.error(err);
//           }
//         });
//       }
//     });
//   }

//   // ----------------- TOOLTIP MOUSE HANDLING -----------------
//   tooltipVisible = false;
//   tooltipPosition = { x: 0, y: 0 };

//   showReactionTooltip(postId: number, event: MouseEvent) {
//     const reactionData = this.postReactions[postId];
//     if (reactionData && reactionData.reactions) {
//       this.hoveredReactions2 = reactionData.reactions;
//       this.tooltipVisible = true;
//       this.tooltipPosition = {
//         x: event.pageX + 10,
//         y: event.pageY + 10
//       };
//     }
//   }

//   hideReactionTooltip() {
//     this.tooltipVisible = false;
//   }

//   // -------------------- SANITIZE --------------------
//   sanitizeVideoUrl(url: string): SafeResourceUrl {
//     if (!url) return '';
//     return this.sanitizer.bypassSecurityTrustResourceUrl(url);
//   }

//   // -------------------- UTILITY / DEBUG --------------------
//   get totalReactions(): number {
//     return this.reactionsData?.react?.reduce((sum: number, r: any) => sum + r.count, 0) || 0;
//   }

//   @Input() reactionsData: any;

//   getTooltipText(reaction: any) {
//     return reaction.person.map((p: any) => p.fullname).join(', ');
//   }

//   // ensure postReactions map exists
//   postReactions: {
//     [postId: number]: { reactions: any[], totalCount: number }
//   } = {};

//   // -------------------- END --------------------
// }

import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ViewChildren, ElementRef, QueryList, HostListener, Input, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, Subscription, Subject, of } from 'rxjs';
import { takeUntil, catchError, finalize, switchMap, map } from 'rxjs/operators';

import { PrintCVComponent } from 'src/app/ComponentSharedUI/Individual/print-cv/print-cv.component';
import { UploadProfileComponent } from 'src/app/ComponentSharedUI/Individual/upload-profile/upload-profile.component';
import { PostUIComponent } from 'src/app/ComponentSharedUI/Public/post-ui/post-ui.component';
import { ImageModalComponent } from '../../Modal/image-modal/image-modal.component';
import { ReactionPostComponent } from 'src/app/ComponentSharedUI/ReactionEmoji/reaction-post/reaction-post.component';

import { ProfileService } from 'src/app/services/Profile/profile.service';
import { CurriculumVitaeService } from 'src/app/services/CV/curriculum-vitae.service';
import { PostUploadImagesService } from 'src/app/services/post-upload-images.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { CommentService } from 'src/app/services/comment/comment.service';
import { ReactionEmojiService } from 'src/app/services/Reaction/reaction-emoji.service';
import { PostReactionByIdService } from 'src/app/services/Reaction/post-reaction-by-id.service';
import { ClientsService } from 'src/app/services/Networking/clients.service';
import { EchoService } from 'src/app/services/echo.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatMenuPanel } from '@angular/material/menu';
import { CommentModalUIComponent } from '../../Modal/comment-modal-ui/comment-modal-ui.component';

interface Reaction { emoji: string; label: string }

@Component({
  selector: 'app-private-post',
  templateUrl: './private-post.component.html',
  styleUrls: ['./private-post.component.css']
})
export class PrivatePostComponent implements OnInit, AfterViewInit, OnDestroy {
  error: string;
  deletePost(_t30: any) {
    throw new Error('Method not implemented.');
  }
  // Inputs & ViewChildren
  @Input() postId!: number;
  @ViewChild('feedContainer') feedContainer!: ElementRef;
  @ViewChildren('videoEl') videoElements!: QueryList<ElementRef<HTMLVideoElement>>;

  // State
  posts: any[] = [];
  profiles: any;
  profile_pic: any = null;
  users: any[] = [];
  isLoading = false;

  // Pagination / infinite scroll
  page = 1;
  perPage = 5;
  allLoaded = false;

  // reactions
  postReactions: {
    [postId: number]: { reactions: any[], totalCount: number }
  } = {};

  userReactions: { [postId: number]: Reaction | null } = {};
  isPopupVisible: { [postId: number]: boolean } = {};

  // realtime
  private destroy$ = new Subject<void>();
  private echoSub?: Subscription;
  newPostsQueue: any[] = [];
  newPostsAvailable = false;

  // intersection observer for autoplay
  private observer?: IntersectionObserver;

  // constants
  private baseUrl = 'https://exploredition.com/';
  private defaultProfile = `${this.baseUrl}storage/app/public/uploads/DEFAULTPROFILE/DEFAULTPROFILE.png`;
  menu_: MatMenuPanel<any>;
  code:any; 

  hoveredReactions: { [postId: number]: Reaction | null } = {};

  reaction = [
    { emoji: '👍', label: 'Like' },
    { emoji: '❤️', label: 'Love' },
    { emoji: '😂', label: 'Haha' },
    { emoji: '😮', label: 'Wow' },
    { emoji: '😢', label: 'Sad' },
    { emoji: '😡', label: 'Angry' }
  ];

  // DI
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private cvService: CurriculumVitaeService,
    private postService: PostUploadImagesService,
    private authService: AuthService,
    private alert: NotificationsService,
    private commentService: CommentService,
    private reactionService: ReactionEmojiService,
    private postReactionByIdService: PostReactionByIdService,
    private clientsService: ClientsService,
    private echoService: EchoService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private postDataservices: PostUploadImagesService,
  ) {
    const url = window.location.href;
    const codesplit = url.split('/').pop();
    this.code = codesplit;
   }

  /* --------------------------- lifecycle --------------------------- */
  ngOnInit(): void {
    this.initRealtime();
    this.loadInitialData();
    this.loadProfileCV();
  }

  
  loadProfileCV() {
    this.profileService.getProfileByUser(this.code).subscribe({
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


  ngAfterViewInit(): void {
    this.setupAutoPlayObserver();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.echoSub?.unsubscribe();
    if (this.observer) this.observer.disconnect();
  }

  /* --------------------------- initial loaders --------------------------- */
  private loadInitialData(): void {
    this.isLoading = true;
    const calls = {
      profile: this.profileService.getProfileByUserOnly().pipe(catchError(() => of(null))),
      cv: this.cvService.getDataCV().pipe(catchError(() => of(null))),
      people: this.clientsService.getPeopleRecentActivity().pipe(catchError(() => of([]))),
      posts: this.postService.getDataPost(this.route.snapshot.paramMap.get('code') || window.location.href.split('/').pop())
        .pipe(catchError(() => of({ success: false, data: [] })))
    } as any;

    forkJoin(calls)
      .pipe(finalize(() => { this.isLoading = false; this.cdr.markForCheck(); }))
      .subscribe((res: any) => {
        if (res.profile?.success) this.profiles = res.profile.message;
        if (res.cv?.message) this.profile_pic = res.cv.message;
        if (res.people?.data) this.users = res.people.data;

        if (res.posts?.success && Array.isArray(res.posts.data)) {
          this.posts = res.posts.data.map((p: any) => this.formatPost(p));
          // batch load reactions to reduce HTTP overhead
          this.loadReactionsBatch(this.posts.map(p => p.id));
        }
      }, err => {
        console.error('Initial load error', err);
      });
  }

  /* --------------------------- format helpers --------------------------- */
  private sanitizePath(path?: string): string { return (path || '').replace(/\\/g, ''); }
  private normUrl(path?: string): string { return this.baseUrl + this.sanitizePath(path); }

  private formatPost(post: any): any {
    return {
      ...post,
      fullname: post.fullname || post.Fullname || 'Unknown User',
      profile_pic: post.profile_pic ? this.normUrl(post.profile_pic) : this.defaultProfile,
      images: (post.images || []).map((i: any) => ({ ...i, path_url: this.normUrl(i.path_url) })),
      videos: (post.videos || []).map((v: any) => ({ ...v, path_url: this.normUrl(v.path_url) })),
      comments: (post.comments || []).map((c: any) => this.formatComment(c)),
      activeHours: this.getActiveHours(post.lastActive),
      visibleComments: 3,
      expanded: false
    };
  }

  private formatComment(c: any): any {
    return {
      ...c,
      profile_pic: c.profile_pic ? this.normUrl(c.profile_pic) : this.defaultProfile,
      replies: (c.replies || []).map((r: any) => this.formatComment(r))
    };
  }

  getActiveHours(lastActive: string): string {
    if (!lastActive) return 'unknown';
    const diff = Math.floor((Date.now() - new Date(lastActive).getTime()) / (1000 * 60 * 60));
    if (diff < 1) return 'Just now';
    return diff === 1 ? '1 hour ago' : `${diff} hours ago`;
  }

  /* --------------------------- reactions --------------------------- */
  private loadReactionsBatch(postIds: number[]): void {
    if (!postIds || postIds.length === 0) return;

    // create array of observables
    const calls = postIds.map(id => this.reactionService.getReactionByPostId(id).pipe(
      catchError(err => {
        console.error('Reaction fetch error for', id, err);
        return of({ react: [] });
      })
    ));

    forkJoin(calls).pipe(takeUntil(this.destroy$)).subscribe(results => {
      results.forEach((res: any, idx: number) => {
        const id = postIds[idx];
        if (res && Array.isArray(res.react)) {
          const mapped = res.react.map((r: any) => ({ ...r, emoji: this.reactionEmojiFor(r.reaction) }));
          const total = mapped.reduce((s: number, x: any) => s + (x.count || 0), 0);
          this.postReactions[id] = { reactions: mapped, totalCount: total };
        } else {
          this.postReactions[id] = { reactions: [], totalCount: 0 };
        }
      });
    }, err => console.error('Batch reaction error', err));
  }

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

  // on-demand single reaction load (lazy)
  totalReactionsCount: number = 0;
  loadReactions(postId: number): void {
    if (!postId) return;

    this.reactionService.getReactionByPostId(postId).subscribe({
      next: (res: any) => {
        if (res && res.react && Array.isArray(res.react)) {
          const mappedReactions = res.react.map((r: any) => ({
            ...r,
            emoji: this.reactionEmojiMap2[r.reaction] || 'thumb'
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


  private reactionEmojiFor(name: string): string {
    const map: any = { Like: '👍', Love: '❤️', Care: '🤗', Haha: '😂', Wow: '😮', Sad: '😢', Angry: '😡' };
    return map[name] || '👍';
  }

  // selecting reaction (saves and reloads reactions for that post)
  async selectReactions(postId: number, react: any) {
    this.userReactions[postId] = react;
    this.isPopupVisible[postId] = false;
    console.log(`Selected reaction for post ${postId}:`, react.label);

    try {
      const res: any = await this.postReactionByIdService.saveReaction(postId, react.label).toPromise();
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

  /* --------------------------- posts (pagination / refresh) --------------------------- */
  refreshFeed(): void {
    this.page = 1;
    this.allLoaded = false;
    this.loadMorePosts(false);
  }

  loadMorePosts(append = true): void {
    if (this.isLoading || this.allLoaded) return;
    this.isLoading = true;

    this.postService.getDataPost(this.route.snapshot.paramMap.get('code') || window.location.href.split('/').pop())
      .pipe(finalize(() => { this.isLoading = false; this.cdr.markForCheck(); }))
      .subscribe((res: any) => {
        if (res?.success && Array.isArray(res.data)) {
          const formatted = res.data.map((p: any) => this.formatPost(p));
          this.posts = append ? [...this.posts, ...formatted] : formatted;
          // load reactions for newly added posts lazily
          const ids = formatted.map((p: { id: any; }) => p.id);
          this.loadReactionsBatch(ids);
        } else {
          if (!append) this.posts = [];
        }
      }, err => {
        console.error('Error loading posts', err);
      });
  }

  /* --------------------------- comments --------------------------- */
  addComment(post: any): void {
    const text = (post.newComment || '').trim();
    if (!text) return;
    post.isSubmitting = true;

    this.commentService.postComment(post.posts_uuid, { comment: text }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        post.comments = post.comments || [];
        post.comments.push({ user: 'You', comment: text, profile_pic: '', replies: [] });
        post.newComment = '';
        post.isSubmitting = false;
      },
      error: (err) => {
        post.isSubmitting = false;
        console.error('Comment error', err);
        this.alert.toastPopUpError('Comment failed');
      }
    });
  }

  addReply(comment: any): void {
    const text = (comment.newReply || '').trim();
    if (!text) return;
    comment.isSubmitting = true;

    this.commentService.postCommentByReply(comment.comment_uuid, { comment: text }).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        comment.replies = comment.replies || [];
        comment.replies.push({ user: 'You', comment: text, profile_pic: '' });
        comment.newReply = '';
        comment.isSubmitting = false;
      },
      error: (err) => {
        comment.isSubmitting = false;
        console.error('Reply error', err);
        this.alert.toastPopUpError('Reply failed');
      }
    });
  }

  /* --------------------------- UI helpers / modals --------------------------- */
  openModal(images: any[]): void {
    const dialogRef = this.dialog.open(ImageModalComponent, { data: images, width: '90%', maxWidth: '1200px' });
    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(res => { if (res) this.refreshFeed(); });
  }

  
  showReaction(postId: number) {
    this.isPopupVisible[postId] = true;
  }
  getReactionEmoji(postId: number): string {
    return this.hoveredReactions[postId]?.emoji
      || this.userReactions[postId]?.emoji
      || 'thumb_up';
  }

  getReactionLabel(postId: number): string {
    return this.hoveredReactions[postId]?.label
      || this.userReactions[postId]?.label
      || 'Like';
  }

  openCommentModal(post: any): void {
    this.dialog.open(CommentModalUIComponent, {
      width: '800px',
      data: post,
    });
  }

  hideReaction(postId: number) {
    this.isPopupVisible[postId] = false;
    this.hoveredReactions[postId] = null;
  }
  openReactionsModal(postId: number): void {
    this.dialog.open(ReactionPostComponent, { data: postId, width: '100%', maxWidth: '600px', panelClass: 'centered-modal' });
  }

  createPost(): void {
    const dialogRef = this.dialog.open(PostUIComponent, { width: '600px', disableClose: true });
    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(() => this.refreshFeed());
  }

  toggleComments(post: any): void { post.showComments = !post.showComments; }

  trackByPostId(_: number, p: any) { return p.id; }

  /* --------------------------- realtime --------------------------- */
  private initRealtime(): void {
    this.echoSub = this.echoService.newPost$.pipe(takeUntil(this.destroy$)).subscribe(post => {
      if (!post) return;
      this.newPostsQueue.unshift(this.formatPost(post));
      this.newPostsAvailable = true;
    });
  }

  prependNewPosts(): void {
    if (this.newPostsQueue.length === 0) return;
    this.posts = [...this.newPostsQueue, ...this.posts];
    this.newPostsQueue = [];
    this.newPostsAvailable = false;
  }

  /* --------------------------- video autoplay --------------------------- */
  private setupAutoPlayObserver(): void {
    try {
      this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const el = entry.target as HTMLVideoElement;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            // pause all others
            this.videoElements.forEach(v => { try { v.nativeElement.pause(); } catch { } });
            el.play().catch(() => { });
          } else {
            el.pause();
          }
        });
      }, { threshold: [0.6] });

      // observe current videos
      setTimeout(() => this.videoElements.forEach(v => this.observer?.observe(v.nativeElement)), 200);
    } catch (err) { console.warn('Observer not available', err); }
  }

  /* --------------------------- misc --------------------------- */
  sanitizeVideoUrl(url: string): SafeResourceUrl { return this.sanitizer.bypassSecurityTrustResourceUrl(url || ''); }

  // hover tooltip state
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




  onEditPost(post: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = post;
    const dialogRef = this.dialog.open(PostUIComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      this.loadMorePosts(post.id);
    });
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
            this.loadMorePosts(post.id);
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



}

