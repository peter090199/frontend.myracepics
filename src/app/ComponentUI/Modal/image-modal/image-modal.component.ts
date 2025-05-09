import { Component, Inject, OnInit } from '@angular/core';
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
export class ImageModalComponent implements OnInit {
  isLoading: boolean = false;
  usercode: any;
  posts: any = [];
  posts_uuind:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ImageModalComponent>,
    private alert: NotificationsService,
    private postDataservices: PostUploadImagesService,
    private authService: AuthService,private comment:CommentService,
  ) 
  {
    this.posts = Array.isArray(data) ? data : [data];
   // this.posts = this.posts.filter((p: any) => p.posts_uuind === this.posts_uuind);
    this.posts_uuind = this.posts.map((post: { posts_uuind: any; }) => post.posts_uuind);
     console.log("Incoming posts:", this.posts);
  }

  ngOnInit(): void {
    this.getCode(); // Only needed for delete or re-fetch
    this.loadUserPost();
    this.getComment();
  }

  currentIndex = 0;

setActive(index: number): void {
  this.currentIndex = index;
  const currentPost = this.posts[this.currentIndex];
  this.posts_uuind = currentPost.posts_uuind;
 // this.getComment(); // Load comments for this post
}


  //getcomment
comments:any = [];
getComment(): void {
  this.comment.getComment(this.posts_uuind).subscribe({
    next: (res) => {
      this.comments = res;
      console.log(this.comments)
    },
    error: (err:any) => {
      err = err.message || 'An error occurred while fetching comments';
    }
  });
}
  getCode(): void {
    this.authService.getProfilecode().subscribe({
      next: (res) => {
        if (res.success && res.message.length > 0) {
          this.usercode = res.message[0].code;
        }
      },
      error: (err) => {
        console.error("Error fetching profile:", err);
      }
    });
  }

  loadUserPost(): void {
    if (!this.usercode) return;

    this.isLoading = true;
    this.postDataservices.getDataPostAddFollow(this.usercode).subscribe(
      (data) => {
        if (data && Array.isArray(data)) {
          this.posts = data.map(post => ({
            ...post,
            path_url: post.path_url
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

  close(): void {
    this.dialogRef.close();
  }

  deleteImage(imageId: any): void {
    this.alert.popupWarning("", "Are you sure you want to delete this image?").then((result: any) => {
      if (result?.value) {
        this.isLoading = true;
        this.postDataservices.deletePosts_uuind(imageId).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.alert.toastrSuccess(res.message);
            //  this.close();
             // this.loadUserPost(); // reload if deleted
            } else {
              this.alert.toastrError(res.message);
            }
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

  addComment(post: any): void {
    if (post.newComment?.trim()) {
      // Add the new comment
      const newEntry = {
        username: "You", // Replace this with the actual logged-in user name
        text: post.newComment
      };
      post.comments = post.comments || [];
      post.comments.push(newEntry);

      // Reset the newComment field
      post.newComment = '';
    }
  }
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
    error: () => {
      comment.isSubmitting = false;
      this.alert.toastPopUpError("Comment failed");
    }
  });
}

}

