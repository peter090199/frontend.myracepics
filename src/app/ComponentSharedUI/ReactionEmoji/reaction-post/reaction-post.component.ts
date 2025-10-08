import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { ClientsService } from 'src/app/services/Networking/clients.service';
import { ReactionEmojiService } from 'src/app/services/Reaction/reaction-emoji.service';


@Component({
  selector: 'app-reaction-post',
  templateUrl: './reaction-post.component.html',
  styleUrls: ['./reaction-post.component.css']
})
export class ReactionPostComponent implements OnInit {
  postId: number = 0;

  constructor(private reactionService: ReactionEmojiService, private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any, private alert: NotificationsService, private clientsService: ClientsService,
  ) {
    this.postId = data;
  }

  isLoading: boolean = false;
  skeletonRows = Array(6); // show 6 skeletons
  react: any[] = [];
  reactionIconMap: Record<string, string> = {
    Sad: '😢',
    Wow: '😮',
    Like: '👍',
    Love: '❤️',
    Haha: '😂',
    Angry: '😡',
  };

  allPersons2: any[] = [];
  currentUserCode: any;


  ngOnInit(): void {
    this.currentUserCode = this.authService.getAuthCode();
    this.getReactionByPostId();
    this.getPeopleRecentActivity();
  }

  users: any;
  peopleRecentActivity: any = [];
allPersonsList: any[] = [];

getPeopleRecentActivity(): void {
  if (this.isLoading) return;

  this.isLoading = true;
  this.currentUserCode = this.authService.getAuthCode();

  this.clientsService.getPeopleRecentActivity().subscribe({
    next: (res) => {
      // Make sure follow_status exists
      this.allPersonsList = res.data.map((person: any) => ({
        ...person,
        follow_status: person.follow_status || 'not_following'
      }));

      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error loading suggestions:', err);
      this.alert.toastrError('❌ Failed to load suggestions.');
      this.isLoading = false;
    }
  });
}

getReactionByPostId(): void {
  this.isLoading = true;
  this.reactionService.getReactionByPostId(this.postId).subscribe({
    next: (res) => {
      this.react = res.react || [];
      this.allPersonsList = res.allPersons || this.allPersonsList;
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error fetching reactions:', err);
      this.isLoading = false;
    }
  });
}

  get allPersons() {
    const map = new Map<number, any>();
    for (const group of this.react) {
      for (const person of group.person) {
        if (!map.has(person.code)) {
          map.set(person.code, person);
        }
      }
    }
    return Array.from(map.values());
  }
  get totalCount(): number {
    return this.react.reduce((acc, cur) => acc + cur.count, 0);
  }

  reactionLabel(reactionGroup: any): string {
    const emoji = this.reactionIconMap[reactionGroup.reaction] || '👍';
    return `${emoji} ${reactionGroup.count}`;
  }



  profile: any = [];
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
          next: (res: any) => {
            if (res.status === true || res.success === true) {
              this.alert.toastrSuccess(successAction);
               this.getPeopleRecentActivity();
            } else {
              this.alert.toastrError(res.message || 'Action failed.');
            }
          },
          error: (err: any) => {
            this.alert.toastrError(err.error?.message || 'Something went wrong.');
            console.error(err);
          }
        });
      }
    });
  }



}
