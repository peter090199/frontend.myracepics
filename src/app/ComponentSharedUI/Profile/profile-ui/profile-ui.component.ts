import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProfileService } from 'src/app/services/Profile/profile.service';
import { UploadProfileComponent } from '../../Individual/upload-profile/upload-profile.component';
import { UserCVComponent } from '../../Individual/user-cv/user-cv.component';
import { UserProfileUiComponent } from '../../Individual/user-profile-ui/user-profile-ui.component';
import { ActivatedRoute } from '@angular/router';
import { AuthGuard } from 'src/app/AuthGuard/auth.guard';
import { PostUploadImagesService } from 'src/app/services/post-upload-images.service';


@Component({
  selector: 'app-profile-ui',
  templateUrl: './profile-ui.component.html',
  styleUrls: ['./profile-ui.component.css']
})
export class ProfileUIComponent implements OnInit {

  error: any;
  profiles: any;
  users: any;
  btnCurriculum: boolean = false;
  isUserOnline: boolean = false;
  code:any;
  posts:any[] = [];
  followers:any;
  activeHours:any;



  constructor(
            private profile:ProfileService,public dialog:MatDialog,
            private route: ActivatedRoute,private authService: AuthGuard,
            private postDataservices:PostUploadImagesService

  ) { }
 
  ngOnInit(): void {


    const url = window.location.href;
    const codesplit = url.split('/').pop();
    this.code = codesplit;

    this.loadUserPost();
    this.loadUserData();
    this.loadProfileCV();
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
    this.postDataservices.getDataPost(this.code).subscribe(
      (data) => {
        if (data && Array.isArray(data)) {
          this.posts = data.map(post => ({
            ...post,
            activeHours: this.getActiveHours(post.lastActive),
            followers: post.followers || 0
          }));
        }
      },
      (error) => console.error('Error fetching posts:', error)
    );
  }
    


  loadProfileCV(){
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

  
  UserCV() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '1000px';
    dialogConfig.height = '690px';
  //  dialogConfig.data = element || null; // Pass user data
    
    const dialogRef = this.dialog.open(UserProfileUiComponent, dialogConfig);
  
    dialogRef.afterClosed().subscribe(() => {
      
    });
  }

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
  

  loadUserData(){
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


  
addComment(post: any) {
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
  this.postDataservices.likePost(post.id, post.liked).subscribe(
    (response) => {
      console.log('✅ Like status updated successfully:', response);
    },
    (error) => {
      console.error('❌ Error updating like status:', error);
    }
  );
}

}
