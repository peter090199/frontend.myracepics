import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from 'src/app/services/Profile/profile.service';
import { UploadProfileComponent } from '../../Individual/upload-profile/upload-profile.component';
import { ImageModalComponent } from 'src/app/ComponentUI/Modal/image-modal/image-modal.component';
import { PostUploadImagesService } from 'src/app/services/post-upload-images.service';
import { CommentService } from 'src/app/services/comment/comment.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { AuthGuard } from 'src/app/AuthGuard/auth.guard';
import { AuthService } from 'src/app/services/auth.service';
import { ClientsService } from 'src/app/services/Networking/clients.service';
import { CurriculumVitaeService } from 'src/app/services/CV/curriculum-vitae.service';

@Component({
  selector: 'app-company-profile-ui',
  templateUrl: './company-profile-ui.component.html',
  styleUrls: ['./company-profile-ui.component.css']
})
export class CompanyProfileUIComponent implements OnInit {

  users: any;
  profiles: any;
  userprofiles: any;
  posts: any[] = [];
  followers: any;

  companyId!: string;
  currentUserCode: any;
  followId: number = 0;
  followStatus: 'none' | 'pending' | 'accepted' | 'cancelled' = 'none';

  isloading = false;
  btnCurriculum = false;
  modalOpen = false;
  currentPage = 0;
  pageSize = 6;
  currentIndex = 0;

  readonly maxImages = 3;
  readonly coverSkeleton = Array(3);
  readonly profileSkeleton = Array(1);

  reactions = [
    { name: 'Like', emoji: '👍' },
    { name: 'Love', emoji: '❤️' },
    { name: 'Haha', emoji: '😂' },
    { name: 'Wow', emoji: '😮' },
    { name: 'Sad', emoji: '😢' },
    { name: 'Angry', emoji: '😡' }
  ];

  selectedReactions: { [postId: string]: any } = {};
  hoveredReaction: any = null;

  constructor(
    private profile: ProfileService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private authGuard: AuthGuard,
    private authService: AuthService,
    private postService: PostUploadImagesService,
    private commentService: CommentService,
    private alert: NotificationsService,
    private clientService: ClientsService,
    private router: Router,
    private cvService: CurriculumVitaeService
  ) { }

  // 📍 Lifecycle
  ngOnInit(): void {
    this.currentUserCode = this.authService.getAuthCode();
    this.companyId = this.route.snapshot.paramMap.get('code') || '';

    this.route.paramMap.subscribe(params => {
      const code = params.get('code');
      if (code) this.loadProfileCV(code);
    });

    this.loadUserData();
    this.fetchProfilePicture();
    this.checkFollowStatus();
    this.loadUserPost();
  }

  // 🧩 Pagination
  get pagedImages() {
    const start = this.currentPage * this.pageSize;
    return this.posts.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.posts.length / this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 0) this.currentPage--;
  }

  // 🖼️ Image Modal
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

  // 🕒 Activity and Profile
  getActiveHours(lastActive: string): string {
    if (!lastActive) return 'unknown';
    const diffInHours = Math.floor((Date.now() - new Date(lastActive).getTime()) / 3600000);
    if (diffInHours < 1) return 'Just now';
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
  }

  fetchProfilePicture(): void {
    this.cvService.getDataCV().subscribe({
      next: (response: any) => {
        this.userprofiles = response?.message;
        if (this.userprofiles?.code) sessionStorage.setItem('code', this.userprofiles.code);
      },
      error: (err) => console.error('Error fetching CV:', err)
    });
  }

  loadProfileCV(code: string) {
    this.profile.getCompanyProfile(code).subscribe({
      next: (res) => {
        if (res.success) this.profiles = res.message;
      },
      error: (err) => console.error('Error loading profile:', err)
    });
  }

  loadUserData() {
    this.profile.getProfileByUserOnly().subscribe({
      next: (res) => {
        if (res.success) this.users = res.message[0];
      },
      error: (err) => console.error('Error fetching user:', err)
    });
  }

  // 🧍 Follow System
  checkFollowStatus() {
    this.clientService.getPendingFollowStatus(this.currentUserCode).subscribe((res: any) => {
      this.followStatus = res.follow_status || 'none';
      this.followId = res.data?.[0]?.id || 0;
    });
  }

  AddFollow(code: any, status: string, firstName: any, lastName: any): void {
    if (!code) return this.alert.toastrWarning('⚠️ No user code provided.');

    const fullname = `${firstName} ${lastName}`;
    const messages = {
      none: { confirm: 'Send a follow request?', success: 'Follow request sent.' },
      pending: { confirm: 'Cancel your pending request?', success: 'Request canceled.' },
      accepted: { confirm: 'Unfollow this user?', success: 'Unfollowed.' }
    }[status];

    this.alert.popupWarning(fullname,"").then(result => {
      if (!result.value) return;

      const request$ = status === 'accepted'
        ? this.profile.Unfollow(this.followId)
        : this.profile.AddFollow(code);

      request$.subscribe({
        next: (res: any) => {
          if (res.success || res.status) {
            this.alert.toastrSuccess(res.message);
            this.followStatus = res.follow_status || 'none';
            this.checkFollowStatus();
          } else this.alert.toastrError(res.message || 'Action failed.');
        },
        error: (err) => this.alert.toastrError(err.error?.message || 'Something went wrong.')
      });
    });
  }

  // 💬 Posts & Comments
  loadUserPost(): void {
    this.isloading = true;
    this.postService.getDataPost(this.companyId).subscribe({
      next: (res) => {
        if (res?.success && Array.isArray(res.data)) {
          const baseUrl = 'https://lightgreen-pigeon-122992.hostingersite.com/';
          this.posts = res.data.map((post: any) => ({
            ...post,
            fullname: post.fullname || post.Fullname || "Unknown User",
            profile_pic: post.profile_pic
              ? post.profile_pic.replace(/\\/g, '')
              : `${baseUrl}storage/app/public/uploads/DEFAULTPROFILE/DEFAULTPROFILE.png`,
            images: (post.images || []).map((img: any) => ({
              ...img, path_url: baseUrl + img.path_url.replace(/\\/g, '')
            })),
            videos: (post.videos || []).map((vid: any) => ({
              ...vid, path_url: baseUrl + vid.path_url.replace(/\\/g, '')
            })),
            comments: (post.comments || []).map((c: any) => ({
              ...c,
              profile_pic: c.profile_pic
                ? c.profile_pic.replace(/\\/g, '')
                : `${baseUrl}storage/app/public/uploads/DEFAULTPROFILE/DEFAULTPROFILE.png`,
              replies: (c.replies || []).map((r: any) => ({
                ...r,
                profile_pic: r.profile_pic
                  ? r.profile_pic.replace(/\\/g, '')
                  : `${baseUrl}storage/app/public/uploads/DEFAULTPROFILE/DEFAULTPROFILE.png`
              }))
            })),
            activeHours: this.getActiveHours(post.lastActive),
            followers: post.followers || 0,
            visibleComments: 3
          }));
        }
        this.isloading = false;
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        this.isloading = false;
      }
    });
  }

  addComment(post: any): void {
    const commentText = post.newComment?.trim();
    if (!commentText) return;
    post.isSubmitting = true;

    this.commentService.postComment(post.posts_uuid, { comment: commentText }).subscribe({
      next: () => {
        post.comments.push({
          user: 'Current User', comment: commentText, profile_pic: '', likes: 0, replies: []
        });
        post.newComment = '';
        post.isSubmitting = false;
      },
      error: () => {
        post.isSubmitting = false;
        this.alert.toastPopUpError("Comment failed");
      }
    });
  }

  addReply(comment: any): void {
    const replyText = comment.newReply?.trim();
    if (!replyText) return;
    comment.isSubmitting = true;

    this.commentService.postCommentByReply(comment.comment_uuid, { comment: replyText }).subscribe({
      next: () => {
        comment.replies.push({
          user: 'Current User', comment: replyText, profile_pic: '', likes: 0, replies: []
        });
        comment.newReply = '';
        comment.isSubmitting = false;
      },
      error: () => {
        comment.isSubmitting = false;
        this.alert.toastPopUpError("Reply failed");
      }
    });
  }

  toggleComments(post: any): void {
    post.showComments = !post.showComments;
  }

  loadMoreComments(post: any): void {
    post.visibleComments += 3;
  }

  // 👍 Likes
  likePost(post: any): void {
    post.liked = !post.liked;
    post.likes = post.liked ? (post.likes || 0) + 1 : Math.max((post.likes || 1) - 1, 0);
    this.postService.likePost(post.id, post.liked).subscribe({
      next: (res) => console.log('Like updated:', res),
      error: (err) => console.error('Error liking post:', err)
    });
  }

  // 😊 Emoji Reactions
  onReactionHover(post: any, reaction: any) {
    this.hoveredReaction = reaction;
    this.selectedReactions[post.id] = reaction;
    console.log(`✅ Reaction '${reaction.name}' sent for post ID: ${post.id}`);
    setTimeout(() => this.hoveredReaction = null, 300);
  }

  // 🧾 Others
  getCaption(index: number): string {
    const caption = this.posts[index]?.caption || '';
    const words = caption.split(' ');
    return words.slice(0, 10).join(' ') + (words.length > 10 ? '...' : '');
  }

  uploadPic(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    this.dialog.open(UploadProfileComponent, dialogConfig).afterClosed().subscribe();
  }

  onCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => this.profiles.coverPhoto = reader.result as string;
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('cover_photo', file);
    formData.append('user_code', this.currentUserCode);

    this.isloading = true;
  }

  UserCV(): void {
    this.router.navigateByUrl("/user-cv");
  }
}
