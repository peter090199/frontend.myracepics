// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-post-feeds',
//   templateUrl: './post-feeds.component.html',
//   styleUrls: ['./post-feeds.component.css']
// })
// export class PostFeedsComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
import { Component } from '@angular/core';

interface Story { img: string; name?: string; profile?: string; }
interface Post {
  authorName: string;
  authorImg: string;
  time: string;
  image?: string;
  likes: string;
  comments: string;
  shares: string;
}

@Component({
  selector: 'app-post-feeds',
  templateUrl: './post-feeds.component.html',
  styleUrls: ['./post-feeds.component.css']
})
export class PostFeedsComponent {
  title = 'ebook';

  searchText = '';

  // sample data (replace image paths with your assets)
  leftItems = [
    { img: 'assets/image/profile.png', label: 'John Deo' },
    { img: 'assets/image/friend.png', label: 'Friends' },
    { img: 'assets/image/saved.png', label: 'Saved' },
    { img: 'assets/image/group.png', label: 'Groups' },
    { img: 'assets/image/marketplace.png', label: 'Marketplace' },
    { img: 'assets/image/watch.png', label: 'Watch' }
  ];

  stories: Story[] = [
    { img: 'assets/image/story_1.png', name: 'Create story', profile: 'assets/image/upload.png' },
    { img: 'assets/image/story_2.jpg', name: 'Charith Disanayaka', profile: 'assets/image/profile_1.jpg' },
    { img: 'assets/image/story_3.jpg', name: 'Minidu Thiranjana', profile: 'assets/image/profile_2.jpg' },
    { img: 'assets/image/story_4.png', name: 'Kavisha Vidurangi', profile: 'assets/image/profile_3.jpg' },
    { img: 'assets/image/story_5.jpg', name: 'Kavindu Akalanka', profile: 'assets/image/profile_4.png' }
  ];

  posts: Post[] = [
    {
      authorName: 'Senuda De Silva',
      authorImg: 'assets/image/post_1.jpg',
      time: '16h',
      image: 'assets/image/post_1.jpg',
      likes: 'You, Charith Disanayaka and 25K others',
      comments: '421 Comments',
      shares: '1.3K Shares'
    },
    {
      authorName: 'Senuda De Silva',
      authorImg: 'assets/image/post_2.jpg',
      time: '1d',
      image: 'assets/image/post_2.jpg',
      likes: 'You and 5K others',
      comments: '320 Comments',
      shares: '650 Shares'
    }
    // add more posts...
  ];

  contacts = [
    'assets/image/contact_1.jpg','assets/image/contact_2.jpg','assets/image/contact_3.jpg',
    'assets/image/contact_4.jpg','assets/image/contact_5.jpg','assets/image/profile_1.jpg'
  ];
}
