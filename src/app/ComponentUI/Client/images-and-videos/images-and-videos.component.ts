import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-images-and-videos',
  templateUrl: './images-and-videos.component.html',
  styleUrls: ['./images-and-videos.component.css']
})
export class ImagesAndVideosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  mediaList = [
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200',
      caption: 'Team Collaboration Meeting'
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200',
      caption: 'New Office Setup'
    },
    {
      type: 'image',
      src: 'https://picsum.photos/1200/800?random=1',
      caption: 'Company Event Highlights'
    },
    {
      type: 'video',
      src: 'https://cdn.coverr.co/videos/coverr-working-at-the-office-9715/1080p.mp4',
      poster: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200',
      caption: 'Office Work Flow Video'
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200',
      caption: 'Tech Team Brainstorming'
    }
  ];


  openMedia(item: any) {
    // For now open in new tab (simple)
    window.open(item.src, '_blank');
  }
}
