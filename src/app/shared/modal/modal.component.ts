import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IndividualService } from 'src/app/main/personal/individual.service';
// import uploadcare from 'uploadcare-widget/uploadcare.lang.en.min.js';
import uploadcare from 'uploadcare-widget/uploadcare.full.min.js';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit, OnDestroy {
  contentType: string = 'image';
  @ViewChild('resourceForm', { static: true }) resourceForm: NgForm;
  @ViewChild('fileInput') fileInput: ElementRef;
  mediaTypeSubscription: Subscription;
  file: File;
  fileUrl: string;

  constructor(private individualService: IndividualService) {}

  ngOnInit() {
    this.mediaTypeSubscription =
      this.individualService.addMediaContentType.subscribe(
        (contentType) => (this.contentType = contentType)
      );
  }
  ngOnDestroy() {
    this.mediaTypeSubscription.unsubscribe();
  }
  onFileChange(event: { target: { files: File } }) {
    this.file = event.target.files[0];
    // console.log('file ', event.target.files[0]);
    let resourceType = this.individualService.addMediaContentType.value;
    if (this.file.type.split('/')[0] !== resourceType) {
      alert('wrong file type choosen');
      this.file = null;
      this.fileInput.nativeElement.value = '';
    }
  }

  onSubmit() {
    console.log(this.resourceForm.value);
    let url: string;
    if (this.contentType !== 'text' && !this.file) {
      let upload = uploadcare.fileFrom('object', this.file);
      upload.done((fileInfo: { cdnUrl: string }) => {
        console.log('Your file has been uploaded. URL: ' + fileInfo.cdnUrl);
        this.fileUrl = fileInfo.cdnUrl;
        url = fileInfo.cdnUrl;
      });
    }

    const { description, resourceName, text } = this.resourceForm.value;
    this.individualService.saveResourceToDb({
      description,
      resourceName,
      url,
      text,
    });
  }
}
