import { NgModule } from '@angular/core';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { BasicComponent } from './basic/basic.component';
import { BibliographyComponent } from './bibliography/bibliography.component';
import { EducationComponent } from './education/education.component';
import { MediaComponent } from './media/media.component';
import { PersonalHeaderComponent } from './personal-header/personal-header.component';
import { PersonalComponent } from './personal.component';
import { SettingsComponent } from './settings/settings.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PersonalRoutingModule } from './personal-routing.module';

@NgModule({
  declarations: [
    PersonalHeaderComponent,
    PersonalComponent,
    BasicComponent,
    EducationComponent,
    BibliographyComponent,
    MediaComponent,
    ModalComponent,
    SettingsComponent,
  ],
  imports: [RouterModule, FormsModule, CommonModule, PersonalRoutingModule],
})
export class PersonalModule {}
