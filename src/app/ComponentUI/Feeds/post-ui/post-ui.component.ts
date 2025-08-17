// import { Component, Input } from '@angular/core';

// interface Post {
//   posts_uuid: string;
//   profile_pic?: string;
//   Fullname: string;
//   created_at: string;
//   caption: string;
//   expanded?: boolean;
//   posts?: { path_url: string }[];
// }

// interface Reaction {
//   emoji: string;
//   reaction: string;
// }

// @Component({
//   selector: 'app-post-ui',
//   templateUrl: './post-ui.component.html',
//   styleUrls: ['./post-ui.component.css']
// })
// export class PostUIComponent {

//   maxImages = 4;
//   isScrollIdle = false;
//   totalReactionsCount = 0;
//   posts: any[] = [];
//   // Reaction maps
//   reactionEmojiMap: { [key: string]: string } = {
//     like: '👍',
//     love: '❤️',
//     haha: '😂',
//     wow: '😮',
//     sad: '😢',
//     angry: '😡'
//   };

//   reactions: Reaction[] = [
//     { emoji: '👍', reaction: 'like' },
//     { emoji: '❤️', reaction: 'love' },
//     { emoji: '😂', reaction: 'haha' },
//     { emoji: '😮', reaction: 'wow' },
//     { emoji: '😢', reaction: 'sad' },
//     { emoji: '😡', reaction: 'angry' }
//   ];

//   reactionList: { reaction: string; count: number }[] = [];
//   postReactions: {
//     [uuid: string]: { showPopup: boolean; hoveredReaction: Reaction | null }
//   } = {};

//   // Scroll handler
//   onScroll(event: Event) {
//     const target = event.target as HTMLElement;
//     this.isScrollIdle = target.scrollTop > 200;
//   }

//   scrollToTop(element: HTMLElement) {
//     element.scrollTo({ top: 0, behavior: 'smooth' });
//   }

//   // Post actions
//   createPost() {
//     console.log('Create new post...');
//   }

//   onEditPost() {
//     console.log('Edit post...');
//   }

//   onDelete(post: Post) {
//     console.log('Delete post:', post);
//   }

//   // Reactions handling
//   togglePopup(postId: string, show: boolean) {
//     if (!this.postReactions[postId]) {
//       this.postReactions[postId] = { showPopup: false, hoveredReaction: null };
//     }
//     this.postReactions[postId].showPopup = show;
//   }

//   setHoveredReaction(postId: string, reaction: Reaction | null) {
//     if (!this.postReactions[postId]) return;
//     this.postReactions[postId].hoveredReaction = reaction;
//   }

//   selectReaction(postId: string, reaction: Reaction) {
//     console.log(`Selected ${reaction.reaction} on post ${postId}`);
//     this.togglePopup(postId, false);
//   }

//   openModal(images: { path_url: string }[]) {
//     console.log('Open image modal', images);
//   }
// }

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-ui',
  templateUrl: './post-ui.component.html',
  styleUrls: ['./post-ui.component.css']
})
export class  PostUIComponent implements OnInit{

  constructor(){

  }

  ngOnInit(): void {
    
  }
  @Input() posts: any[] = [];

  maxImages = 4;
  isScrollIdle = false;
  showReactionsFor: string | null = null;
  reactions = [
    { type: 'like', emoji: '👍' },
    { type: 'love', emoji: '❤️' },
    { type: 'haha', emoji: '😂' },
    { type: 'wow', emoji: '😮' },
    { type: 'sad', emoji: '😢' },
    { type: 'angry', emoji: '😡' }
  ];

  postReactions: any = {};
  reactionEmojiMap: any = {
    like: '👍',
    love: '❤️',
    haha: '😂',
    wow: '😮',
    sad: '😢',
    angry: '😡'
  };

  totalReactionsCount = 0;
  reactionList: any[] = [];

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    this.isScrollIdle = target.scrollTop > 200;
  }

  scrollToTop(element: HTMLElement) {
    element.scrollTo({ top: 0, behavior: 'smooth' });
  }

  createPost() {
    console.log('Open create post modal...');
  }

  onEditPost() {
    console.log('Edit post...');
  }

  onDelete(post: any) {
    console.log('Delete post:', post);
  }

  openModal(images: any[]) {
    console.log('Open image modal with images:', images);
  }

  togglePopup(postId: string, show: boolean) {
    if (!this.postReactions[postId]) {
      this.postReactions[postId] = { showPopup: false, hoveredReaction: null };
    }
    this.postReactions[postId].showPopup = show;
  }

  setHoveredReaction(postId: string, reaction: any | null) {
    if (this.postReactions[postId]) {
      this.postReactions[postId].hoveredReaction = reaction;
    }
  }

  selectReaction(postId: string, reaction: any) {
    console.log('Selected reaction:', reaction, 'for post:', postId);
    this.postReactions[postId].hoveredReaction = reaction;
    this.postReactions[postId].showPopup = false;
  }
}
