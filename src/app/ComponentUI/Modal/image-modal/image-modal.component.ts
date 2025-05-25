import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment/comment.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { PostUploadImagesService } from 'src/app/services/post-upload-images.service';
import { ReactionEmojiService } from 'src/app/services/Reaction/reaction-emoji.service';
import { MatDialog } from '@angular/material/dialog';
import { ReactionModalComponent } from 'src/app/ComponentSharedUI/ReactEmoji/reaction-modal/reaction-modal.component';

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
  reactions: any[] = [
    { reaction: 'Like', emoji: '👍' },
    { reaction: 'Love', emoji: '❤️' },
    { reaction: 'Haha', emoji: '😂' },
    { reaction: 'Wow', emoji: '😮' },
    { reaction: 'Sad', emoji: '😢' },
    { reaction: 'Angry', emoji: '😡' }
  ];

  showReactions = false;
  hoveredReaction: { reaction: string, emoji: string } | null = null;
  selectedReaction: any = [];
  selectedReactions: { [postId: string]: any } = {};

  reactionEmojiMap: { [key: string]: string } = {
    Like: '👍',
    Love: '❤️',
    Haha: '😂',
    Wow: '😮',
    Sad: '😢',
    Angry: '😡',
    
  };

  reactionList: any[] = [];
  displayedReactions: {
    name: string;
    count: number;
    emoji: string;
    index: number;
    users: { code: number; fullname: string; photo_pic: string }[];
  }[] = [];

  totalReactionsCount: number = 0;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, private reactionService: ReactionEmojiService,
    private dialogRef: MatDialogRef<ImageModalComponent>,
    private alert: NotificationsService,private dialog: MatDialog,
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
    //  this.getReactionPost_uuidOrUuid();
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


  selectReaction(react: { reaction: string, emoji: string }) {
    this.selectedReaction = react;
    this.hoveredReaction = null;
    this.showReactions = false;
    // Save to database: only send the reaction name (e.g., 'love')
    this.saveReactionToDatabase(this.post_uuidOrUind, react.reaction);
  }

  //save react
  saveReactionToDatabase(post_uuidOrUuid: any, reaction: string): void {
    const payload = {
      reaction: reaction
    };
    this.reactionService.putReactionInvidual(post_uuidOrUuid, payload).subscribe({
      next: (res) => {
        //     console.log('✅ Reaction response:', res);
        this.getReactionPost_uuidOrUuid(); // Make sure this method exists
      },
      error: () => {
         this.errorMsg();
      }
    });
  }

  errorMsg(){
     this.alert.toastrError('❌ Error updating reaction:')
  }

  getReactionPost_uuidOrUuid(): void {
    const currentUserCode = this.authService.getAuthCode();
    this.reactionService.getReactionPost_uuidOrUuid(this.post_uuidOrUind).subscribe({
      next: (res) => {
        this.reactionList = res.react || [];
        this.totalReactionsCount = res.count || 0;
        this.displayedReactions = this.reactionList
          .slice(0, 5)
          .map((r, i) => {
            const reactionMeta = this.reactions.find(e => e.reaction === r.reaction);
            return {
              name: r.reaction,
              count: r.count,
              emoji: reactionMeta ? reactionMeta.emoji : '',
              index: i,
              users: r.person || []
            };
          });
        //  display select  this.selectedReaction by code
        this.selectedReaction = this.displayedReactions.find(r =>
          r.users.some(u => u.code === Number(currentUserCode)) // Convert string to number
        ) || null;

      },
      error: () => {
         this.errorMsg();
      }
    });
  }


  //get comment
  getComment(): void {
    console.log(this.post_uuidOrUind)
    this.comment.getComment(this.post_uuidOrUind).subscribe({
      next: (res) => {
        this.comments = res;
        this.getReactionPost_uuidOrUuid();
      },
      error: (err: any) => {
        this.alert.toastPopUpError(err?.message || 'Failed to fetch comments');
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }


  //delete image
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
    console.log(this.post_uuidOrUind, " ", this.newComment)

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

   openReactionsModal(): void {
    this.dialog.open(ReactionModalComponent, {
      data: this.post_uuidOrUind,
      width: '95%',
      maxWidth: '600px',
      panelClass: 'centered-modal',
    });

  }

}
