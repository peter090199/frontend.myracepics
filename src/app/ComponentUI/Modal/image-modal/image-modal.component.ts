import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment/comment.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { PostUploadImagesService } from 'src/app/services/post-upload-images.service';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent implements OnInit, AfterViewInit {
  @ViewChild('carousel') carousel!: ElementRef;

  posts: any[] = [];
  comments: any[] = [];

  currentIndex: number = 0;
  isLoading: boolean = false;
  isSubmitting: boolean = false;

  post_uuidOrUind: string = '';

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


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ImageModalComponent>,
    private alert: NotificationsService,
    private postDataservices: PostUploadImagesService,
    private authService: AuthService,
    private comment: CommentService,
  ) {
    this.posts = data;
  }

  ngOnInit(): void {
    if (this.posts.length > 0) {
      this.currentIndex = 0;
      // this.posts.forEach(post => post.showComments = false);
      this.post_uuidOrUind = this.posts[0].posts_uuind;
      this.getComment();
    }
  }

  ngAfterViewInit(): void {
    const el = this.carousel.nativeElement;
    el.addEventListener('slid.bs.carousel', () => {
      const activeIndex = el.querySelector('.carousel-item.active')?.getAttribute('data-index');
      this.currentIndex = parseInt(activeIndex, 10);
      this.post_uuidOrUind = this.posts[this.currentIndex]?.posts_uuind;
      this.getComment();
    });
  }

  getComment(): void {
    this.comment.getComment(this.post_uuidOrUind).subscribe({
      next: (res) => {
        this.comments = res;
      },
      error: (err: any) => {
        this.alert.toastPopUpError(err?.message || 'Failed to fetch comments');
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  deleteImage(imageId: string): void {
    this.alert.popupWarning('', 'Are you sure you want to delete this image?').then((result: any) => {
      if (result?.value) {
        this.isLoading = true;
        this.postDataservices.deletePosts_uuind(imageId).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.alert.toastrSuccess(res.message);
              // this.close();
            } else {
              this.alert.toastrError(res.message);
            }
            this.isLoading = false;
          },
          error: (error: any) => {
            this.alert.toastrError(error.error?.message || 'An error occurred while deleting the post.');
            this.isLoading = false;
          }
        });
      }
    });
  }

  onReactionHover(post: any, reaction: any): void {
    this.hoveredReaction = reaction;
    this.selectedReactions[post.id] = reaction;
    this.sendReactionToServer(post.id, reaction);
    setTimeout(() => (this.showReactions = false), 300);
  }

  sendReactionToServer(postId: string, reaction: any): void {
    console.log(`✅ Sent reaction '${reaction.name}' for post ID: ${postId}`);
    // Use a real API call here
  }

  toggleComments(post: any): void {
    post.showComments = !post.showComments;
  
    // if (post.showComments) {
    //   this.post_uuidOrUind = post.posts_uuind;
    //   this.getComment();
    // }
  }


newComment: string = '';
addComment(): void {
  if (!this.newComment.trim()) {
    return; 
  }
console.log(this.post_uuidOrUind , " ", this.newComment)

const data = {
  post_uuid: this.post_uuidOrUind,
  comment: this.newComment
};

  this.comment.postCommentIndividual(this.post_uuidOrUind, data).subscribe({
    next: (res) => {
      // this.comments.push({
      //   comment: this.newComment,
      //   likes: 0,
      //   replies: [],
      // });
      this.alert.toastrSuccess(res.message);
      this.getComment();
      this.newComment = '';
      this.isSubmitting = false;
    },
    error: (err) => {
      this.alert.toastPopUpError("Comment failed:")
    }
  });
}



  likeComment(comment: any): void {
    comment.likes = (comment.likes || 0) + 1;
  }

  addReply(comment: any): void {
    const replyText = comment.newReply?.trim();
    if (!replyText) return;

    comment.isSubmitting = true;

    const payload = { comment: replyText };

    this.comment.postCommentByReply(comment.comment_uuid, payload).subscribe({
      next: () => {
        // comment.replies = comment.replies || [];
        // comment.replies.push({
        //   fullname: 'You',
        //   comment: replyText,
        //   profile_pic: '',
        //   likes: 0,
        //   date_comment: new Date().toLocaleString()
        // });

        
        comment.newReply = '';
        this.getComment();
        comment.isSubmitting = false;
      },
      error: () => {
        comment.isSubmitting = false;
        this.alert.toastPopUpError('Reply failed');
      }
    });
  }
}
