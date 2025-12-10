import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-user-resume-ui',
  templateUrl: './user-resume-ui.component.html',
  styleUrls: ['./user-resume-ui.component.css']
})
export class UserResumeUIComponent implements OnInit {

  gallery: any[] = [];
  selectedResume: any = null;
  domain = 'https://exploredition.com';
  user:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UserResumeUIComponent>,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    // Map resumes and fix path
    this.gallery = (this.data?.resumes || []).map((r: { url: string }) => ({
      ...r,
      url: r.url.replace('/storage/app/public', '/storage'),
      safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(this.domain + r.url)
    }));

    if (this.gallery.length > 0) {
      this.selectedResume = this.gallery[0];
    }
    this.user = this.data;
  }

  getStatusClass(status: string) {
  switch (status) {
    case 'review': return 'status-review';
    case 'applied_active': return 'status-active';
    case 'rejected': return 'status-rejected';
    default: return '';
  }
}
  isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(url);
  }

  isPDF(url: string): boolean {
    return /\.pdf$/i.test(url);
  }

  setSelected(item: any) {
    this.selectedResume = item;
  }

  close() {
    this.dialogRef.close();
  }

  downloadPDF(url: string) {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'resume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
