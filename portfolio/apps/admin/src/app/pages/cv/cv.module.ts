import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { CvRoutingModule } from './cv-routing.module';

import { PersonalComponent } from './personal/personal.component';
import { SummaryComponent } from './summary/summary.component';
import { ExperienceListComponent } from './experience/experience-list/experience-list.component';
import { ExperienceFormComponent } from './experience/experience-form/experience-form.component';
import { EducationListComponent } from './education/education-list/education-list.component';
import { EducationFormComponent } from './education/education-form/education-form.component';
import { SkillsListComponent } from './skills/skills-list/skills-list.component';
import { SkillFormComponent } from './skills/skill-form/skill-form.component';
import { LanguagesListComponent } from './languages/languages-list/languages-list.component';
import { LanguageFormComponent } from './languages/language-form/language-form.component';
import { CertificationsListComponent } from './certifications/certifications-list/certifications-list.component';
import { CertificationFormComponent } from './certifications/certification-form/certification-form.component';
import { AwardsListComponent } from './awards/awards-list/awards-list.component';
import { AwardFormComponent } from './awards/award-form/award-form.component';
import { ReferencesListComponent } from './references/references-list/references-list.component';
import { ReferenceFormComponent } from './references/reference-form/reference-form.component';
import { ImportCvComponent } from './import-cv/import-cv.component';

@NgModule({
  declarations: [
    PersonalComponent,
    SummaryComponent,
    ExperienceListComponent,
    ExperienceFormComponent,
    EducationListComponent,
    EducationFormComponent,
    SkillsListComponent,
    SkillFormComponent,
    LanguagesListComponent,
    LanguageFormComponent,
    CertificationsListComponent,
    CertificationFormComponent,
    AwardsListComponent,
    AwardFormComponent,
    ReferencesListComponent,
    ReferenceFormComponent,
    ImportCvComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, CvRoutingModule],
})
export class CvModule {}
