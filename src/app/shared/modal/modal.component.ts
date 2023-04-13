import {
  ApplicationRef,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  BasicDetailsInterface,
  IndividualService,
} from 'src/app/main/personal/individual.service';
// import uploadcare from 'uploadcare-widget/uploadcare.lang.en.min.js';
import uploadcare from 'uploadcare-widget/uploadcare.full.min.js';
import { ResourceService } from './resource.service';
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
  file: File;
  fileUrl: string;
  myModal: any;

  mediaTypeSubscription: Subscription;
  modalModeSubscription: Subscription;
  showModalSub: Subscription;

  //
  displayable: BasicDetailsInterface['resource'][0];

  constructor(
    private individualService: IndividualService,
    private resourceService: ResourceService
  ) {}

  ngOnInit() {
    this.mediaTypeSubscription =
      this.resourceService.addMediaContentType.subscribe(
        (contentType) => (this.contentType = contentType)
      );

    this.myModal = new window.bootstrap.Modal(
      document.getElementById('exampleModal')
    );

    this.showModalSub = this.resourceService.showModal.subscribe((show) => {
      if (show) {
        this.myModal.show();
      }
    });

    this.modalModeSubscription = this.resourceService.mode.subscribe((mode) => {
      if (mode === 'create') {
        this.displayable = this.resourceService.emptyData;
      } else {
        this.displayable =
          this.individualService.displayUser.value.resource.find(
            (d) => d._id === mode
          );
        this.resourceForm.controls['name'].setValue(this.displayable.name);
        this.resourceForm.controls['description'].setValue(
          this.displayable.description
        );
        if (this.contentType == 'text')
          this.resourceForm.controls['text'].setValue(this.displayable.text);
      }
    });
  }
  ngOnDestroy() {
    this.mediaTypeSubscription.unsubscribe();
    this.modalModeSubscription.unsubscribe();
    this.resourceService.mode.next('create');
    this.showModalSub.unsubscribe();
  }
  onFileChange(event: { target: { files: File } }) {
    this.file = event.target.files[0];
    // console.log('file ', event.target.files[0]);
    let resourceType = this.resourceService.addMediaContentType.value;
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
        // this.displayable.url = fileInfo.cdnUrl
      });
      this.file = null;
      this.fileInput.nativeElement.value = '';
    }

    const { description, name, text } = this.resourceForm.value;
    this.resourceService.saveResourceToDb({
      description,
      name,
      url,
      text,
      resourceId: this.displayable._id,
    });
    this.resourceForm.reset();
    this.myModal.hide();
  }
}
