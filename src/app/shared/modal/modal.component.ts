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
declare var window: any;

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
  myModal: any;
  modalSubscription: Subscription;
  showModal = false;

  constructor(private individualService: IndividualService) {}

  ngOnInit() {
    this.mediaTypeSubscription =
      this.individualService.addMediaContentType.subscribe(
        (contentType) => (this.contentType = contentType)
      );

    this.myModal = new window.bootstrap.Modal(
      document.getElementById('exampleModal')
    );

    this.individualService.showModal.subscribe((show) => {
      if (show) {
        this.myModal.show();
      }
    });
  }
  ngOnDestroy() {
    this.mediaTypeSubscription.unsubscribe();
    this.modalSubscription.unsubscribe();
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

  async onSubmit() {
    console.log(this.resourceForm.value);
    let url: string;
    if (this.contentType !== 'text' && this.file) {
      let upload = uploadcare.fileFrom('object', this.file);
      await upload.done((fileInfo: { cdnUrl: string }) => {
        console.log('Your file has been uploaded. URL: ' + fileInfo.cdnUrl);
        this.fileUrl = fileInfo.cdnUrl;
        url = fileInfo.cdnUrl;
      });
      this.file = null;
      this.fileInput.nativeElement.value = '';
    }

    const { description, name, text } = this.resourceForm.value;
    this.individualService.saveResourceToDb({
      description,
      name,
      url,
      text,
      id: this.individualService.displayUser.value._id,
    });
    this.resourceForm.reset();
  }
}
