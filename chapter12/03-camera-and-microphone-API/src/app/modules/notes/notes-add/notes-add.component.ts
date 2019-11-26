import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DataService } from '../../core/data.service';
import { SnackBarService } from '../../core/snack-bar.service';
declare const window: any;
declare const MediaRecorder: any;
@Component({
  selector: 'app-notes-add',
  templateUrl: './notes-add.component.html',
  styleUrls: ['./notes-add.component.scss']
})
export class NotesAddComponent {
  @ViewChild('videoOutput') videoOutput: ElementRef;
  @ViewChild('recorded') recordedVideo: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;

  public disabled = { record: true, stop: false, play: false, download: false };
  public userID;
  public errorMessages$ = new Subject();
  public loading$ = new Subject();
  public isMediaRecorderSupported: boolean;
  private recordedBlobs;
  private liveStream: any;
  private mediaRecorder: any;

  constructor(
    private router: Router,
    private data: DataService,
    private snackBar: SnackBarService
  ) {
    if (window.MediaRecorder) {
      this.isMediaRecorderSupported = true;
      this.getStream();
    } else {
      this.isMediaRecorderSupported = false;
    }
  }

  async getStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
        // video: {
        //   width: { min: 1280 },
        //   height: { min: 720 }
        // }
      });
      this.handleLiveStream(stream);
    } catch (e) {
      this.isMediaRecorderSupported = false;
      this.onSendError('No permission or something is wrong');
      return 'No permission or something is wrong';
    }
  }

  handleLiveStream(stream) {
    this.liveStream = stream;
    this.videoOutput.nativeElement.srcObject = stream;
  }

  getMediaRecorderOptions() {
    let options = {
      mimeType: 'video/webm;codecs=vp9',
      audioBitsPerSecond: 1000000, // 1 Mbps
      bitsPerSecond: 1000000, // 2 Mbps
      videoBitsPerSecond: 1000000 // 2 Mbps
    };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.log(`${options.mimeType} is not Supported`);
      options = { ...options, mimeType: 'video/webm;codecs=vp8' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.log(`${options.mimeType} is not Supported`);
        options = { ...options, mimeType: 'video/webm' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.log(`${options.mimeType} is not Supported`);
          options = { ...options, mimeType: '' };
        }
      }
    }
    return options;
  }

  record() {
    this.recordedBlobs = [];
    this.disabled = { play: false, download: false, record: false, stop: true };
    this.mediaRecorder = new MediaRecorder(
      this.liveStream,
      this.getMediaRecorderOptions
    );
    this.mediaRecorder.ondataavailable = e => {
      {
        if (e.data) {
          this.recordedBlobs.push(e.data);
        }
      }
    };
    this.mediaRecorder.start();
    console.log('MediaRecorder started', this.mediaRecorder);
  }

  stop() {
    this.disabled = { play: true, download: true, record: true, stop: false };
    this.mediaRecorder.onstop = e => {
      // vide recoding has been stopped we are ready to show or make download ready
      this.recordedVideo.nativeElement.controls = true;
    };
    this.mediaRecorder.stop();
  }

  play() {
    this.disabled = { play: true, download: true, record: true, stop: false };
    const buffer = new Blob(this.recordedBlobs, { type: 'video/webm' });
    this.recordedVideo.nativeElement.src = window.URL.createObjectURL(buffer);
  }

  download() {
    const blob = new Blob(this.recordedBlobs, { type: 'video/webm' });
    const url = window.URL.createObjectURL(blob);
    this.downloadLink.nativeElement.url = url;
    this.downloadLink.nativeElement.download = `recording_${new Date().getTime()}.webm`;
    this.downloadLink.nativeElement.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
  }

  onSaveNote(values) {
    this.data.addNote(values).then(
      doc => {
        this.snackBar.open(`LOCAL: ${doc.id} has been succeffully saved`);
      },
      e => {
        this.errorMessages$.next('something is wrong when adding to DB');
      }
    );
    this.router.navigate(['/notes']);
  }

  onSendError(message) {
    this.errorMessages$.next(message);
  }
}
