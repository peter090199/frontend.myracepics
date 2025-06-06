import { Injectable, OnInit } from '@angular/core';
import { PostUploadImagesService } from '../post-upload-images.service';
import { NotificationsService } from '../Global/notifications.service';
import { CommentService } from '../comment/comment.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class SharedRoutinesService implements OnInit {
  error: any;
  onNewPostsDetected: (count: number) => void;

  constructor(private postDataservices:PostUploadImagesService,private alert:NotificationsService,private comment:CommentService,
              private authService: AuthService

  ) { }


  ngOnInit(): void {
    this.getCode();
  }

  usercode:any;
  isLoading:boolean = false;
  posts:any[] = [];
  post_uuidOrUind: any[] = [];


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
  

  loadUserPost(): void {
    if (!this.usercode) {
      this.alert.popupWarning("Usercode is ", "undefined, cannot load posts.")
      return;
    }

    
    this.isLoading = true;

    this.postDataservices.getDataPostAddFollow().subscribe(
      (data) => {
        const newPostCount = data.length - this.posts.length;
        
        if (data && Array.isArray(data)) {
          this.posts = data.map(post => ({
            ...post,
            activeHours: this.getActiveHours(post.lastActive),
            followers: post.followers || 0,
            currentIndex: 0, 
            images: post.images || [],
            visibleComments: 8, 
          }));

          if (this.onNewPostsDetected && newPostCount > 0) {
            this.onNewPostsDetected(newPostCount);
          }
        }
        console.log(this.usercode)
        
        this.post_uuidOrUind = data.map((item: any) => item.posts_uuid);
        this.comments = []; // Clear before loading
        this.post_uuidOrUind.forEach(uuid => {
          this.getComment(uuid,this.posts );
        });

        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching posts:', error);
        this.isLoading = false;
      }
    );
  }

    //getcomment
    comments:any = [];
    getComment(post_uuid: string, post: any): void {
      this.comment.getComment(post_uuid).subscribe({
        next: (res) => {
          post.comments = res;
          console.log(post.comments)
        },
        error: (err) => {
          this.error = err.message || 'An error occurred while fetching comments';
        }
      });
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
  


}
