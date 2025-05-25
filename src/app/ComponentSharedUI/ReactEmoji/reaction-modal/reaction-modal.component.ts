import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ReactionEmojiService } from 'src/app/services/Reaction/reaction-emoji.service';

@Component({
  selector: 'app-reaction-modal',
  templateUrl: './reaction-modal.component.html',
  styleUrls: ['./reaction-modal.component.css']
})
export class ReactionModalComponent implements OnInit {
    post_uuidOrUind:any = [];


    constructor( private reactionService: ReactionEmojiService,private authService: AuthService,
                @Inject(MAT_DIALOG_DATA) public data: any,
    )
    {
      this.post_uuidOrUind = data;
      console.log(this.post_uuidOrUind);
    }


  ngOnInit(): void {
     this.getReactionPost_uuidOrUuid()
  }
  react:any[]=[];
  reactionIconMap: Record<string, string> = {
    Sad: '😢',
    Wow: '😮',
    Like: '👍',
    Love: '❤️',
    Haha: '😂',
    Angry: '😡',
  };

  
  getReactionPost_uuidOrUuid(): void {
    const currentUserCode = this.authService.getAuthCode();
    this.reactionService.getReactionPost_uuidOrUuid(this.post_uuidOrUind).subscribe({
      next: (res) => {
        this.react = res.react || [];

      },
      error: () => {
        // this.errorMsg();
      }
    });
  }


  // Combine all persons from all reactions, without duplicates by code
  get allPersons() {
    const map = new Map<number, any>();
    for (const reactionGroup of this.react) {
      for (const person of reactionGroup.person) {
        if (!map.has(person.code)) {
          map.set(person.code, person);
        }
      }
    }
    return Array.from(map.values());
  }

  // Total count is sum of all reaction counts
  get totalCount(): number {
    return this.react.reduce((acc, cur) => acc + cur.count, 0);
  }

  reactionLabel(reactionGroup: any): string {
    const emoji = this.reactionIconMap[reactionGroup.reaction] || '👍';
    return `${emoji} ${reactionGroup.count}`;
  }

}
