import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment/comment.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { ReactionEmojiService } from 'src/app/services/Reaction/reaction-emoji.service';

@Component({
  selector: 'app-comment-modal-ui',
  templateUrl: './comment-modal-ui.component.html',
  styleUrls: ['./comment-modal-ui.component.css']
})
export class CommentModalUIComponent implements OnInit {
  newComment: string = ''; // user input
  displayedComments: any[] = []; // visible comments
  initialLoadCount = 3; // first n comments
  post_uuidOrUind: string = '';
  currentUserCode: any;
  comments: any = [];
  isLoading = true;
  private commentCache: { [uuid: string]: any[] } = {};


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // post object
    private dialogRef: MatDialogRef<CommentModalUIComponent>,
    private commentService: CommentService,
    private alert: NotificationsService,
    private reactionService: ReactionEmojiService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUserCode = this.authService.getAuthCode();
    this.post_uuidOrUind = this.data.posts_uuid;

    // ✅ 1. Instantly show locally cached or passed comments (fast UX)
    this.displayedComments = (this.data.comments || []).slice(0, this.initialLoadCount);

    // ✅ 2. Fetch latest comments in background (don’t block UI)
    if (this.post_uuidOrUind) {
      setTimeout(() => this.getComments(), 0); // async microtask
    }
  }

  getComments(): void {
    if (!this.post_uuidOrUind) return;

    this.isLoading = true;

    const cached = this.commentCache[this.post_uuidOrUind];
    if (cached && cached.length) {
      this.data.comments = cached;
      this.displayedComments = cached.slice(0, this.initialLoadCount);
      this.isLoading = false; // stop skeleton early
    }

    this.commentService.getComment(this.post_uuidOrUind).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (!res) return;
        this.data.comments = res;
        this.comments = res;
        this.displayedComments = res.slice(0, this.initialLoadCount);
        this.commentCache[this.post_uuidOrUind] = res;
      },
      error: (err) => {
        this.isLoading = false;
        this.alert.toastPopUpError(err?.message || 'Failed to fetch comments');
      }
    });
  }


  //reply edit
  saveReplyEdit(reply: any, id: any) {
    const data = {
      comment: reply.comment,
      comment_settings: "com_replies"
    };

    this.commentService.updateReply(id, data).subscribe({
      next: (res) => {
        console.log('Reply saved:', res);
        reply.isEditing = false;
      },
      error: (err) => {
        console.error('Error saving reply:', err);
      }
    });
  }


  //edit comment
  editComment(comment: any) {
    comment.isEditing = true;
  }
  replyeditComment(replycomment: any) {
    replycomment.isEditing = true;
  }


  cancelCommentEdit(comment: any) {
    comment.isEditing = false;
  }

  saveCommentEdit(comment: any) {
    // TODO: API call here to save the comment
    comment.isEditing = false;
  }

  editReply(reply: any) {
    reply.isEditing = true;
  }

  cancelReplyEdit(reply: any) {
    reply.isEditing = false;
  }

  //   getComment(): void {
  //   console.log(this.post_uuidOrUind)
  //   this.comment.getComment(this.post_uuidOrUind).subscribe({
  //     next: (res) => {
  //       this.comments = res;
  //       console.log(this.comments)
  //       this.getReactionPost_uuidOrUuid();
  //     },
  //     error: (err: any) => {
  //       this.alert.toastPopUpError(err?.message || 'Failed to fetch comments');
  //     }
  //   });
  // }

  addComment(): void {
    if (!this.newComment.trim()) {
      return;
    }
    console.log(this.post_uuidOrUind, " ", this.newComment)

    const data = {
      post_uuid: this.post_uuidOrUind,
      comment: this.newComment
    };

    this.commentService.postCommentIndividual(this.post_uuidOrUind, data).subscribe({
      next: (res) => {
        console.log(res.data);
        this.getComments();
        this.newComment = '';
        //  this.isSubmitting = false;
      },
      error: () => {
        this.alert.toastPopUpError("Comment failed:")
      }
    });
  }

  addReply(comment: any): void {
    const replyText = comment.newReply?.trim();
    if (!replyText) return;

    comment.isSubmitting = true;

    const payload = { comment: replyText };

    this.commentService.postCommentByReply(comment.comment_uuid, payload).subscribe({
      next: () => {
        comment.newReply = '';
        this.getComments();
        comment.isSubmitting = false;
      },
      error: () => {
        comment.isSubmitting = false;
        this.alert.toastPopUpError('Reply failed');
      }
    });
  }


  /** Post a new comment (push locally and send to server) */
  postComment(): void {
    const text = this.newComment.trim();
    if (!text) return;

    const newComment = {
      fullname: 'You', // replace with current user data
      profile_pic: 'https://lightgreen-pigeon-122992.hostingersite.com/storage/app/public/uploads/DEFAULTPROFILE/DEFAULTPROFILE.png',
      text: text,
      created_at: new Date()
    };

    // locally update comment arrays
    this.data.comments.push(newComment);
    this.displayedComments.push(newComment);
    this.newComment = '';

    // send to backend
    this.addCommentToServer(text);
  }

  /** Send comment to backend API */
  private addCommentToServer(text: string): void {
    const payload = {
      post_uuid: this.post_uuidOrUind,
      comment: text
    };

    this.commentService.postCommentIndividual(this.post_uuidOrUind, payload).subscribe({
      next: () => {
        // refresh comments from server
        this.getComments();
      },
      error: () => {
        this.alert.toastPopUpError('Comment failed to post');
      }
    });
  }


  likeReply(reply: any) {
    reply.likedByCurrentUser = !reply.likedByCurrentUser;
    reply.likeCount = reply.likeCount || 0;
    reply.likeCount += reply.likedByCurrentUser ? 1 : -1;
  }

  showReplyInput(reply: any) {
    reply.showReplyInput = !reply.showReplyInput;
  }

  sendNestedReply(parentReply: any) {
    if (!parentReply.newReply?.trim()) return;

    const newReply = {
      id: Date.now(),
      fullname: this.data.fullname,
      profile_pic: this.data.profile_pic,
      comment: parentReply.newReply,
      date_comment: new Date().toLocaleString(),
    };

    parentReply.replies = parentReply.replies || [];
    parentReply.replies.push(newReply);
    parentReply.newReply = '';
    parentReply.showReplyInput = false;
  }
deleteReply(replyId: number) {
  const confirmDelete = confirm('Are you sure you want to delete this reply?');
  if (!confirmDelete) return;

  // Example logic — adjust based on your backend structure
  // this.commentService.deleteReply(replyId).subscribe({
  //   next: () => {
  //     // Remove from UI instantly
  //     this.comment.replies = this.comment.replies.filter(
  //       (r: any) => r.id !== replyId
  //     );
  //     this.notificationService.showSuccess('Reply deleted successfully!');
  //   },
  //   error: (err) => {
  //     console.error('Error deleting reply:', err);
  //     this.notificationService.showError('Failed to delete reply.');
  //   },
  // });
}



  /** Load all comments */
  loadAllComments(): void {
    this.displayedComments = [...this.data.comments];
  }

  /** Close modal */
  closeModal(): void {
    this.dialogRef.close();
  }
}
