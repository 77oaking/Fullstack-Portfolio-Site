import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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

const routes: Routes = [
  { path: 'personal', component: PersonalComponent },
  { path: 'summary', component: SummaryComponent },

  { path: 'experience', component: ExperienceListComponent },
  { path: 'experience/add', component: ExperienceFormComponent },
  { path: 'experience/edit/:id', component: ExperienceFormComponent },

  { path: 'education', component: EducationListComponent },
  { path: 'education/add', component: EducationFormComponent },
  { path: 'education/edit/:id', component: EducationFormComponent },

  { path: 'skills', component: SkillsListComponent },
  { path: 'skills/add', component: SkillFormComponent },
  { path: 'skills/edit/:id', component: SkillFormComponent },

  { path: 'languages', component: LanguagesListComponent },
  { path: 'languages/add', component: LanguageFormComponent },
  { path: 'languages/edit/:id', component: LanguageFormComponent },

  { path: 'certifications', component: CertificationsListComponent },
  { path: 'certifications/add', component: CertificationFormComponent },
  { path: 'certifications/edit/:id', component: CertificationFormComponent },

  { path: 'awards', component: AwardsListComponent },
  { path: 'awards/add', component: AwardFormComponent },
  { path: 'awards/edit/:id', component: AwardFormComponent },

  { path: 'references', component: ReferencesListComponent },
  { path: 'references/add', component: ReferenceFormComponent },
  { path: 'references/edit/:id', component: ReferenceFormComponent },
  { path: 'import', component: ImportCvComponent },

  { path: '', redirectTo: 'personal', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CvRoutingModule {}
