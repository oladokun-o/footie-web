import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'footiedrop-web-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements AfterViewInit {
  @ViewChild('loadingVideo') loadingVideo!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
    const video: HTMLVideoElement = this.loadingVideo.nativeElement;

    // Ensuring autoplay and muted attributes are set
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playbackRate = 1; // Set playback rate

    // Listen for the 'canplay' event to start playing the video
    video.addEventListener('canplay', () => {
      video.play().catch(error => {
        console.error('Video play failed', error);
      });
    });

    // Retry playing the video in case it fails initially
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error('Autoplay failed. Trying to play manually', error);
        setTimeout(() => {
          video.play().catch(error => {
            console.error('Manual play failed', error);
          });
        }, 1000); // Retry after 1 second
      });
    }
  }
}
