import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProfileService } from 'src/app/services/Profile/profile.service';
import { UploadProfileComponent } from '../../Individual/upload-profile/upload-profile.component';
import { UserCVComponent } from '../../Individual/user-cv/user-cv.component';
import { UserProfileUiComponent } from '../../Individual/user-profile-ui/user-profile-ui.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGuard } from 'src/app/AuthGuard/auth.guard';
import { PostUploadImagesService } from 'src/app/services/post-upload-images.service';
import { CommentService } from 'src/app/services/comment/comment.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { ImageModalComponent } from 'src/app/ComponentUI/Modal/image-modal/image-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { ClientsService } from 'src/app/services/Networking/clients.service';
@Component({
  selector: 'app-company-profile-ui',
  templateUrl: './company-profile-ui.component.html',
  styleUrls: ['./company-profile-ui.component.css']
})
export class CompanyProfileUIComponent implements OnInit {

  error: any;
  profiles: any;
  users: any;
  btnCurriculum: boolean = false;
  isUserOnline: boolean = false;
  code: any;
  posts: any[] = [];
  followers: any;
  activeHours: any;

  modalOpen = false;
  currentPage = 0;
  pageSize = 6;
  newComment = '';
  currentIndex = 0;
  maxImages: number = 3;



  constructor(
    private profile: ProfileService, public dialog: MatDialog,
    private route: ActivatedRoute, private authService: AuthGuard, private authServiceCode: AuthService,
    private postDataservices: PostUploadImagesService, private comment: CommentService,
    private alert: NotificationsService, private clientServices: ClientsService, private router: Router,

  ) { }


  get pagedImages() {
    const start = this.currentPage * this.pageSize;
    return this.posts.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.posts.length / this.pageSize);
  }

  openModal(image: any): void {
    const dialogRef = this.dialog.open(ImageModalComponent, {
      data: image,
      minWidth: '70%',
      maxWidth: '90%',
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadUserPost();
    });

  }


  closeModal(): void {
    this.modalOpen = false;
  }

  changeSlide(direction: number): void {
    const total = this.posts.length;
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
    const caption = this.posts[index]?.caption || ''; // Use an empty string if undefined or null
    return caption.split(' ').slice(0, 10).join(' ') + (caption.split(' ').length > 10 ? '...' : '');
  }

  currentUserCode: any;
  isloading: boolean = false;
  coverSkeleton = Array(3);
  profileSkeleton = Array(1);



  companyId!: string;
  ngOnInit(): void {
    this.currentUserCode = this.authServiceCode.getAuthCode();
    this.companyId = this.route.snapshot.paramMap.get('code') || '';

    this.route.paramMap.subscribe(params => {
      const code = params.get('code');
      if (code) {
        this.loadProfileCV(code);
      }
    });

    this.loadUserPost();
    this.loadUserData();
    //this.loadProfileCV();

    this.checkFollowStatus();
  }


  followId: number = 0;
  checkFollowStatus() {
    this.clientServices.getPendingFollowStatus(this.currentUserCode).subscribe((res: any) => {
      this.followStatus = res.follow_status || 'none';

      if (res.data && res.data.length > 0) {
        const followRecord = res.data[0]; // get the first match
        this.followId = followRecord.id;  // 👈 store the follow ID (e.g., 142)
      } else {
        this.followId = 0;
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
  sendReactionToServer(postId: string, reaction: any) {
    console.log(`✅ Sent reaction '${reaction.name}' for post ID: ${postId}`);
    // TODO: Use HttpClient or service here
    // this.api.sendReaction(postId, reaction).subscribe(...)
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
    this.isloading = true; // start skeleton

    this.postDataservices.getDataPost(this.companyId).subscribe({
      next: (res) => {
        if (res && res.success && Array.isArray(res.data)) {
          this.posts = res.data.map((post: any) => {
            // ✅ Fix image URLs
            const images = (post.images || []).map((img: any) => ({
              ...img,
              path_url: 'https://lightgreen-pigeon-122992.hostingersite.com/' +
                img.path_url.replace(/\\/g, '')
            }));

            // ✅ Fix video URLs
            const videos = (post.videos || []).map((vid: any) => ({
              ...vid,
              path_url: 'https://lightgreen-pigeon-122992.hostingersite.com/' +
                vid.path_url.replace(/\\/g, '')
            }));

            // ✅ Fix comments & replies
            const comments = (post.comments || []).map((comment: any) => ({
              ...comment,
              profile_pic: comment.profile_pic
                ? comment.profile_pic.replace(/\\/g, '')
                : 'https://lightgreen-pigeon-122992.hostingersite.com/storage/app/public/uploads/DEFAULTPROFILE/DEFAULTPROFILE.png',
              replies: (comment.replies || []).map((reply: any) => ({
                ...reply,
                profile_pic: reply.profile_pic
                  ? reply.profile_pic.replace(/\\/g, '')
                  : 'https://lightgreen-pigeon-122992.hostingersite.com/storage/app/public/uploads/DEFAULTPROFILE/DEFAULTPROFILE.png'
              }))
            }));

            return {
              ...post,
              fullname: post.fullname || post.Fullname || "Unknown User",
              profile_pic: post.profile_pic
                ? post.profile_pic.replace(/\\/g, '')
                : 'https://lightgreen-pigeon-122992.hostingersite.com/storage/app/public/uploads/DEFAULTPROFILE/DEFAULTPROFILE.png',
              images,
              videos,
              comments,
              activeHours: this.getActiveHours(post.lastActive), // if backend sends lastActive
              followers: post.followers || 0,
              visibleComments: 3
            };
          });
        }
        this.isloading = false; // ✅ stop skeleton after success
      },
      error: (err) => {
        console.error('Error fetching posts:', err);
        this.isloading = false; // ✅ stop skeleton on error too
      }
    });
  }



  // loadUserPost(): void {
  //   this.postDataservices.getDataPost(this.code).subscribe(
  //     (data) => {
  //       if (data && Array.isArray(data)) {
  //         this.posts = data.map(post => ({
  //           ...post,
  //           activeHours: this.getActiveHours(post.lastActive),
  //           followers: post.followers || 0,
  //           visibleComments: 3, 
  //         }));
  //            this.posts.forEach(post => {
  //           if (post.path_url && post.path_url.length > 0) {
  //             post.path_url.forEach((image: { path_url: string; }) => {
  //               image.path_url = 'https://lightgreen-pigeon-122992.hostingersite.com/' + image.path_url.replace(/\\/g, '');
  //             });
  //           }
  //         });


  //       }

  //     },
  //     (error) => console.error('Error fetching posts:', error)
  //   );
  // }

  likeComment(comment: any) {
    comment.likes = (comment.likes || 0) + 1;
  }

  //reply comment
  addReply(comment: any): void {
    const replyText = comment.newReply?.trim();
    if (!replyText) return;

    comment.isSubmitting = true;

    const payload = {
      comment: replyText
    };

    console.log(payload);

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
  loadMoreComments(post: any): void {
    post.visibleComments += 3;
  }

  loadProfileCV(code: string) {
    console.log("code: ", code)
    this.profile.getCompanyProfile(code).subscribe({
      next: (res) => {
        if (res.success == true) {
          this.profiles = res.message;

        } else {
          this.error = 'Failed to load profile data';
        }
      },
      error: (err) => {
        this.error = err.message || 'An error occurred while fetching profile data';
      },
    });
  }

  UserCV() {
    this.router.navigateByUrl("/user-cv")
  }

  // UserCV() {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;
  //   dialogConfig.width = '1000px';
  //   dialogConfig.height = '690px';
  // //  dialogConfig.data = element || null; // Pass user data

  //   const dialogRef = this.dialog.open(UserProfileUiComponent, dialogConfig);

  //   dialogRef.afterClosed().subscribe(() => {

  //   });
  // }

  // UserCV() {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;
  //   dialogConfig.width = '980px';
  // //  dialogConfig.data = element || null; // Pass user data

  //   const dialogRef = this.dialog.open(UserCVComponent, dialogConfig);

  //   dialogRef.afterClosed().subscribe(() => {

  //   });
  // }


  loadUserData() {
    this.profile.getProfileByUserOnly().subscribe({
      next: (response) => {
        if (response.success == true) {
          this.users = response.message[0]; // Access the first item in the message array
        } else {
          this.error = 'Failed to load profile data';
        }
      },
      error: (err) => {
        this.error = err.message || 'An error occurred while fetching profile data';
      },
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
        // this.getRoles(); // Refresh the table after dialog closure
      }
    });
  }

  toggleComments(post: any): void {
    post.showComments = !post.showComments;
  }



  addComment(post: any): void {
    const commentText = post.newComment?.trim();
    if (!commentText) return;
    post.isSubmitting = true;

    const payload = {
      comment: commentText
    };

    this.comment.postComment(post.posts_uuid, payload).subscribe({
      next: () => {
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


  likePost(post: any): void {
    if (!post.liked) {
      post.likes = (post.likes || 0) + 1; // Increment likes
    } else {
      post.likes = Math.max((post.likes || 1) - 1, 0); // Decrement likes, but not below zero
    }
    post.liked = !post.liked; // Toggle liked state

    // Call API to update like status in the backend
    this.postDataservices.likePost(post.id, post.liked).subscribe(
      (response) => {
        console.log('✅ Like status updated successfully:', response);
      },
      (error) => {
        console.error('❌ Error updating like status:', error);
      }
    );
  }

  followStatus: 'none' | 'pending' | 'accepted' | 'cancelled' = 'none';
  AddFollow(code: any, status: string, profilename: any, lname: any): void {
    if (!code) {
      this.alert.toastrWarning('⚠️ No user code provided.');
      return;
    }

    const fullname = profilename + " " + lname;

    let confirmMessage = '';
    let successAction = '';

    if (status === 'none') {
      confirmMessage = 'Send a follow request to this user?';
      successAction = 'Follow request sent.';
    } else if (status === 'pending') {
      confirmMessage = 'Cancel your pending follow request?';
      successAction = 'Follow request canceled.';
    } else if (status === 'accepted') {
      confirmMessage = 'Unfollow this user?';
      successAction = 'Unfollowed successfully.';
    }
    console.log(this.followId)
    this.alert.popupWarning(fullname, confirmMessage).then((result) => {
      if (result.value) {
        const request$ =
          status === 'accepted'
            ? this.profile.Unfollow(this.followId) // 👈 call different API for unfollow
            : this.profile.AddFollow(code); // 👈 default follow/cancel

        request$.subscribe({
          next: (res: any) => {
            if (res.success === true || res.status === true) {
              this.alert.toastrSuccess(res.message || successAction);
              this.followStatus = res.follow_status || 'none';
              this.checkFollowStatus();
            } else {
              this.alert.toastrError(res.message || 'Action failed.');
            }
          },
          error: (error: any) => {
            this.alert.toastrError(error.error?.message || 'Something went wrong.');
            console.error('❌ Follow error:', error);
          }
        });
      }
    });
  }


  onCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Show preview instantly
    const reader = new FileReader();
    reader.onload = () => {
      this.profiles.coverPhoto = reader.result as string;
    };
    reader.readAsDataURL(file);

    // Optional: upload to backend
    const formData = new FormData();
    formData.append('cover_photo', file);
    formData.append('user_code', this.currentUserCode);

    this.isloading = true;

    // this.http.post('/api/upload-cover', formData).subscribe({
    //   next: (res: any) => {
    //     console.log('Cover photo updated successfully');
    //     this.isloading = false;
    //   },
    //   error: (err) => {
    //     console.error('Error uploading cover photo', err);
    //     this.isloading = false;
    //   },
    // });
  }


  // AddFollow(code: any, status: string, profilename:any,lname:any): void {
  //   if (!code) {
  //     this.alert.toastrWarning('⚠️ No user code provided.');
  //     return;
  //   }

  //   let confirmMessage = '';
  //   let successAction = '';

  //   if (status === 'none') {
  //     confirmMessage = 'Send a follow request to this user?';
  //     successAction = 'Follow request sent.';
  //   } else if (status === 'pending') {
  //     confirmMessage = 'Cancel your pending follow request?';
  //     successAction = 'Follow request canceled.';
  //   } else if (status === 'accepted') {
  //     confirmMessage = 'Unfollow this user?';
  //     successAction = 'Unfollowed successfully.';
  //   }
  //   const fullname = profilename + " " + lname;
  //   this.alert.popupWarning(fullname, confirmMessage).then((result) => {
  //     if (result.value) {
  //       this.profile.AddFollow(code).subscribe({
  //         next: (res) => {
  //           if (res.success === true || res.status === true) {
  //             this.alert.toastrSuccess(res.message || successAction);

  //             // Update follow status dynamically
  //             this.followStatus = res.follow_status || 'none';
  //             this.checkFollowStatus();
  //           } else {
  //             this.alert.toastrError(res.message || 'Action failed.');
  //           }
  //         //  this.isLoading = false;
  //         },
  //         error: (error) => {
  //           this.alert.toastrError(error.error?.message || 'Something went wrong.');
  //           console.error('❌ Follow error:', error);
  //          // this.isLoading = false;
  //         }
  //       });
  //     }
  //   });
  // }

  // AddFollow(code: any): void {

  //     this.alert.popupWarning(code," "+"Are you sure to delete this role?").then((result) => {
  //       if (result.value) 
  //       {
  //         this.profile.AddFollow(code).subscribe({
  //             next:(res)=>{
  //               if(res.success === true)
  //                 {
  //                   this.alert.toastrSuccess(res.message);
  //                   this.isLoading = false;
  //                 }
  //                 else{
  //                   this.notificationsService.toastrError(res.message);
  //                   this.isLoading = false;
  //                 }
  //                 this.getRoles();
  //             },
  //             error:(error)=>{
  //               this.notificationsService.toastrError(error.error);
  //               this.isLoading = false;
  //             }

  //         });
  //       }

  //   if (!code) {
  //     this.alert.toastrWarning('⚠️ No user code provided for follow request.');
  //     return;
  //   }

  //   this.profile.AddFollow(code).subscribe({
  //     next: (res) => {
  //       if(res.status == true)      
  //         this.alert.toastrSuccess(res.message);

  //         this.followStatus = res.follow_status;
  //            console.log(this.followStatus)
  //         this.checkFollowStatus();
  //     },
  //     error: (error: any) => {
  //       this.alert.toastrError('Failed to follow user.');
  //       console.error('❌ Error updating follow status:', error);
  //     }
  //   });

  // }



}
