import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Subscription, take } from 'rxjs';
import { ResourceService } from '../resource.service';
import { Resource } from '../resource.model';
import * as frmApp from 'src/app/store/app.reducer';
import * as ResourceActions from '../store/resource.actions';
import { Store } from '@ngrx/store';

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
  storeSub: Subscription;
  isCreatingNew: boolean;
  showModal: boolean;

  displayable: Resource = new Resource();

  constructor(
    private resourceService: ResourceService,
    private store: Store<frmApp.AppState>,

  ) {}

  ngOnInit() {
    this.storeSub = this.store.select('resource').subscribe((data) => {
      this.contentType = data.addMediaContentType;
      this.isCreatingNew = data.isCreatingNew;
      if (this.isCreatingNew) {
        this.displayable = new Resource();
      } else {
        this.displayable = {...data.individualResource.find(
          (d) => d._id === data.isEditingId
        )}
      }
      
      this.showModal = data.showModal;
    });
  }
  closeModal() {
    this.store.dispatch(ResourceActions.closeModal());
  }
  ngOnDestroy() {
    this.storeSub.unsubscribe();
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
    const { description, name, text } = this.resourceForm.value;
    const formData = new FormData();
    formData.append('description', description);
    formData.append('name', name);
    formData.append('text', text);
    formData.append('url', this.file);

    if (this.isCreatingNew) {
      this.store.dispatch(
        ResourceActions.beginCreateNewResource({
          resource: formData,
        })
      );
    } else {
      this.store.dispatch(
        ResourceActions.beginPatchResource({
          resource: formData,
          id: this.displayable._id,
        })
      );
    }
    this.resourceForm.reset();
    // this.myModal.hide();
    this.file = null;
    this.closeModal()
  }
}
